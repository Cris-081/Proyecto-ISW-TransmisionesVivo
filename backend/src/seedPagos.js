import { prisma } from "./config/prisma.js";

await prisma.pagos.createMany({
  data: [
    { cliente: "Biomotors", transmision: "Lanzamiento producto", total: 890000, montoPagado: 445000 },
    { cliente: "Cervecería Austral", transmision: "Torneo Interbarrial", total: 890000, montoPagado: 0 },
    { cliente: "Colegio San Pedro", transmision: "Acto de graduación", total: 280000, montoPagado: 280000 },
  ],
});

await prisma.$disconnect();
console.log("Pagos cargados");