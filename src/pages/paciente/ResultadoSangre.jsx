import { useState } from "react"
import { RANGOS_REFERENCIA, EXPLICACIONES, COLORES_SEMAFORO } from "../../constantes/catalogos"

// ─────────────────────────────────────────────────────────────
//  BARRA DE PROGRESO MEJORADA
// ─────────────────────────────────────────────────────────────
function BarraProgreso({ analito, colorBarra }) {
  const rango = RANGOS_REFERENCIA[analito.analito]
  if (!rango || analito.valor_numerico === null) return null

  const maximo = rango.ref_high * 1.5
  const pctValor = Math.min((analito.valor_numerico / maximo) * 100, 100)
  const pctLimite = Math.min((rango.ref_high / maximo) * 100, 100)

  return (
    <div className="mt-3">
      <div className="relative w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
        <div
          className="absolute left-0 top-0 h-full rounded-full transition-all duration-500"
          style={{ width: `${pctValor}%`, background: colorBarra }}
        />
        <div
          className="absolute top-0 h-full w-px bg-gray-400 opacity-60"
          style={{ left: `${pctLimite}%` }}
        />
      </div>
      <div className="flex justify-between mt-1.5 text-[10px] text-gray-400">
        <span>{rango.ref_low}</span>
        <span>{rango.ref_high} {rango.unidad}</span>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────
//  SECCIÓN DE EXPLICACIÓN
// ─────────────────────────────────────────────────────────────
function SeccionExplicacion({ analito }) {
  const explicacion = EXPLICACIONES[analito.analito]
  if (!explicacion) return null

  return (
    <div className="border-t border-gray-100 bg-gray-50 px-5 py-5 space-y-4 text-sm">
      <div>
        <p className="font-semibold text-gray-600 text-xs uppercase tracking-wider mb-1.5">¿Qué es?</p>
        <p className="text-gray-700 leading-relaxed">{explicacion.que_es}</p>
      </div>

      <div>
        <p className="font-semibold text-gray-600 text-xs uppercase tracking-wider mb-1.5">¿Qué significa tu resultado?</p>
        <p className="text-gray-700 leading-relaxed">{explicacion.que_significa}</p>
      </div>

      <div>
        <p className="font-semibold text-gray-600 text-xs uppercase tracking-wider mb-1.5">Recomendación</p>
        <p className="text-gray-700 leading-relaxed">{explicacion.recomendacion}</p>
      </div>

      <div className="pt-2 border-t border-gray-200">
        <p className="text-[10px] font-semibold text-blue-600 mb-1">Fuente médica</p>
        <p className="text-xs text-blue-700 font-medium">{explicacion.referencia}</p>
        <a 
          href={explicacion.url} 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-xs text-blue-600 hover:underline inline-flex items-center gap-1 mt-1"
        >
          Ver artículo completo →
        </a>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────
//  COMPONENTE PRINCIPAL: ResultadoSangre
// ─────────────────────────────────────────────────────────────
function ResultadoSangre({ analito, semaforo }) {
  const [expandido, setExpandido] = useState(false)

  const estado = semaforo(analito)
  const colores = COLORES_SEMAFORO[estado]
  const rango = RANGOS_REFERENCIA[analito.analito]
  const tieneExpl = !!EXPLICACIONES[analito.analito]

  const low = analito.ref_low !== null ? analito.ref_low : (rango ? rango.ref_low : null)
  const high = analito.ref_high !== null ? analito.ref_high : (rango ? rango.ref_high : null)

  return (
    <div className={`rounded-3xl border overflow-hidden transition-all duration-300 hover:shadow-lg ${colores.fondo} ${colores.borde}`}>
      
      {/* CABECERA */}
      <div className="p-5">
        <div className="flex justify-between items-start gap-3">
          <div className="flex-1">
            <p className="font-semibold text-gray-800 text-[15px] leading-tight">
              {analito.analito}
            </p>
            {rango && (
              <p className="text-[10px] text-gray-400 mt-1">
                Rango normal: {low} – {high} {analito.unidad}
              </p>
            )}
          </div>

          <span className={`text-xs px-3 py-1 rounded-full font-semibold flex-shrink-0 ${colores.badge}`}>
            {colores.etiqueta}
          </span>
        </div>

        {/* VALOR PRINCIPAL */}
        <div className="mt-4 flex items-baseline gap-2">
          <span className={`text-4xl font-bold tracking-tighter ${colores.texto}`}>
            {analito.prefijo}{analito.valor_raw}
          </span>
          <span className="text-sm text-gray-400 font-medium">{analito.unidad}</span>
        </div>

        {/* BARRA DE PROGRESO */}
        <BarraProgreso analito={analito} colorBarra={colores.barra} />

        {/* BOTÓN DE EXPLICACIÓN */}
        {tieneExpl && (
          <button
            onClick={() => setExpandido(!expandido)}
            className="mt-4 text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1 transition-colors"
          >
            {expandido ? "Ocultar explicación" : "¿Qué significa este resultado?"}
            <span className="text-base leading-none">{expandido ? "−" : "+"}</span>
          </button>
        )}
      </div>

      {/* SECCIÓN EXPANDIBLE */}
      {expandido && <SeccionExplicacion analito={analito} />}
    </div>
  )
}

export default ResultadoSangre