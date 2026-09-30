import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

export const loginService = async (credentials) => {
  try {
    const response = await axios.post(`${API_URL}/auth/login`, credentials);
    return response.data.data; 
  } catch (error) {
    if (!error.response) {
      throw new Error("No se pudo conectar con el servidor. Revisa que el backend esté encendido.");
    }
    const body = error.response.data || {};
    const detail = typeof body.details === "string" ? body.details : null;
    throw new Error(detail || body.message || "Error al iniciar sesión");
  }
};
