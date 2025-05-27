'use client'
import { useState } from 'react'

interface DataTableProps {
  columns: { key: string; label: string }[]
  data: any[]
  onEdit?: (item: any) => void
  onDelete?: (item: any) => void
  onStatusChange?: (item: any) => void
  activeSection?: string
}

export default function DataTable({ columns, data, onEdit, onDelete, onStatusChange, activeSection }: DataTableProps) {
  // Filter out empty records
  const filteredData = data.filter(item => {
    return Object.values(item).some(value => value !== null && value !== '')
  })

  // Get a unique identifier for each row
  const getRowKey = (item: any) => {
    if (item.id_prestamo) return `prestamo-${item.id_prestamo}`
    if (item.id_equipo) return `equipo-${item.id_equipo}`
    if (item.id_mantenimiento) return `mantenimiento-${item.id_mantenimiento}`
    return `item-${Math.random()}`  // Fallback to random key if no id found
  }

  const formatCellValue = (item: any, key: string) => {
    try {
      // Handle nested properties
      if (key.includes('.')) {
        const [parentKey, childKey] = key.split('.')
        if (!item || !item[parentKey]) return ''
        return item[parentKey][childKey] || ''
      }

      const value = item[key]
      if (!value) return ''

      // Handle dates
      if (key.includes('fecha')) {
        const date = new Date(value)
        if (isNaN(date.getTime())) return ''
        
        return date.toLocaleDateString('es-ES', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric'
        }).replace(/\//g, '-')
      }

      return String(value)
    } catch (error) {
      console.error(`Error formatting value for key ${key}:`, error)
      return ''
    }
  }

  const renderActionButtons = (item: any) => {
    const renderStatusButton = () => {
      if (activeSection === 'mantenimientos' && item.estado === 'En Mantenimiento') {
        return (
          <button
            onClick={() => onStatusChange && onStatusChange(item, 'mantenimientos')}
            className="text-green-600 hover:text-green-800 mr-2"
          >
            Finalizar
          </button>
        )
      }
      if (activeSection === 'prestamos' && item.estado === 'Prestado') {
        return (
          <button
            onClick={() => onStatusChange && onStatusChange(item, 'prestamos')}
            className="text-green-600 hover:text-green-800 mr-2"
          >
            Finalizar
          </button>
        )
      }
      return null
    }

    return (
      <td className="px-6 py-4 space-x-2">
        {renderStatusButton()}
        {onEdit && (
          <button 
            onClick={() => onEdit(item)} 
            className="text-blue-600 hover:text-blue-800 mr-2"
          >
            Editar
          </button>
        )}
        {onDelete && (
          <button 
            onClick={() => onDelete(item)} 
            className="text-red-600 hover:text-red-800"
          >
            Eliminar
          </button>
        )}
      </td>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white rounded-lg shadow">
        <thead className="bg-gray-100">
          <tr>
            {columns.map((column, index) => (
              <th key={`header-${column.key}-${index}`} className="px-6 py-3 text-left text-sm font-semibold">
                {column.label}
              </th>
            ))}
            {(onEdit || onDelete || onStatusChange) && (
              <th key="header-actions" className="px-6 py-3">Acciones</th>
            )}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {filteredData.map((item) => (
            <tr key={getRowKey(item)}>
              {columns.map((column, index) => (
                <td key={`${getRowKey(item)}-${column.key}-${index}`} className="px-6 py-4 text-sm">
                  {formatCellValue(item, column.key)}
                </td>
              ))}
              {renderActionButtons(item)}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

