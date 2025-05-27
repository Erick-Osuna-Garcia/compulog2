import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Create default location
  const ubicacion = await prisma.ubicacion.create({
    data: {
      edificio: 'Principal',
      piso: '1',
      oficina: 'Almacén'
    }
  })

  // Create default user
  const usuario = await prisma.usuario.create({
    data: {
      nombre: 'Admin',
      correo: 'admin@compulog.com',
      rol: 'ADMIN'
    }
  })

  console.log({ ubicacion, usuario })
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })