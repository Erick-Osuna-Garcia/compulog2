'use client'
import { useState, useEffect } from 'react'
import Modal from '../components/Modal'
import EquipoForm from '../components/forms/EquipoForm'
import MantenimientoForm from '../components/forms/MantenimientoForm'
import PrestamoForm from '../components/forms/PrestamoForm'
import DataTable from '../components/DataTable'

const sections = {
  equipos: {
    title: 'Equipos',
    columns: [
      { key: 'nombre_equipo', label: 'Nombre' },
      { key: 'tipo_equipo', label: 'Tipo' },
      { key: 'marca', label: 'Marca' },
      { key: 'estado', label: 'Estado' }
    ]
  },
  mantenimientos: {
    title: 'Mantenimientos',
    columns: [
      { key: 'tipo', label: 'Tipo' },
      { key: 'fecha', label: 'Fecha' },
      { key: 'tecnico', label: 'Técnico' },
      { key: 'estado', label: 'Estado' },
      { key: 'equipo.nombre_equipo', label: 'Equipo' }, // Agregar esta línea
    ]
  },
  prestamos: {
    title: 'Préstamos',
    columns: [
      { key: 'fecha_prestamo', label: 'Fecha Préstamo' },
      { key: 'fecha_devolucion', label: 'Fecha Devolución' },
      { key: 'usuario.nombre', label: 'Usuario' },
      { key: 'estado', label: 'Estado' },
      { key: 'equipo.nombre_equipo', label: 'Equipo' } // Agregar esta línea
    ]
  }
}

const formComponents = {
  equipos: EquipoForm,
  mantenimientos: MantenimientoForm,
  prestamos: PrestamoForm
}

export default function InventarioPage() {
  const [activeSection, setActiveSection] = useState('equipos')
  const [data, setData] = useState([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingItem, setEditingItem] = useState(null)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [itemToDelete, setItemToDelete] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    fetchData()
  }, [activeSection])

  const fetchData = async () => {
    setIsLoading(true) // Iniciamos loading
    try {
      const res = await fetch(`/api/${activeSection}`)
      const newData = await res.json()
      
      // Simulamos 1 segundo de carga
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      setData(newData)
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setIsLoading(false) // Terminamos loading
    }
  }

  const handleSubmit = async (formData: any) => {
    try {
      const idField = {
        equipos: 'id_equipo',
        mantenimientos: 'id_mantenimiento',
        prestamos: 'id_prestamo'
      }[activeSection]

      const url = editingItem 
        ? `/api/${activeSection}/${editingItem[idField]}`
        : `/api/${activeSection}`

      const response = await fetch(url, {
        method: editingItem ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        throw new Error('Error al guardar')
      }

      await fetchData()
      setIsModalOpen(false)
      setEditingItem(null)

    } catch (error) {
      console.error('Error:', error)
      alert('Error al guardar')
    }
  }

  const handleEdit = (item: any) => {
    setEditingItem(item)
    setIsModalOpen(true)
  }

  const handleDelete = async (item: any) => {
    try {
      const idField = {
        equipos: 'id_equipo',
        mantenimientos: 'id_mantenimiento',
        prestamos: 'id_prestamo'
      }[activeSection]

      const id = item[idField]
      
      if (!id) {
        throw new Error('ID no encontrado')
      }

      const response = await fetch(`/api/${activeSection}/${id}`, {
        method: 'DELETE',
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Error al eliminar')
      }

      await fetchData()
      setIsDeleteModalOpen(false)
      setItemToDelete(null)

    } catch (error) {
      console.error('Error:', error)
      alert(error instanceof Error ? error.message : 'Error al eliminar')
    }
  }

  const handleStatusChange = async (item: any, section: 'mantenimientos' | 'prestamos') => {
    try {
      // 1. Elimina el registro de mantenimiento o préstamo
      const idField = section === 'mantenimientos' ? 'id_mantenimiento' : 'id_prestamo';
      const id = item[idField];

      const deleteRes = await fetch(`/api/${section}/${id}`, {
        method: 'DELETE',
      });

      if (!deleteRes.ok) {
        throw new Error('No se pudo eliminar el registro');
      }

      // 2. Cambia el estado del equipo a "Activo"
      await fetch(`/api/equipos/${item.id_equipo}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ estado: 'Activo' }),
      });

      await fetchData(); // Refresca la tabla
    } catch (error) {
      alert('Error al finalizar: ' + (error as Error).message);
    }
  }

  const FormComponent = formComponents[activeSection]

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <div className="flex space-x-4">
          {Object.keys(sections).map(section => (
            <button
              key={section}
              onClick={() => setActiveSection(section)}
              className={`px-4 py-2 rounded ${
                activeSection === section 
                  ? 'bg-cyan-400 text-white' 
                  : 'bg-gray-200 text-gray-700'
              }`}
            >
              {sections[section].title}
            </button>
          ))}
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-[#1b003a] text-white px-4 py-2 rounded hover:bg-cyan-500"
        >
          Agregar Nuevo
        </button>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center p-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <DataTable
          columns={sections[activeSection].columns}
          data={data}
          onEdit={handleEdit}
          onDelete={(item) => {
            setItemToDelete(item);
            setIsDeleteModalOpen(true);
          }}
          onStatusChange={handleStatusChange}
          activeSection={activeSection}
        />
      )}

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => {
          setIsModalOpen(false)
          setEditingItem(null)
        }}
        title={`${editingItem ? 'Editar' : 'Agregar'} ${sections[activeSection].title}`}
      >
        <FormComponent 
          onSubmit={handleSubmit}
          onCancel={() => {
            setIsModalOpen(false)
            setEditingItem(null)
          }}
          initialData={editingItem}
        />
      </Modal>

      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false)
          setItemToDelete(null)
        }}
        title="Confirmar Eliminación"
      >
        <div className="p-4">
          <p className="mb-4">¿Está seguro que desea eliminar este registro?</p>
          <div className="flex justify-end space-x-2">
            <button
              onClick={() => itemToDelete && handleDelete(itemToDelete)}
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
            >
              Eliminar
            </button>
            <button
              onClick={() => {
                setIsDeleteModalOpen(false)
                setItemToDelete(null)
              }}
              className="bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300"
            >
              Cancelar
            </button>
          </div>
        </div>
      </Modal>
    </div>
  )
}