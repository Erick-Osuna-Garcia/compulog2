'use client';
import { useEffect, useState } from 'react';
import { z } from 'zod';

const equipoSchema = z.object({
  nombre: z.string().min(3),
  tipo: z.string(),
  marca: z.string(),
  modelo: z.string(),
  numeroSerie: z.string(),
  sistemaOperativo: z.string(),
  procesador: z.string(),
  ram: z.string(),
  discoDuro: z.string(),
  fechaCompra: z.string(),
  estado: z.string(),
});

export default function EquiposPage() {
  const [equipos, setEquipos] = useState([]);
  const [formData, setFormData] = useState<unknown>({});
  const [isEditing, setIsEditing] = useState(false);

  const fetchEquipos = async () => {
    const res = await fetch('/api/equipos');
    const data = await res.json();
    setEquipos(data);
  };

  useEffect(() => {
    fetchEquipos();
  }, []);

  const handleChange = (e: unknown) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      equipoSchema.parse(formData);
      const res = await fetch('/api/equipos', {
        method: isEditing ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        setFormData({});
        setIsEditing(false);
        fetchEquipos();
      }
    } catch (err: unknown) {
      alert('Error en validación o envío: ' + err.message);
    }
  };

  const handleEdit = (equipo: unknown) => {
    setFormData(equipo);
    setIsEditing(true);
  };

  const handleDelete = async (id: number) => {
    await fetch('/api/equipos', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });
    fetchEquipos();
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Inventario de Equipos</h1>

      <form className="grid gap-2 mb-6">
        {['nombre','tipo','marca','modelo','numeroSerie','sistemaOperativo','procesador','ram','discoDuro','fechaCompra','estado'].map(field => (
          <input
            key={field}
            name={field}
            value={formData[field] || ''}
            onChange={handleChange}
            placeholder={field}
            className="border p-2 rounded"
          />
        ))}
        <button type="button" onClick={handleSubmit} className="bg-blue-500 text-white px-4 py-2 rounded">
          {isEditing ? 'Actualizar' : 'Agregar'}
        </button>
      </form>

      <ul>
        {equipos.map((e: unknown) => (
          <li key={e.id} className="border p-2 mb-2 rounded">
            <div className="flex justify-between items-center">
              <span>{e.nombre} - {e.marca} - {e.modelo}</span>
              <div>
                <button onClick={() => handleEdit(e)} className="text-blue-500 mr-2">Editar</button>
                <button onClick={() => handleDelete(e.id)} className="text-red-500">Eliminar</button>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
