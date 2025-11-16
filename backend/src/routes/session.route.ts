import { Router } from "express";
import {
  getSessionHandler,
  deleteSessionHandler,
} from "../controllers/session.controller";

const sessionRoute = Router();

// prefix  :      /session/
sessionRoute.get("/", getSessionHandler);

// delete session
sessionRoute.delete("/:id", deleteSessionHandler);

export { sessionRoute };
