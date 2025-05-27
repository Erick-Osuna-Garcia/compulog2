-- CreateTable
CREATE TABLE "Equipo" (
    "id_equipo" SERIAL NOT NULL,
    "nombre_equipo" TEXT NOT NULL,
    "tipo_equipo" TEXT NOT NULL,
    "marca" TEXT NOT NULL,
    "modelo" TEXT NOT NULL,
    "numero_serie" TEXT NOT NULL,
    "sistema_operativo" TEXT NOT NULL,
    "procesador" TEXT NOT NULL,
    "ram" TEXT NOT NULL,
    "disco_duro" TEXT NOT NULL,
    "fecha_compra" TIMESTAMP(3) NOT NULL,
    "estado" TEXT NOT NULL,
    "id_ubicacion" INTEGER NOT NULL,
    "id_usuario" INTEGER NOT NULL,

    CONSTRAINT "Equipo_pkey" PRIMARY KEY ("id_equipo")
);

-- CreateTable
CREATE TABLE "Mantenimiento" (
    "id_mantenimiento" SERIAL NOT NULL,
    "id_equipo" INTEGER NOT NULL,
    "tipo" TEXT NOT NULL,
    "descripcion" TEXT NOT NULL,
    "fecha" TIMESTAMP(3) NOT NULL,
    "tecnico" TEXT NOT NULL,

    CONSTRAINT "Mantenimiento_pkey" PRIMARY KEY ("id_mantenimiento")
);

-- CreateTable
CREATE TABLE "Prestamo" (
    "id_prestamo" SERIAL NOT NULL,
    "id_equipo" INTEGER NOT NULL,
    "id_usuario" INTEGER NOT NULL,
    "fecha_prestamo" TIMESTAMP(3) NOT NULL,
    "fecha_devolucion" TIMESTAMP(3) NOT NULL,
    "estado" TEXT NOT NULL,

    CONSTRAINT "Prestamo_pkey" PRIMARY KEY ("id_prestamo")
);

-- CreateTable
CREATE TABLE "Ubicacion" (
    "id_ubicacion" SERIAL NOT NULL,
    "edificio" TEXT NOT NULL,
    "piso" TEXT NOT NULL,
    "oficina" TEXT NOT NULL,

    CONSTRAINT "Ubicacion_pkey" PRIMARY KEY ("id_ubicacion")
);

-- CreateTable
CREATE TABLE "Usuario" (
    "id_usuario" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "correo" TEXT NOT NULL,
    "departamento" TEXT NOT NULL,
    "rol" TEXT NOT NULL,

    CONSTRAINT "Usuario_pkey" PRIMARY KEY ("id_usuario")
);

-- AddForeignKey
ALTER TABLE "Equipo" ADD CONSTRAINT "Equipo_id_ubicacion_fkey" FOREIGN KEY ("id_ubicacion") REFERENCES "Ubicacion"("id_ubicacion") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Equipo" ADD CONSTRAINT "Equipo_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "Usuario"("id_usuario") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Mantenimiento" ADD CONSTRAINT "Mantenimiento_id_equipo_fkey" FOREIGN KEY ("id_equipo") REFERENCES "Equipo"("id_equipo") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Prestamo" ADD CONSTRAINT "Prestamo_id_equipo_fkey" FOREIGN KEY ("id_equipo") REFERENCES "Equipo"("id_equipo") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Prestamo" ADD CONSTRAINT "Prestamo_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "Usuario"("id_usuario") ON DELETE RESTRICT ON UPDATE CASCADE;
