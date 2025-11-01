import { Request, Response, NextFunction } from "express";
import catchErrors from "../utils/catchErrors";
import { createAccount } from "../services/auth.service";
import { BAD_REQUEST, CREATED, OK } from "../constants/http";
import { setAuthCookies } from "../utils/setAuthCookies";
import { loginSchema, registerSchema } from "./auth.schemas";
import { loginUser } from "../services/auth.service";
import { verifyToken, AccessTokenPayload } from "../utils/jwt";
import { SessionModal } from "../models/session.model";
import { clearAuthCookies } from "../utils/setAuthCookies";

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

export { registerHandler, loginHandler, logoutHandler };
