export const FUNCIONES = {
  switch: "Switch",
  camara: "Cámara",
  audio: "Audio",
  relator: "Relator",
  montaje: "Montaje",
};

export const ROLES = {
  admin: "Administrador",
  coordinador: "Coordinador",
  operador: "Operador",
};

export const labelFuncion = (f) => FUNCIONES[f] || f;
export const labelRol = (r) => ROLES[r] || r;
