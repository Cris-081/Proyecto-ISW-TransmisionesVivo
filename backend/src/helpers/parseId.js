import { HttpError } from "../handlers/errorHandler.js";

//Convierte un parametro a entero positivo o lanza un error 400
export function parseId(value, label = "ID") {
  const id = Number(value);
  if (!Number.isInteger(id) || id <= 0) throw new HttpError(400, `${label} invalido`);
  return id;
}
