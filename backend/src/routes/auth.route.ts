import { Router } from "express";
import {
  registerHandler,
  loginHandler,
  logoutHandler,
} from "../controllers/auth.controller";
const authRoute = Router();

// the prefix is : /auth

authRoute.post("/register", registerHandler);
authRoute.post("/login", loginHandler);
authRoute.post("/logout", logoutHandler);

export default authRoute;
