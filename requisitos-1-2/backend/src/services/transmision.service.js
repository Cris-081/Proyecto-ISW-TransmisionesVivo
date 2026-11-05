import { Between } from "typeorm";
import { AppDataSource } from "../config/configDb.js";
import { Transmision } from "../entities/transmision.entity.js";

const repo = () => AppDataSource.getRepository(Transmision);

const HORA_APERTURA = 8;  // 08:00
const HORA_CIERRE = 22;   // 22:00
const pad = (n) => String(n).padStart(2, "0");
const FECHA_REGEX = /^\d{4}-\d{2}-\d{2}$/;
const HORA_REGEX = /^([01]\d|2[0-3]):[0-5]\d$/;

/* ---------- REQUISITO 1: disponibilidad de horarios ---------- */
export const getDisponibilidadService = async (fecha) => {
  if (!FECHA_REGEX.test(fecha)) throw new Error("Fecha inválida (use YYYY-MM-DD)");

  const reservas = await repo().find({ where: { fecha }, order: { horaInicio: "ASC" } });

  const slots = [];
  for (let h = HORA_APERTURA; h < HORA_CIERRE; h++) {
    const horaInicio = `${pad(h)}:00`;
    const horaFin = `${pad(h + 1)}:00`;
    // Solapamiento de intervalos: la reserva empieza antes de que termine el
    // bloque y termina después de que el bloque empieza.
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

  // Validación en servidor: evita conflictos aunque el frontend se salte.
  const conflicto = await repo()
    .createQueryBuilder("t")
    .where("t.fecha = :fecha", { fecha })
    .andWhere("t.horaInicio < :horaFin", { horaFin })
    .andWhere("t.horaFin > :horaInicio", { horaInicio })
    .getOne();

  if (conflicto) throw new Error("El horario seleccionado ya está reservado");

  const nueva = repo().create({ tema: String(tema).trim(), fecha, horaInicio, horaFin });
  return await repo().save(nueva);
};

/* ---------- REQUISITO 2: transmisiones de un mes ---------- */
export const getTransmisionesPorMesService = async (anio, mes) => {
  anio = Number(anio);
  mes = Number(mes);
  if (!Number.isInteger(anio) || !Number.isInteger(mes) || mes < 1 || mes > 12) {
    throw new Error("Año o mes inválido");
  }

  const ultimoDia = new Date(anio, mes, 0).getDate();
  const desde = `${anio}-${pad(mes)}-01`;
  const hasta = `${anio}-${pad(mes)}-${pad(ultimoDia)}`;

  return await repo().find({
    where: { fecha: Between(desde, hasta) },     // solo el mes elegido
    order: { fecha: "ASC", horaInicio: "ASC" },  // orden cronológico
  });
};
