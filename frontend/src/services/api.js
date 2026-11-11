import axios from "axios";
import { getToken } from "../helpers/storage.js";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

// El backend exige el bearer toeken
export const api = axios.create({ baseURL: API_URL });

api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});
