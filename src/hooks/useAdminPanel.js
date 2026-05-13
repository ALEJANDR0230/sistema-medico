import { useState, useEffect } from "react"

const API = "https://69e9c1ee15c7e2d51268ad00.mockapi.io/Clinica/Usuarios"

export function useAdminPanel() {
  const [medicos, setMedicos]               = useState([])
  const [cargando, setCargando]             = useState(true)
  const [modalAbierto, setModalAbierto]     = useState(false)
  const [medicoEditando, setMedicoEditando] = useState(null)
  
  const [form, setForm] = useState({
    nombre: "",
    correo: "",
    password: "",
    telefono: "",
    cedula_profesional: "",
    especialidad: "",
    rol: "medico",
    activo: true
  })

  useEffect(() => { cargarMedicos() }, [])

  const cargarMedicos = async () => {
    setCargando(true)
    const res   = await fetch(API)
    const datos = await res.json()
    setMedicos(datos.filter((u) => u.rol === "medico"))
    setCargando(false)
  }

  const handleGuardar = async (formData) => {
    const dataToSend = formData || form

    if (!dataToSend.nombre || !dataToSend.correo || !dataToSend.password) {
      alert("Nombre, correo y contraseña son obligatorios")
      return
    }

    if (medicoEditando) {
      await fetch(`${API}/${medicoEditando.id}`, {
        method:  "PUT",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify(dataToSend),
      })
    } else {
      await fetch(API, {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({
          ...dataToSend,
          rol: "medico",
          activo: true
        }),
      })
    }
    cerrarModal()
    cargarMedicos()
  }

  const handleDesactivar = async (medico) => {
    if (!confirm(`¿Desactivar a ${medico.nombre}?`)) return
    await fetch(`${API}/${medico.id}`, {
      method:  "PUT",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify({ ...medico, activo: false }),
    })
    cargarMedicos()
  }

  const handleReactivar = async (medico) => {
    await fetch(`${API}/${medico.id}`, {
      method:  "PUT",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify({ ...medico, activo: true }),
    })
    cargarMedicos()
  }

  const abrirModalNuevo = () => {
    setMedicoEditando(null)
    setForm({
      nombre: "",
      correo: "",
      password: "",
      telefono: "",
      cedula_profesional: "",
      especialidad: "",
      rol: "medico",
      activo: true
    })
    setModalAbierto(true)
  }

  const abrirModalEditar = (medico) => {
    setMedicoEditando(medico)
    setForm({
      nombre: medico.nombre || "",
      correo: medico.correo || "",
      password: medico.password || "",
      telefono: medico.telefono || "",
      cedula_profesional: medico.cedula_profesional || "",
      especialidad: medico.especialidad || "",
      rol: medico.rol || "medico",
      activo: medico.activo ?? true
    })
    setModalAbierto(true)
  }

  const cerrarModal = () => {
    setModalAbierto(false)
    setMedicoEditando(null)
  }

  return {
    medicos,
    cargando,
    modalAbierto,
    medicoEditando,
    form,
    setForm,
    handleGuardar,
    handleDesactivar,
    handleReactivar,
    abrirModalNuevo,
    abrirModalEditar,
    cerrarModal
  }
}