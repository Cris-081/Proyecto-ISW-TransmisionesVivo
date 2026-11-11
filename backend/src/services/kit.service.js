import { prisma } from "../config/prisma.js";
import { HttpError } from "../handlers/errorHandler.js";
import { parseId } from "../helpers/parseId.js";

const kitInclude = {
  items: { orderBy: { id: "asc" } },
  team: { select: { id: true, name: true } },
};

const cleanItems = (items) =>
  items.map(({ tipo, nombre, numeroSerie }) => ({ tipo, nombre, numeroSerie: numeroSerie || null }));

export const getAllKitsService = async (estado) => {
  return await prisma.kit.findMany({
    where: estado ? { estado } : undefined,
    include: kitInclude,
    orderBy: { id: "asc" },
  });
};

export const getKitByIdService = async (kitId) => {
  const id = parseId(kitId, "ID de kit");
  const kit = await prisma.kit.findUnique({ where: { id }, include: kitInclude });
  if (!kit) throw new HttpError(404, "Kit no encontrado");
  return kit;
};

export const createKitService = async ({ nombre, descripcion, items }) => {
  return await prisma.kit.create({
    data: { nombre, descripcion: descripcion || null, items: { create: cleanItems(items) } },
    include: kitInclude,
  });
};

export const updateKitService = async (kitId, { nombre, descripcion, items }) => {
  const id = parseId(kitId, "ID de kit");
  const exists = await prisma.kit.findUnique({ where: { id }, select: { id: true } });
  if (!exists) throw new HttpError(404, "Kit no encontrado");

  // se reemplaza la lista de equipos 
  return await prisma.kit.update({
    where: { id },
    data: {
      nombre,
      descripcion: descripcion || null,
      items: { deleteMany: {}, create: cleanItems(items) },
    },
    include: kitInclude,
  });
};

export const deleteKitService = async (kitId) => {
  const id = parseId(kitId, "ID de kit");

  // Solo borra si esta disponible
  const { count } = await prisma.kit.deleteMany({ where: { id, estado: "Disponible" } });
  if (count === 0) {
    const kit = await prisma.kit.findUnique({ where: { id }, select: { nombre: true } });
    if (!kit) throw new HttpError(404, "Kit no encontrado");
    throw new HttpError(409, `El kit "${kit.nombre}" esta ocupado. Liberalo antes de eliminarlo.`);
  }
};

export const assignKitToTeamService = async (kitId, teamId) => {
  const id = parseId(kitId, "ID de kit");
  const tid = parseId(teamId, "ID de equipo");

  const team = await prisma.team.findUnique({ where: { id: tid }, select: { id: true } });
  if (!team) throw new HttpError(404, "Equipo no encontrado");

  // solo cambia si el kit sigue Disponible
  const { count } = await prisma.kit.updateMany({
    where: { id, estado: "Disponible" },
    data: { estado: "Ocupado", teamId: tid, asignadoAt: new Date() },
  });

  if (count === 0) {
    const kit = await prisma.kit.findUnique({ where: { id }, include: { team: { select: { name: true } } } });
    if (!kit) throw new HttpError(404, "Kit no encontrado");
    const donde = kit.team ? ` (asignado a "${kit.team.name}")` : "";
    throw new HttpError(409, `El kit "${kit.nombre}" ya esta ocupado${donde} y no puede asignarse de nuevo.`);
  }

  return await getKitByIdService(id);
};

export const releaseKitService = async (kitId) => {
  const id = parseId(kitId, "ID de kit");

  const { count } = await prisma.kit.updateMany({
    where: { id, estado: "Ocupado" },
    data: { estado: "Disponible", teamId: null, asignadoAt: null },
  });

  if (count === 0) {
    const kit = await prisma.kit.findUnique({ where: { id }, select: { nombre: true } });
    if (!kit) throw new HttpError(404, "Kit no encontrado");
    throw new HttpError(409, `El kit "${kit.nombre}" ya esta disponible.`);
  }

  return await getKitByIdService(id);
};
