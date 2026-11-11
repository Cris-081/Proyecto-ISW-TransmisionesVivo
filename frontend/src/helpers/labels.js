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


export const TIPOS_ITEM = {
  camara: "Camara",
  microfono: "Microfono",
  accesorio: "Accesorio",
};

export const labelTipoItem = (t) => TIPOS_ITEM[t] || t;
