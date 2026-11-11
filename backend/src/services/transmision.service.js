import { prisma } from "../config/prisma.js";

const HORA_APERTURA = 8;  // 08:00
const HORA_CIERRE = 22;   // 22:00
const pad = (n) => String(n).padStart(2, "0");
const FECHA_REGEX = /^\d{4}-\d{2}-\d{2}$/;
const HORA_REGEX = /^([01]\d|2[0-3]):[0-5]\d$/;

//  
const aFecha = (iso) => {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) throw new Error("Fecha inválida");
  return d;
};


const formatear = (t) => ({ ...t, fecha: t.fecha.toISOString().slice(0, 10) });

/* ---------- REQUISITO 1: disponibilidad de horarios ---------- */
export const getDisponibilidadService = async (fecha) => {
  if (!FECHA_REGEX.test(fecha)) throw new Error("Fecha inválida (use YYYY-MM-DD)");

  const reservas = await prisma.transmisiones.findMany({
    where: { fecha: aFecha(fecha) },
    orderBy: { horaInicio: "asc" },
  });

  const slots = [];
  for (let h = HORA_APERTURA; h < HORA_CIERRE; h++) {
    const horaInicio = `${pad(h)}:00`;
    const horaFin = `${pad(h + 1)}:00`;
    const reserva = reservas.find((r) => r.horaInicio < horaFin && r.horaFin > horaInicio);
    slots.push({
      horaInicio,
      horaFin,
      disponible: !reserva,
      tema: reserva ? reserva.tema : null,
    });
  }
  return slots;
};

export const createTransmisionService = async ({ tema, fecha, horaInicio, horaFin }) => {
  if (!tema || !String(tema).trim()) throw new Error("El tema es obligatorio");
  if (!FECHA_REGEX.test(fecha)) throw new Error("Fecha inválida");
  if (!HORA_REGEX.test(horaInicio) || !HORA_REGEX.test(horaFin)) throw new Error("Hora inválida");
  if (horaInicio >= horaFin) throw new Error("La hora de término debe ser posterior a la de inicio");

  const apertura = `${pad(HORA_APERTURA)}:00`;
  const cierre = `${pad(HORA_CIERRE)}:00`;
  if (horaInicio < apertura || horaFin > cierre) {
    throw new Error(`El horario permitido es entre ${apertura} y ${cierre}`);
  }

  if (new Date(`${fecha}T${horaInicio}:00`) < new Date()) {
    throw new Error("No se puede programar una transmisión en el pasado");
  }

  const fechaDate = aFecha(fecha);

  // Validación en servidor: evita conflictos aunque el frontend se salte.
  const conflicto = await prisma.transmisiones.findFirst({
    where: {
      fecha: fechaDate,
      horaInicio: { lt: horaFin },
      horaFin: { gt: horaInicio },
    },
  });

  if (conflicto) throw new Error("El horario seleccionado ya está reservado");

  const nueva = await prisma.transmisiones.create({
    data: { tema: String(tema).trim(), fecha: fechaDate, horaInicio, horaFin },
  });
  return formatear(nueva);
};

/* ---------- REQUISITO 2: transmisiones de un mes ---------- */
export const getTransmisionesPorMesService = async (anio, mes) => {
  anio = Number(anio);
  mes = Number(mes);
  if (!Number.isInteger(anio) || !Number.isInteger(mes) || mes < 1 || mes > 12) {
    throw new Error("Año o mes inválido");
  }

  const ultimoDia = new Date(anio, mes, 0).getDate();
  const desde = aFecha(`${anio}-${pad(mes)}-01`);
  const hasta = aFecha(`${anio}-${pad(mes)}-${pad(ultimoDia)}`);

  const lista = await prisma.transmisiones.findMany({
    where: { fecha: { gte: desde, lte: hasta } },          // solo el mes elegido
    orderBy: [{ fecha: "asc" }, { horaInicio: "asc" }],    // orden cronológico
  });
  return lista.map(formatear);
};