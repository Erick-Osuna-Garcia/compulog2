import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const usuarios = await prisma.usuario.findMany({
      select: {
        id_usuario: true,
        nombre: true,
        rol: true
      }
    })
    return NextResponse.json(usuarios || [])
  } catch (error) {
    console.error('Error al obtener usuarios:', error)
    return NextResponse.json({ error: 'Error al obtener usuarios' }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const data = await req.json()
    const nuevo = await prisma.usuario.create({
      data: {
        nombre: data.nombre,
        correo: data.correo,
        rol: data.rol
      }
    })
    return NextResponse.json(nuevo)
  } catch (error) {
    console.error('Error al crear usuario:', error)
    return NextResponse.json({ 
      error: 'Error al crear usuario',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}