

import { useState } from "react"
import { RANGOS_REFERENCIA, EXPLICACIONES, COLORES_SEMAFORO } from "../../constantes/catalogos"

// ─────────────────────────────────────────────────────────────
//  SUBCOMPONENTE INTERNO: Barra de progreso
//  Muestra visualmente qué tan lejos está el valor del rango normal
// ─────────────────────────────────────────────────────────────
function BarraProgreso({ analito, colorBarra }) {
  const rango = RANGOS_REFERENCIA[analito.analito]

  // Si no hay rango de referencia no se puede dibujar la barra
  if (!rango || analito.valor_numerico === null) return null

  // El máximo de la barra es 1.5 veces el límite superior del rango
  const maximo       = rango.ref_high * 1.5
  const pctValor     = Math.min((analito.valor_numerico / maximo) * 100, 100)
  const pctLimite    = Math.min((rango.ref_high / maximo) * 100, 100)

  return (
    <div className="w-full mt-2">
      {/* Barra con el valor actual */}
      <div className="relative w-full h-2 bg-gray-100 rounded-full overflow-hidden">
        {/* Relleno de color según el semáforo */}
        <div
          className="absolute left-0 top-0 h-full rounded-full transition-all"
          style={{ width: pctValor + "%", background: colorBarra }}
        />
        {/* Línea vertical que marca el límite superior normal */}
        <div
          className="absolute top-0 h-full w-px bg-gray-400 opacity-50"
          style={{ left: pctLimite + "%" }}
        />
      </div>

      {/* Etiquetas del rango debajo de la barra */}
      <div className="flex justify-between mt-0.5">
        <span className="text-xs text-gray-400">{rango.ref_low}</span>
        <span className="text-xs text-gray-400">{rango.ref_high} {rango.unidad}</span>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────
//  SUBCOMPONENTE INTERNO: Sección de explicación expandible
// ─────────────────────────────────────────────────────────────
function SeccionExplicacion({ analito }) {
  const explicacion = EXPLICACIONES[analito.analito]
  if (!explicacion) return null

  return (
    <div className="border-t border-gray-200 bg-white px-4 py-4 space-y-3">

      <div>
        <p className="text-xs font-bold text-gray-500 uppercase mb-1">¿Qué es?</p>
        <p className="text-sm text-gray-700 leading-relaxed">{explicacion.que_es}</p>
      </div>

      <div>
        <p className="text-xs font-bold text-gray-500 uppercase mb-1">¿Qué significa tu resultado?</p>
        <p className="text-sm text-gray-700 leading-relaxed">{explicacion.que_significa}</p>
      </div>

      <div>
        <p className="text-xs font-bold text-gray-500 uppercase mb-1">Recomendación</p>
        <p className="text-sm text-gray-700 leading-relaxed">{explicacion.recomendacion}</p>
      </div>

      {/* Fuente médica con enlace */}
      <div className="bg-blue-50 border border-blue-100 rounded-xl px-3 py-2">
        <p className="text-xs font-bold text-blue-600 uppercase mb-1">Fuente de referencia</p>
        <p className="text-xs text-blue-700 font-medium mb-1">{explicacion.referencia}</p>
        <a
          href={explicacion.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-blue-500 hover:underline"
        >
          Ver artículo
        </a>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────
//  COMPONENTE PRINCIPAL: TarjetaAnalito
// ─────────────────────────────────────────────────────────────
function ResultadoSangre({ analito, semaforo }) {
  const [expandido, setExpandido] = useState(false)

  const estado      = semaforo(analito)
  const colores     = COLORES_SEMAFORO[estado]
  const rango       = RANGOS_REFERENCIA[analito.analito]
  const tieneExpl   = !!EXPLICACIONES[analito.analito]

  // Calcular el texto del rango de referencia
  const low  = analito.ref_low  !== null ? analito.ref_low  : (rango ? rango.ref_low  : null)
  const high = analito.ref_high !== null ? analito.ref_high : (rango ? rango.ref_high : null)

  return (
    <div className={"rounded-2xl border overflow-hidden hover:shadow-md transition-shadow " +
      colores.fondo + " " + colores.borde}>

      {/* ── CABECERA: nombre, valor y barra ── */}
      <div className="p-4">

        {/* Nombre del analito y badge de estado */}
        <div className="flex justify-between items-start mb-2">
          <p className="text-sm font-semibold text-gray-700 leading-tight pr-2">
            {analito.analito}
          </p>
          <span className={"text-xs px-2 py-0.5 rounded-full font-medium flex-shrink-0 " + colores.badge}>
            {colores.etiqueta}
          </span>
        </div>

        {/* Valor numérico con unidad */}
        <p className={"text-2xl font-bold mb-2 " + colores.texto}>
          {analito.prefijo}{analito.valor_raw}
          <span className="text-sm font-normal ml-1 text-gray-400">
            {analito.unidad}
          </span>
        </p>

        {/* Barra de progreso visual */}
        <BarraProgreso analito={analito} colorBarra={colores.barra} />

        {/* Texto del rango de referencia */}
        {low !== null && high !== null && (
          <p className="text-xs text-gray-400 mt-2">
            Rango normal: {low} a {high} {analito.unidad}
          </p>
        )}

        {/* Botón para expandir la explicación */}
        {tieneExpl && (
          <button
            onClick={() => setExpandido(!expandido)}
            className="mt-2 text-xs text-blue-600 font-medium hover:underline"
          >
            {expandido ? "Ocultar explicación" : "¿Qué significa este resultado?"}
          </button>
        )}
      </div>

      {/* ── SECCIÓN EXPANDIBLE: explicación médica ── */}
      {expandido && <SeccionExplicacion analito={analito} />}
    </div>
  )
}

export default ResultadoSangre