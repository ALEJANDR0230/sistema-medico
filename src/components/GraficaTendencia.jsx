import { useState } from "react"
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ReferenceLine, ResponsiveContainer, Legend
} from "recharts"

const COLORES_ANALITO = {
  "COLESTEROL":             "#3b82f6",
  "TRIGLICERIDOS":          "#f59e0b",
  "HDL COLESTEROL":         "#22c55e",
  "LDL COLESTEROL":         "#ef4444",
  "VLDL COLESTEROL":        "#8b5cf6",
  "COLESTEROL NO-HDL":      "#06b6d4",
  "PROTEINA C REACTIVA":    "#f97316",
  "PROTEINA C REACTIVA HS": "#ec4899",
  "APOLIPOPROTEINA B":      "#64748b",
  "INDICE ATEROGENICO":     "#84cc16",
  "LIPOPROTEINA A":         "#a855f7",
  "GLUCOSA":                "#10b981",
  "HEMOGLOBINA":            "#dc2626",
  "HEMATOCRITO":            "#7c3aed",
  "CREATININA":             "#0284c7",
}

const RANGOS = {
  "COLESTEROL":             { min: 0,   max: 200  },
  "TRIGLICERIDOS":          { min: 0,   max: 150  },
  "HDL COLESTEROL":         { min: 40,  max: 60   },
  "LDL COLESTEROL":         { min: 0,   max: 100  },
  "VLDL COLESTEROL":        { min: 15,  max: 35   },
  "COLESTEROL NO-HDL":      { min: 0,   max: 130  },
  "PROTEINA C REACTIVA":    { min: 0,   max: 5    },
  "PROTEINA C REACTIVA HS": { min: 0,   max: 1    },
  "INDICE ATEROGENICO":     { min: 0,   max: 4.5  },
  "GLUCOSA":                { min: 70,  max: 100  },
  "HEMOGLOBINA":            { min: 12,  max: 17   },
}

function TooltipCustom({ active, payload, label }) {
  if (!active || !payload || payload.length === 0) return null
  return (
    <div style={{
      background: "var(--color-background-primary)",
      border: "1px solid var(--color-border-secondary)",
      borderRadius: 10, padding: "10px 14px", fontSize: 12,
    }}>
      <p style={{ color: "var(--color-text-tertiary)", marginBottom: 6, fontWeight: 500 }}>{label}</p>
      {payload.map((entry) => (
        <div key={entry.name} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 3 }}>
          <div style={{ width: 8, height: 8, borderRadius: "50%", background: entry.color, flexShrink: 0 }} />
          <span style={{ color: "var(--color-text-secondary)" }}>{entry.name}:</span>
          <span style={{ color: "var(--color-text-primary)", fontWeight: 500 }}>{entry.value}</span>
        </div>
      ))}
    </div>
  )
}

function GraficaTendencia({ historial }) {
  const [analitosSeleccionados, setAnalitosSeleccionados] = useState([])
  const [vista, setVista] = useState("lineas")

  if (!historial || historial.length < 2) {
    return (
      <div style={{
        background: "var(--color-background-secondary)",
        border: "1px solid var(--color-border-tertiary)",
        borderRadius: 16, padding: "40px 24px", textAlign: "center"
      }}>
        <p style={{ fontSize: 36, marginBottom: 12 }}>📈</p>
        <p style={{ color: "var(--color-text-primary)", fontWeight: 500, fontSize: 14, marginBottom: 6 }}>
          Aun no hay suficientes estudios
        </p>
        <p style={{ color: "var(--color-text-tertiary)", fontSize: 12 }}>
          Necesitas al menos 2 estudios para ver la tendencia historica. Sube otro PDF para comparar.
        </p>
      </div>
    )
  }

  const todosLosAnalitos = []
  historial.forEach((estudio) => {
    if (estudio.resultados) {
      estudio.resultados.forEach((r) => {
        if (!todosLosAnalitos.includes(r.analito) && r.valor_numerico !== null) {
          todosLosAnalitos.push(r.analito)
        }
      })
    }
  })

  const seleccionados = analitosSeleccionados.length > 0
    ? analitosSeleccionados
    : todosLosAnalitos.slice(0, 3)

  const datosGrafica = historial.map((estudio) => {
    const punto = { fecha: estudio.fecha }
    if (estudio.resultados) {
      estudio.resultados.forEach((r) => {
        if (seleccionados.includes(r.analito) && r.valor_numerico !== null) {
          punto[r.analito] = r.valor_numerico
        }
      })
    }
    return punto
  })

  const toggleAnalito = (nombre) => {
    setAnalitosSeleccionados((prev) => {
      if (prev.includes(nombre)) return prev.filter((n) => n !== nombre)
      if (prev.length >= 4) return prev
      return [...prev, nombre]
    })
  }

  const rangoActivo = seleccionados.length === 1 ? RANGOS[seleccionados[0]] : null

  return (
    <div style={{ background: "var(--color-background-primary)", borderRadius: 20, border: "1px solid var(--color-border-tertiary)", overflow: "hidden" }}>

      <div style={{ padding: "20px 20px 0" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
          <div>
            <p style={{ fontSize: 15, fontWeight: 500, color: "var(--color-text-primary)", marginBottom: 3 }}>
              Tendencia historica
            </p>
            <p style={{ fontSize: 12, color: "var(--color-text-tertiary)" }}>
              {historial.length} estudios registrados — selecciona hasta 4 analitos para comparar
            </p>
          </div>
          <div style={{ display: "flex", gap: 6 }}>
            {["lineas", "puntos"].map((v) => (
              <button
                key={v}
                onClick={() => setVista(v)}
                style={{
                  fontSize: 11, padding: "4px 10px", borderRadius: 8, fontWeight: 500,
                  border: "1px solid",
                  borderColor: vista === v ? "#3b82f6" : "var(--color-border-secondary)",
                  background: vista === v ? "#3b82f6" : "var(--color-background-secondary)",
                  color: vista === v ? "#fff" : "var(--color-text-secondary)",
                  cursor: "pointer",
                }}
              >
                {v === "lineas" ? "Lineas" : "Puntos"}
              </button>
            ))}
          </div>
        </div>

        <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 16 }}>
          {todosLosAnalitos.map((nombre) => {
            const activo = seleccionados.includes(nombre)
            const color  = COLORES_ANALITO[nombre] || "#64748b"
            return (
              <button
                key={nombre}
                onClick={() => toggleAnalito(nombre)}
                style={{
                  fontSize: 10, padding: "3px 8px", borderRadius: 20,
                  border: "1.5px solid",
                  borderColor: activo ? color : "var(--color-border-tertiary)",
                  background: activo ? color + "22" : "var(--color-background-secondary)",
                  color: activo ? color : "var(--color-text-tertiary)",
                  cursor: "pointer", fontWeight: activo ? 500 : 400,
                  transition: "all .15s",
                }}
              >
                {nombre.length > 20 ? nombre.slice(0, 18) + "..." : nombre}
              </button>
            )
          })}
        </div>
      </div>

      <div style={{ padding: "0 8px 0 0" }}>
        <ResponsiveContainer width="100%" height={260}>
          <LineChart data={datosGrafica} margin={{ top: 8, right: 24, left: 0, bottom: 8 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border-tertiary)" />
            <XAxis
              dataKey="fecha"
              tick={{ fontSize: 11, fill: "var(--color-text-tertiary)" }}
              tickLine={false}
              axisLine={{ stroke: "var(--color-border-tertiary)" }}
            />
            <YAxis
              tick={{ fontSize: 11, fill: "var(--color-text-tertiary)" }}
              tickLine={false}
              axisLine={false}
              width={40}
            />
            <Tooltip content={<TooltipCustom />} />

            {rangoActivo && (
              <ReferenceLine
                y={rangoActivo.max}
                stroke="#ef4444"
                strokeDasharray="4 4"
                strokeWidth={1}
                label={{ value: "Max normal", fill: "#ef4444", fontSize: 10, position: "right" }}
              />
            )}
            {rangoActivo && rangoActivo.min > 0 && (
              <ReferenceLine
                y={rangoActivo.min}
                stroke="#22c55e"
                strokeDasharray="4 4"
                strokeWidth={1}
                label={{ value: "Min normal", fill: "#22c55e", fontSize: 10, position: "right" }}
              />
            )}

            {seleccionados.map((nombre) => (
              <Line
                key={nombre}
                type="monotone"
                dataKey={nombre}
                stroke={COLORES_ANALITO[nombre] || "#64748b"}
                strokeWidth={2}
                dot={vista === "puntos"
                  ? { r: 5, fill: COLORES_ANALITO[nombre] || "#64748b", strokeWidth: 2, stroke: "#fff" }
                  : { r: 4, fill: COLORES_ANALITO[nombre] || "#64748b", strokeWidth: 2, stroke: "#fff" }
                }
                activeDot={{ r: 6, strokeWidth: 2, stroke: "#fff" }}
                connectNulls={false}
                name={nombre.length > 16 ? nombre.slice(0, 14) + "..." : nombre}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div style={{ padding: "12px 20px 16px", borderTop: "1px solid var(--color-border-tertiary)" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 8 }}>
          {historial.map((estudio, i) => (
            <div key={i} style={{
              background: "var(--color-background-secondary)",
              border: "1px solid var(--color-border-tertiary)",
              borderRadius: 10, padding: "8px 12px"
            }}>
              <p style={{ fontSize: 11, fontWeight: 500, color: "var(--color-text-primary)", marginBottom: 3 }}>
                {estudio.fecha}
              </p>
              <p style={{ fontSize: 10, color: "var(--color-text-tertiary)", marginBottom: 4 }}>
                {estudio.laboratorio || "Laboratorio"}
              </p>
              <div style={{ display: "flex", gap: 8 }}>
                <span style={{ fontSize: 10, color: "#22c55e", fontWeight: 500 }}>
                  {estudio.normales} norm
                </span>
                {estudio.alterados > 0 && (
                  <span style={{ fontSize: 10, color: "#ef4444", fontWeight: 500 }}>
                    {estudio.alterados} alt
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  )
}

export default GraficaTendencia