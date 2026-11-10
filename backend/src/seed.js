import { prisma } from "./prisma.js";

await prisma.trabajadores.createMany({
  data: [
    { nombre: "M. Cárdenas", cargo: "Camarógrafo" },
    { nombre: "J. Pérez", cargo: "Sonidista" },
    { nombre: "J. Pino", cargo: "Camarógrafo" },
    { nombre: "R. Tapia", cargo: "Operador" },
  ],
});

await prisma.equipos.createMany({
  data: [
    { nombre: "FX6" },
    { nombre: "Switcher ATEM" },
    { nombre: "Micrófono shotgun" },
    { nombre: "Cámara secundaria" },
    { nombre: "Panel LED" },
  ],
});

await prisma.$disconnect();
console.log("Datos de ejemplo cargados");