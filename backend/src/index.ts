import express from "express";

const app = express();

app.get("/", (req, res) => {
  return res.status(200).json({
    message: "Server is running Great ;)",
    status: "Healthy ",
  });
});
app.get("/health", (req, res) => {
  return res.status(200).json({
    message: "Server is running Great ;)",
    status: "Healthy ",
  });
});

// read PORT from environment (allow string->number) with fallback
const PORT = process.env.PORT ? Number(process.env.PORT) : 4000;

app.listen(PORT, () => {
  console.log(`Server is listening at http://localhost:${PORT}`);
});
