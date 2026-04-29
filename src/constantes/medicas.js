
// URL de la API — cuando tengas backend real, cambia solo esta linea
export const URL_API = "https://69e9c1ee15c7e2d51268ad00.mockapi.io/Clinica/Usuarios"

// ── ESPECIALIDADES ────────────────────────────────────────────
// Para agregar una nueva especialidad, agrega un objeto al final
// con el mismo formato: { valor: "...", etiqueta: "..." }
export const ESPECIALIDADES_BASE = [
  { valor: "",                  etiqueta: "Sin especialidad"  },
  { valor: "Medicina General",  etiqueta: "Medicina General"  },
  { valor: "Cardiología",       etiqueta: "Cardiología"       },
  { valor: "Endocrinología",    etiqueta: "Endocrinología"    },
  { valor: "Hematología",       etiqueta: "Hematología"       },
  { valor: "Nefrología",        etiqueta: "Nefrología"        },
  { valor: "Hepatología",       etiqueta: "Hepatología"       },
  { valor: "Nutrición",         etiqueta: "Nutrición"         },
]

// ── COLORES DEL SEMÁFORO ──────────────────────────────────────
// Mapea un estado a clases de Tailwind y color hex para graficas
export const COLORES_SEMAFORO = {
  green: {
    fondo:    "bg-green-50",
    borde:    "border-green-300",
    texto:    "text-green-700",
    badge:    "bg-green-100 text-green-700",
    barra:    "#22c55e",
    etiqueta: "Normal",
  },
  yellow: {
    fondo:    "bg-yellow-50",
    borde:    "border-yellow-300",
    texto:    "text-yellow-700",
    badge:    "bg-yellow-100 text-yellow-700",
    barra:    "#f59e0b",
    etiqueta: "Límite",
  },
  red: {
    fondo:    "bg-red-50",
    borde:    "border-red-300",
    texto:    "text-red-700",
    badge:    "bg-red-100 text-red-600",
    barra:    "#ef4444",
    etiqueta: "Atención",
  },
  gray: {
    fondo:    "bg-gray-50",
    borde:    "border-gray-200",
    texto:    "text-gray-600",
    badge:    "bg-gray-100 text-gray-500",
    barra:    "#9ca3af",
    etiqueta: "Sin ref",
  },
}

// ── RANGOS DE REFERENCIA ──────────────────────────────────────
// Para agregar un analito nuevo, agrega una entrada con su nombre
// exacto como clave, y los valores ref_low, ref_high y unidad
export const RANGOS_REFERENCIA = {
  "COLESTEROL":             { ref_low: 0,    ref_high: 200,  unidad: "mg/dL"  },
  "TRIGLICERIDOS":          { ref_low: 0,    ref_high: 150,  unidad: "mg/dL"  },
  "HDL COLESTEROL":         { ref_low: 40,   ref_high: 60,   unidad: "mg/dL"  },
  "LDL COLESTEROL":         { ref_low: 0,    ref_high: 100,  unidad: "mg/dL"  },
  "VLDL COLESTEROL":        { ref_low: 15,   ref_high: 35,   unidad: "mg/dL"  },
  "COLESTEROL NO-HDL":      { ref_low: 0,    ref_high: 130,  unidad: "mg/dL"  },
  "PROTEINA C REACTIVA":    { ref_low: 0,    ref_high: 5,    unidad: "mg/L"   },
  "PROTEINA C REACTIVA HS": { ref_low: 0,    ref_high: 1,    unidad: "mg/L"   },
  "APOLIPOPROTEINA B":      { ref_low: 50,   ref_high: 120,  unidad: "mg/dL"  },
  "INDICE ATEROGENICO":     { ref_low: 0,    ref_high: 4.5,  unidad: ""       },
  "LIPOPROTEINA A":         { ref_low: 0,    ref_high: 75,   unidad: "nmol/L" },
  "GLUCOSA":                { ref_low: 70,   ref_high: 100,  unidad: "mg/dL"  },
  "HEMOGLOBINA":            { ref_low: 12,   ref_high: 17,   unidad: "g/dL"   },
  "HEMATOCRITO":            { ref_low: 36,   ref_high: 52,   unidad: "%"      },
  "CREATININA":             { ref_low: 0.6,  ref_high: 1.2,  unidad: "mg/dL"  },
  "ACIDO URICO":            { ref_low: 2.4,  ref_high: 7.0,  unidad: "mg/dL"  },
}