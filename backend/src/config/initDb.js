"use strict";
import { AppDataSource } from "./configDb.js";
import { User } from "../entities/user.entity.js";
import bcrypt from "bcrypt";

export async function createUsers() {
  try {
    const userRepository = AppDataSource.getRepository(User);

    const count = await userRepository.count();
    if (count > 0) {
      console.log("=> Base de datos inicializada: Usuarios existentes.");
      return;
    }

    const SALT_ROUNDS = 10;

    const users = [
      {
        nombre: "Coordinador General",
        email: "admin@envivo.com",
        run: "00000000-0",
        password: await bcrypt.hash("admin123", SALT_ROUNDS),
        role: "admin",
        funciones: ["switch", "camara", "audio", "relator", "montaje"],
        estado: "Activo",
        numeroTelefonico: "900000001",
      },
      {
        nombre: "Carlos(Multitarea)",
        email: "carlos@envivo.com",
        run: "11111111-1",
        password: await bcrypt.hash("carlos123", SALT_ROUNDS),
        role: "operador",
        funciones: ["camara", "audio", "montaje"],
        estado: "Activo",
        numeroTelefonico: "900000002",
      },
      {
        nombre: "Maria(Especialista Switch)",
        email: "maria@envivo.com",
        run: "22222222-2",
        password: await bcrypt.hash("maria123", SALT_ROUNDS),
        role: "operador",
        funciones: ["switch", "camara"], 
        estado: "Activo",
        numeroTelefonico: "900000003",
      },
      {
        nombre: "Pedro(Técnico de Montaje)",
        email: "pedro@envivo.com",
        run: "33333333-3",
        password: await bcrypt.hash("pedro123", SALT_ROUNDS),
        role: "operador",
        funciones: ["montaje", "audio"],
        estado: "Activo",
        numeroTelefonico: "900000004",
      },
    ];

    console.log("=> Cargando personal...");

    for (const u of users) {
      const nuevoUsuario = userRepository.create(u);
      await userRepository.save(nuevoUsuario);
      console.log(`[OK] Registrado: \({u.nombre} - Funciones: [\){u.funciones.join(", ")}]`);
    }
  } catch (error) {
    console.error("=> Error al crear usuarios iniciales:", error);
    throw error;
  }
}