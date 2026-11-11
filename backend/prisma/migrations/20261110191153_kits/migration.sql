-- CreateEnum
CREATE TYPE "EstadoKit" AS ENUM ('Disponible', 'Ocupado');

-- CreateEnum
CREATE TYPE "TipoItem" AS ENUM ('camara', 'microfono', 'accesorio');

-- CreateTable
CREATE TABLE "kits" (
    "id" SERIAL NOT NULL,
    "nombre" VARCHAR(100) NOT NULL,
    "descripcion" TEXT,
    "estado" "EstadoKit" NOT NULL DEFAULT 'Disponible',
    "team_id" INTEGER,
    "asignado_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "kits_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "kit_items" (
    "id" SERIAL NOT NULL,
    "kit_id" INTEGER NOT NULL,
    "tipo" "TipoItem" NOT NULL,
    "nombre" VARCHAR(100) NOT NULL,
    "numero_serie" VARCHAR(100),

    CONSTRAINT "kit_items_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "kits_nombre_key" ON "kits"("nombre");

-- AddForeignKey
ALTER TABLE "kits" ADD CONSTRAINT "kits_team_id_fkey" FOREIGN KEY ("team_id") REFERENCES "teams"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "kit_items" ADD CONSTRAINT "kit_items_kit_id_fkey" FOREIGN KEY ("kit_id") REFERENCES "kits"("id") ON DELETE CASCADE ON UPDATE CASCADE;
