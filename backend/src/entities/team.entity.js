import { EntitySchema } from "typeorm";

export const Team = new EntitySchema({
  name: "Team",
  tableName: "teams",
  columns: {
    id: {
      primary: true,
      type: "int",
      generated: true,
    },
    name: {
      type: "varchar",
      length: 100,
      nullable: false,
    },
    description: {
      type: "text",
      nullable: true,
    },
    createdAt: {
      type: "timestamp",
      createDate: true,
    },
  },
  relations: {
    members: {
      target: "User",
      type: "one-to-many",
      inverseSide: "team",
    },
  },
});