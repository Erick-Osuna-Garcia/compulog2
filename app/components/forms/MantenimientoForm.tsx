'use client'
import { useState, useEffect } from 'react'

interface Equipo {
  id_equipo: number
  nombre_equipo: string
}

interface MantenimientoFormProps {
  onSubmit: (data: any) => void
  onCancel: () => void
}

export default function MantenimientoForm({ onSubmit, onCancel }: MantenimientoFormProps) {
  const [equipos, setEquipos] = useState<Equipo[]>([])
  const [formData, setFormData] = useState({
    tipo: '',
    descripcion: '',
    fecha: new Date().toISOString().split('T')[0],
    tecnico: '',
    estado: 'Pendiente',
    id_equipo: ''
  })

  useEffect(() => {
    // Fetch equipos when component mounts
    fetch('/api/equipos')
      .then(res => res.json())
      .then(data => setEquipos(data))
      .catch(error => console.error('Error fetching equipos:', error))
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.id_equipo) {
      alert('Por favor seleccione un equipo')
      return
    }
    try {
      await onSubmit(formData)
      setFormData({
        tipo: '',
        descripcion: '',
        fecha: new Date().toISOString().split('T')[0],
        tecnico: '',
        estado: 'Pendiente',
        id_equipo: '',
      })
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
        <label className="block text-sm font-medium mb-1">Tipo</label>
        <select
          className="w-full p-2 border rounded"
          value={formData.tipo}
          onChange={e => setFormData({...formData, tipo: e.target.value})}
        >
          <option value="">Seleccione tipo</option>
          <option value="Preventivo">Preventivo</option>
          <option value="Correctivo">Correctivo</option>
          <option value="Actualización">Actualización</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Descripción</label>
        <textarea
          className="w-full p-2 border rounded"
          value={formData.descripcion}
          onChange={e => setFormData({...formData, descripcion: e.target.value})}
          rows={3}
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Fecha</label>
        <input
          type="date"
          className="w-full p-2 border rounded"
          value={formData.fecha}
          onChange={e => setFormData({...formData, fecha: e.target.value})}
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Técnico</label>
        <input
          type="text"
          className="w-full p-2 border rounded"
          value={formData.tecnico}
          onChange={e => setFormData({...formData, tecnico: e.target.value})}
        />
      </div>

      <div className="flex space-x-2">
        <button
          type="submit"
          className={`flex-1 p-2 rounded text-white ${
            'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          Guardar Mantenimiento
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