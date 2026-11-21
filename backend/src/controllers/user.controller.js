import { getUserByIdService, updateOwnProfileService } from "../services/admin.service.js";
import { handleControllerError } from "../handlers/errorHandler.js";
import { handleSuccess, handleErrorClient } from "../handlers/responseHandlers.js";
import { updateProfileValidation } from "../validations/user.validation.js";

export async function getUserById(req, res) {
  try {
    const { password, ...user } = await getUserByIdService(req.params.id);
    return handleSuccess(res, 200, "Usuario obtenido", user);
  } catch (err) {
    return handleControllerError(res, err);
  }
}

// El usuario puede cambiar sus datos pero solo el correo o el numero
export async function updateMe(req, res) {
  try {
    
    const { error, value } = updateProfileValidation.validate(req.body, { stripUnknown: true });
    if (error) return handleErrorClient(res, 400, error.details[0].message);
    const user = await updateOwnProfileService(req.user.id, value);
    return handleSuccess(res, 200, "Datos actualizados con exito", user);
  } catch (err) {
    return handleControllerError(res, err);
  }
}
