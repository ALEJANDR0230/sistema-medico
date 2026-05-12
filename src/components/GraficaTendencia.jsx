import { useState } from "react"
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer
} from "recharts"

/* ============================================
   CONFIGURACIÓN
   ============================================ */
const COLORES_ANALISIS = {
  "COLESTEROL": "#3b82f6", "TRIGLICÉRIDOS": "#f59e0b", "HDL COLESTEROL": "#22c55e",
  "LDL COLESTEROL": "#ef4444", "VLDL COLESTEROL": "#8b5cf6", "COLESTEROL NO-HDL": "#06b6d4",
  "PROTEÍNA C REACTIVA": "#f97316", "PROTEÍNA C REACTIVA HS": "#ec4899",
  "APOLIPOPROTEÍNA B": "#64748b", "ÍNDICE ATEROGÉNICO": "#84cc16",
  "LIPOPROTEÍNA A": "#a855f7", "GLUCOSA": "#10b981", "HEMOGLOBINA": "#dc2626",
  "HEMATOCRITO": "#7c3aed", "CREATININA": "#0284c7",
}

const RANGOS = {
  "COLESTEROL": { min: 0, max: 200, maxDisplay: 300, unidad: "mg/dL" },
  "TRIGLICÉRIDOS": { min: 0, max: 150, maxDisplay: 300, unidad: "mg/dL" },
  "HDL COLESTEROL": { min: 40, max: 60, maxDisplay: 100, unidad: "mg/dL" },
  "LDL COLESTEROL": { min: 0, max: 100, maxDisplay: 200, unidad: "mg/dL" },
  "VLDL COLESTEROL": { min: 15, max: 35, maxDisplay: 60, unidad: "mg/dL" },
  "COLESTEROL NO-HDL": { min: 0, max: 130, maxDisplay: 200, unidad: "mg/dL" },
  "PROTEÍNA C REACTIVA": { min: 0, max: 5, maxDisplay: 15, unidad: "mg/L" },
  "PROTEÍNA C REACTIVA HS": { min: 0, max: 1, maxDisplay: 5, unidad: "mg/L" },
  "ÍNDICE ATEROGÉNICO": { min: 0, max: 4.5, maxDisplay: 8, unidad: "" },
  "GLUCOSA": { min: 70, max: 100, maxDisplay: 200, unidad: "mg/dL" },
  "HEMOGLOBINA": { min: 12, max: 17, maxDisplay: 20, unidad: "g/dL" },
}

const NOMBRES_CORTOS = {
  "PROTEÍNA C REACTIVA HS": "PCR hs", "PROTEÍNA C REACTIVA": "PCR",
  "COLESTEROL NO-HDL": "Col. no-HDL", "APOLIPOPROTEÍNA B": "Apo B",
  "ÍNDICE ATEROGÉNICO": "Índ. aterogénico", "HDL COLESTEROL": "HDL",
  "LDL COLESTEROL": "LDL", "VLDL COLESTEROL": "VLDL",
  "TRIGLICÉRIDOS": "Triglicéridos", "LIPOPROTEÍNA A": "Lipoproteína A",
}

const ANALISIS_POSITIVOS = ["HDL COLESTEROL", "HEMOGLOBINA", "HEMATOCRITO"]

/* ============================================
   FUNCIONES AUXILIARES
   ============================================ */
function getNombre(r) { return r.nombre ?? r.analito }
function nombreCorto(nombre) { return NOMBRES_CORTOS[nombre] || nombre }

function esNormal(nombre, valor) {
  const r = RANGOS[nombre]
  if (!r || valor === null) return null
  return valor >= (r.min ?? 0) && valor <= r.max
}

function calcTendencia(nombre, historial) {
  const valores = historial
    .map(e => e.resultados?.find(r => getNombre(r) === nombre)?.valor_numerico ?? null)
    .filter(v => v !== null)
  if (valores.length < 2) return "estable"
  const diferencia = valores[valores.length - 1] - valores[0]
  if (Math.abs(diferencia) / valores[0] < 0.03) return "estable"
  return diferencia > 0 ? "sube" : "baja"
}

function infoTendencia(nombre, historial) {
  const t = calcTendencia(nombre, historial)
  const positivo = ANALISIS_POSITIVOS.includes(nombre)
  if (t === "estable") return { icono: "→", color: "#f59e0b", label: "Estable" }
  if (t === "sube") return positivo
    ? { icono: "↑", color: "#22c55e", label: "Mejorando" }
    : { icono: "↑", color: "#ef4444", label: "Aumentando" }
  return positivo
    ? { icono: "↓", color: "#ef4444", label: "Bajando" }
    : { icono: "↓", color: "#22c55e", label: "Mejorando" }
}

function formatearValor(valor, decimales = 1) {
  if (valor === null || valor === undefined) return "—"
  return Number(valor).toFixed(decimales).replace(/\.?0+$/, "")
}

/* ============================================
   DONA
   ============================================ */
function DonaAnalisis({ nombre, valor, color }) {
  const rango = RANGOS[nombre]
  const max = rango?.maxDisplay ?? 300
  const fraccion = Math.min(Math.max(valor / max, 0), 1)

  const R = 42, cx = 56, cy = 56, strokeW = 9
  const circunf = 2 * Math.PI * R
  const arco = fraccion * circunf
  const normalMin = ((rango?.min ?? 0) / max) * circunf
  const normalMax = ((rango?.max ?? max) / max) * circunf
  const fueraDeRango = esNormal(nombre, valor) === false

  return (
    <div className="relative flex justify-center">
      <svg viewBox="0 0 112 112" width="112" height="112" className="block">
        <circle cx={cx} cy={cy} r={R} fill="none" stroke="#e5e7eb" strokeWidth={strokeW} />
        {rango && (
          <circle cx={cx} cy={cy} r={R} fill="none" stroke="#22c55e" strokeWidth={strokeW + 1}
            strokeDasharray={`${normalMax - normalMin} ${circunf - (normalMax - normalMin)}`}
            strokeDashoffset={circunf / 4 - normalMin} strokeLinecap="round" opacity="0.22" />
        )}
        <circle cx={cx} cy={cy} r={R} fill="none"
          stroke={fueraDeRango ? "#ef4444" : color} strokeWidth={strokeW}
          strokeDasharray={`${arco} ${circunf - arco}`} strokeDashoffset={circunf / 4}
          strokeLinecap="round"
          style={{ transition: "stroke-dasharray .5s cubic-bezier(.4,0,.2,1)" }} />
        <text x={cx} y={cy - 3} textAnchor="middle" fontSize="18" fontWeight="700"
          fill={fueraDeRango ? "#ef4444" : "#111827"}>{formatearValor(valor, 1)}</text>
        <text x={cx} y={cy + 14} textAnchor="middle" fontSize="9" fill="#6b7280">
          {rango?.unidad || "—"}
        </text>
      </svg>
    </div>
  )
}

/* ============================================
   TARJETA DE ANÁLISIS
   ============================================ */
function TarjetaAnalisis({ nombre, historial }) {
  const color = COLORES_ANALISIS[nombre] || "#64748b"
  const rango = RANGOS[nombre]

  const estudiosOrdenados = [...historial].reverse()
  const ultimoEstudio = estudiosOrdenados.find(e =>
    e.resultados?.find(r => getNombre(r) === nombre && r.valor_numerico !== null)
  )
  const ultimoResultado = ultimoEstudio?.resultados?.find(r => getNombre(r) === nombre)
  const valor = ultimoResultado?.valor_numerico ?? null

  const estudioAnterior = estudiosOrdenados[1]
  const resultadoAnterior = estudioAnterior?.resultados?.find(r => getNombre(r) === nombre)
  const valorAnterior = resultadoAnterior?.valor_numerico ?? null

  const normal = esNormal(nombre, valor)
  const tend = infoTendencia(nombre, historial)

  let cambio = null
  if (valor !== null && valorAnterior !== null) {
    const diff = valor - valorAnterior
    const porcentaje = valorAnterior !== 0 ? Math.round((diff / valorAnterior) * 100) : 0
    cambio = { diff, porcentaje, sube: diff > 0 }
  }

  const datosLinea = estudiosOrdenados
    .map((e, i) => {
      const res = e.resultados?.find(r => getNombre(r) === nombre)
      return res?.valor_numerico != null
        ? { mes: e.fecha?.split(" ")[0] || `Estudio ${i + 1}`, valor: res.valor_numerico }
        : null
    })
    .filter(Boolean)
    .slice(0, 6)
    .reverse()

  return (
    <div className="bg-white border border-gray-100 rounded-3xl p-5 shadow-sm hover:shadow-md transition-all">
      <div className="flex justify-between items-start mb-3">
        <div>
          <p className="font-semibold text-sm" style={{ color }}>{nombreCorto(nombre)}</p>
          {rango && (
            <p className="text-[10px] text-gray-400 mt-0.5">
              Rango: {rango.min > 0 ? `${rango.min}–` : "<"}{rango.max} {rango.unidad || ""}
            </p>
          )}
        </div>
        
        {normal !== null && (
          <span className={`text-[10px] px-3 py-0.5 rounded-full font-medium ${normal ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"}`}>
            {normal ? "Normal" : "Alterado"}
          </span>
        )}
      </div>

      {valor !== null ? (
        <DonaAnalisis nombre={nombre} valor={valor} color={color} />
      ) : (
        <div className="h-[112px] flex items-center justify-center text-gray-400 text-xs">Sin dato</div>
      )}

      {cambio && (
        <div className="mt-3 text-center">
          <span className="text-xs text-gray-500">vs mes anterior: </span>
          <span className={`font-semibold text-sm ${cambio.sube ? "text-red-600" : "text-emerald-600"}`}>
            {cambio.sube ? "↑" : "↓"} {formatearValor(Math.abs(cambio.diff), 1)} {rango?.unidad}
            <span className="text-[10px] ml-1 text-gray-400">({cambio.porcentaje > 0 ? "+" : ""}{cambio.porcentaje}%)</span>
          </span>
        </div>
      )}

      <div className="border-t border-gray-100 my-4" />

      <div className="flex items-center justify-between text-xs mb-3">
        <span className="text-gray-500">Tendencia general</span>
        <span className="font-semibold flex items-center gap-1" style={{ color: tend.color }}>
          {tend.icono} {tend.label}
        </span>
      </div>

      {datosLinea.length > 1 && (
        <div className="mt-2">
          <p className="text-[10px] text-gray-500 mb-1">Evolución últimos estudios</p>
          <div className="h-28 -mx-1">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={datosLinea}>
                <CartesianGrid strokeDasharray="2 2" stroke="#f3f4f6" />
                <XAxis dataKey="mes" tick={{ fontSize: 9, fill: "#9ca3af" }} />
                <YAxis tickFormatter={(v) => formatearValor(v, 1)} tick={{ fontSize: 9, fill: "#9ca3af" }} />
                <Tooltip contentStyle={{ fontSize: "11px", borderRadius: "8px" }} labelStyle={{ color: "#6b7280" }} />
                <Line type="natural" dataKey="valor" stroke={color} strokeWidth={2.5} dot={{ fill: color, r: 3 }} activeDot={{ r: 5 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  )
}

/* ============================================
   TARJETA DE ESTUDIO
   ============================================ */
function TarjetaEstudio({ estudio }) {
  const total = estudio.resultados?.length ?? 0
  const normales = estudio.resultados?.filter(r => r.valor_numerico !== null && esNormal(getNombre(r), r.valor_numerico) === true).length ?? 0
  const alterados = estudio.resultados?.filter(r => r.valor_numerico !== null && esNormal(getNombre(r), r.valor_numerico) === false).length ?? 0
  const porcentaje = total > 0 ? Math.round((normales / total) * 100) : 0

  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-4 text-sm">
      <p className="font-semibold text-gray-800">{estudio.fecha}</p>
      <p className="text-xs text-gray-500 mb-3">{estudio.laboratorio || "Laboratorio"}</p>
      <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden mb-2">
        <div className="h-full rounded-full transition-all" style={{
          width: `${porcentaje}%`,
          background: porcentaje >= 80 ? "#22c55e" : porcentaje >= 50 ? "#f59e0b" : "#ef4444"
        }} />
      </div>
      <div className="flex justify-between text-xs">
        <span className="text-emerald-600 font-medium">{normales} normal{normales !== 1 ? "es" : ""}</span>
        {alterados > 0 && <span className="text-red-600 font-medium">{alterados} alterado{alterados !== 1 ? "s" : ""}</span>}
      </div>
    </div>
  )
}

/* ============================================
   COMPONENTE PRINCIPAL: GraficaTendencia
   ============================================ */
export default function GraficaTendencia({ historial }) {
  const [filtro, setFiltro] = useState("todos")

  if (!historial || historial.length === 0) {
    return (
      <div className="bg-white border border-gray-100 rounded-3xl p-12 text-center">
        <div className="text-6xl mb-4 opacity-50">📈</div>
        <p className="font-semibold text-gray-700 mb-2">Aún no tienes estudios</p>
        <p className="text-sm text-gray-500">Sube tu primer PDF de laboratorio para comenzar a ver tu historial.</p>
      </div>
    )
  }

  const todosLosAnalisis = []
  historial.forEach(e => {
    e.resultados?.forEach(r => {
      if (!todosLosAnalisis.includes(getNombre(r)) && r.valor_numerico !== null)
        todosLosAnalisis.push(getNombre(r))
    })
  })

  const analisisConEstado = todosLosAnalisis.map(nombre => {
    const ultimoEstudio = [...historial].reverse().find(e =>
      e.resultados?.find(r => getNombre(r) === nombre && r.valor_numerico !== null)
    )
    const ultimo = ultimoEstudio?.resultados?.find(r => getNombre(r) === nombre)
    return { nombre, normal: esNormal(nombre, ultimo?.valor_numerico ?? null) }
  })

  const analisisFiltrados =
    filtro === "alterados" ? analisisConEstado.filter(a => a.normal === false).map(a => a.nombre)
    : filtro === "normales" ? analisisConEstado.filter(a => a.normal === true).map(a => a.nombre)
    : todosLosAnalisis

  const nNormales = analisisConEstado.filter(a => a.normal === true).length
  const nAlterados = analisisConEstado.filter(a => a.normal === false).length

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap justify-between items-end gap-4">
        <div>
          <h3 className="text-2xl font-bold text-gray-800">Tendencia Histórica</h3>
          <p className="text-gray-500 text-sm mt-1">
            {historial.length} estudio{historial.length !== 1 ? "s" : ""} · {todosLosAnalisis.length} análisis
          </p>
        </div>

        <div className="flex gap-2 flex-wrap">
          {[
            { id: "todos", label: `Todos (${todosLosAnalisis.length})` },
            { id: "normales", label: `Normales (${nNormales})` },
            { id: "alterados", label: `Alterados (${nAlterados})` },
          ].map(f => (
            <button key={f.id} onClick={() => setFiltro(f.id)}
              className={`px-5 py-2 rounded-2xl text-sm font-medium transition-all border ${filtro === f.id 
                ? "bg-blue-50 border-blue-600 text-blue-700" 
                : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50"}`}>
              {f.label}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 text-xs flex flex-wrap gap-x-6 gap-y-2 text-gray-600">
        <div className="flex items-center gap-2">• Franja verde = zona normal</div>
        <div className="flex items-center gap-2">• Arco = último resultado</div>
        <div className="flex items-center gap-2">• Línea = evolución real</div>
      </div>

      {analisisFiltrados.length === 0 ? (
        <div className="text-center py-12 text-gray-500">No hay análisis en este filtro.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {analisisFiltrados.map(nombre => (
            <TarjetaAnalisis key={nombre} nombre={nombre} historial={historial} />
          ))}
        </div>
      )}

      {historial.length >= 2 && (
        <div>
          <p className="font-semibold text-gray-700 mb-4">Historial de estudios</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {historial.map((e, i) => (
              <TarjetaEstudio key={i} estudio={e} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}