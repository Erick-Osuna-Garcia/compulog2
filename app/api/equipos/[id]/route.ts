import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

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
        // ...other fields...
      }
    })

    return NextResponse.json(equipo)
  } catch (error) {
    console.error('Error al actualizar equipo:', error)
    return NextResponse.json({ error: 'Error al actualizar equipo' }, { status: 500 })
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(await Promise.resolve(params.id))

    // Check if equipment has any active loans or maintenance records
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
      return NextResponse.json({ 
        error: 'No se puede eliminar un equipo con préstamos activos' 
      }, { status: 400 })
    }

    if (maintenanceRecords) {
      return NextResponse.json({ 
        error: 'No se puede eliminar un equipo con registros de mantenimiento' 
      }, { status: 400 })
    }

    // Delete all related records in a transaction
    await prisma.$transaction(async (tx) => {
      // Delete related maintenance records first
      await tx.mantenimiento.deleteMany({
        where: { id_equipo: id }
      })

      // Delete related loans
      await tx.prestamo.deleteMany({
        where: { id_equipo: id }
      })

      // Finally delete the equipment
      await tx.equipo.delete({
        where: { id_equipo: id }
      })
    })

    return NextResponse.json({ 
      message: 'Equipo y registros relacionados eliminados correctamente' 
    })

  } catch (error) {
    console.error('Error al eliminar equipo:', error)
    return NextResponse.json({ 
      error: 'Error al eliminar equipo',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}