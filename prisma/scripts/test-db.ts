import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const equipos = await prisma.equipo.findMany()
  console.log(equipos)
}

main()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect())
