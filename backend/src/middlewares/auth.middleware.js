import jwt from "jsonwebtoken";
import { prisma } from "../config/prisma.js";
import { JWT_SECRET } from "../config/configEnv.js";
import { handleErrorClient, handleErrorServer } from "../handlers/responseHandlers.js";

// Middleware para verificar la autenticacion

export async function authenticate(req, res, next) {
  const header = req.headers.authorization;
  if (!header || !header.startsWith("Bearer ")) {
    return handleErrorClient(res, 401, "Token de autenticacion requerido");
  }

  const token = header.slice(7).trim();

  let payload;
  try {
    payload = jwt.verify(token, JWT_SECRET, { algorithms: ["HS256"] });
  } catch (err) {
    const message = err.name === "TokenExpiredError" ? "El token ha expirado" : "Token invalido";
    return handleErrorClient(res, 401, message);
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: Number(payload.id) },
      select: {
        id: true,
        email: true,
        nombre: true,
        role: true,
        funciones: true,
        estado: true,
        teamId: true,
      },
    });

    if (!user) {
      return handleErrorClient(res, 401, "El usuario del token ya no existe");
    }
    if (user.estado !== "Activo") {
      return handleErrorClient(res, 403, "Tu cuenta esta inactiva o bloqueada");
    }

    req.user = user;
    return next();
  } catch (err) {
    return handleErrorServer(res, 500, "Error al validar la sesion", err.message);
  }
}

// solo permite entrar si el usuario tiene un rol de estos
export const authorizeRoles = (...roles) => (req, res, next) => {
  if (!req.user) return handleErrorClient(res, 401, "No autenticado");
  if (!roles.includes(req.user.role)) {
    return handleErrorClient(res, 403, "No tienes permisos para realizar esta accion");
  }
  return next();
};


// pertmite que solo se reciba la informacion del rol que se debe
export const authorizeSelfOrRoles = (paramName = "id", ...roles) => (req, res, next) => {
  if (!req.user) return handleErrorClient(res, 401, "No autenticado");
  const isOwner = String(req.user.id) === String(req.params[paramName]);
  if (isOwner || roles.includes(req.user.role)) return next();
  return handleErrorClient(res, 403, "No tienes permisos para acceder a este sitio");
};

// atajo para las rutas de gestion: solo admin y coordinador
export const soloGestion = authorizeRoles("admin", "coordinador");
