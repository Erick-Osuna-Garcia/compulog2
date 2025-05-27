import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id)
    const data = await req.json()

    const prestamo = await prisma.prestamo.update({
      where: { id_prestamo: id },
      data: {
        fecha_prestamo: new Date(data.fecha_prestamo),
        fecha_devolucion: data.fecha_devolucion ? new Date(data.fecha_devolucion) : null,
        estado: data.estado,
        notas: data.notas,
        id_equipo: parseInt(data.id_equipo),
        id_usuario: parseInt(data.id_usuario)
      },
      include: {
        equipo: true,
        usuario: true
      }
    })

    return NextResponse.json(prestamo)
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    console.error('Error al actualizar préstamo:', error)
    return NextResponse.json({ error: 'Error al actualizar préstamo' }, { status: 500 })
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id)
    
    // Get the loan to access equipment ID
    const prestamo = await prisma.prestamo.findUnique({
      where: { id_prestamo: id }
    })

    if (!prestamo) {
      return NextResponse.json({ error: 'Préstamo no encontrado' }, { status: 404 })
    }

    // Execute both operations in a transaction
    const result = await prisma.$transaction([
      // Delete the loan
      prisma.prestamo.delete({
        where: { id_prestamo: id }
      }),
      // Update equipment status back to active
      prisma.equipo.update({
        where: { id_equipo: prestamo.id_equipo },
        data: { estado: 'Activo' }
      })
    ])

    return NextResponse.json({ message: 'Préstamo eliminado correctamente' })
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    console.error('Error al eliminar préstamo:', error)
    return NextResponse.json({ error: 'Error al eliminar préstamo' }, { status: 500 })
  }
}