import { api } from "./api.js";

const msg = (error) =>
  error.response?.data?.message || "No se pudo conectar con el servidor.";

// Requisito 1: bloques libres/reservados de una fecha
export const getDisponibilidad = async (fecha) => {
  try {
    const r = await api.get("/transmisiones/disponibilidad", { params: { fecha } });
    return r.data.data;
  } catch (e) {
    throw new Error(msg(e));
  }
};

// Requisito 1: reservar un horario válido
export const crearTransmision = async (datos) => {
  try {
    const r = await api.post("/transmisiones", datos);
    return r.data.data;
  } catch (e) {
    throw new Error(msg(e));
  }
};

// Requisito 2: transmisiones de un mes
export const getTransmisionesPorMes = async (anio, mes) => {
  try {
    const r = await api.get("/transmisiones", { params: { anio, mes } });
    return r.data.data;
  } catch (e) {
    throw new Error(msg(e));
  }
};
export const getTarifas = async (tipo) => {
  try {
    const r = await api.get("/tarifas", { params: { tipo } });
    return r.data.data;
  } catch (e) {
    throw new Error(msg(e));
  }
};
export const getPagos = async (filtro) => {
  try {
    const r = await api.get("/pagos", { params: { filtro } });
    return r.data.data;
  } catch (e) {
    throw new Error(msg(e));
  }
};