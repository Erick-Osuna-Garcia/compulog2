'use client'
import { useState, useEffect } from 'react'

interface Equipo {
  id_equipo: number
  nombre_equipo: string
}

interface Usuario {
  id_usuario: number
  nombre: string
}

interface PrestamoFormProps {
  onSubmit: (data: unknown) => void
  onCancel: () => void
  initialData?: unknown
}

export default function PrestamoForm({ onSubmit, onCancel, initialData }: PrestamoFormProps) {
  const [equipos, setEquipos] = useState<Equipo[]>([])
  const [usuarios, setUsuarios] = useState<Usuario[]>([])
  const [formData, setFormData] = useState({
    id_equipo: initialData?.id_equipo || '',
    id_usuario: initialData?.id_usuario || '',
    fecha_prestamo: initialData?.fecha_prestamo 
      ? new Date(initialData.fecha_prestamo).toISOString().split('T')[0]
      : new Date().toISOString().split('T')[0],
    fecha_devolucion: initialData?.fecha_devolucion 
      ? new Date(initialData.fecha_devolucion).toISOString().split('T')[0]
      : '',
    estado: initialData?.estado || 'Prestado',
    notas: initialData?.notas || ''
  })

  useEffect(() => {
    // Fetch equipos and usuarios when component mounts
    Promise.all([
      fetch('/api/equipos').then(res => res.json()),
      fetch('/api/usuarios').then(res => res.json())
    ]).then(([equiposData, usuariosData]) => {
      setEquipos(equiposData || [])
      setUsuarios(usuariosData || [])
    }).catch(error => {
      console.error('Error fetching data:', error)
    })
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.id_equipo || !formData.id_usuario) {
      alert('Por favor complete todos los campos requeridos')
      return
    }
    try {
      await onSubmit(formData)
    } catch (error) {
      console.error('Error:', error)
    }
  }
// eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleReturn = async (id_prestamo: number, id_equipo: number) => {
    try {
      const response = await fetch('/api/prestamos', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id_prestamo, id_equipo })
      })

      if (!response.ok) {
        throw new Error('Error al devolver el préstamo')
      }

      // Refresh the data or handle UI update
      // You might want to call a callback function passed as prop
    } catch (error) {
      console.error('Error:', error)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">Equipo</label>
        <select
          className="w-full p-2 border rounded"
          value={formData.id_equipo}
          onChange={e => setFormData({...formData, id_equipo: e.target.value})}
          required
        >
          <option value="">Seleccione un equipo</option>
          {equipos.map(equipo => (
            <option key={equipo.id_equipo} value={equipo.id_equipo}>
              {equipo.nombre_equipo}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Usuario</label>
        <select
          className="w-full p-2 border rounded"
          value={formData.id_usuario}
          onChange={e => setFormData({...formData, id_usuario: e.target.value})}
          required
        >
          <option value="">Seleccione un usuario</option>
          {usuarios.map(usuario => (
            <option key={usuario.id_usuario} value={usuario.id_usuario}>
              {usuario.nombre}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Fecha de Préstamo</label>
        <input
          type="date"
          className="w-full p-2 border rounded"
          value={formData.fecha_prestamo}
          onChange={e => setFormData({...formData, fecha_prestamo: e.target.value})}
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Fecha de Devolución Esperada</label>
        <input
          type="date"
          className="w-full p-2 border rounded"
          value={formData.fecha_devolucion}
          onChange={e => setFormData({...formData, fecha_devolucion: e.target.value})}
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Notas</label>
        <textarea
          className="w-full p-2 border rounded"
          value={formData.notas}
          onChange={e => setFormData({...formData, notas: e.target.value})}
          rows={3}
        />
      </div>

      <div className="flex space-x-2">
        <button
          type="submit"
          className="flex-1 bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
        >
          Guardar Préstamo
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 bg-gray-200 text-gray-700 p-2 rounded hover:bg-gray-300"
        >
          Cancelar
        </button>
      </div>
    </form>
  )
}