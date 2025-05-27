import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const prestamos = await prisma.prestamo.findMany({
      include: {
        equipo: true,
        usuario: true
      }
    })
    return NextResponse.json(prestamos || []) // Return empty array if null
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    console.error('Error al obtener préstamos:', error)
    return NextResponse.json({ error: 'Error al obtener préstamos' }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const data = await req.json()
    
    // Verify equipment exists and is available
    const equipo = await prisma.equipo.findUnique({
      where: { id_equipo: parseInt(data.id_equipo) }
    })

    if (!equipo) {
      return NextResponse.json({ error: 'Equipo no encontrado' }, { status: 404 })
    }

    if (equipo.estado === 'Ocupado') {
      return NextResponse.json({ 
        error: 'El equipo ya está en préstamo' 
      }, { status: 400 })
    }

    // Create loan and update equipment status in a transaction
     // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [prestamo, _] = await prisma.$transaction([
      // Create the loan
      prisma.prestamo.create({
        data: {
          fecha_prestamo: new Date(data.fecha_prestamo),
          fecha_devolucion: data.fecha_devolucion ? new Date(data.fecha_devolucion) : null,
          estado: 'Prestado',
          notas: data.notas || '',
          id_equipo: parseInt(data.id_equipo),
          id_usuario: parseInt(data.id_usuario)
        },
        include: {
          equipo: true,
          usuario: true
        }
      }),
      // Update equipment status
      prisma.equipo.update({
        where: { id_equipo: parseInt(data.id_equipo) },
        data: { estado: 'Ocupado' }
      })
    ])

    return NextResponse.json(prestamo)
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    console.error('Error al crear préstamo:', error)
    return NextResponse.json({ 
      error: 'Error al crear préstamo',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

// Add endpoint to handle returns
export async function PUT(req: Request) {
  try {
    const data = await req.json()
    
    const prestamo = await prisma.$transaction([
      // Update loan status
      prisma.prestamo.update({
        where: { id_prestamo: parseInt(data.id_prestamo) },
        data: { 
          estado: 'Devuelto',
          fecha_devolucion: new Date()
        }
      }),
      // Update equipment status back to available
      prisma.equipo.update({
        where: { id_equipo: parseInt(data.id_equipo) },
        data: { estado: 'Activo' }
      })
    ])

    return NextResponse.json(prestamo)
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    console.error('Error al devolver préstamo:', error)
    return NextResponse.json({ 
      error: 'Error al devolver préstamo',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}