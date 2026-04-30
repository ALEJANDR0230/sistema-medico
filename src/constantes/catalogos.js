// ─────────────────────────────────────────────────────────────
//  ARCHIVO: constantes/catalogos.js
//
//  CATÁLOGO CENTRAL DE DATOS DEL SISTEMA.
//  Aquí viven todas las listas y configuraciones que usa la app:
//  especialidades, colores del semáforo, rangos de analitos,
//  dietas disponibles y explicaciones por analito.
//
//  Si necesitas agregar o modificar cualquier dato,
//  hazlo aquí. El cambio aplica automáticamente en toda la app.
// ─────────────────────────────────────────────────────────────

// URL de la API — cuando tengas backend real, cambia solo esta línea
export const URL_API = "https://69e9c1ee15c7e2d51268ad00.mockapi.io/Clinica/Usuarios"

// ── ESPECIALIDADES ────────────────────────────────────────────
// Para agregar una nueva, copia el último objeto y cambia los valores
export const ESPECIALIDADES_BASE = [
  { valor: "",                 etiqueta: "Sin especialidad" },
  { valor: "Medicina General", etiqueta: "Medicina General" },
  { valor: "Cardiología",      etiqueta: "Cardiología"      },
  { valor: "Endocrinología",   etiqueta: "Endocrinología"   },
  { valor: "Hematología",      etiqueta: "Hematología"      },
  { valor: "Nefrología",       etiqueta: "Nefrología"       },
  { valor: "Hepatología",      etiqueta: "Hepatología"      },
  { valor: "Nutrición",        etiqueta: "Nutrición"        },
]

// ── COLORES DEL SEMÁFORO ──────────────────────────────────────
// Cada clave (green, yellow, red, gray) mapea a clases de Tailwind
// y un color hex para las gráficas de Recharts
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
// Define qué valores se consideran normales para cada analito.
// Para agregar uno nuevo: "NOMBRE_EXACTO": { ref_low, ref_high, unidad }
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

// ── DIETAS DISPONIBLES ────────────────────────────────────────
// El médico elige una clave y el paciente ve el contenido completo.
// Para agregar una dieta nueva: copia un bloque y cambia los datos.
// La clave debe ser una sola palabra en minúsculas sin espacios.
export const DIETAS = {

  general: {
    titulo:      "Dieta equilibrada saludable",
    descripcion: "Plan nutricional para mantener una salud óptima",
    foto:        "https://images.unsplash.com/photo-1547592180-85f173990554?w=600&auto=format&fit=crop&q=80",
    comer: [
      "Verduras de colores variados en cada comida",
      "Frutas frescas de temporada",
      "Proteínas magras: pollo, pescado, huevo, leguminosas",
      "Granos enteros: avena, arroz integral, quinoa",
      "Grasas saludables: aguacate, nueces, aceite de oliva",
      "Agua mínimo 2 litros al día",
    ],
    evitar: [
      "Ultraprocesados y comida rápida",
      "Azúcar y refrescos en exceso",
      "Sal en exceso",
      "Alcohol",
      "Grasas trans: margarinas y frituras",
    ],
    consejo: "El plato saludable: la mitad verduras, un cuarto proteínas, un cuarto granos enteros.",
  },

  colesterol_alto: {
    titulo:      "Dieta para colesterol elevado",
    descripcion: "Plan para reducir el colesterol LDL y triglicéridos",
    foto:        "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&auto=format&fit=crop&q=80",
    comer: [
      "Avena y cereales integrales",
      "Salmón, sardinas y atún con omega-3",
      "Nueces, almendras y aguacate",
      "Aceite de oliva extra virgen",
      "Espinaca, brócoli y verduras de hoja verde",
      "Lentejas, frijoles y garbanzos",
    ],
    evitar: [
      "Carnes rojas y embutidos",
      "Lácteos enteros",
      "Frituras y comida rápida",
      "Repostería y galletas industriales",
      "Alcohol en exceso",
    ],
    consejo: "Caminar 30 minutos diarios puede reducir el colesterol LDL hasta un 10% en 3 meses.",
  },

  trigliceridos_altos: {
    titulo:      "Dieta para triglicéridos elevados",
    descripcion: "Plan para bajar los triglicéridos en sangre",
    foto:        "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=600&auto=format&fit=crop&q=80",
    comer: [
      "Pescados grasos 2 a 3 veces por semana",
      "Verduras sin almidón: calabaza, pepino, apio",
      "Proteínas magras: pollo sin piel, pavo, claras de huevo",
      "Semillas de chía y linaza",
      "Aguacate con moderación",
    ],
    evitar: [
      "Azúcar y refrescos azucarados",
      "Pan blanco, arroz blanco y pasta",
      "Jugos de fruta aunque sean naturales",
      "Alcohol",
      "Frutas muy dulces en exceso: mango, plátano, uva",
    ],
    consejo: "Eliminar el alcohol y el azúcar por 3 semanas puede reducir los triglicéridos hasta un 30%.",
  },

  glucosa_alta: {
    titulo:      "Dieta para glucosa elevada",
    descripcion: "Plan para controlar el azúcar en sangre",
    foto:        "https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=600&auto=format&fit=crop&q=80",
    comer: [
      "Verduras de hoja verde en abundancia",
      "Proteínas magras en cada comida",
      "Avena, quinoa y cebada",
      "Canela: mejora la sensibilidad a la insulina",
      "Lentejas y frijoles",
      "Fresas, manzanas y peras",
    ],
    evitar: [
      "Azúcar, miel y endulzantes en exceso",
      "Pan blanco y tortillas de harina",
      "Refrescos y jugos",
      "Papas fritas y botanas",
      "Cereales azucarados",
    ],
    consejo: "Comer cada 3 a 4 horas en porciones moderadas ayuda a mantener el azúcar estable.",
  },

}

// ── EXPLICACIONES DE ANALITOS ─────────────────────────────────
// Texto que el paciente ve al expandir cada resultado.
// Para agregar uno nuevo, copia un bloque con el nombre exacto del analito.
export const EXPLICACIONES = {

  "COLESTEROL": {
    que_es:        "El colesterol es una grasa natural que produce tu hígado. Es necesario para formar células, pero en exceso puede acumularse en las arterias.",
    que_significa: "Menos de 200 mg/dL es normal. Tu nivel indica bajo riesgo cardiovascular.",
    recomendacion: "Mantén una dieta baja en grasas saturadas, haz ejercicio regularmente y evita el tabaco.",
    referencia:    "American Heart Association - Heart Disease and Stroke Statistics 2023",
    url:           "https://www.heart.org/en/health-topics/cholesterol",
  },

  "TRIGLICERIDOS": {
    que_es:        "Los triglicéridos son grasas que el cuerpo almacena como energía. Vienen principalmente de los alimentos que consumes.",
    que_significa: "Menos de 150 mg/dL es normal. Niveles altos se asocian con riesgo de enfermedades del corazón.",
    recomendacion: "Reduce el consumo de azúcar, alcohol y carbohidratos refinados.",
    referencia:    "National Heart, Lung, and Blood Institute - Triglycerides",
    url:           "https://www.nhlbi.nih.gov/health/blood-tests/triglycerides",
  },

  "HDL COLESTEROL": {
    que_es:        "El HDL es el colesterol bueno. Recoge el exceso de colesterol de las arterias y lo lleva al hígado para eliminarlo.",
    que_significa: "Mayor a 40 mg/dL en hombres es aceptable. Más de 60 mg/dL se considera protector del corazón.",
    recomendacion: "El ejercicio físico regular es la mejor forma de aumentar el HDL.",
    referencia:    "Mayo Clinic - HDL cholesterol",
    url:           "https://www.mayoclinic.org/diseases-conditions/high-blood-cholesterol/in-depth/hdl-cholesterol/art-20046388",
  },

  "LDL COLESTEROL": {
    que_es:        "El LDL es el colesterol malo. En exceso se deposita en las paredes de las arterias formando placas.",
    que_significa: "Menos de 100 mg/dL es óptimo. Entre 100 y 129 está cerca del óptimo.",
    recomendacion: "Evita grasas trans como frituras y comida procesada.",
    referencia:    "American College of Cardiology - LDL Cholesterol Guidelines",
    url:           "https://www.acc.org",
  },

  "VLDL COLESTEROL": {
    que_es:        "El VLDL transporta triglicéridos desde el hígado hacia los tejidos del cuerpo.",
    que_significa: "El rango normal es 15 a 35 mg/dL. Niveles elevados aumentan el riesgo cardiovascular.",
    recomendacion: "Reducir azúcar y alcohol ayuda a bajar el VLDL de forma significativa.",
    referencia:    "Cleveland Clinic - VLDL Cholesterol",
    url:           "https://my.clevelandclinic.org/health/articles/11920-vldl-cholesterol",
  },

  "COLESTEROL NO-HDL": {
    que_es:        "Es la suma de todos los tipos de colesterol malo. Es un indicador más completo que el LDL solo.",
    que_significa: "Debe ser menor a 130 mg/dL. Un nivel bajo indica bajo riesgo cardiovascular.",
    recomendacion: "Mantén tu dieta actual si el valor es bajo.",
    referencia:    "National Lipid Association - Non-HDL Cholesterol",
    url:           "https://www.lipid.org",
  },

  "PROTEINA C REACTIVA": {
    que_es:        "Producida por el hígado cuando hay inflamación en el cuerpo. Es un marcador general de inflamación.",
    que_significa: "El rango normal es 0 a 5 mg/L. Un valor bajo indica que no hay inflamación significativa.",
    recomendacion: "Duerme bien, haz ejercicio y evita el estrés crónico.",
    referencia:    "Harvard Health Publishing - C-reactive protein",
    url:           "https://www.health.harvard.edu/heart-health/c-reactive-protein-test-to-screen-for-heart-disease",
  },

  "PROTEINA C REACTIVA HS": {
    que_es:        "Detecta niveles muy bajos de inflamación que podrían indicar riesgo cardiovascular antes de que aparezcan síntomas.",
    que_significa: "Menos de 1 mg/L es riesgo bajo. Entre 1 y 3 es riesgo moderado. Mayor a 3 es riesgo alto.",
    recomendacion: "Un resultado bajo indica riesgo cardiovascular muy bajo. Continúa con hábitos saludables.",
    referencia:    "American Heart Association - Inflammation and Heart Disease",
    url:           "https://www.heart.org/en/health-topics/consumer-healthcare/what-is-cardiovascular-disease/inflammation-and-heart-disease",
  },

  "APOLIPOPROTEINA B": {
    que_es:        "La proteína principal del LDL. Refleja el número de partículas aterogénicas en la sangre.",
    que_significa: "El rango óptimo es 50 a 120 mg/dL. Es mejor predictor de riesgo cardiovascular que el LDL solo.",
    recomendacion: "Una dieta baja en grasas saturadas y el ejercicio son clave.",
    referencia:    "European Heart Journal - Apolipoprotein B",
    url:           "https://academic.oup.com/eurheartj",
  },

  "INDICE ATEROGENICO": {
    que_es:        "Relación entre el colesterol total y el HDL. Indica qué tan probable es que el colesterol se deposite en las arterias.",
    que_significa: "Menor a 3.5 es óptimo. Entre 3.5 y 4.5 es moderado. Mayor a 4.5 es alto riesgo.",
    recomendacion: "Un índice bajo indica buen equilibrio entre colesterol bueno y malo.",
    referencia:    "Atherosclerosis Journal - Atherogenic Index",
    url:           "https://www.atherosclerosis-journal.com",
  },

  "LIPOPROTEINA A": {
    que_es:        "Partícula especial de colesterol determinada genéticamente. Niveles altos son factor de riesgo cardiovascular independiente.",
    que_significa: "Menos de 75 nmol/L es aceptable. Un resultado muy bajo es favorable.",
    recomendacion: "Los niveles son principalmente genéticos. Comenta con tu médico si tienes antecedentes familiares.",
    referencia:    "European Atherosclerosis Society - Lipoprotein(a)",
    url:           "https://www.europeanheartjournal.com",
  },

}