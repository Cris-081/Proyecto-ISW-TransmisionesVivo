import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

const msg = (error) =>
  error.response?.data?.message || "No se pudo conectar con el servidor.";

// Requisito 1: bloques libres/reservados de una fecha
export const getDisponibilidad = async (fecha) => {
  try {
    const r = await axios.get(`${API_URL}/transmisiones/disponibilidad`, { params: { fecha } });
    return r.data.data;
  } catch (e) {
    throw new Error(msg(e));
  }
};

// Requisito 1: reservar un horario válido
export const crearTransmision = async (datos) => {
  try {
    const r = await axios.post(`${API_URL}/transmisiones`, datos);
    return r.data.data;
  } catch (e) {
    throw new Error(msg(e));
  }
};

// Requisito 2: transmisiones de un mes
export const getTransmisionesPorMes = async (anio, mes) => {
  try {
    const r = await axios.get(`${API_URL}/transmisiones`, { params: { anio, mes } });
    return r.data.data;
  } catch (e) {
    throw new Error(msg(e));
  }
};
export const getTarifas = async (tipo) => {
  try {
    const r = await axios.get(`${API_URL}/tarifas`, { params: { tipo } });
    return r.data.data;
  } catch (e) {
    throw new Error(msg(e));
  }
};