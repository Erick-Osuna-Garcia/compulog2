export default function HomePage() {
  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8 text-center">
        Sistema de Gestión de Equipos de Cómputo
      </h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Gestión de Inventario</h2>
          <ul className="list-disc list-inside space-y-2">
            <li>Control de equipos</li>
            <li>Registro de mantenimientos</li>
            <li>Sistema de préstamos</li>
            <li>Gestión de ubicaciones</li>
          </ul>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Acceso Rápido</h2>
          <div className="space-y-3">
             <a href="/home" 
               className="block w-full text-center bg-purple-600 text-white p-2 rounded hover:bg-purple-700">
             Inicio
            </a>
            <a href="/equipos" 
               className="block w-full text-center bg-blue-600 text-white p-2 rounded hover:bg-blue-700">
              Ver Inventario
            </a>
            <a href="/mantenimientos" 
               className="block w-full text-center bg-green-600 text-white p-2 rounded hover:bg-green-700">
              Registrar Mantenimiento
            </a>
            <a href="/prestamos" 
               className="block w-full text-center bg-purple-600 text-white p-2 rounded hover:bg-purple-700">
              Gestionar Préstamos
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}