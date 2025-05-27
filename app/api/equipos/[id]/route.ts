import { prisma } from '@/lib/prisma'
import { NextResponse, type NextRequest } from 'next/server'

// NO declares tu propio tipo RouteContext



export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const id = parseInt(params.id)

  try {
    const [activeLoans, maintenanceRecords] = await Promise.all([
      prisma.prestamo.findFirst({
        where: {
          id_equipo: id,
          estado: 'Prestado'
        }
      }),
      prisma.mantenimiento.findFirst({
        where: {
          id_equipo: id
        }
      })
    ])

    if (activeLoans) {
      return NextResponse.json(
        { error: 'No se puede eliminar un equipo con préstamos activos' },
        { status: 400 }
      )
    }

    if (maintenanceRecords) {
      return NextResponse.json(
        { error: 'No se puede eliminar un equipo con registros de mantenimiento' },
        { status: 400 }
      )
    }

    await prisma.$transaction(async (tx) => {
      await tx.mantenimiento.deleteMany({ where: { id_equipo: id } })
      await tx.prestamo.deleteMany({ where: { id_equipo: id } })
      await tx.equipo.delete({ where: { id_equipo: id } })
    })

    return NextResponse.json({
      message: 'Equipo y registros relacionados eliminados correctamente'
    })
  } catch (error) {
    console.error('Error al eliminar equipo:', error)
    return NextResponse.json(
      {
        error: 'Error al eliminar equipo',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
