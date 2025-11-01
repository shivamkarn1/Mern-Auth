import { JWT_REFRESH_SECRET, JWT_SECRET } from "../constants/env";
import { SessionDocument } from "../models/session.model";
import { UserDocument } from "../models/user.model";
import jwt, { SignOptions, VerifyOptions } from "jsonwebtoken";

export type RefreshTokenPayload = {
  sessionId: SessionDocument["_id"];
};
export type AccessTokenPayload = {
  userId: UserDocument["_id"];
  sessionId: SessionDocument["_id"];
};

type SignOptionsAndSecret = SignOptions & {
  secret: string;
};
const defaults: SignOptions = {
  audience: "user",
};

const accessTokenSignOptions: SignOptionsAndSecret = {
  expiresIn: "15min",
  secret: JWT_SECRET,
};
const refreshTokenSignOptions: SignOptionsAndSecret = {
  expiresIn: "30d",
  secret: JWT_REFRESH_SECRET,
};

const signDefaults: SignOptions = {
  audience: "user",
};

const verifyDefaults: VerifyOptions = {
  audience: "user",
};

const signToken = (
  payload: AccessTokenPayload | RefreshTokenPayload,
  options?: SignOptions & { secret: string }
): string => {
  const { secret, ...jwtOptions } = options || accessTokenSignOptions;
  return jwt.sign(payload as object, secret, {
    ...signDefaults,
    ...jwtOptions,
  });
};

const verifyToken = (
  token: string,
  options?: jwt.VerifyOptions & { secret?: string }
): { payload: unknown } | null => {
  const opts = options ?? { secret: JWT_SECRET };
  const { secret = JWT_SECRET, ...verifyOpts } = opts;
  try {
    const mergedVerifyOpts: jwt.VerifyOptions = {
      ...verifyDefaults,
      ...(verifyOpts as jwt.VerifyOptions),
    };
    const payload = jwt.verify(token, secret, mergedVerifyOpts);
    return { payload };
  } catch (error) {
    return null;
  }
};

export {
  accessTokenSignOptions,
  refreshTokenSignOptions,
  signToken,
  verifyToken,
};
