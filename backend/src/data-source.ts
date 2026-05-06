import "reflect-metadata";
import { DataSource } from "typeorm";
import { VacationRequest } from "./entity/VacationRequest";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: "localhost",
  port: 5432,
  username: "postgres",
  password: "",
  database: "vacation_db",
  synchronize: true,
  entities: [VacationRequest],
});