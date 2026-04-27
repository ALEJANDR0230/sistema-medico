import { useState, useEffect } from "react"

const API = "https://69e9c1ee15c7e2d51268ad00.mockapi.io/Clinica/Usuarios"

const FOTO_HEADER = "https://images.unsplash.com/photo-1538108149393-fbbd81895907?w=1200&auto=format&fit=crop&q=80"

const FOTOS_AVATAR = [
  "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=80&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=80&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1551601651-2a8555f1a136?w=80&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=80&auto=format&fit=crop&q=80",
]

const ESPECIALIDADES = [
  { value: "",                  label: "Sin especialidad" },
  { value: "Medicina General",  label: "Medicina General" },
  { value: "Cardiologia",       label: "Cardiologia" },
  { value: "Endocrinologia",    label: "Endocrinologia" },
  { value: "Hematologia",       label: "Hematologia" },
  { value: "Nefrologia",        label: "Nefrologia" },
  { value: "Hepatologia",       label: "Hepatologia" },
  { value: "Nutricion",         label: "Nutricion" },
]

const FORM_VACIO = {
  nombre:            "",
  correo:            "",
  password:          "",
  especialidad:      "",
  cedula_profesional:"",
  rol:               "medico",
  activo:            true,
}

function BadgeEspecialidad({ especialidad }) {
  if (!especialidad) return (
    <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-400 font-medium">
      Sin especialidad
    </span>
  )
  return (
    <span className="text-xs px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 font-medium">
      {especialidad}
    </span>
  )
}

function BadgeCedula({ cedula }) {
  if (!cedula) return (
    <span className="text-xs px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 font-medium">
      Sin cedula
    </span>
  )
  return (
    <span className="text-xs px-2 py-0.5 rounded-full bg-green-100 text-green-700 font-medium">
      Ced. {cedula}
    </span>
  )
}

function AdminPanel({ usuario, onLogout }) {
  const [medicos, setMedicos]               = useState([])
  const [cargando, setCargando]             = useState(true)
  const [modalAbierto, setModalAbierto]     = useState(false)
  const [medicoEditando, setMedicoEditando] = useState(null)
  const [busqueda, setBusqueda]             = useState("")
  const [filtro, setFiltro]                 = useState("todos")
  const [filtroEsp, setFiltroEsp]           = useState("")
  const [errores, setErrores]               = useState({})
  const [form, setForm]                     = useState(FORM_VACIO)

  useEffect(() => { cargarMedicos() }, [])

  const cargarMedicos = async () => {
    setCargando(true)
    const res   = await fetch(API)
    const datos = await res.json()
    setMedicos(datos.filter((u) => u.rol === "medico"))
    setCargando(false)
  }

  const validarForm = () => {
    const e = {}
    if (!form.nombre.trim())   e.nombre = "El nombre es obligatorio"
    if (!form.correo.includes("@")) e.correo = "Ingresa un correo valido"
    if (!medicoEditando && form.password.length < 6)
      e.password = "La contrasena debe tener al menos 6 caracteres"
    if (form.cedula_profesional && !/^\d{6,8}$/.test(form.cedula_profesional))
      e.cedula_profesional = "La cedula debe tener entre 6 y 8 digitos numericos"
    setErrores(e)
    return Object.keys(e).length === 0
  }

  const handleGuardar = async () => {
    if (!validarForm()) return
    const payload = {
      ...form,
      especialidad:       form.especialidad       || "",
      cedula_profesional: form.cedula_profesional || "",
    }
    if (medicoEditando) {
      await fetch(API + "/" + medicoEditando.id, {
        method: "PUT", headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
    } else {
      await fetch(API, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...payload, rol: "medico", activo: true }),
      })
    }
    cerrarModal()
    cargarMedicos()
  }

  const handleDesactivar = async (medico) => {
    if (!confirm("Desactivar a " + medico.nombre + "?")) return
    await fetch(API + "/" + medico.id, {
      method: "PUT", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...medico, activo: false }),
    })
    cargarMedicos()
  }

  const handleReactivar = async (medico) => {
    await fetch(API + "/" + medico.id, {
      method: "PUT", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...medico, activo: true }),
    })
    cargarMedicos()
  }

  const abrirModalNuevo = () => {
    setMedicoEditando(null)
    setForm(FORM_VACIO)
    setErrores({})
    setModalAbierto(true)
  }

  const abrirModalEditar = (medico) => {
    setMedicoEditando(medico)
    setForm({
      nombre:             medico.nombre             || "",
      correo:             medico.correo             || "",
      password:           medico.password           || "",
      especialidad:       medico.especialidad       || "",
      cedula_profesional: medico.cedula_profesional || "",
      rol:                "medico",
      activo:             medico.activo,
    })
    setErrores({})
    setModalAbierto(true)
  }

  const cerrarModal = () => {
    setModalAbierto(false)
    setMedicoEditando(null)
    setErrores({})
  }

  const actualizar = (campo, valor) => {
    setForm({ ...form, [campo]: valor })
    setErrores({ ...errores, [campo]: "" })
  }

  const medicosFiltrados = medicos.filter((m) => {
    const coincideBusqueda = (
      m.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      m.correo.toLowerCase().includes(busqueda.toLowerCase()) ||
      (m.cedula_profesional || "").includes(busqueda)
    )
    const coincideEstatus =
      filtro === "todos"    ? true :
      filtro === "activos"  ? m.activo === true :
      m.activo === false
    const coincideEsp =
      filtroEsp === "" ? true : (m.especialidad || "") === filtroEsp
    return coincideBusqueda && coincideEstatus && coincideEsp
  })

  const totalActivos   = medicos.filter((m) => m.activo).length
  const totalInactivos = medicos.filter((m) => !m.activo).length

  return (
    <div className="min-h-screen bg-gray-100">

      <div
        className="relative h-60 bg-cover bg-center"
        style={{ backgroundImage: "url(" + FOTO_HEADER + ")" }}
      >
        <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, rgba(29,62,130,0.85) 0%, rgba(15,110,86,0.75) 100%)" }} />
        <div className="relative z-10 flex justify-between items-start px-8 pt-6">
          <div>
            <p className="text-white text-xs font-medium opacity-70 uppercase tracking-wider mb-1">Sistema Medico</p>
            <h1 className="text-white text-2xl font-bold">Panel Administrador</h1>
            <p className="text-white text-sm opacity-80 mt-1">Bienvenido, {usuario.nombre}</p>
          </div>
          <button
            onClick={onLogout}
            className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-xl text-sm font-medium backdrop-blur-sm transition-colors border border-white/30"
          >
            Cerrar sesion
          </button>
        </div>

        <div className="relative z-10 flex gap-4 px-8 mt-4">
          {[
            [medicos.length, "Total medicos"],
            [totalActivos,   "Activos"],
            [totalInactivos, "Inactivos"],
          ].map(([num, label]) => (
            <div key={label} className="bg-white/20 backdrop-blur-sm border border-white/30 rounded-xl px-5 py-3 text-center">
              <p className="text-white text-2xl font-bold">{num}</p>
              <p className="text-white text-xs opacity-80">{label}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 -mt-2 pb-10">
        <div className="bg-white rounded-2xl shadow-lg p-6">

          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-5">
            <div>
              <h2 className="text-lg font-bold text-gray-800">Personal Medico</h2>
              <p className="text-sm text-gray-400">Gestiona el equipo de doctores de la clinica</p>
            </div>
            <button
              onClick={abrirModalNuevo}
              className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl text-sm font-medium transition-colors shadow-md"
            >
              + Nuevo medico
            </button>
          </div>

          <div className="flex flex-wrap gap-3 mb-5">
            <input
              type="text"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              placeholder="Buscar por nombre, correo o cedula..."
              className="flex-1 min-w-48 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
            />
            <div className="flex gap-2">
              {[["todos","Todos"],["activos","Activos"],["inactivos","Inactivos"]].map(([val, label]) => (
                <button
                  key={val}
                  onClick={() => setFiltro(val)}
                  className={"px-3 py-2 rounded-xl text-xs font-medium transition-colors " +
                    (filtro === val ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200")}
                >
                  {label}
                </button>
              ))}
            </div>
            <select
              value={filtroEsp}
              onChange={(e) => setFiltroEsp(e.target.value)}
              className="border border-gray-200 rounded-xl px-3 py-2 text-xs text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
            >
              <option value="">Todas las especialidades</option>
              {ESPECIALIDADES.filter((e) => e.value !== "").map((e) => (
                <option key={e.value} value={e.value}>{e.label}</option>
              ))}
            </select>
          </div>

          {cargando ? (
            <div className="py-16 text-center">
              <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-3" />
              <p className="text-gray-400 text-sm">Cargando medicos...</p>
            </div>
          ) : medicosFiltrados.length === 0 ? (
            <div className="py-16 text-center">
              <p className="text-4xl mb-3">👨‍⚕️</p>
              <p className="text-gray-500 font-medium">No se encontraron medicos</p>
              <p className="text-gray-400 text-sm mt-1">Intenta con otro filtro o agrega uno nuevo</p>
            </div>
          ) : (
            <div className="space-y-3">
              {medicosFiltrados.map((m, i) => (
                <div
                  key={m.id}
                  className="flex items-center gap-4 p-4 border border-gray-100 rounded-2xl hover:bg-gray-50 transition-colors"
                >
                  <img
                    src={FOTOS_AVATAR[i % FOTOS_AVATAR.length]}
                    alt={m.nombre}
                    className="w-12 h-12 rounded-full object-cover border-2 border-gray-200 flex-shrink-0"
                  />

                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-800 text-sm">{m.nombre}</p>
                    <p className="text-xs text-gray-400 truncate mb-1">{m.correo}</p>
                    <div className="flex gap-2 flex-wrap">
                      <BadgeEspecialidad especialidad={m.especialidad} />
                      <BadgeCedula cedula={m.cedula_profesional} />
                    </div>
                  </div>

                  <span className={"text-xs px-3 py-1 rounded-full font-medium flex-shrink-0 " +
                    (m.activo ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600")}>
                    {m.activo ? "Activo" : "Inactivo"}
                  </span>

                  <div className="flex gap-2 flex-shrink-0">
                    <button
                      onClick={() => abrirModalEditar(m)}
                      className="bg-amber-100 hover:bg-amber-200 text-amber-700 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors"
                    >
                      Editar
                    </button>
                    {m.activo ? (
                      <button
                        onClick={() => handleDesactivar(m)}
                        className="bg-red-100 hover:bg-red-200 text-red-600 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors"
                      >
                        Desactivar
                      </button>
                    ) : (
                      <button
                        onClick={() => handleReactivar(m)}
                        className="bg-green-100 hover:bg-green-200 text-green-700 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors"
                      >
                        Reactivar
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {modalAbierto && (
        <div
          className="fixed inset-0 flex items-center justify-center z-50"
          style={{ background: "rgba(0,0,0,0.5)" }}
          onClick={(e) => e.target === e.currentTarget && cerrarModal()}
        >
          <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-md mx-4 max-h-screen overflow-y-auto">

            <div className="flex justify-between items-center mb-5">
              <h3 className="text-lg font-bold text-gray-800">
                {medicoEditando ? "Editar medico" : "Registrar nuevo medico"}
              </h3>
              <button
                onClick={cerrarModal}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 text-sm transition-colors"
              >
                x
              </button>
            </div>

            <div className="space-y-4">

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nombre completo <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={form.nombre}
                  onChange={(e) => actualizar("nombre", e.target.value)}
                  className={"w-full border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 " +
                    (errores.nombre ? "border-red-400 bg-red-50" : "border-gray-300")}
                  placeholder="Dr. Nombre Apellido"
                />
                {errores.nombre && (
                  <p className="text-xs text-red-500 mt-1">{errores.nombre}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Correo electronico <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  value={form.correo}
                  onChange={(e) => actualizar("correo", e.target.value)}
                  className={"w-full border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 " +
                    (errores.correo ? "border-red-400 bg-red-50" : "border-gray-300")}
                  placeholder="doctor@clinica.com"
                />
                {errores.correo && (
                  <p className="text-xs text-red-500 mt-1">{errores.correo}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {medicoEditando ? "Nueva contrasena (dejar vacio para no cambiar)" : "Contrasena temporal"}
                  {!medicoEditando && <span className="text-red-500"> *</span>}
                </label>
                <input
                  type="text"
                  value={form.password}
                  onChange={(e) => actualizar("password", e.target.value)}
                  className={"w-full border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 " +
                    (errores.password ? "border-red-400 bg-red-50" : "border-gray-300")}
                  placeholder={medicoEditando ? "Dejar vacio para no cambiar" : "Minimo 6 caracteres"}
                />
                {errores.password && (
                  <p className="text-xs text-red-500 mt-1">{errores.password}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Especialidad
                </label>
                <select
                  value={form.especialidad}
                  onChange={(e) => actualizar("especialidad", e.target.value)}
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-700"
                >
                  {ESPECIALIDADES.map((e) => (
                    <option key={e.value} value={e.value}>{e.label}</option>
                  ))}
                </select>
                <p className="text-xs text-gray-400 mt-1">
                  Opcional — selecciona la especialidad del medico o dejala en blanco
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Cedula profesional
                </label>
                <input
                  type="text"
                  value={form.cedula_profesional}
                  onChange={(e) => actualizar("cedula_profesional", e.target.value.replace(/\D/g, ""))}
                  className={"w-full border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 " +
                    (errores.cedula_profesional ? "border-red-400 bg-red-50" : "border-gray-300")}
                  placeholder="Ej: 1234567"
                  maxLength={8}
                />
                {errores.cedula_profesional ? (
                  <p className="text-xs text-red-500 mt-1">{errores.cedula_profesional}</p>
                ) : (
                  <p className="text-xs text-gray-400 mt-1">
                    Opcional — solo numeros, entre 6 y 8 digitos
                  </p>
                )}
              </div>

            </div>

            <div className="mt-4 p-3 bg-gray-50 border border-gray-200 rounded-xl">
              <p className="text-xs text-gray-500">
                Los campos marcados con <span className="text-red-500 font-bold">*</span> son obligatorios.
                La especialidad y cedula son opcionales pero recomendables para validar al medico.
              </p>
            </div>

            <div className="flex gap-3 mt-5">
              <button
                onClick={cerrarModal}
                className="flex-1 border border-gray-300 text-gray-600 py-3 rounded-xl text-sm hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleGuardar}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl text-sm font-medium shadow-md transition-colors"
              >
                {medicoEditando ? "Guardar cambios" : "Crear medico"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminPanel