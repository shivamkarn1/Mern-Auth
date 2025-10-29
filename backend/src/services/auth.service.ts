import VerificationCodeType from "../constants/verificationCodeType";
import { User } from "../models/user.model";
import { oneYearFromNow } from "../utils/date";
import { VerificationModel } from "../models/verificationCode.model";
import { SessionModal } from "../models/session.model";
import jwt from "jsonwebtoken";
import { JWT_REFRESH_SECRET, JWT_SECRET } from "../constants/env";
import appAssert from "../utils/appAssert";
import { exist } from "joi";
import { CONFLICT } from "../constants/http";

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
  // send verification email -> will add RESEND EMAIL integration later

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

export { createAccount };
