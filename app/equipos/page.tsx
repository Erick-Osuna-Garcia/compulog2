'use client'
import { useState, useEffect } from 'react'

export default function EquiposPage() {
  const [equipos, setEquipos] = useState([])

  useEffect(() => {
    fetch('/api/equipos')
      .then(res => res.json())
      .then(data => setEquipos(data))
  }, [])

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Inventario de Equipos</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {equipos.map((equipo: any) => (
          <div key={equipo.id_equipo} className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-4">
              <div className="flex justify-between items-start">
                <h2 className="text-xl font-semibold text-gray-800">{equipo.nombre_equipo}</h2>
                <span className={`px-2 py-1 rounded text-sm ${
                  equipo.estado === 'Activo' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {equipo.estado}
                </span>
              </div>
              
              <div className="mt-4 space-y-2 text-sm text-gray-600">
                <p><span className="font-medium">Tipo:</span> {equipo.tipo_equipo}</p>
                <p><span className="font-medium">Marca:</span> {equipo.marca}</p>
                <p><span className="font-medium">Modelo:</span> {equipo.modelo}</p>
                <p><span className="font-medium">Serie:</span> {equipo.numero_serie}</p>
                <p><span className="font-medium">SO:</span> {equipo.sistema_operativo}</p>
                <p><span className="font-medium">Procesador:</span> {equipo.procesador}</p>
                <p><span className="font-medium">RAM:</span> {equipo.ram}</p>
                <p><span className="font-medium">Disco:</span> {equipo.disco_duro}</p>
                <p><span className="font-medium">Compra:</span> {new Date(equipo.fecha_compra).toLocaleDateString()}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}