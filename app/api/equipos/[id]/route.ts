import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

// ✅ PUT — Actualizar equipo por ID
export async function PUT(
  req: Request,
  context: { params: { id: string } }
) {
  try {
    const id = parseInt(context.params.id)
    const data = await req.json()

    const equipo = await prisma.equipo.update({
      where: { id_equipo: id },
      data: {
        nombre_equipo: data.nombre_equipo,
        tipo_equipo: data.tipo_equipo,
        marca: data.marca,
        modelo: data.modelo,
        estado: data.estado,
        // Agrega otros campos si es necesario
      }
    })

    return NextResponse.json(equipo)
  } catch (error) {
    console.error('Error al actualizar equipo:', error)
    return NextResponse.json(
      { error: 'Error al actualizar equipo' },
      { status: 500 }
    )
  }
}

// ✅ DELETE — Eliminar equipo por ID
export async function DELETE(
  req: Request,
  context: { params: { id: string } }
) {
  try {
    const id = parseInt(context.params.id)

    // Verifica si tiene préstamos activos o mantenimientos
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

    // Elimina registros relacionados en una transacción
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
