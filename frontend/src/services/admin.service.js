import { api } from "./api.js";

// Usuarios
export const getUsers = async () => (await api.get("/admin/users")).data;
export const createUser = async (user) => (await api.post("/admin/users", user)).data;
export const updateUserRole = async (userId, role) =>
  (await api.patch(`/admin/users/${userId}/role`, { role })).data;
export const updateUserFunciones = async (userId, funciones) =>
  (await api.patch(`/admin/users/${userId}/funciones`, { funciones })).data;

// Equipos de trabajo
export const getTeams = async () => (await api.get("/admin/teams")).data;
export const createTeam = async (name, description, memberIds = []) =>
  (await api.post("/admin/teams", { name, description, memberIds })).data;
export const updateTeam = async (teamId, name, description) =>
  (await api.put(`/admin/teams/${teamId}`, { name, description })).data;
export const deleteTeam = async (teamId) => (await api.delete(`/admin/teams/${teamId}`)).data;
export const assignUserToTeam = async (userId, teamId) =>
  (await api.post("/admin/teams/assign", { userId, teamId })).data;
