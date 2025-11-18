import { Router } from "express";
import {
  registerHandler,
  loginHandler,
  logoutHandler,
  refreshHandler,
  verifyEmailHandler,
  sendPasswordResetHandler,
  resetPasswordHandler,
  resendVerificationEmailHandler,
} from "../controllers/auth.controller";
import { authenticate } from "../middleware/authenticate";
const authRoute = Router();

// the prefix is : /auth

authRoute.post("/register", registerHandler);
authRoute.post("/login", loginHandler);
authRoute.get("/refresh", refreshHandler);
authRoute.post("/logout", logoutHandler);
authRoute.get("/email/verify/:code", verifyEmailHandler);
authRoute.post(
  "/email/verify/resend",
  authenticate,
  resendVerificationEmailHandler
);
authRoute.post("/password/forgot", sendPasswordResetHandler);
authRoute.post("/password/reset/", resetPasswordHandler);

export default authRoute;
