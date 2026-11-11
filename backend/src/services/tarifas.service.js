import { prisma } from "../config/prisma.js";

export const getTarifasService = async (tipo) => {
  if (!["empresa", "normal"].includes(tipo)) throw new Error("Tipo de cliente inválido");
  return await prisma.tarifas.findMany({
    where: { tipoCliente: tipo },
    orderBy: { id: "asc" },
  });
};