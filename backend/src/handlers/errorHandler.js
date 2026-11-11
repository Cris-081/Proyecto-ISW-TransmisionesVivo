import { handleErrorClient, handleErrorServer } from "./responseHandlers.js";

// Error con codigos como el 400 4004 o 409 
export class HttpError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}

// te da los errores del controlador 
export function handleControllerError(res, err) {
  if (err instanceof HttpError) {
    return err.status >= 500
      ? handleErrorServer(res, err.status, err.message)
      : handleErrorClient(res, err.status, err.message);
  }
  
  if (err?.code === "P2002") {
    const campos = Array.isArray(err.meta?.target) ? err.meta.target.join(", ") : "los datos indicados";
    return handleErrorClient(res, 409, `Ya existe un registro con ese valor (${campos})`);
  }
  if (err?.code === "P2025") return handleErrorClient(res, 404, "Registro no encontrado");
  if (err?.code === "P2003") {
    return handleErrorClient(res, 409, "La operacion entra en conflicto con registros relacionados");
  }

  console.error(err);
  return handleErrorServer(res, 500, "Error interno del servidor");
}
