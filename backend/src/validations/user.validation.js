import Joi from "joi";

const FUNCIONES_PERMITIDAS = ["camara", "audio", "switch", "relator", "montaje"];

export const loginValidation = Joi.object({
  email: Joi.string().email().required().trim().messages({
    "string.empty": "El email es obligatorio.",
    "string.email": "El formato del email no es válido.",
  }),
  password: Joi.string().min(6).required().messages({
    "string.empty": "La contraseña es obligatoria.",
    "string.min": "La contraseña debe tener al menos 6 caracteres.",
  }),
});

export const createUserValidation = Joi.object({
  nombre: Joi.string().required(),
  email: Joi.string().email().required(),
  run: Joi.string().required(),
  password: Joi.string().min(6).required(),
  role: Joi.string().valid("admin", "coordinador", "operador").default("operador"),
  funciones: Joi.array().items(Joi.string().valid(...FUNCIONES_PERMITIDAS)),
  numeroTelefonico: Joi.string().optional(),
});