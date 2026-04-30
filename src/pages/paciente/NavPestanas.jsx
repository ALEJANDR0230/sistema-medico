// Lista de pestañas disponibles.
// Para agregar una nueva sección, agrega un objeto aquí.
const PESTANAS = [
  { clave: "resultados", etiqueta: "Mis resultados"  },
  { clave: "tendencia",  etiqueta: "Tendencia"        },
  { clave: "opinion",    etiqueta: "Opinión médica"   },
  { clave: "dieta",      etiqueta: "Mi dieta"         },
  { clave: "mapa",       etiqueta: "Clínicas"         },
  { clave: "perfil",     etiqueta: "Mi perfil"        },
  { clave: "subir",      etiqueta: "Subir PDF"        },
]

function NavPestanas({ activa, onCambiar }) {
  return (
    <div className="flex gap-1 mb-5 bg-white rounded-2xl shadow p-1.5 overflow-x-auto">
      {PESTANAS.map(({ clave, etiqueta }) => (
        <button
          key={clave}
          onClick={() => onCambiar(clave)}
          className={
            "flex-1 py-2 px-1 rounded-xl text-xs font-medium transition-colors whitespace-nowrap " +
            (activa === clave
              ? "bg-blue-600 text-white shadow"
              : "text-gray-500 hover:bg-gray-100")
          }
        >
          {etiqueta}
        </button>
      ))}
    </div>
  )
}

export default NavPestanas