'use client'
import { useState } from 'react'

export default function EquipoForm() {
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
    fecha_compra: '',
    estado: 'Activo'
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const res = await fetch('/api/equipos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      })
      
      if (res.ok) {
        // Limpiar formulario y mostrar mensaje de éxito
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
          fecha_compra: '',
          estado: 'Activo'
        })
      }
    } catch (error) {
      console.error('Error al guardar:', error)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-lg mx-auto">
      <div className="space-y-4">
        <input
          type="text"
          placeholder="Nombre del equipo"
          className="w-full p-2 border rounded"
          value={formData.nombre_equipo}
          onChange={e => setFormData({...formData, nombre_equipo: e.target.value})}
        />
        {/* Agregar campos similares para el resto de atributos */}
        <button 
          type="submit"
          className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
        >
          Guardar Equipo
        </button>
      </div>
    </form>
  )
}