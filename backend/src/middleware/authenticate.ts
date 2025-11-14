import { RequestHandler } from "express";
import appAssert from "../utils/appAssert";
import { UNAUTHORIZED } from "../constants/http";
import { AppErrorCode } from "../constants/appErrorCode";
import { AccessTokenPayload, verifyToken } from "../utils/jwt";

declare global {
  namespace Express {
    interface Request {
      userId: AccessTokenPayload["userId"];
      sessionId: AccessTokenPayload["sessionId"];
    }
  }
}

const authenticate: RequestHandler = (req, _, next) => {
  const accessToken = req.cookies?.accessToken as string | undefined;

  appAssert(
    accessToken,
    UNAUTHORIZED,
    "Authentication required",
    AppErrorCode.InvalidAccessToken
  );

  const result = verifyToken(accessToken);

  appAssert(
    result,
    UNAUTHORIZED,
    "Invalid or expired access token",
    AppErrorCode.InvalidAccessToken
  );

  req.userId = (result.payload as AccessTokenPayload).userId;
  req.sessionId = (result.payload as AccessTokenPayload).sessionId;

  next();
};

export { authenticate };
