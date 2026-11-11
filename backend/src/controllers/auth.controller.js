import { loginService } from "../services/auth.service.js";
import { loginValidation } from "../validations/user.validation.js";
import { handleSuccess, handleErrorClient, handleErrorServer } from "../handlers/responseHandlers.js";

export async function login(req, res) {
  try {
    const { error, value } = loginValidation.validate(req.body);
    if (error) {
      return handleErrorClient(res, 400, error.details[0].message);
    }

    const { email, password } = value;
    const authData = await loginService({ email, password });

    return handleSuccess(res, 200, "Inicio de sesion exitoso", authData);
  } catch (error) {
    // Errores esperados (404, 403, 401)
    if (error.status) {
      return handleErrorClient(res, error.status, error.message);
    }
    return handleErrorServer(res, 500, "Error interno del servidor", error.message);
  }
}

export async function me(req, res) {
  return handleSuccess(res, 200, "Sesion valida", req.user);
}
