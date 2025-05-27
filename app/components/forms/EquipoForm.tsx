'use client'
import { useState } from 'react'

interface EquipoFormProps {
  onSubmit: (data: any) => void
  onCancel: () => void
}

export default function EquipoForm({ onSubmit, onCancel }: EquipoFormProps) {
  const [formData, setFormData] = useState({
    nombre_equipo: '',
    tipo_equipo: '',
    marca: '',
    modelo: '',
    numero_serie: '',
    sistema_operativo: '',
    procesador: '',
    ram: '',
    disco_duro: '',
    estado: 'Activo',
    fecha_compra: new Date().toISOString().split('T')[0] // Add today's date as default
  })

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    
    if (!formData.nombre_equipo.trim()) {
      newErrors.nombre_equipo = 'El nombre es requerido'
    }
    if (!formData.tipo_equipo.trim()) {
      newErrors.tipo_equipo = 'El tipo es requerido'
    }
    if (!formData.marca.trim()) {
      newErrors.marca = 'La marca es requerida'
    }
    if (!formData.numero_serie.trim()) {
      newErrors.numero_serie = 'El número de serie es requerido'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)
    
    try {
      await onSubmit(formData)
      
      // Reset form
      setFormData({
        nombre_equipo: '',
        tipo_equipo: '',
        marca: '',
        modelo: '',
        numero_serie: '',
        sistema_operativo: '',
        procesador: '',
        ram: '',
        disco_duro: '',
        estado: 'Activo',
        fecha_compra: new Date().toISOString().split('T')[0]
      })
      
    } catch (error) {
      console.error('Error al guardar:', error)
      setErrors({ submit: 'Error al guardar el equipo' })
    } finally {
      setIsSubmitting(false)
    }
  }

  const renderField = (name: keyof typeof formData, label: string) => (
    <div>
      <label className="block text-sm font-medium mb-1">{label}</label>
      <input
        type="text"
        className={`w-full p-2 border rounded ${errors[name] ? 'border-red-500' : ''}`}
        value={formData[name]}
        onChange={e => setFormData({...formData, [name]: e.target.value})}
      />
      {errors[name] && (
        <p className="text-red-500 text-xs mt-1">{errors[name]}</p>
      )}
    </div>
  )

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {renderField('nombre_equipo', 'Nombre')}
        {renderField('tipo_equipo', 'Tipo')}
        {renderField('marca', 'Marca')}
        {renderField('modelo', 'Modelo')}
        {renderField('numero_serie', 'Número de Serie')}
        {renderField('sistema_operativo', 'Sistema Operativo')}
        {renderField('procesador', 'Procesador')}
        {renderField('ram', 'RAM')}
        {renderField('disco_duro', 'Disco Duro')}
        <div>
          <label className="block text-sm font-medium mb-1">Fecha de Compra</label>
          <input
            type="date"
            className="w-full p-2 border rounded"
            value={formData.fecha_compra}
            onChange={e => setFormData({...formData, fecha_compra: e.target.value})}
          />
        </div>
      </div>

      {errors.submit && (
        <p className="text-red-500 text-sm">{errors.submit}</p>
      )}

      <div className="flex space-x-2">
        <button
          type="submit"
          disabled={isSubmitting}
          className={`flex-1 p-2 rounded text-white ${
            isSubmitting 
              ? 'bg-blue-400 cursor-not-allowed' 
              : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          {isSubmitting ? 'Guardando...' : 'Guardar'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          disabled={isSubmitting}
          className="flex-1 bg-gray-200 text-gray-700 p-2 rounded hover:bg-gray-300"
        >
          Cancelar
        </button>
      </div>
    </form>
  )
}