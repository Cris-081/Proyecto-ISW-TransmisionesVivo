import { prisma } from "../config/prisma.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config/configEnv.js";

export const loginService = async ({ email, password }) => {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
        throw { status: 404, message: "Usuario no encontrado" };
    }

    if (user.estado === "Inactivo" || user.estado === "Bloqueado") {
        throw { status: 403, message: "Tu solicitud de ingreso aun no ha sido aprobada o la cuenta esta deshabilitada" };
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        throw { status: 401, message: "Contraseña incorrecta" };
    }

    const token = jwt.sign(
        { 
            id: user.id, 
            email: user.email, 
            role: user.role, 
            nombre: user.nombre,
            funciones: user.funciones || [] 
        },
        JWT_SECRET,
        { expiresIn: "1d" } 
    );

    return { 
        token, 
        user: { 
            id: user.id,
            nombre: user.nombre, 
            role: user.role, 
            email: user.email,
            run: user.run,
            numeroTelefonico: user.numeroTelefonico,
            estado: user.estado,
            funciones: user.funciones || [] 
        } 
    };
};