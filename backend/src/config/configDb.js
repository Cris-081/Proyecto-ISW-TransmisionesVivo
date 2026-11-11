"use strict";
import { prisma } from "./prisma.js";
import { createUsers } from "./initDb.js";

export async function connectDB() {
  try {
    await prisma.$connect();
    console.log("=> Conexion a BD exitosa");

    await createUsers();
  } catch (error) {
    console.error("=> Error al conectar a BD:", error);
    throw error;
  }
}
