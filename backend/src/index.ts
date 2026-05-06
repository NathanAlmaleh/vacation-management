import express from "express";
import cors from "cors";

import { AppDataSource } from "./data-source";

AppDataSource.initialize()
  .then(() => {
    console.log("Database connected");
  })
  .catch((err) => {
    console.error(err);
  });

const app = express();

app.use(cors());
app.use(express.json());

app.get("/health", (_req, res) => {
  res.send("OK");
});

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});