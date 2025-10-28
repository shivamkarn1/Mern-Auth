import "dotenv/config";
import express from "express";
import { connectDB } from "./config/db";

const app = express();

app.get("/", (req, res) => {
  return res.status(200).json({
    message: "Server is running Great ;)",
    status: "Healthy ",
  });
});
app.get("/health", (_, res) => {
  return res.status(200).json({
    status: "Healthy ",
  });
});

const PORT = process.env.PORT ? Number(process.env.PORT) : 4000;

app.listen(PORT, async () => {
  console.log(`Server is listening at http://localhost:${PORT}`);
  await connectDB();
});
