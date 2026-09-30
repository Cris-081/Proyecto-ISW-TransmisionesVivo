import { loginService } from "../services/auth.service.js";
import { loginValidation } from "../validations/user.validation.js";
import { handleSuccess, handleErrorClient, handleErrorServer } from "../handlers/responseHandlers.js";

export async function login(req, res) {
  try {
    const { error } = loginValidation.validate(req.body);
    if (error) {
      return handleErrorClient(res, 400, error.details[0].message);
    }

    const { email, password } = req.body;
    const authData = await loginService({ email, password });

    return handleSuccess(res, 200, "Inicio de sesión exitoso", authData);
  } catch (error) {
    if (
      error.message === "Credenciales inválidas" ||
      error.message === "La cuenta se encuentra inactiva o deshabilitada"
    ) {
      return handleErrorClient(res, 401, error.message);
    }
    return handleErrorServer(res, 500, "Error interno del servidor", error.message);
  }
}