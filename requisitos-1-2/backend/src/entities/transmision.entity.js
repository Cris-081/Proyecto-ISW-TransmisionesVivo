import { EntitySchema } from "typeorm";

// Tabla "transmisiones". Fecha y horas van por separado (texto "HH:MM")
// para evitar problemas de zona horaria y comparar rangos fácilmente.
export const Transmision = new EntitySchema({
  name: "Transmision",
  tableName: "transmisiones",
  columns: {
    id: { primary: true, type: "int", generated: "increment" },
    tema: { type: "varchar", length: 150, nullable: false },
    fecha: { type: "date", nullable: false },                     // "2026-10-20"
    horaInicio: { type: "varchar", length: 5, nullable: false },  // "09:00"
    horaFin: { type: "varchar", length: 5, nullable: false },     // "10:00"
    created_at: { type: "timestamp", createDate: true },
  },
});
