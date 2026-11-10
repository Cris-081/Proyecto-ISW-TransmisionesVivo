import { prisma } from "../prisma.js";

const FILTROS = ["todos", "adelantos", "saldos", "pagado"];

const calcular = (p) => {
  const adelanto = Math.round(p.total * 0.5);
  const progreso = p.total ? Math.round((p.montoPagado / p.total) * 100) : 0;
  let estado = "Sin adelanto";
  if (p.montoPagado >= p.total) estado = "Pagado";
  else if (p.montoPagado >= adelanto) estado = "Adelanto pagado";
  return { ...p, adelanto, progreso, estado };
};

export const getPagosService = async (filtro = "todos") => {
  if (!FILTROS.includes(filtro)) throw new Error("Filtro inválido");
  const lista = (await prisma.pagos.findMany({ orderBy: { id: "asc" } })).map(calcular);
  if (filtro === "adelantos") return lista.filter((p) => p.estado === "Sin adelanto");
  if (filtro === "saldos") return lista.filter((p) => p.estado === "Adelanto pagado");
  if (filtro === "pagado") return lista.filter((p) => p.estado === "Pagado");
  return lista;
};