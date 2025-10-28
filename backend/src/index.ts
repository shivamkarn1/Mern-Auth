import "dotenv/config";
import express, { Request, Response, NextFunction } from "express";
import { connectDB } from "./config/db";
import cors from "cors";
import { CLIENT_URL } from "../src/constants/env";
import cookieParser from "cookie-parser";
import { errorHandler } from "../src/middleware/errorHandler";
import catchErrors from "./utils/catchErrors";
import { OK } from "./constants/http";
const app = express();

//middlewares
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: CLIENT_URL,
    credentials: true,
  })
);
app.use(express.json({ limit: "16kb" }));

app.get("/", (req: Request, res: Response) => {
  return res.status(200).json({
    message: "Server is running Great ;)",
    status: "Healthy ",
  });
});
app.use(cookieParser());

app.get("/health", (_, res: Response) => {
  return res.status(OK).json({
    status: "Healthy ",
  });
});

app.use(errorHandler);

const PORT = process.env.PORT ? Number(process.env.PORT) : 4000;

app.listen(PORT, async () => {
  console.log(`Server is listening at http://localhost:${PORT}`);
  await connectDB();
});
