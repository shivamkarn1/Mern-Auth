import { Request, Response, NextFunction } from "express";
import catchErrors from "../utils/catchErrors";
import {
  createAccount,
  refresehUserAccessToken,
  verifyEmail,
  sendPasswordResetEmail,
  resetPassword,
} from "../services/auth.service";
import { BAD_REQUEST, CREATED, OK, UNAUTHORIZED } from "../constants/http";
import {
  getRefreshTokenCookieOptions,
  setAuthCookies,
} from "../utils/setAuthCookies";
import {
  emailSchema,
  loginSchema,
  registerSchema,
  resetPasswordSchema,
} from "./auth.schemas";
import { loginUser } from "../services/auth.service";
import { verifyToken, AccessTokenPayload } from "../utils/jwt";
import { SessionModal } from "../models/session.model";
import { clearAuthCookies } from "../utils/setAuthCookies";
import appAssert from "../utils/appAssert";
import { getAccessTokenCookieOptions } from "../utils/setAuthCookies";
import { verificationCodeSchema } from "./auth.schemas";
import { send } from "process";
import { clear } from "console";

const registerHandler = catchErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    // validate request
    const request = registerSchema.parse({
      ...req.body,
      userAgent: Array.isArray(req.headers["user-agent"])
        ? req.headers["user-agent"][0]
        : req.headers["user-agent"],
    });
    // call service
    const { user, accessToken, refreshToken } = await createAccount(request);
    return setAuthCookies({ res, accessToken, refreshToken })
      .status(CREATED)
      .json({ message: "User Registered Successfully", user });
  }
);

const loginHandler = catchErrors(async (req: Request, res: Response) => {
  const request = loginSchema.parse({
    ...req.body,
    userAgent: req.headers["user-agent"],
  });

  const requestBody = {
    ...req.body,
    userAgent: Array.isArray(req.headers["user-agent"])
      ? req.headers["user-agent"][0]
      : req.headers["user-agent"],
  };

  //  Following code to send a message instead of hanging server in loading state
  const parsed = loginSchema.safeParse(requestBody);
  if (!parsed.success) {
    return res
      .status(BAD_REQUEST)
      .json({ message: "Invalid Input", issues: parsed.error.format() });
  }

  // call service
  const { accessToken, refreshToken } = await loginUser(request);

  return setAuthCookies({ res, accessToken, refreshToken })
    .status(OK)
    .json({ message: "Login SuccessFull" });
});
const logoutHandler = catchErrors(async (req: Request, res: Response) => {
  const accessToken = req.cookies.accessToken;
  if (!accessToken) {
    return res.status(OK).json({ message: "No access token" });
  }

  const verified = verifyToken(accessToken);
  if (!verified) {
    return res.status(401).json({ message: "Invalid token" });
  }

  const payload = verified.payload as AccessTokenPayload;
  const sessionId = payload.sessionId;

  if (payload) {
    await SessionModal.findByIdAndDelete(payload.sessionId);
  }

  clearAuthCookies(res);
  return res.status(OK).json({ message: "Logout SuccessFull" });
});

const refreshHandler = catchErrors(async (req, res) => {
  const refreshToken = req.cookies.refreshToken as string | undefined;

  appAssert(refreshToken, UNAUTHORIZED, "Missing Refresh Token");

  const { accessToken, newRefreshToken } = await refresehUserAccessToken(
    refreshToken
  );

  if (refreshToken) {
    res.cookie("refreshToken", newRefreshToken, getRefreshTokenCookieOptions());
  }
  return res
    .status(OK)
    .cookie("accessToken", accessToken, getAccessTokenCookieOptions())
    .json({ message: "Access Token Refreshed" });
});

const verifyEmailHandler = catchErrors(async (req, res) => {
  const verificationCode = verificationCodeSchema.parse(req.params.code);

  // use the verifyemail service

  await verifyEmail(verificationCode);

  return res.status(OK).json({ message: "Email was Verified Successfully" });
});

const sendPasswordResetHandler = catchErrors(async (req, res) => {
  const email = emailSchema.parse(req.body.email);

  // call service
  await sendPasswordResetEmail(email);
  // return success response
  return res
    .status(OK)
    .json({ message: "Password reset email sent successfully" });
});

const resetPasswordHandler = catchErrors(async (req, res) => {
  // Implementation for resetting the password goes here
  const request = resetPasswordSchema.parse(req.body);

  await resetPassword(request);

  return clearAuthCookies(res)
    .status(OK)
    .json({ message: "Password reset successfully" });
});

export {
  registerHandler,
  loginHandler,
  logoutHandler,
  refreshHandler,
  verifyEmailHandler,
  sendPasswordResetHandler,
  resetPasswordHandler,
};
