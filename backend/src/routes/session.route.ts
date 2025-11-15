import { Router } from "express";
import { getSessionHandler } from "../controllers/session.controller";

const sessionRoute = Router();

// prefix  :      /session/
sessionRoute.get("/", getSessionHandler);

export { sessionRoute };
