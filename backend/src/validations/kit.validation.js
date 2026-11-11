import Joi from "joi";

export const TIPOS_ITEM = ["camara", "microfono", "accesorio"];

const itemSchema = Joi.object({
  tipo: Joi.string()
    .valid(...TIPOS_ITEM)
    .required()
    .messages({
      "any.only": `El tipo de equipo debe ser: ${TIPOS_ITEM.join(", ")}.`,
      "any.required": "Cada equipo necesita un tipo.",
    }),
  nombre: Joi.string().trim().max(100).required().messages({
    "string.empty": "Cada equipo necesita un nombre o modelo.",
    "string.max": "El nombre de un equipo no puede superar los 100 caracteres.",
    "any.required": "Cada equipo necesita un nombre o modelo.",
  }),
  numeroSerie: Joi.string().trim().max(100).allow("", null).optional(),
});

export const kitValidation = Joi.object({
  nombre: Joi.string().trim().max(100).required().messages({
    "string.empty": "El nombre del kit es obligatorio.",
    "string.max": "El nombre del kit no puede superar los 100 caracteres.",
    "any.required": "El nombre del kit es obligatorio.",
  }),
  descripcion: Joi.string().trim().max(500).allow("", null).optional(),
  items: Joi.array()
    .items(itemSchema)
    .required()
    .custom((items, helpers) => {
      // Un kit tiene que tener si o si camara y micro, lo demas es "opcional"
      if (!items.some((i) => i.tipo === "camara")) return helpers.message("El kit debe incluir al menos una camara.");
      if (!items.some((i) => i.tipo === "microfono")) return helpers.message("El kit debe incluir al menos un microfono.");
      return items;
    })
    .messages({ "any.required": "El kit debe incluir equipos (camara y microfono como minimo)." }),
});

export const asignarKitValidation = Joi.object({
  teamId: Joi.number().integer().positive().required().messages({
    "any.required": "Debes indicar el equipo al que se asigna el kit.",
    "number.base": "El equipo indicado no es valido.",
  }),
});
