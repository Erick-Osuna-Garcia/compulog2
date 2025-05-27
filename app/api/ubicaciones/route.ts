import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET() {
  const ubicaciones = await prisma.ubicacion.findMany({
    include: {
      Equipo: {
        select: {
          nombre_equipo: true
        }
      }
    }
  })
  return NextResponse.json(ubicaciones)
}