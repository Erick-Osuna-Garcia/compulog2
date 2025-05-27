import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const equipos = await prisma.equipo.findMany()
    return NextResponse.json(equipos)
  } catch (error) {
    console.error('Error al obtener equipos:', error)
    return NextResponse.json({ error: 'Error al obtener equipos' }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const data = await req.json()

    // Check if location exists
    const ubicacion = await prisma.ubicacion.findUnique({
      where: { id_ubicacion: 1 }
    })

    if (!ubicacion) {
      return NextResponse.json(
        { error: 'Ubicación no encontrada' },
        { status: 404 }
      )
    }

    const nuevo = await prisma.equipo.create({ 
      data: {
        ...data,
        fecha_compra: new Date(),
        id_ubicacion: ubicacion.id_ubicacion,
        id_usuario: 1 // Make sure this user exists from seed
      } 
    })
    
    return NextResponse.json(nuevo)
  } catch (error) {
    console.error('Error al crear equipo:', error)
    return NextResponse.json(
      { error: 'Error al crear equipo', details: error.message },
      { status: 500 }
    )
  }
}