import bcrypt from "bcrypt";
import { prisma } from "../config/prisma.js";
import { HttpError } from "../handlers/errorHandler.js";
import { parseId } from "../helpers/parseId.js";
import { notificarEquipoAsignado, correoConfigurado } from "./mail.service.js";

const ROLES = ["admin", "coordinador", "operador"];

export const getAllUsersService = async () => {
  return await prisma.user.findMany({ include: { team: true }, orderBy: { id: "asc" } });
};

export const getUserByIdService = async (userId) => {
  const user = await prisma.user.findUnique({
    where: { id: parseId(userId, "ID de usuario") },
    include: { team: true },
  });
  if (!user) throw new HttpError(404, "Usuario no encontrado");
  return user;
};

export const createUserService = async (data) => {
  const { password, funciones, numeroTelefonico, ...rest } = data;
  return await prisma.user.create({
    data: {
      ...rest,
      password: await bcrypt.hash(password, 10),
      funciones: funciones || [],
      numeroTelefonico: numeroTelefonico || null,
    },
    include: { team: true },
  });
};

export const updateUserRoleService = async (userId, role) => {
  const id = parseId(userId, "ID de usuario");
  if (!ROLES.includes(role)) throw new HttpError(400, `Rol invalido. Valores permitidos: ${ROLES.join(", ")}`);

  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) throw new HttpError(404, "Usuario no encontrado");

  return await prisma.user.update({ where: { id }, data: { role } });
};

// Funciones operativas del usuario (camara, audio, switch, relator, montaje)
export const updateUserFuncionesService = async (userId, funciones) => {
  const id = parseId(userId, "ID de usuario");
  const user = await prisma.user.findUnique({ where: { id }, select: { id: true } });
  if (!user) throw new HttpError(404, "Usuario no encontrado");

  return await prisma.user.update({ where: { id }, data: { funciones }, include: { team: true } });
};

export const createTeamService = async (name, description, memberIds = []) => {
  const ids = [...new Set(memberIds.map(Number))];

  if (ids.length) {
    const existentes = await prisma.user.findMany({ where: { id: { in: ids } }, select: { id: true } });
    const faltan = ids.filter((id) => !existentes.some((u) => u.id === id));
    if (faltan.length) throw new HttpError(404, `Usuarios no encontrados: ${faltan.join(", ")}`);
  }

  // el equipo y la asignacion de sus integrantes se guardan en una sola operacion
  const team = await prisma.team.create({
    data: {
      name,
      description: description || null,
      members: ids.length ? { connect: ids.map((id) => ({ id })) } : undefined,
    },
    include: { members: { select: { id: true, nombre: true, email: true } } },
  });

  // el correo se envia si se guarda, el equipo queda creado 
  const notificaciones = ids.length
    ? await notificarEquipoAsignado(team, team.members)
    : { configurado: correoConfigurado(), enviados: 0, fallidos: [] };

  return { ...team, notificaciones };
};

export const updateTeamService = async (teamId, { name, description }) => {
  const id = parseId(teamId, "ID de equipo");
  const team = await prisma.team.findUnique({ where: { id }, select: { id: true } });
  if (!team) throw new HttpError(404, "Equipo no encontrado");

  return await prisma.team.update({ where: { id }, data: { name, description: description || null } });
};

export const deleteTeamService = async (teamId) => {
  const id = parseId(teamId, "ID de equipo");
  const team = await prisma.team.findUnique({ where: { id }, select: { name: true } });
  if (!team) throw new HttpError(404, "Equipo no encontrado");

  const kitsAsignados = await prisma.kit.count({ where: { teamId: id } });
  if (kitsAsignados > 0) {
    throw new HttpError(409, `El equipo "${team.name}" tiene kits asignados. Liberalos antes de eliminarlo.`);
  }

  // Quedan sin equipo
  await prisma.team.delete({ where: { id } });
};

export const assignUserToTeamService = async (userId, teamId) => {
  const id = parseId(userId, "ID de usuario");
  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) throw new HttpError(404, "Usuario no encontrado");

  if (teamId) {
    const team = await prisma.team.findUnique({ where: { id: parseId(teamId, "ID de equipo") } });
    if (!team) throw new HttpError(404, "Equipo no encontrado");
  }

  return await prisma.user.update({
    where: { id },
    data: { teamId: teamId ? Number(teamId) : null },
    include: { team: true },
  });
};

export const getAllTeamsService = async () => {
  return await prisma.team.findMany({
    include: {
      members: true,
      kits: { select: { id: true, nombre: true } },
    },
    orderBy: { id: "asc" },
  });
};
