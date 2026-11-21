import { api } from "./api.js";

// El propio usuario cambia solo su correo y su telefono
export const updateMyProfile = async (data) => (await api.patch("/users/me", data)).data;
