import { getUserByIdService } from "../services/admin.service.js";
import { handleControllerError } from "../handlers/errorHandler.js";
import { handleSuccess } from "../handlers/responseHandlers.js";

export async function getUserById(req, res) {
  try {
    const { password, ...user } = await getUserByIdService(req.params.id);
    return handleSuccess(res, 200, "Usuario obtenido", user);
  } catch (err) {
    return handleControllerError(res, err);
  }
}
