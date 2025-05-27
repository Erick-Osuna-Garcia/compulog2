import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  const id = parseInt(await Promise.resolve(params.id))
  try {
    const prestamo = await prisma.prestamo.findUnique({
      where: { id_prestamo: id }
    })
    if (!prestamo) {
      return NextResponse.json({ error: 'No encontrado' }, { status: 404 })
    }
    await prisma.$transaction([
      prisma.prestamo.delete({ where: { id_prestamo: id } }),
      prisma.equipo.update({
        where: { id_equipo: prestamo.id_equipo },
        data: { estado: 'Activo' }
      })
    ])
    return NextResponse.json({ message: 'Préstamo finalizado y equipo disponible' })
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    return NextResponse.json({ error: 'Error al finalizar préstamo' }, { status: 500 })
  }
}