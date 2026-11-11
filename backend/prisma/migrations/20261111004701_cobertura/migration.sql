-- CreateTable
CREATE TABLE "transmisiones" (
    "id" SERIAL NOT NULL,
    "tema" VARCHAR(150) NOT NULL,
    "fecha" DATE NOT NULL,
    "horaInicio" VARCHAR(5) NOT NULL,
    "horaFin" VARCHAR(5) NOT NULL,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PK_6df8c2fe648b87cf37994d82983" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "trabajadores" (
    "id" SERIAL NOT NULL,
    "nombre" VARCHAR(100) NOT NULL,
    "cargo" VARCHAR(50) NOT NULL,

    CONSTRAINT "trabajadores_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "equipos" (
    "id" SERIAL NOT NULL,
    "nombre" VARCHAR(100) NOT NULL,

    CONSTRAINT "equipos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tarifas" (
    "id" SERIAL NOT NULL,
    "servicio" VARCHAR(100) NOT NULL,
    "tipoCliente" VARCHAR(20) NOT NULL,
    "precio" INTEGER NOT NULL,
    "condicion" VARCHAR(100) NOT NULL,

    CONSTRAINT "tarifas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pagos" (
    "id" SERIAL NOT NULL,
    "cliente" VARCHAR(100) NOT NULL,
    "transmision" VARCHAR(150) NOT NULL,
    "total" INTEGER NOT NULL,
    "montoPagado" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "pagos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_trabajadoresTotransmisiones" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_trabajadoresTotransmisiones_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_equiposTotransmisiones" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_equiposTotransmisiones_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_trabajadoresTotransmisiones_B_index" ON "_trabajadoresTotransmisiones"("B");

-- CreateIndex
CREATE INDEX "_equiposTotransmisiones_B_index" ON "_equiposTotransmisiones"("B");

-- AddForeignKey
ALTER TABLE "_trabajadoresTotransmisiones" ADD CONSTRAINT "_trabajadoresTotransmisiones_A_fkey" FOREIGN KEY ("A") REFERENCES "trabajadores"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_trabajadoresTotransmisiones" ADD CONSTRAINT "_trabajadoresTotransmisiones_B_fkey" FOREIGN KEY ("B") REFERENCES "transmisiones"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_equiposTotransmisiones" ADD CONSTRAINT "_equiposTotransmisiones_A_fkey" FOREIGN KEY ("A") REFERENCES "equipos"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_equiposTotransmisiones" ADD CONSTRAINT "_equiposTotransmisiones_B_fkey" FOREIGN KEY ("B") REFERENCES "transmisiones"("id") ON DELETE CASCADE ON UPDATE CASCADE;
