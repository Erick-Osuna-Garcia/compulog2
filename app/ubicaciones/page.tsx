'use client'
import { useState, useEffect } from 'react'

interface Ubicacion {
  id_ubicacion: number
  edificio: string
  piso: string
  oficina: string
  Equipo: {
    nombre_equipo: string
  }[]
}

export default function UbicacionesPage() {
  const [ubicaciones, setUbicaciones] = useState<Ubicacion[]>([])

  useEffect(() => {
    fetch('/api/ubicaciones')
      .then(res => res.json())
      .then(data => setUbicaciones(data))
  }, [])

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Gestión de Ubicaciones</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {ubicaciones.map(ubicacion => (
          <div key={ubicacion.id_ubicacion} className="bg-white p-4 rounded-lg shadow">
            <h2 className="text-xl font-semibold">
              {ubicacion.edificio} - Piso {ubicacion.piso}
            </h2>
            <p className="text-gray-600">Oficina: {ubicacion.oficina}</p>
            
            <div className="mt-4">
              <h3 className="font-medium mb-2">Equipos en esta ubicación:</h3>
              <ul className="list-disc list-inside text-sm text-gray-600">
                {ubicacion.Equipo.map(equipo => (
                  <li key={equipo.nombre_equipo}>{equipo.nombre_equipo}</li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}