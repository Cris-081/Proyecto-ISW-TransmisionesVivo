import { DataSource } from "typeorm";
import { DB_HOST, DB_PORT, DB_USERNAME, DB_PASSWORD, DATABASE } from "./configEnv.js";
import { Transmision } from "../entities/transmision.entity.js";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: DB_HOST,
  port: Number(DB_PORT),
  username: DB_USERNAME,
  password: DB_PASSWORD,
  database: DATABASE,
  entities: [Transmision],
  synchronize: true, 
  logging: false,
});
