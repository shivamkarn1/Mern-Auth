import { Request, Response, NextFunction } from "express";
import catchErrors from "../utils/catchErrors";
import { z } from "zod";
import { createAccount } from "../services/auth.service";
import { CREATED, OK } from "../constants/http";
import { setAuthCookies } from "../utils/setAuthCookies";
import { loginSchema, registerSchema } from "./auth.schemas";
import { loginUser } from "../services/auth.service";

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

  // call service
  const { accessToken, refreshToken } = await loginUser(request);

  return setAuthCookies({ res, accessToken, refreshToken })
    .status(OK)
    .json({ message: "Login SuccessFull" });
});

export { registerHandler, loginHandler };
