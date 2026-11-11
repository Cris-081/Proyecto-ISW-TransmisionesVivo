-- CreateEnum
CREATE TYPE "Role" AS ENUM ('admin', 'coordinador', 'operador');

-- CreateEnum
CREATE TYPE "Estado" AS ENUM ('Activo', 'Inactivo', 'Bloqueado');

-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "run" VARCHAR(12) NOT NULL,
    "nombre" VARCHAR(100) NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "password" VARCHAR(255) NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'operador',
    "funciones" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "estado" "Estado" NOT NULL DEFAULT 'Activo',
    "numeroTelefonico" VARCHAR(15),
    "team_id" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "teams" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "teams_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_run_key" ON "users"("run");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_team_id_fkey" FOREIGN KEY ("team_id") REFERENCES "teams"("id") ON DELETE SET NULL ON UPDATE CASCADE;
