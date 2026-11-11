import * as adminService from "../services/admin.service.js";
import { handleSuccess, handleErrorClient } from "../handlers/responseHandlers.js";
import { handleControllerError } from "../handlers/errorHandler.js";
import {
  createUserValidation,
  updateFuncionesValidation,
  teamValidation,
  createTeamValidation,
} from "../validations/user.validation.js";

const omitPassword = ({ password, ...user }) => user;
const validate = (schema, body) => schema.validate(body, { stripUnknown: true });

export async function getUsers(req, res) {
  try {
    const users = await adminService.getAllUsersService();
    return handleSuccess(res, 200, "Usuarios obtenidos", users.map(omitPassword));
  } catch (err) {
    return handleControllerError(res, err);
  }
}

export async function createUser(req, res) {
  try {
    const { error, value } = validate(createUserValidation, req.body);
    if (error) return handleErrorClient(res, 400, error.details[0].message);
    const user = await adminService.createUserService(value);
    return handleSuccess(res, 201, "Usuario creado con exito", omitPassword(user));
  } catch (err) {
    return handleControllerError(res, err);
  }
}

export async function updateUserRole(req, res) {
  try {
    const { id } = req.params;
    const { role } = req.body;
    const updated = await adminService.updateUserRoleService(id, role);
    return handleSuccess(res, 200, "Rol actualizado con exito", omitPassword(updated));
  } catch (err) {
    return handleControllerError(res, err);
  }
}

export async function updateUserFunciones(req, res) {
  try {
    const { error, value } = validate(updateFuncionesValidation, req.body);
    if (error) return handleErrorClient(res, 400, error.details[0].message);
    const updated = await adminService.updateUserFuncionesService(req.params.id, value.funciones);
    return handleSuccess(res, 200, "Funciones actualizadas con exito", omitPassword(updated));
  } catch (err) {
    return handleControllerError(res, err);
  }
}

export async function createTeam(req, res) {
  try {
    const { error, value } = validate(createTeamValidation, req.body);
    if (error) return handleErrorClient(res, 400, error.details[0].message);
    const team = await adminService.createTeamService(value.name, value.description, value.memberIds);
    return handleSuccess(res, 201, "Equipo creado con exito", team);
  } catch (err) {
    return handleControllerError(res, err);
  }
}

export async function updateTeam(req, res) {
  try {
    const { error, value } = validate(teamValidation, req.body);
    if (error) return handleErrorClient(res, 400, error.details[0].message);
    const team = await adminService.updateTeamService(req.params.id, value);
    return handleSuccess(res, 200, "Equipo actualizado con exito", team);
  } catch (err) {
    return handleControllerError(res, err);
  }
}

export async function deleteTeam(req, res) {
  try {
    await adminService.deleteTeamService(req.params.id);
    return handleSuccess(res, 200, "Equipo eliminado con exito");
  } catch (err) {
    return handleControllerError(res, err);
  }
}

export async function assignTeam(req, res) {
  try {
    const { userId, teamId } = req.body;
    const updated = await adminService.assignUserToTeamService(userId, teamId);
    return handleSuccess(res, 200, "Asignacion de equipo actualizada", omitPassword(updated));
  } catch (err) {
    return handleControllerError(res, err);
  }
}

export async function getTeams(req, res) {
  try {
    const teams = await adminService.getAllTeamsService();
    const safeTeams = teams.map((team) => ({
      ...team,
      members: team.members?.map(omitPassword),
    }));
    return handleSuccess(res, 200, "Equipos obtenidos", safeTeams);
  } catch (err) {
    return handleControllerError(res, err);
  }
}
