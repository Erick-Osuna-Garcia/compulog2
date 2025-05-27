'use client'
import { useState, useEffect } from 'react'

export default function PrestamosPage() {
  const [prestamos, setPrestamos] = useState([])

  useEffect(() => {
    fetch('/api/prestamos')
      .then(res => res.json())
      .then(data => setPrestamos(data))
  }, [])

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Gestión de Préstamos</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {prestamos.map((prestamo: unknown) => (
          <div key={prestamo.id_prestamo} className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-4">
              <div className="flex justify-between items-start">
                <h2 className="text-xl font-semibold text-gray-800">{prestamo.equipo?.nombre_equipo}</h2>
                <span className={`px-2 py-1 rounded text-sm ${
                  prestamo.estado === 'Prestado' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
                }`}>
                  {prestamo.estado}
                </span>
              </div>
              
              <div className="mt-4 space-y-2 text-sm text-gray-600">
                <p><span className="font-medium">Usuario:</span> {prestamo.usuario?.nombre}</p>
                <p><span className="font-medium">Prestado:</span> {new Date(prestamo.fecha_prestamo).toLocaleDateString()}</p>
                <p><span className="font-medium">Devolución:</span> {new Date(prestamo.fecha_devolucion).toLocaleDateString()}</p>
                <p><span className="font-medium">Estado:</span> {prestamo.estado}</p>
                {prestamo.descripcion && (
                  <p><span className="font-medium">Notas:</span> {prestamo.descripcion}</p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}