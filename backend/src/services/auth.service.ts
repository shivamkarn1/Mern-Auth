import VerificationCodeType from "../constants/verificationCodeType";
import { User } from "../models/user.model";
import {
  oneYearFromNow,
  ONE_DAY_MS,
  thirtyDaysFromNow,
  fivMinAgo,
  oneHourFromNow,
} from "../utils/date";
import { VerificationModel } from "../models/verificationCode.model";
import { SessionModal } from "../models/session.model";
import jwt from "jsonwebtoken";
import { JWT_REFRESH_SECRET, JWT_SECRET, CLIENT_URL } from "../constants/env";
import appAssert from "../utils/appAssert";
import {
  CONFLICT,
  INTERNAL_SERVER_ERROR,
  UNAUTHORIZED,
  NOT_FOUND,
  TOO_MANY_REQUESTS,
  BAD_REQUEST,
} from "../constants/http";
import { signToken, refreshTokenSignOptions, verifyToken } from "../utils/jwt";
import { sendMail } from "../utils/sendMail";
import {
  getVerifyEmailTemplate,
  passwordResetTemplate,
} from "../utils/emailTemplates";
import { hashValue } from "../utils/bcrypt";

export type createAccountParams = {
  email: string;
  password: string;
  userAgent?: string | undefined;
};
const createAccount = async (data: createAccountParams) => {
  // check if user already exists
  const existingUser = await User.exists({
    email: data.email,
  });

  // if (existingUser) {
  //   throw new Error("User Already Exists");
  // }
  appAssert(!existingUser, CONFLICT, "Email(User) already in Use");
  // create user
  const user = await User.create({
    email: data.email,
    password: data.password,
  });
  if (!user) {
    throw new Error("Failed to Register User.");
  }
  // create verification code
  const verificationCode = await VerificationModel.create({
    userId: user._id,
    type: VerificationCodeType.EmailVerification,
    expiresAt: oneYearFromNow(),
  });

  const url = `${CLIENT_URL}/email/verify/${verificationCode._id}`;

  // send verification email -> will add RESEND EMAIL integration later
  try {
    await sendMail({
      to: user.email,
      ...getVerifyEmailTemplate(url),
    });
  } catch (err) {
    console.error("Failed to send verification email:", err);
  }
  // create session
  const session = await SessionModal.create({
    userId: user._id,
    userAgent: data.userAgent,
  });

  // sign access token and refresh token
  const accessToken = jwt.sign({ sessionId: session._id }, JWT_SECRET, {
    audience: ["user"],
    expiresIn: "15min",
  });
  const refreshToken = jwt.sign(
    { sessionId: session._id },
    JWT_REFRESH_SECRET,
    {
      audience: ["user"],
      expiresIn: "30d",
    }
  );
  // return user & tokens
  return {
    user: user.omitPassword(),
    accessToken,
    refreshToken,
  };
};
export type loginParams = {
  email: string;
  password: string;
  userAgent?: string | undefined;
};
const loginUser = async ({ email, password, userAgent }: loginParams) => {
  // get the user by email
  const user = await User.findOne({ email });

  // validate the password
  appAssert(user, UNAUTHORIZED, "Invalid Email or Password ! ");

  const isValid = await user.comparePassword(password);

  appAssert(isValid, UNAUTHORIZED, "Invalid Email or Password");

  // create a session
  const userId = user._id;
  const session = await SessionModal.create({
    userId,
    userAgent,
  });
  const sessionInfo = {
    sessionId: session._id,
  };

  // sign access token and refresh token
  const refreshToken = signToken(sessionInfo, refreshTokenSignOptions);

  const accessToken = signToken({
    ...sessionInfo,
    userId: user._id,
  });

  // return user & tokens
  return {
    user: user.omitPassword(),
    accessToken,
    refreshToken,
  };
};

const refresehUserAccessToken = async (refreshToken: string) => {
  const result = verifyToken(refreshToken, {
    secret: refreshTokenSignOptions.secret,
  }) as RefreshTokenPayload | { payload: RefreshTokenPayload };
  const payload = "payload" in result ? result.payload : result;
  appAssert(payload, UNAUTHORIZED, "Invalid refresh Token");

  const session = await SessionModal.findById(payload.sessionId);
  const now = Date.now();
  appAssert(
    session && session.expiresAt.getTime() > now,
    UNAUTHORIZED,
    "Sessoin Expired"
  );
  const sessionNeedsRefresh = session.expiresAt.getTime() - now <= ONE_DAY_MS;

  if (sessionNeedsRefresh) {
    session.expiresAt = thirtyDaysFromNow();
    await session.save();
  }

  const newRefreshToken = sessionNeedsRefresh
    ? signToken(
        {
          sessionId: session._id,
        },
        refreshTokenSignOptions
      )
    : undefined;
  const accessToken = signToken({
    userId: session.userId,
    sessionId: session._id,
  });

  return {
    accessToken,
    newRefreshToken,
  };
};

type RefreshTokenPayload = { sessionId: string };

const verifyEmail = async (code: string) => {
  // get the verification code
  const validCode = await VerificationModel.findOne({
    _id: code,
    type: VerificationCodeType.EmailVerification,
    expiresAt: { $gt: new Date() },
  });

  // update user to verified true
  const updatedUser = await User.findByIdAndUpdate(
    validCode?.userId,
    {
      verified: true,
    },
    { new: true }
  );

  appAssert(updatedUser, INTERNAL_SERVER_ERROR, "Failed to verify Email");

  // delete verification code
  await validCode?.deleteOne();

  // return user
  return {
    user: updatedUser.omitPassword(),
  };
};

const sendPasswordResetEmail = async (email: string) => {
  // email user by email
  const user = await User.findOne({ email });
  appAssert(user, NOT_FOUND, "User Not Found !");
  // check email rate limit
  const fiveMinAgo = fivMinAgo();

  const count = await VerificationModel.countDocuments({
    userId: user._id,
    type: VerificationCodeType.PasswordReset,
    createdAt: { $gt: fiveMinAgo },
  });

  // Allow up to 3 password reset requests within the last 5 minutes
  appAssert(
    count <= 3,
    TOO_MANY_REQUESTS,
    "Too many requests. Try again later."
  );

  // create verif code
  const expiresAt = oneHourFromNow();
  const verificationCode = await VerificationModel.create({
    userId: user._id,
    type: VerificationCodeType.PasswordReset,
    expiresAt,
  });
  // send verf email
  const url = `${CLIENT_URL}/password/reset?code=${
    verificationCode._id
  }&exp=${expiresAt.getTime()}`;

  try {
    const data = await sendMail({
      to: user.email,
      ...passwordResetTemplate(url),
    });
    // The Resend SDK may not always surface an `id` property in typings or responses.
    // Instead assert that we received a response object from sendMail.
    appAssert(
      data != null &&
        (data.raw !== undefined || (data as any).id !== undefined),
      INTERNAL_SERVER_ERROR,
      "Failed to send reset email"
    );
  } catch (err: any) {
    console.error("Failed to send reset email:", err);
    appAssert(
      false,
      INTERNAL_SERVER_ERROR,
      `${err?.name || "Error"} - ${err?.message || String(err)}`
    );
  }
};

type ResetPasswordParams = {
  password: string;
  verificationCode: string;
};

const resetPassword = async ({
  password,
  verificationCode,
}: ResetPasswordParams) => {
  // get the verf code
  const validCode = await VerificationModel.findOne({
    _id: verificationCode,
    type: VerificationCodeType.PasswordReset,
    expiresAt: { $gt: new Date() },
  });

  appAssert(validCode, BAD_REQUEST, "Invalid or Expired Verification Code");
  // update users password
  // hash the new password before updating
  const hashedPassword = await hashValue(password);
  const updatedUser = await User.findByIdAndUpdate(
    validCode.userId,
    { password: hashedPassword },
    { new: true }
  );
  appAssert(updatedUser, INTERNAL_SERVER_ERROR, "Failed to reset password");

  // Delete vef code
  await validCode.deleteOne();

  // delete all sessions
  await SessionModal.deleteMany({ userId: validCode.userId });

  // return response
  return {
    user: updatedUser.omitPassword(),
  };
};

export {
  createAccount,
  loginUser,
  refresehUserAccessToken,
  verifyEmail,
  sendPasswordResetEmail,
  resetPassword,
};
