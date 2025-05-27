import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const mantenimientos = await prisma.mantenimiento.findMany({
      include: {
        equipo: true
      }
    })
    return NextResponse.json(mantenimientos)
  } catch (error) {
    console.error('Error al obtener mantenimientos:', error)
    return NextResponse.json({ error: 'Error al obtener mantenimientos' }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const data = await req.json()
    
    // Ensure id_equipo is present and is a number
    if (!data.id_equipo) {
      return NextResponse.json({ 
        error: 'ID de equipo es requerido' 
      }, { status: 400 })
    }

    const equipoId = parseInt(data.id_equipo)
    
    // Verify equipment exists
    const equipo = await prisma.equipo.findUnique({
      where: { 
        id_equipo: equipoId 
      }
    })

    if (!equipo) {
      return NextResponse.json({ 
        error: 'Equipo no encontrado' 
      }, { status: 404 })
    }

    const nuevo = await prisma.mantenimiento.create({
      data: {
        tipo: data.tipo,
        descripcion: data.descripcion,
        fecha: new Date(data.fecha),
        tecnico: data.tecnico,
        estado: data.estado,
        id_equipo: equipoId
      },
      include: {
        equipo: true
      }
    })
    
    return NextResponse.json(nuevo)
  } catch (error) {
    console.error('Error al crear mantenimiento:', error)
    return NextResponse.json({ 
      error: 'Error al crear mantenimiento',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}