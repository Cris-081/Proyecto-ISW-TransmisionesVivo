import { EntitySchema } from "typeorm";

export const User = new EntitySchema({
  name: "User",
  tableName: "users",
  columns: {
    id: {
      primary: true,
      type: "int",
      generated: "increment",
    },
    run: {
      type: "varchar",
      length: 12,
      unique: true,
      nullable: false,
    },
    nombre: {
      type: "varchar",
      length: 100,
      nullable: false,
    },
    email: {
      type: "varchar",
      length: 255,
      unique: true,
      nullable: false,
    },
    password: {
      type: "varchar",
      length: 255,
      nullable: false,
    },
    role: {
      type: "enum",
      enum: ["admin", "coordinador", "operador"],
      default: "operador",
      nullable: false,
    },
    
    funciones: {
      type: "simple-array",
      nullable: true,
      default: "",
    },
    estado: {
      type: "enum",
      enum: ["Activo", "Inactivo", "Bloqueado"],
      default: "Activo",
      nullable: false,
    },
    numeroTelefonico: {
      type: "varchar",
      length: 15,
      nullable: true,
    },
    created_at: {
      type: "timestamp",
      createDate: true,
      default: () => "CURRENT_TIMESTAMP",
    },
    updated_at: {
      type: "timestamp",
      updateDate: true,
      default: () => "CURRENT_TIMESTAMP",
    },
  },
  relations: {
    team: {
      target: "Team",
      type: "many-to-one",
      joinColumn: { name: "team_id" },
      nullable: true,
      onDelete: "SET NULL",
    },
  },
});