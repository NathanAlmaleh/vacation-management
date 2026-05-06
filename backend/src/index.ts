import express from "express";
import cors from "cors";

import { AppDataSource } from "./data-source";
import requestRoutes from "./routes/request.routes";

const app = express();

app.use(cors());

app.use(express.json());

app.use("/requests", requestRoutes); // 👈 add this

AppDataSource.initialize()
  .then(() => {
    console.log("Database connected");
  })
  .catch((err) => {
    console.error(err);
  });

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
