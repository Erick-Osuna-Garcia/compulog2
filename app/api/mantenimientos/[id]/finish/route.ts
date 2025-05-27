import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  const id = parseInt(await Promise.resolve(params.id))
  try {
    const mantenimiento = await prisma.mantenimiento.findUnique({
      where: { id_mantenimiento: id }
    })
    if (!mantenimiento) {
      return NextResponse.json({ error: 'No encontrado' }, { status: 404 })
    }
    await prisma.$transaction([
      prisma.mantenimiento.delete({ where: { id_mantenimiento: id } }),
      prisma.equipo.update({
        where: { id_equipo: mantenimiento.id_equipo },
        data: { estado: 'Activo' }
      })
    ])
    return NextResponse.json({ message: 'Mantenimiento finalizado y equipo disponible' })
  } catch (error) {
    return NextResponse.json({ error: 'Error al finalizar mantenimiento' }, { status: 500 })
  }
}

export async function GET() {
  const mantenimientos = await prisma.mantenimiento.findMany({
    include: {
      equipo: true, // Esto es correcto
    },
  })
  return NextResponse.json(mantenimientos)
}

const handleStatusChange = async (item, section) => {
  const idField = section === 'mantenimientos' ? 'id_mantenimiento' : 'id_prestamo';
  const endpoint = section === 'mantenimientos'
    ? `/api/mantenimientos/${item[idField]}/finish`
    : `/api/prestamos/${item[idField]}/return`;

  const res = await fetch(endpoint, { method: 'PUT' });
  if (!res.ok) alert('Error al finalizar');
  await fetchData();
};

const columns = [
  { key: 'tipo', label: 'Tipo' },
  { key: 'descripcion', label: 'Descripción' },
  { key: 'fecha', label: 'Fecha' },
  { key: 'tecnico', label: 'Técnico' },
  { key: 'equipo.nombre_equipo', label: 'Equipo' }, // <- Esta columna muestra la PC
]


function formatCellValue(item, key) {
  // Soporta 'equipo.nombre_equipo'
  return key.split('.').reduce((obj, k) => (obj ? obj[k] : ''), item) ?? ''
}

/* <DataTable
  columns={columns}
  data={mantenimientos}
  // ...otros props
/> */

