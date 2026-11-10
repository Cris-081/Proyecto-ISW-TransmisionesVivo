import { prisma } from "./prisma.js";

await prisma.tarifas.createMany({
  data: [
    { servicio: "Transmisión básica (1 cámara)", tipoCliente: "empresa", precio: 380000, condicion: "Contrato anual -10%" },
    { servicio: "Producción con sponsor", tipoCliente: "empresa", precio: 890000, condicion: "Incluye branding en pantalla" },
    { servicio: "Transmisión básica (1 cámara)", tipoCliente: "normal", precio: 280000, condicion: "Pago único" },
    { servicio: "Evento familiar / social", tipoCliente: "normal", precio: 180000, condicion: "Pago único" },
  ],
});

await prisma.$disconnect();
console.log("Tarifas cargadas");