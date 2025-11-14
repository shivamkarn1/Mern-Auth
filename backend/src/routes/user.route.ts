import { Router } from "express";
import { getUserHandler } from "../controllers/user.controller";
const userRoute = Router();

// prefix :      /user
userRoute.get("/getCurrentUser", getUserHandler);

export default userRoute;
