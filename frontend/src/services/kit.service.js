import { api } from "./api.js";

export const getKits = async (estado) =>
  (await api.get("/admin/kits", { params: estado ? { estado } : {} })).data;
export const createKit = async (kit) => (await api.post("/admin/kits", kit)).data;
export const updateKit = async (kitId, kit) => (await api.put(`/admin/kits/${kitId}`, kit)).data;
export const deleteKit = async (kitId) => (await api.delete(`/admin/kits/${kitId}`)).data;
export const assignKit = async (kitId, teamId) =>
  (await api.post(`/admin/kits/${kitId}/asignar`, { teamId })).data;
export const releaseKit = async (kitId) => (await api.post(`/admin/kits/${kitId}/liberar`)).data;
