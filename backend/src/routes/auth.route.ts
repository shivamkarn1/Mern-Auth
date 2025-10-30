import { Router } from "express";
import { registerHandler, loginHandler } from "../controllers/auth.controller";
const authRoute = Router();

// the prefix is : /auth

authRoute.post("/register", registerHandler);
authRoute.post("/login", loginHandler);

export default authRoute;
