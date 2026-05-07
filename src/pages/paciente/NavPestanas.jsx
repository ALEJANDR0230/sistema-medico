const PESTANAS = [
  { clave: "resultados", etiqueta: "Mis resultados" },
  { clave: "tendencia",  etiqueta: "Tendencia" },
  { clave: "opinion",    etiqueta: "Opinión médica" },
  { clave: "dieta",      etiqueta: "Mi dieta" },
  { clave: "mapa",       etiqueta: "Clínicas" },
  { clave: "perfil",     etiqueta: "Mi perfil" },
  { clave: "subir",      etiqueta: "Subir PDF" },
]

export default function NavPestanas({ activa, onCambiar }) {
  return (
    <aside className="w-80 min-h-screen bg-white shadow flex flex-col flex-shrink-0">
      <nav className="flex-1 p-4 flex flex-col gap-2">
        {PESTANAS.map(({ clave, etiqueta }) => (
          <button
            key={clave}
            onClick={() => onCambiar(clave)}
            className={
              "w-full py-3 px-5 rounded-xl text-base font-medium transition-colors text-left " +
              (activa === clave
                ? "bg-blue-600 text-white shadow"
                : "text-gray-500 hover:bg-gray-100")
            }
          >
            {etiqueta}
          </button>
        ))}
      </nav>
    </aside>
  )
}