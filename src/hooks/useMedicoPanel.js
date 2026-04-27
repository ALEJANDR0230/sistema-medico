import { useState, useEffect } from "react"

const API = "https://69e9c1ee15c7e2d51268ad00.mockapi.io/Clinica/Usuarios"

export function useMedicoPanel(usuario) {
  const [pacientes, setPacientes]       = useState([])
  const [seleccionado, setSeleccionado] = useState(null)
  const [opinion, setOpinion]           = useState("")
  const [enviando, setEnviando]         = useState(false)
  const [exito, setExito]               = useState(false)

  useEffect(() => { cargarPacientes() }, [])

  const cargarPacientes = async () => {
    const res   = await fetch(API)
    const datos = await res.json()
    setPacientes(datos.filter((u) => u.rol === "paciente"))
  }

  const seleccionarPaciente = (p) => {
    setSeleccionado(p)
    setOpinion("")
    setExito(false)
  }

  const handleEnviarOpinion = async () => {
    if (!opinion.trim()) {
      alert("Escribe una opinión antes de enviar")
      return
    }
    setEnviando(true)
    await fetch(`${API}/${seleccionado.id}`, {
      method:  "PUT",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify({
        ...seleccionado,
        opinion_medico: opinion,
        fecha_opinion:  new Date().toLocaleDateString("es-MX"),
        medico_nombre:  usuario.nombre,
      }),
    })
    setEnviando(false)
    setExito(true)
    setOpinion("")
    cargarPacientes()
    setTimeout(() => setExito(false), 3000)
  }

  return {
    pacientes, seleccionado, opinion, setOpinion,
    enviando, exito, seleccionarPaciente, handleEnviarOpinion
  }
}