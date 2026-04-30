
import { DIETAS } from "../../constantes/catalogos"
function SeccionDieta({ dietaClave }) {

  // Si no hay dieta asignada todavía
  if (!dietaClave) {
    return (
      <div className="bg-white rounded-2xl shadow p-10 text-center">
        <p className="text-gray-500 font-medium">Sin dieta asignada aún</p>
        <p className="text-gray-400 text-sm mt-1">
          Tu médico asignará una dieta cuando revise tus resultados.
        </p>
      </div>
    )
  }

  const dieta = DIETAS[dietaClave]

  // Si la clave no existe en el catálogo
  if (!dieta) return null

  return (
    <div className="bg-white rounded-2xl shadow overflow-hidden">

      {/* Foto de portada con título encima */}
      <div className="relative h-40">
        <img
          src={dieta.foto}
          alt={dieta.titulo}
          className="w-full h-full object-cover"
        />
        {/* Capa oscura para que el texto se lea sobre la foto */}
        <div
          className="absolute inset-0"
          style={{ background: "linear-gradient(to top, rgba(0,0,0,0.65) 0%, transparent 55%)" }}
        />
        <div className="absolute bottom-0 left-0 p-4">
          <p className="text-white font-bold text-base">{dieta.titulo}</p>
          <p className="text-white text-xs opacity-80">Recomendada por tu médico</p>
        </div>
      </div>

      {/* Contenido: listas y consejo */}
      <div className="p-5">
        <div className="grid grid-cols-2 gap-5 mb-4">

          {/* Qué comer */}
          <div>
            <p className="text-xs font-bold text-green-700 uppercase mb-2">
              Alimentos recomendados
            </p>
            <ul className="space-y-1.5">
              {dieta.comer.map((item, i) => (
                <li key={i} className="text-xs text-gray-700 flex gap-2 items-start">
                  <span className="text-green-500 font-bold mt-0.5 flex-shrink-0">+</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Qué evitar */}
          <div>
            <p className="text-xs font-bold text-red-600 uppercase mb-2">
              Alimentos a evitar
            </p>
            <ul className="space-y-1.5">
              {dieta.evitar.map((item, i) => (
                <li key={i} className="text-xs text-gray-700 flex gap-2 items-start">
                  <span className="text-red-400 font-bold mt-0.5 flex-shrink-0">-</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Consejo del día */}
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-3">
          <p className="text-xs font-bold text-amber-700 mb-1">Consejo del día</p>
          <p className="text-xs text-amber-800 leading-relaxed">{dieta.consejo}</p>
        </div>
      </div>
    </div>
  )
}

export default SeccionDieta