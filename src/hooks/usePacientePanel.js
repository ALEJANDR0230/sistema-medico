import { useState, useEffect } from "react"

const API = "https://69e9c1ee15c7e2d51268ad00.mockapi.io/Clinica/Usuarios"

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
}

export const EXPLICACIONES = {
  "COLESTEROL": {
    que_es: "El colesterol es una grasa natural que produce tu higado. Es necesario para formar celulas, pero en exceso puede acumularse en las arterias.",
    que_significa: "Menos de 200 mg/dL es normal. Tu nivel indica bajo riesgo cardiovascular.",
    recomendacion: "Manten una dieta baja en grasas saturadas, haz ejercicio regularmente y evita el tabaco.",
    referencia: "American Heart Association - Heart Disease and Stroke Statistics 2023",
    url: "https://www.heart.org/en/health-topics/cholesterol"
  },
  "TRIGLICERIDOS": {
    que_es: "Los trigliceridos son grasas que el cuerpo almacena como energia. Vienen principalmente de los alimentos que consumes.",
    que_significa: "Menos de 150 mg/dL es normal. Niveles altos se asocian con riesgo de enfermedades del corazon.",
    recomendacion: "Reduce el consumo de azucar, alcohol y carbohidratos refinados.",
    referencia: "National Heart, Lung, and Blood Institute - Triglycerides",
    url: "https://www.nhlbi.nih.gov/health/blood-tests/triglycerides"
  },
  "HDL COLESTEROL": {
    que_es: "El HDL es el colesterol bueno. Recoge el exceso de colesterol de las arterias y lo lleva al higado para eliminarlo.",
    que_significa: "Mayor a 40 mg/dL en hombres es aceptable. Mas de 60 mg/dL se considera protector del corazon.",
    recomendacion: "El ejercicio fisico regular es la mejor forma de aumentar el HDL.",
    referencia: "Mayo Clinic - HDL cholesterol",
    url: "https://www.mayoclinic.org/diseases-conditions/high-blood-cholesterol/in-depth/hdl-cholesterol/art-20046388"
  },
  "LDL COLESTEROL": {
    que_es: "El LDL es el colesterol malo. En exceso se deposita en las paredes de las arterias formando placas.",
    que_significa: "Menos de 100 mg/dL es optimo. Entre 100-129 esta cerca del optimo.",
    recomendacion: "Evita grasas trans como frituras y comida procesada.",
    referencia: "American College of Cardiology - LDL Cholesterol Guidelines",
    url: "https://www.acc.org"
  },
  "VLDL COLESTEROL": {
    que_es: "El VLDL transporta trigliceridos desde el higado hacia los tejidos.",
    que_significa: "El rango normal es 15-35 mg/dL. Niveles elevados aumentan el riesgo cardiovascular.",
    recomendacion: "Reducir azucar y alcohol ayuda a bajar el VLDL.",
    referencia: "Cleveland Clinic - VLDL Cholesterol",
    url: "https://my.clevelandclinic.org/health/articles/11920-vldl-cholesterol"
  },
  "COLESTEROL NO-HDL": {
    que_es: "Es la suma de todos los tipos de colesterol malo. Indicador mas completo del riesgo cardiovascular.",
    que_significa: "Debe ser menor a 130 mg/dL.",
    recomendacion: "Manten tu dieta actual si el valor es bajo.",
    referencia: "National Lipid Association - Non-HDL Cholesterol",
    url: "https://www.lipid.org"
  },
  "PROTEINA C REACTIVA": {
    que_es: "Producida por el higado cuando hay inflamacion en el cuerpo. Es un marcador general de inflamacion.",
    que_significa: "El rango normal es 0-5 mg/L. Un valor bajo indica que no hay inflamacion significativa.",
    recomendacion: "Duerme bien, haz ejercicio y evita el estres cronico.",
    referencia: "Harvard Health Publishing - C-reactive protein",
    url: "https://www.health.harvard.edu/heart-health/c-reactive-protein-test-to-screen-for-heart-disease"
  },
  "PROTEINA C REACTIVA HS": {
    que_es: "Detecta niveles muy bajos de inflamacion que podrian indicar riesgo cardiovascular.",
    que_significa: "Menos de 1 mg/L es riesgo bajo. Entre 1-3 es moderado. Mayor a 3 es alto riesgo.",
    recomendacion: "Un resultado bajo indica riesgo cardiovascular muy bajo.",
    referencia: "American Heart Association - Inflammation and Heart Disease",
    url: "https://www.heart.org/en/health-topics/consumer-healthcare/what-is-cardiovascular-disease/inflammation-and-heart-disease"
  },
  "APOLIPOPROTEINA B": {
    que_es: "La proteina principal del LDL. Refleja el numero de particulas aterogenicas en la sangre.",
    que_significa: "El rango optimo es 50-120 mg/dL.",
    recomendacion: "Una dieta baja en grasas saturadas y el ejercicio son clave.",
    referencia: "European Heart Journal - Apolipoprotein B",
    url: "https://academic.oup.com/eurheartj"
  },
  "INDICE ATEROGENICO": {
    que_es: "Relacion entre colesterol total y HDL. Indica probabilidad de deposito en arterias.",
    que_significa: "Menor a 3.5 es optimo. Entre 3.5-4.5 es moderado. Mayor a 4.5 es alto riesgo.",
    recomendacion: "Un indice bajo indica buen equilibrio entre colesterol bueno y malo.",
    referencia: "Atherosclerosis Journal - Atherogenic Index",
    url: "https://www.atherosclerosis-journal.com"
  },
  "LIPOPROTEINA A": {
    que_es: "Particula especial de colesterol determinada geneticamente. Niveles altos son factor de riesgo independiente.",
    que_significa: "Menos de 75 nmol/L es aceptable.",
    recomendacion: "Los niveles son principalmente geneticos. Comenta con tu medico si tienes antecedentes familiares.",
    referencia: "European Atherosclerosis Society - Lipoprotein(a)",
    url: "https://www.europeanheartjournal.com"
  },
}

export const DIETAS_INFO = {
  colesterol_alto: {
    titulo: "Dieta para colesterol elevado",
    foto: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&auto=format&fit=crop&q=80",
    comer: ["Avena y cereales integrales","Salmon y atun (omega-3)","Nueces y aguacate","Aceite de oliva","Espinaca y brocoli","Lentejas y frijoles"],
    evitar: ["Carnes rojas y embutidos","Lacteos enteros","Frituras y comida rapida","Reposteria industrial"],
    consejo: "Caminar 30 minutos diarios puede reducir el colesterol LDL hasta un 10% en 3 meses.",
  },
  trigliceridos_altos: {
    titulo: "Dieta para trigliceridos elevados",
    foto: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=600&auto=format&fit=crop&q=80",
    comer: ["Pescados grasos 2-3 veces/semana","Verduras sin almidon","Proteinas magras","Semillas de chia y linaza","Aguacate con moderacion"],
    evitar: ["Azucar y refrescos","Pan blanco y arroz blanco","Jugos de fruta","Alcohol","Frutas muy dulces en exceso"],
    consejo: "Eliminar el alcohol y el azucar por 3 semanas puede reducir los trigliceridos hasta un 30%.",
  },
  glucosa_alta: {
    titulo: "Dieta para glucosa elevada",
    foto: "https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=600&auto=format&fit=crop&q=80",
    comer: ["Verduras de hoja verde","Proteinas magras en cada comida","Avena y quinoa","Canela","Leguminosas","Fresas y manzanas"],
    evitar: ["Azucar y miel en exceso","Pan blanco y tortillas de harina","Refrescos y jugos","Papas fritas","Cereales azucarados"],
    consejo: "Comer cada 3-4 horas en porciones moderadas ayuda a mantener el azucar estable.",
  },
  general: {
    titulo: "Dieta equilibrada saludable",
    foto: "https://images.unsplash.com/photo-1547592180-85f173990554?w=600&auto=format&fit=crop&q=80",
    comer: ["Verduras de colores variados","Frutas frescas de temporada","Proteinas magras","Granos enteros","Grasas saludables","Agua minimo 2 litros"],
    evitar: ["Ultraprocesados y comida rapida","Azucar y refrescos en exceso","Sal en exceso","Alcohol","Grasas trans"],
    consejo: "El plato saludable: la mitad verduras, un cuarto proteinas, un cuarto granos enteros.",
  },
}

export function usePacientePanel(usuario) {
  const [datos, setDatos]       = useState(null)
  const [cargando, setCargando] = useState(true)

  useEffect(() => { cargarDatos() }, [])

  const cargarDatos = async () => {
    setCargando(true)
    const res    = await fetch(API + "/" + usuario.id)
    const perfil = await res.json()
    setDatos(perfil)
    setCargando(false)
  }

  const resultados   = datos && datos.estudio   ? datos.estudio.resultados : null
  const pacienteInfo = datos && datos.estudio   ? datos.estudio.paciente   : null
  const resumen      = datos && datos.estudio   ? datos.estudio.resumen    : null
  const dieta        = datos && datos.dieta_recomendada ? datos.dieta_recomendada : null
  const historial    = datos && datos.historial ? datos.historial          : []

  const semaforo = (analito) => {
    if (analito.estatus === "normal") return "green"
    if (analito.estatus === "alto")   return "red"
    if (analito.estatus === "bajo")   return "yellow"
    if (analito.estatus === "sin_referencia") {
      const r = RANGOS_REFERENCIA[analito.analito]
      if (!r) return "gray"
      const v = analito.valor_numerico
      if (v > r.ref_high || v < r.ref_low) return "red"
      return "green"
    }
    return "gray"
  }

  return { datos, cargando, resultados, pacienteInfo, resumen, dieta, historial, semaforo, cargarDatos }
}