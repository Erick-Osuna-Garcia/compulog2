'use client'
import { useState, useEffect } from 'react'

export default function MantenimientosPage() {
  const [mantenimientos, setMantenimientos] = useState([])

  useEffect(() => {
    fetch('/api/mantenimientos')
      .then(res => res.json())
      .then(data => setMantenimientos(data))
  }, [])

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Registro de Mantenimientos</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {mantenimientos.map((mant: any) => (
          <div key={mant.id_mantenimiento} className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-4">
              <div className="flex justify-between items-start">
                <h2 className="text-xl font-semibold text-gray-800">{mant.equipo?.nombre_equipo}</h2>
                <span className={`px-2 py-1 rounded text-sm ${
                  mant.estado === 'En Mantenimiento' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'
                }`}>
                  {mant.estado}
                </span>
              </div>
              
              <div className="mt-4 space-y-2 text-sm text-gray-600">
                <p><span className="font-medium">Tipo:</span> {mant.tipo}</p>
                <p><span className="font-medium">Técnico:</span> {mant.tecnico}</p>
                <p><span className="font-medium">Fecha:</span> {new Date(mant.fecha).toLocaleDateString()}</p>
                <p><span className="font-medium">Descripción:</span></p>
                <p className="pl-4 text-gray-700">{mant.descripcion}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}