import { Router } from "express";
import {
  registerHandler,
  loginHandler,
  logoutHandler,
  refreshHandler,
  verifyEmailHandler,
} from "../controllers/auth.controller";
const authRoute = Router();

// the prefix is : /auth

authRoute.post("/register", registerHandler);
authRoute.post("/login", loginHandler);
authRoute.get("/refresh", refreshHandler);
authRoute.post("/logout", logoutHandler);
authRoute.get("/email/verify/:code", verifyEmailHandler);

export default authRoute;
