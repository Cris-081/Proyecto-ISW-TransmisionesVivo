import Joi from "joi";

export const FUNCIONES_PERMITIDAS = ["camara", "audio", "switch", "relator", "montaje"];

export const loginValidation = Joi.object({
  email: Joi.string().email().required().trim().lowercase().messages({
    "string.empty": "El email es obligatorio.",
    "string.email": "El formato del email no es valido.",
  }),
  password: Joi.string().min(6).required().messages({
    "string.empty": "La contraseña es obligatoria.",
    "string.min": "La contraseña debe tener al menos 6 caracteres.",
  }),
});

export const createUserValidation = Joi.object({
  nombre: Joi.string().trim().max(100).required(),
  email: Joi.string().email().trim().lowercase().max(255).required(),
  run: Joi.string().trim().max(12).required(),
  password: Joi.string().min(6).required(),
  role: Joi.string().valid("admin", "coordinador", "operador").default("operador"),
  funciones: Joi.array().items(Joi.string().valid(...FUNCIONES_PERMITIDAS)).unique().default([]),
  numeroTelefonico: Joi.string().trim().max(15).allow("", null).optional(),
});

export const updateFuncionesValidation = Joi.object({
  funciones: Joi.array()
    .items(Joi.string().valid(...FUNCIONES_PERMITIDAS))
    .unique()
    .required()
    .messages({
      "any.only": `Las funciones permitidas son: ${FUNCIONES_PERMITIDAS.join(", ")}.`,
      "array.unique": "No repitas funciones.",
      "any.required": "Debes indicar la lista de funciones.",
    }),
});

export const teamValidation = Joi.object({
  name: Joi.string().trim().max(100).required().messages({
    "string.empty": "El nombre del equipo es obligatorio.",
    "string.max": "El nombre del equipo no puede superar los 100 caracteres.",
    "any.required": "El nombre del equipo es obligatorio.",
  }),
  description: Joi.string().trim().allow("", null).optional(),
});

export const createTeamValidation = teamValidation.keys({
  memberIds: Joi.array()
    .items(Joi.number().integer().positive())
    .unique()
    .default([])
    .messages({
      "array.unique": "No repitas integrantes.",
      "number.base": "Los integrantes indicados no son validos.",
    }),
});
