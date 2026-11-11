import * as kitService from "../services/kit.service.js";
import { kitValidation, asignarKitValidation } from "../validations/kit.validation.js";
import { handleSuccess, handleErrorClient } from "../handlers/responseHandlers.js";
import { handleControllerError } from "../handlers/errorHandler.js";

const ESTADOS = ["Disponible", "Ocupado"];

const validate = (schema, body) => schema.validate(body, { stripUnknown: true });

export async function getKits(req, res) {
  try {
    const { estado } = req.query;
    if (estado && !ESTADOS.includes(estado)) {
      return handleErrorClient(res, 400, `El estado debe ser: ${ESTADOS.join(" o ")}`);
    }
    const kits = await kitService.getAllKitsService(estado);
    return handleSuccess(res, 200, "Kits obtenidos", kits);
  } catch (err) {
    return handleControllerError(res, err);
  }
}

export async function getKit(req, res) {
  try {
    return handleSuccess(res, 200, "Kit obtenido", await kitService.getKitByIdService(req.params.id));
  } catch (err) {
    return handleControllerError(res, err);
  }
}

export async function createKit(req, res) {
  try {
    const { error, value } = validate(kitValidation, req.body);
    if (error) return handleErrorClient(res, 400, error.details[0].message);
    const kit = await kitService.createKitService(value);
    return handleSuccess(res, 201, "Kit creado con exito", kit);
  } catch (err) {
    return handleControllerError(res, err);
  }
}

export async function updateKit(req, res) {
  try {
    const { error, value } = validate(kitValidation, req.body);
    if (error) return handleErrorClient(res, 400, error.details[0].message);
    const kit = await kitService.updateKitService(req.params.id, value);
    return handleSuccess(res, 200, "Kit actualizado con exito", kit);
  } catch (err) {
    return handleControllerError(res, err);
  }
}

export async function deleteKit(req, res) {
  try {
    await kitService.deleteKitService(req.params.id);
    return handleSuccess(res, 200, "Kit eliminado con exito");
  } catch (err) {
    return handleControllerError(res, err);
  }
}

export async function assignKit(req, res) {
  try {
    const { error, value } = validate(asignarKitValidation, req.body);
    if (error) return handleErrorClient(res, 400, error.details[0].message);
    const kit = await kitService.assignKitToTeamService(req.params.id, value.teamId);
    return handleSuccess(res, 200, "Kit asignado al equipo", kit);
  } catch (err) {
    return handleControllerError(res, err);
  }
}

export async function releaseKit(req, res) {
  try {
    const kit = await kitService.releaseKitService(req.params.id);
    return handleSuccess(res, 200, "Kit liberado", kit);
  } catch (err) {
    return handleControllerError(res, err);
  }
}
