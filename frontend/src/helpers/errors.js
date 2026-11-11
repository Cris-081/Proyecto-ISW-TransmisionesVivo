/** Mensaje legible para mostrar al usuario a partir de un error de axios. */
export function getErrorMessage(err) {
  if (!err?.response) return "No se pudo conectar con el servidor. Revisa que el backend este encendido.";
  return err.response.data?.message || "Ocurrio un error inesperado.";
}
