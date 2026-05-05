import { useState } from "react"

/* ─────────────────────────────────────────────
   CONFIGURACIÓN
   ───────────────────────────────────────────── */
const COLORES_ANALISIS = {
  "COLESTEROL":              "#3b82f6",
  "TRIGLICÉRIDOS":           "#f59e0b",
  "HDL COLESTEROL":          "#22c55e",
  "LDL COLESTEROL":          "#ef4444",
  "VLDL COLESTEROL":         "#8b5cf6",
  "COLESTEROL NO-HDL":       "#06b6d4",
  "PROTEÍNA C REACTIVA":     "#f97316",
  "PROTEÍNA C REACTIVA HS":  "#ec4899",
  "APOLIPOPROTEÍNA B":       "#64748b",
  "ÍNDICE ATEROGÉNICO":      "#84cc16",
  "LIPOPROTEÍNA A":          "#a855f7",
  "GLUCOSA":                 "#10b981",
  "HEMOGLOBINA":             "#dc2626",
  "HEMATOCRITO":             "#7c3aed",
  "CREATININA":              "#0284c7",
}

// min/max = rango normal · maxDisplay = tope visual de la dona
const RANGOS = {
  "COLESTEROL":              { min: 0,  max: 200,  maxDisplay: 300,  unidad: "mg/dL" },
  "TRIGLICÉRIDOS":           { min: 0,  max: 150,  maxDisplay: 300,  unidad: "mg/dL" },
  "HDL COLESTEROL":          { min: 40, max: 60,   maxDisplay: 100,  unidad: "mg/dL" },
  "LDL COLESTEROL":          { min: 0,  max: 100,  maxDisplay: 200,  unidad: "mg/dL" },
  "VLDL COLESTEROL":         { min: 15, max: 35,   maxDisplay: 60,   unidad: "mg/dL" },
  "COLESTEROL NO-HDL":       { min: 0,  max: 130,  maxDisplay: 200,  unidad: "mg/dL" },
  "PROTEÍNA C REACTIVA":     { min: 0,  max: 5,    maxDisplay: 15,   unidad: "mg/L"  },
  "PROTEÍNA C REACTIVA HS":  { min: 0,  max: 1,    maxDisplay: 5,    unidad: "mg/L"  },
  "ÍNDICE ATEROGÉNICO":      { min: 0,  max: 4.5,  maxDisplay: 8,    unidad: ""      },
  "GLUCOSA":                 { min: 70, max: 100,  maxDisplay: 200,  unidad: "mg/dL" },
  "HEMOGLOBINA":             { min: 12, max: 17,   maxDisplay: 20,   unidad: "g/dL"  },
}

const NOMBRES_CORTOS = {
  "PROTEÍNA C REACTIVA HS":  "PCR hs",
  "PROTEÍNA C REACTIVA":     "PCR",
  "COLESTEROL NO-HDL":       "Col. no-HDL",
  "APOLIPOPROTEÍNA B":       "Apo B",
  "ÍNDICE ATEROGÉNICO":      "Índ. aterogénico",
  "HDL COLESTEROL":          "HDL",
  "LDL COLESTEROL":          "LDL",
  "VLDL COLESTEROL":         "VLDL",
  "TRIGLICÉRIDOS":           "Triglicéridos",
  "LIPOPROTEÍNA A":          "Lipoproteína A",
}

// Análisis donde SUBIR es bueno (la lógica de color de tendencia se invierte)
const ANALISIS_POSITIVOS = ["HDL COLESTEROL", "HEMOGLOBINA", "HEMATOCRITO"]

// Acepta tanto r.nombre como r.analito (compatibilidad con datos existentes)
function getNombre(r) { return r.nombre ?? r.analito }

/* ─────────────────────────────────────────────
   HELPERS
   ───────────────────────────────────────────── */
function nombreCorto(nombre) {
  return NOMBRES_CORTOS[nombre] || nombre
}

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
  const t        = calcTendencia(nombre, historial)
  const positivo = ANALISIS_POSITIVOS.includes(nombre)
  if (t === "estable") return { icono: "→", color: "#f59e0b", label: "Estable"   }
  if (t === "sube")    return positivo
    ? { icono: "↑", color: "#22c55e", label: "Mejorando"  }
    : { icono: "↑", color: "#ef4444", label: "Aumentando" }
  return positivo
    ? { icono: "↓", color: "#ef4444", label: "Bajando"    }
    : { icono: "↓", color: "#22c55e", label: "Mejorando"  }
}

/* ─────────────────────────────────────────────
   DONA SVG
   ───────────────────────────────────────────── */
function DonaAnalisis({ nombre, valor, color }) {
  const rango    = RANGOS[nombre]
  const max      = rango?.maxDisplay ?? 300
  const min      = rango?.min        ?? 0
  const fraccion = Math.min(Math.max(valor / max, 0), 1)

  const R       = 42
  const cx      = 56, cy = 56
  const strokeW = 9
  const circunf = 2 * Math.PI * R
  const arco    = fraccion * circunf

  const normalMin    = (min / max) * circunf
  const normalMax    = ((rango?.max ?? max) / max) * circunf
  const fueraDeRango = esNormal(nombre, valor) === false

  return (
    <svg viewBox="0 0 112 112" width="112" height="112" style={{ display: "block", margin: "0 auto" }}>
      {/* Pista de fondo */}
      <circle cx={cx} cy={cy} r={R} fill="none" stroke="rgba(150,150,150,0.35)" strokeWidth={strokeW} />

      {/* Franja de zona normal */}
      {rango && (
        <circle
          cx={cx} cy={cy} r={R} fill="none"
          stroke="rgba(34,197,94,0.22)"
          strokeWidth={strokeW + 2}
          strokeDasharray={`${normalMax - normalMin} ${circunf - (normalMax - normalMin)}`}
          strokeDashoffset={circunf / 4 - normalMin}
          strokeLinecap="round"
        />
      )}

      {/* Arco del valor actual */}
      <circle
        cx={cx} cy={cy} r={R} fill="none"
        stroke={fueraDeRango ? "#ef4444" : color}
        strokeWidth={strokeW}
        strokeDasharray={`${arco} ${circunf - arco}`}
        strokeDashoffset={circunf / 4}
        strokeLinecap="round"
        style={{ transition: "stroke-dasharray .6s cubic-bezier(.4,0,.2,1)" }}
      />

      {/* Valor central */}
      <text x={cx} y={cy - 5} textAnchor="middle" fontSize="15" fontWeight="600"
        fill={fueraDeRango ? "#ef4444" : "var(--color-text-primary)"}>
        {valor}
      </text>
      <text x={cx} y={cy + 11} textAnchor="middle" fontSize="9" fill="var(--color-text-tertiary)">
        {rango?.unidad || ""}
      </text>
    </svg>
  )
}

/* ─────────────────────────────────────────────
   TARJETA DE UN ANÁLISIS
   ───────────────────────────────────────────── */
function TarjetaAnalisis({ nombre, historial }) {
  const color = COLORES_ANALISIS[nombre] || "#64748b"
  const rango = RANGOS[nombre]

  const ultimoEstudio   = [...historial].reverse().find(e =>
    e.resultados?.find(r => getNombre(r) === nombre && r.valor_numerico !== null)
  )
  const ultimoResultado = ultimoEstudio?.resultados?.find(r => getNombre(r) === nombre)
  const valor           = ultimoResultado?.valor_numerico ?? null

  const normal = esNormal(nombre, valor)
  const tend   = infoTendencia(nombre, historial)

  const spark    = historial
    .map(e => e.resultados?.find(r => getNombre(r) === nombre)?.valor_numerico ?? null)
    .filter(v => v !== null)
  const sparkMax = Math.max(...spark, rango?.maxDisplay ?? 1)
  const sparkMin = Math.min(...spark)

  return (
    <div style={{
      background: "var(--color-background-primary)",
      border: "1px solid var(--color-border-tertiary)",
      borderTop: `3px solid ${color}`,
      borderRadius: 16,
      padding: "16px 14px 14px",
      display: "flex", flexDirection: "column", gap: 10,
    }}>
      {/* Encabezado */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <p style={{ fontSize: 12, fontWeight: 500, color, letterSpacing: ".02em" }}>
          {nombreCorto(nombre)}
        </p>
        {normal !== null && (
          <span style={{
            fontSize: 10, fontWeight: 500, padding: "2px 8px", borderRadius: 20,
            background: normal ? "rgba(34,197,94,.12)" : "rgba(239,68,68,.12)",
            color:      normal ? "#15803d"             : "#b91c1c",
          }}>
            {normal ? "Normal" : "Alterado"}
          </span>
        )}
      </div>

      {/* Dona */}
      {valor !== null
        ? <DonaAnalisis nombre={nombre} valor={valor} color={color} />
        : (
          <div style={{ height: 112, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ fontSize: 12, color: "var(--color-text-tertiary)" }}>Sin dato</span>
          </div>
        )
      }

      {/* Rango de referencia */}
      {rango && (
        <p style={{ fontSize: 10, color: "var(--color-text-tertiary)", textAlign: "center" }}>
          Rango normal: {rango.min > 0 ? `${rango.min}–` : "<"}{rango.max} {rango.unidad}
        </p>
      )}

      <div style={{ borderTop: "1px solid var(--color-border-tertiary)" }} />

      {/* Tendencia */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span style={{ fontSize: 11, color: "var(--color-text-secondary)" }}>Tendencia</span>
        <span style={{ fontSize: 12, fontWeight: 500, color: tend.color, display: "flex", alignItems: "center", gap: 3 }}>
          {tend.icono} {tend.label}
        </span>
      </div>

      {/* Spark bars (historial visual) */}
      {spark.length > 1 && (
        <div style={{ display: "flex", alignItems: "flex-end", gap: 3, height: 28 }}>
          {spark.map((v, i) => {
            const esUltimo = i === spark.length - 1
            const altura   = sparkMax === sparkMin ? 50 : Math.round(((v - sparkMin) / (sparkMax - sparkMin)) * 80 + 20)
            const ok       = esNormal(nombre, v)
            return (
              <div key={i}
                title={`${historial[i]?.fecha || ""}: ${v}`}
                style={{
                  flex: 1, height: `${altura}%`, borderRadius: 3,
                  background: esUltimo ? (ok === false ? "#ef4444" : color) : "var(--color-border-secondary)",
                  opacity: esUltimo ? 1 : 0.55,
                  transition: "height .4s ease",
                }}
              />
            )
          })}
        </div>
      )}

      {/* Fechas bajo las barras */}
      {spark.length > 1 && (
        <div style={{ display: "flex", gap: 3 }}>
          {historial.map((e, i) => (
            <div key={i} style={{
              flex: 1, fontSize: 9, color: "var(--color-text-tertiary)",
              textAlign: "center", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
            }}>
              {e.fecha?.split(" ")[0] || ""}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

/* ─────────────────────────────────────────────
   TARJETA RESUMEN DE UN ESTUDIO
   ───────────────────────────────────────────── */
function TarjetaEstudio({ estudio }) {
  const total      = estudio.resultados?.length ?? 0
  const normales   = estudio.resultados?.filter(r =>
    r.valor_numerico !== null && esNormal(getNombre(r), r.valor_numerico) === true
  ).length ?? 0
  const alterados  = estudio.resultados?.filter(r =>
    r.valor_numerico !== null && esNormal(getNombre(r), r.valor_numerico) === false
  ).length ?? 0
  const porcentaje = total > 0 ? Math.round((normales / total) * 100) : 0

  return (
    <div style={{
      background: "var(--color-background-secondary)",
      border: "1px solid var(--color-border-tertiary)",
      borderRadius: 12, padding: "10px 14px",
    }}>
      <p style={{ fontSize: 12, fontWeight: 500, color: "var(--color-text-primary)", marginBottom: 2 }}>
        {estudio.fecha}
      </p>
      <p style={{ fontSize: 11, color: "var(--color-text-tertiary)", marginBottom: 8 }}>
        {estudio.laboratorio || "Laboratorio"}
      </p>

      <div style={{
        height: 4, borderRadius: 4, background: "var(--color-border-tertiary)",
        overflow: "hidden", marginBottom: 6,
      }}>
        <div style={{
          height: "100%", width: `${porcentaje}%`, borderRadius: 4,
          background: porcentaje >= 80 ? "#22c55e" : porcentaje >= 50 ? "#f59e0b" : "#ef4444",
          transition: "width .5s ease",
        }} />
      </div>

      <div style={{ display: "flex", gap: 10, fontSize: 11 }}>
        <span style={{ color: "#15803d", fontWeight: 500 }}>
          {normales} normal{normales !== 1 ? "es" : ""}
        </span>
        {alterados > 0 && (
          <span style={{ color: "#b91c1c", fontWeight: 500 }}>
            {alterados} alterado{alterados !== 1 ? "s" : ""}
          </span>
        )}
      </div>
    </div>
  )
}

/* ─────────────────────────────────────────────
   COMPONENTE PRINCIPAL
   ───────────────────────────────────────────── */
export default function GraficaTendencia({ historial }) {
  const [filtro, setFiltro] = useState("todos")

  if (!historial || historial.length === 0) {
    return (
      <div style={{
        background: "var(--color-background-secondary)",
        border: "1px solid var(--color-border-tertiary)",
        borderRadius: 16, padding: "40px 24px", textAlign: "center",
      }}>
        <p style={{ fontSize: 36, marginBottom: 12 }}>📈</p>
        <p style={{ color: "var(--color-text-primary)", fontWeight: 500, fontSize: 14, marginBottom: 6 }}>
          Aún no hay estudios
        </p>
        <p style={{ color: "var(--color-text-tertiary)", fontSize: 12 }}>
          Sube un PDF de laboratorio para comenzar a ver tu historial.
        </p>
      </div>
    )
  }

  // Recolectar todos los nombres de análisis con al menos un valor
  const todosLosAnalisis = []
  historial.forEach(e => {
    e.resultados?.forEach(r => {
      if (!todosLosAnalisis.includes(getNombre(r)) && r.valor_numerico !== null)
        todosLosAnalisis.push(getNombre(r))
    })
  })

  // Estado actual (normal/alterado) de cada análisis
  const analisisConEstado = todosLosAnalisis.map(nombre => {
    const ultimoEstudio = [...historial].reverse().find(e =>
      e.resultados?.find(r => getNombre(r) === nombre && r.valor_numerico !== null)
    )
    const ultimo = ultimoEstudio?.resultados?.find(r => getNombre(r) === nombre)
    return { nombre, normal: esNormal(nombre, ultimo?.valor_numerico ?? null) }
  })

  const analisisFiltrados =
    filtro === "alterados" ? analisisConEstado.filter(a => a.normal === false).map(a => a.nombre)
    : filtro === "normales" ? analisisConEstado.filter(a => a.normal === true ).map(a => a.nombre)
    : todosLosAnalisis

  const nNormales  = analisisConEstado.filter(a => a.normal === true ).length
  const nAlterados = analisisConEstado.filter(a => a.normal === false).length

  const OPCIONES_FILTRO = [
    { id: "todos",     label: `Todos (${todosLosAnalisis.length})` },
    { id: "normales",  label: `Normales (${nNormales})`,   color: "#15803d", fondo: "rgba(34,197,94,.12)"  },
    { id: "alterados", label: `Alterados (${nAlterados})`, color: "#b91c1c", fondo: "rgba(239,68,68,.12)" },
  ]

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

      {/* ENCABEZADO */}
      <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "flex-end", gap: 12 }}>
        <div>
          <p style={{ fontSize: 16, fontWeight: 500, color: "var(--color-text-primary)", marginBottom: 3 }}>
            Tendencia histórica de laboratorios
          </p>
          <p style={{ fontSize: 12, color: "var(--color-text-tertiary)" }}>
            {historial.length} estudio{historial.length !== 1 ? "s" : ""} · {todosLosAnalisis.length} análisis registrados
          </p>
        </div>

        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          {OPCIONES_FILTRO.map(f => (
            <button key={f.id} onClick={() => setFiltro(f.id)} style={{
              fontSize: 11, padding: "4px 12px", borderRadius: 20, cursor: "pointer",
              fontWeight:  filtro === f.id ? 500 : 400,
              border:      "1px solid",
              borderColor: filtro === f.id ? (f.color || "var(--color-border-primary)") : "var(--color-border-tertiary)",
              background:  filtro === f.id ? (f.fondo || "var(--color-border-tertiary)") : "var(--color-background-primary)",
              color:       filtro === f.id ? (f.color || "var(--color-text-primary)") : "var(--color-text-secondary)",
              transition:  "all .15s",
            }}>
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* LEYENDA */}
      <div style={{
        display: "flex", gap: 16, flexWrap: "wrap",
        background: "var(--color-background-secondary)",
        border: "1px solid var(--color-border-tertiary)",
        borderRadius: 10, padding: "8px 14px",
        fontSize: 11, color: "var(--color-text-secondary)",
      }}>
        <span style={{ display: "flex", alignItems: "center", gap: 5 }}>
          <span style={{ width: 10, height: 10, borderRadius: "50%", background: "rgba(34,197,94,.4)", display: "inline-block" }}/>
          Franja verde = zona normal
        </span>
        <span style={{ display: "flex", alignItems: "center", gap: 5 }}>
          <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#3b82f6", display: "inline-block" }}/>
          Arco = último resultado (rojo si alterado)
        </span>
        <span style={{ display: "flex", alignItems: "center", gap: 5 }}>
          <span style={{ width: 10, height: 4, borderRadius: 2, background: "var(--color-border-secondary)", display: "inline-block" }}/>
          Barras = historial de valores
        </span>
      </div>

      {/* GRID DE DONAS */}
      {analisisFiltrados.length === 0 ? (
        <p style={{ fontSize: 13, color: "var(--color-text-tertiary)", textAlign: "center", padding: "24px 0" }}>
          No hay análisis en este filtro.
        </p>
      ) : (
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(170px, 1fr))",
          gap: 12,
        }}>
          {analisisFiltrados.map(nombre => (
            <TarjetaAnalisis key={nombre} nombre={nombre} historial={historial} />
          ))}
        </div>
      )}

      {/* HISTORIAL DE ESTUDIOS */}
      {historial.length >= 2 && (
        <>
          <p style={{ fontSize: 13, fontWeight: 500, color: "var(--color-text-secondary)", marginBottom: -8 }}>
            Historial de estudios
          </p>
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))",
            gap: 8,
          }}>
            {historial.map((e, i) => (
              <TarjetaEstudio key={i} estudio={e} />
            ))}
          </div>
        </>
      )}

    </div>
  )
}

