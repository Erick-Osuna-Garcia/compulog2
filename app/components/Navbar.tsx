'use client'

export default function Navbar() {
  return (
    <nav className="bg-[#1B2026] text-white p-4 shadow-lg">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex-shrink-0">
          <h1 className="text-xl font-bold">CompuLog</h1>
        </div>
        
        <div className="flex items-center space-x-6">
          <a 
            href="/home" 
            className="px-3 py-2 text-sm font-medium
              relative after:absolute after:bottom-0 after:left-0 after:w-full 
              after:h-0.5 after:bg-cyan-400 after:transform after:scale-x-0 
              after:transition-transform after:duration-200
              hover:text-cyan-400 hover:after:scale-x-100"
          >
            Inicio
          </a>
          <a 
            href="/inventario" 
            className="px-3 py-2 text-sm font-medium
              relative after:absolute after:bottom-0 after:left-0 after:w-full 
              after:h-0.5 after:bg-cyan-400 after:transform after:scale-x-0 
              after:transition-transform after:duration-200
              hover:text-cyan-400 hover:after:scale-x-100"
          >
            Inventario
          </a>
          <a 
            href="/reportes" 
            className="px-3 py-2 text-sm font-medium
              relative after:absolute after:bottom-0 after:left-0 after:w-full 
              after:h-0.5 after:bg-cyan-400 after:transform after:scale-x-0 
              after:transition-transform after:duration-200
              hover:text-cyan-400 hover:after:scale-x-100"
          >
            Reportes
          </a>
          <a 
            href="/configuracion" 
            className="px-3 py-2 text-sm font-medium
              relative after:absolute after:bottom-0 after:left-0 after:w-full 
              after:h-0.5 after:bg-cyan-400 after:transform after:scale-x-0 
              after:transition-transform after:duration-200
              hover:text-cyan-400 hover:after:scale-x-100"
          >
            Configuración
          </a>
        </div>
      </div>
    </nav>
  )
}