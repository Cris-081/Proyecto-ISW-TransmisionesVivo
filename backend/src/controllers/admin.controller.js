import * as adminService from "../services/admin.service.js";
import { handleSuccess, handleErrorServer, handleErrorClient } from "../handlers/responseHandlers.js";

const omitPassword = ({ password, ...user }) => user;

export async function getUsers(req, res) {
  try {
    const users = await adminService.getAllUsersService();
    return handleSuccess(res, 200, "Usuarios obtenidos", users.map(omitPassword));
  } catch (err) {
    return handleErrorServer(res, 500, err.message);
  }
}

export async function updateUserRole(req, res) {
  try {
    const { id } = req.params;
    const { role } = req.body;
    const updated = await adminService.updateUserRoleService(id, role);
    return handleSuccess(res, 200, "Rol actualizado con éxito", omitPassword(updated));
  } catch (err) {
    return handleErrorClient(res, 400, err.message);
  }
}

export async function createTeam(req, res) {
  try {
    const { name, description } = req.body;
    const team = await adminService.createTeamService(name, description);
    return handleSuccess(res, 201, "Equipo creado con éxito", team);
  } catch (err) {
    return handleErrorClient(res, 400, err.message);
  }
}

export async function assignTeam(req, res) {
  try {
    const { userId, teamId } = req.body;
    const updated = await adminService.assignUserToTeamService(userId, teamId);
    return handleSuccess(res, 200, "Asignación de equipo actualizada", omitPassword(updated));
  } catch (err) {
    return handleErrorClient(res, 400, err.message);
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
    return handleErrorServer(res, 500, err.message);
  }
}