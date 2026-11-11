import { PrismaClient } from "@prisma/client";
import { DATABASE_URL } from "./configEnv.js";

export const prisma = new PrismaClient({ datasourceUrl: DATABASE_URL });
