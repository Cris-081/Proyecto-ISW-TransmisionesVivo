import * as service from "../services/transmision.service.js";
import { handleSuccess, handleErrorClient } from "../handlers/responseHandlers.js";

export async function getDisponibilidad(req, res) {
  try {
    const slots = await service.getDisponibilidadService(req.query.fecha);
    return handleSuccess(res, 200, "Disponibilidad obtenida", slots);
  } catch (err) {
    return handleErrorClient(res, 400, err.message);
  }
}

export async function createTransmision(req, res) {
  try {
    const t = await service.createTransmisionService(req.body || {});
    return handleSuccess(res, 201, "Transmisión programada con éxito", t);
  } catch (err) {
    const status = err.message.includes("reservado") ? 409 : 400;
    return handleErrorClient(res, status, err.message);
  }
}

export async function getTransmisionesPorMes(req, res) {
  try {
    const { anio, mes } = req.query;
    const lista = await service.getTransmisionesPorMesService(anio, mes);
    return handleSuccess(res, 200, "Transmisiones obtenidas", lista);
  } catch (err) {
    return handleErrorClient(res, 400, err.message);
  }
}
