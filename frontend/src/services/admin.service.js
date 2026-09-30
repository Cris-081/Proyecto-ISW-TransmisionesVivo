import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

export const getUsers = async () => {
  const response = await axios.get(`${API_URL}/admin/users`);
  return response.data;
};

export const updateUserRole = async (userId, role) => {
  const response = await axios.patch(`${API_URL}/admin/users/${userId}/role`, { role });
  return response.data;
};

export const getTeams = async () => {
  const response = await axios.get(`${API_URL}/admin/teams`);
  return response.data;
};

export const createTeam = async (name, description) => {
  const response = await axios.post(`${API_URL}/admin/teams`, { name, description });
  return response.data;
};

export const assignUserToTeam = async (userId, teamId) => {
  const response = await axios.post(`${API_URL}/admin/teams/assign`, { userId, teamId });
  return response.data;
};