const PESTANAS = [
  { clave: "resultados", etiqueta: "Mis resultados" },
  { clave: "tendencia",  etiqueta: "Tendencia" },
  { clave: "opinion",    etiqueta: "Opinión médica" },
  { clave: "dieta",      etiqueta: "Mi dieta" },
  { clave: "mapa",       etiqueta: "Clínicas" },
  { clave: "perfil",     etiqueta: "Mi perfil" },
  { clave: "subir",      etiqueta: "Subir PDF" },
];

export default function NavPestanas({ activa, onCambiar }) {
  return (
    <aside className="w-96 min-h-screen bg-white border-r border-gray-100 flex flex-col flex-shrink-0 shadow-sm">
      
      {/* Header del sidebar */}
      <div className="px-8 py-7 border-b border-gray-100">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center">
            <span className="text-white text-xl font-bold">SM</span>
          </div>
          <div>
            <p className="font-bold text-xl text-gray-800">Mi Dashboard</p>
            <p className="text-sm text-gray-500 -mt-1">Paciente</p>
          </div>
        </div>
      </div>

      {/* Navegación */}
      <nav className="flex-1 p-5 flex flex-col gap-1.5">
        {PESTANAS.map(({ clave, etiqueta }) => (
          <button
            key={clave}
            onClick={() => onCambiar(clave)}
            className={`
              w-full flex items-center gap-4 px-6 py-4 rounded-2xl text-left transition-all duration-200 text-lg
              ${activa === clave 
                ? "bg-blue-600 text-white shadow-lg shadow-blue-500/30 font-semibold" 
                : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
              }
            `}
          >
            <span className="font-medium">{etiqueta}</span>
            
            {/* Indicador activo */}
            {activa === clave && (
              <div className="ml-auto w-2 h-2 bg-white rounded-full" />
            )}
          </button>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-5 border-t border-gray-100 mt-auto">
        <div className="text-center text-sm text-gray-400">
          Sistema Médico v2.0
        </div>
      </div>
    </aside>
  );
}