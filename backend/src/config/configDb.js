"use strict";
import { DataSource } from "typeorm";
import { DATABASE, DB_USERNAME, HOST, DB_PASSWORD, DB_PORT } from "./configEnv.js";
import { createUsers } from "./initDb.js";
import { User } from "../entities/user.entity.js";
import { Team } from "../entities/team.entity.js";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: `${HOST}`,
  port: Number(DB_PORT),
  username: `${DB_USERNAME}`,
  password: `${DB_PASSWORD}`,
  database: `${DATABASE}`,
  entities: [User, Team],
  synchronize: true,
  logging: false,
});

export async function connectDB() {
  try {
    await AppDataSource.initialize();
    console.log("=> Conexión a BD exitosa");

    await createUsers();

  } catch (error) {
    console.error("=> Error al conectar a BD:", error);
    throw error;
  }
}