import { prisma } from "../prisma.js";

const CARGOS_REQUERIDOS = ["Camarógrafo", "Sonidista"];

const estadoDe = (t) => {
  if (!t.trabajadores.length && !t.equipos.length) return "Sin asignar";
  const cargos = t.trabajadores.map((w) => w.cargo);
  const faltan = CARGOS_REQUERIDOS.filter((c) => !cargos.includes(c));
  if (!t.equipos.length) faltan.push("equipo técnico");
  return faltan.length
    ? `Cobertura parcial — falta ${faltan.join(", ")}`
    : "Cobertura completa";
};

export const getCoberturaHoyService = async () => {
  const hoy = new Date(new Date().toLocaleDateString("en-CA"));
  const lista = await prisma.transmisiones.findMany({
    where: { fecha: hoy },
    include: { trabajadores: true, equipos: true },
    orderBy: { horaInicio: "asc" },
  });
  return lista.map((t) => {
    const estado = estadoDe(t);
    return {
      id: t.id,
      tema: t.tema,
      horaInicio: t.horaInicio,
      horaFin: t.horaFin,
      trabajadores: t.trabajadores,
      equipos: t.equipos,
      estado,
      completa: estado === "Cobertura completa",
    };
  });
};

export const getCatalogoService = async () => ({
  trabajadores: await prisma.trabajadores.findMany({ orderBy: { nombre: "asc" } }),
  equipos: await prisma.equipos.findMany({ orderBy: { nombre: "asc" } }),
});

export const asignarService = async (id, trabajadorIds = [], equipoIds = []) => {
  id = Number(id);
  if (!Number.isInteger(id)) throw new Error("Transmisión inválida");
  await prisma.transmisiones.update({
    where: { id },
    data: {
      trabajadores: { set: trabajadorIds.map((x) => ({ id: Number(x) })) },
      equipos: { set: equipoIds.map((x) => ({ id: Number(x) })) },
    },
  });
};