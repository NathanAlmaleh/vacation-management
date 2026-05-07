import express from "express";
import cors from "cors";

import { AppDataSource } from "./data-source";
import requestRoutes from "./routes/request.routes";
import userRoutes from "./routes/user.routes";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/requests", requestRoutes);
app.use("/users", userRoutes);

AppDataSource.initialize()
  .then(() => {
    console.log("Database connected");
    app.listen(3000, () => {
      console.log("Server running on http://localhost:3000");
    });
  })
  .catch((err) => {
    console.error(err);
  });
