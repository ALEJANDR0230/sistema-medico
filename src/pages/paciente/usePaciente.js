
import { useState, useEffect } from "react"
import { URL_API, RANGOS_REFERENCIA } from "../../constantes/catalogos"

export function usePaciente(usuario) {

  const [datos,    setDatos]    = useState(null)
  const [cargando, setCargando] = useState(true)

  // Cargar datos al montar el componente
  useEffect(() => {
    cargarDatos()
  }, [])

  // ── FUNCIÓN: traer el perfil del paciente desde MockAPI ───────
  const cargarDatos = async () => {
    setCargando(true)
    try {
      const res    = await fetch(URL_API + "/" + usuario.id)
      const perfil = await res.json()
      setDatos(perfil)
    } catch {
      console.error("Error al cargar datos del paciente")
    } finally {
      setCargando(false)
    }
  }

  // ── EXTRACCIÓN DE CAMPOS ──────────────────────────────────────
  // Extraer cada campo del objeto datos de forma segura
  const resultados   = datos?.estudio?.resultados  ?? null
  const pacienteInfo = datos?.estudio?.paciente     ?? null
  const resumen      = datos?.estudio?.resumen      ?? null
  const dieta        = datos?.dieta_recomendada     ?? null
  const historial    = datos?.historial             ?? []

  // ── FUNCIÓN: semáforo de colores por analito ──────────────────
  // Recibe un analito y devuelve su color según el estado
  const semaforo = (analito) => {

    // El laboratorio ya determinó el estado
    if (analito.estatus === "normal") return "green"
    if (analito.estatus === "alto")   return "red"
    if (analito.estatus === "bajo")   return "yellow"

    // El laboratorio no dio rango — usamos nuestros rangos internos
    if (analito.estatus === "sin_referencia") {
      const rango = RANGOS_REFERENCIA[analito.analito]
      if (!rango) return "gray" // no tenemos rango para este analito

      const valor = analito.valor_numerico
      if (valor > rango.ref_high || valor < rango.ref_low) return "red"
      return "green"
    }

    return "gray"
  }

  return {
    datos,
    cargando,
    resultados,
    pacienteInfo,
    resumen,
    dieta,
    historial,
    semaforo,
    cargarDatos,
  }
}