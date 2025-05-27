import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  const id = parseInt(await Promise.resolve(params.id))
  try {
    await prisma.mantenimiento.delete({
      where: { id_mantenimiento: id }
    })
    return NextResponse.json({ message: 'Mantenimiento eliminado' })
     // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    return NextResponse.json({ error: 'Error al eliminar mantenimiento' }, { status: 500 })
  }
}