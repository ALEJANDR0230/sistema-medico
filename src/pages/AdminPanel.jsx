
import { useState, useEffect } from "react"
import { URL_API, ESPECIALIDADES_BASE } from "../constantes/catalogos"
import {
  botonPrimario, botonSecundario,
  botonAmbar, botonRojoSuave, botonVerdeSuave,
  inputBase, inputError, inputDeshabilitado,
  selectBase, labelCampo, textoError, textoAyuda,
  spinnerClase,
} from "../estilos/clases"

// ── CONSTANTES LOCALES ────────────────────────────────────────

const FOTO_ENCABEZADO = "https://images.unsplash.com/photo-1538108149393-fbbd81895907?w=1200&auto=format&fit=crop&q=80"

const FOTOS_AVATAR = [
  "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=80&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=80&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1551601651-2a8555f1a136?w=80&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=80&auto=format&fit=crop&q=80",
]

const FORMULARIO_VACIO = {
  nombre:             "",
  correo:             "",
  password:           "",
  especialidad:       "",
  especialidadNueva:  "",   // campo para escribir una especialidad que no esta en la lista
  cedula_profesional: "",
  rol:                "medico",
  activo:             true,
}

// ─────────────────────────────────────────────────────────────
//  SUBCOMPONENTE: Encabezado con foto y estadísticas
// ─────────────────────────────────────────────────────────────
function Encabezado({ nombreAdmin, onLogout, totalMedicos, activos, inactivos }) {
  return (
    <div
      className="relative h-44 bg-cover bg-center"
      style={{ backgroundImage: "url(" + FOTO_ENCABEZADO + ")" }}
    >
      <div
        className="absolute inset-0"
        style={{ background: "linear-gradient(135deg, rgba(29,62,130,0.85) 0%, rgba(15,110,86,0.75) 100%)" }}
      />
      <div className="relative z-10 flex justify-between items-start px-8 pt-6">
        <div>
          <p className="text-white text-xs font-medium opacity-70 uppercase tracking-wider mb-1">
            Sistema Médico
          </p>
          <h1 className="text-white text-2xl font-bold">Panel Administrador</h1>
          <p className="text-white text-sm opacity-80 mt-1">Bienvenido, {nombreAdmin}</p>
        </div>
        <button
          onClick={onLogout}
          className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-xl text-sm font-medium backdrop-blur-sm transition-colors border border-white/30"
        >
          Cerrar sesión
        </button>
      </div>
      <div className="relative z-10 flex gap-4 px-8 mt-4">
        {[
          [totalMedicos, "Total médicos"],
          [activos,      "Activos"],
          [inactivos,    "Inactivos"],
        ].map(([numero, etiqueta]) => (
          <div
            key={etiqueta}
            className="bg-white/20 backdrop-blur-sm border border-white/30 rounded-xl px-5 py-3 text-center"
          >
            <p className="text-white text-2xl font-bold">{numero}</p>
            <p className="text-white text-xs opacity-80">{etiqueta}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────
//  SUBCOMPONENTE: Barra de búsqueda y filtros
// ─────────────────────────────────────────────────────────────
function BarraBusqueda({
  busqueda, onBusqueda,
  filtroEstatus, onFiltroEstatus,
  filtroEsp, onFiltroEsp,
  especialidades,
}) {
  return (
    <div className="flex flex-wrap gap-3 mb-5">

      <input
        type="text"
        value={busqueda}
        onChange={(e) => onBusqueda(e.target.value)}
        placeholder="Buscar por nombre, correo o cédula..."
        className="flex-1 min-w-48 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
      />

      <div className="flex gap-2">
        {[
          ["todos",     "Todos"],
          ["activos",   "Activos"],
          ["inactivos", "Inactivos"],
        ].map(([valor, etiqueta]) => (
          <button
            key={valor}
            onClick={() => onFiltroEstatus(valor)}
            className={"px-3 py-2 rounded-xl text-xs font-medium transition-colors " +
              (filtroEstatus === valor
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200")}
          >
            {etiqueta}
          </button>
        ))}
      </div>

      <select
        value={filtroEsp}
        onChange={(e) => onFiltroEsp(e.target.value)}
        className="border border-gray-200 rounded-xl px-3 py-2 text-xs text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
      >
        <option value="">Todas las especialidades</option>
        {especialidades.filter((e) => e.valor !== "").map((e) => (
          <option key={e.valor} value={e.valor}>{e.etiqueta}</option>
        ))}
      </select>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────
//  SUBCOMPONENTE: Badge de especialidad
// ─────────────────────────────────────────────────────────────
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

// ─────────────────────────────────────────────────────────────
//  SUBCOMPONENTE: Badge de cédula profesional
// ─────────────────────────────────────────────────────────────
function BadgeCedula({ cedula }) {
  if (!cedula) return (
    <span className="text-xs px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 font-medium">
      Sin cédula
    </span>
  )
  return (
    <span className="text-xs px-2 py-0.5 rounded-full bg-green-100 text-green-700 font-medium">
      Céd. {cedula}
    </span>
  )
}

// ─────────────────────────────────────────────────────────────
//  SUBCOMPONENTE: Fila de un médico en la lista
// ─────────────────────────────────────────────────────────────
function FilaMedico({ medico, indice, onEditar, onDesactivar, onReactivar }) {
  return (
    <div className="flex items-center gap-4 p-4 border border-gray-100 rounded-2xl hover:bg-gray-50 transition-colors">

      <img
        src={FOTOS_AVATAR[indice % FOTOS_AVATAR.length]}
        alt={medico.nombre}
        className="w-12 h-12 rounded-full object-cover border-2 border-gray-200 flex-shrink-0"
      />

      <div className="flex-1 min-w-0">
        <p className="font-semibold text-gray-800 text-sm">{medico.nombre}</p>
        <p className="text-xs text-gray-400 truncate mb-1">{medico.correo}</p>
        <div className="flex gap-2 flex-wrap">
          <BadgeEspecialidad especialidad={medico.especialidad} />
          <BadgeCedula      cedula={medico.cedula_profesional} />
        </div>
      </div>

      <span className={"text-xs px-3 py-1 rounded-full font-medium flex-shrink-0 " +
        (medico.activo
          ? "bg-green-100 text-green-700"
          : "bg-red-100 text-red-600")}>
        {medico.activo ? "Activo" : "Inactivo"}
      </span>

      <div className="flex gap-2 flex-shrink-0">
        <button onClick={() => onEditar(medico)} className={botonAmbar}>
          Editar
        </button>
        {medico.activo ? (
          <button onClick={() => onDesactivar(medico)} className={botonRojoSuave}>
            Desactivar
          </button>
        ) : (
          <button onClick={() => onReactivar(medico)} className={botonVerdeSuave}>
            Reactivar
          </button>
        )}
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────
//  SUBCOMPONENTE: Formulario dentro del modal
//  Contiene todos los campos y la lógica de especialidad nueva
// ─────────────────────────────────────────────────────────────
function FormularioMedico({ form, errores, onChange, modoEdicion, especialidades }) {

  // Saber si el usuario eligió "otra" para mostrar el campo de texto
  const estaAgregandoNueva = form.especialidad === "__nueva__"

  return (
    <div className="space-y-4">

      {/* Nombre — no editable si estamos editando */}
      <div>
        <label className={labelCampo}>
          Nombre completo {!modoEdicion && <span className="text-red-500">*</span>}
        </label>
        {modoEdicion ? (
          // En modo edición el nombre no se puede cambiar
          <div>
            <input
              type="text"
              value={form.nombre}
              disabled
              className={inputDeshabilitado}
            />
            <p className={textoAyuda}>El nombre del médico no se puede modificar.</p>
          </div>
        ) : (
          <div>
            <input
              type="text"
              value={form.nombre}
              onChange={(e) => onChange("nombre", e.target.value)}
              className={errores.nombre ? inputError : inputBase}
              placeholder="Dr. Nombre Apellido"
            />
            {errores.nombre && <p className={textoError}>{errores.nombre}</p>}
          </div>
        )}
      </div>

      {/* Correo */}
      <div>
        <label className={labelCampo}>
          Correo electrónico <span className="text-red-500">*</span>
        </label>
        <input
          type="email"
          value={form.correo}
          onChange={(e) => onChange("correo", e.target.value)}
          className={errores.correo ? inputError : inputBase}
          placeholder="doctor@clinica.com"
        />
        {errores.correo && <p className={textoError}>{errores.correo}</p>}
      </div>

      {/* Contraseña — con ñ correcta */}
      <div>
        <label className={labelCampo}>
          {modoEdicion
            ? "Nueva contraseña (dejar vacío para no cambiar)"
            : "Contraseña *"}
        </label>
        <input
          type="text"
          value={form.password}
          onChange={(e) => onChange("password", e.target.value)}
          className={errores.password ? inputError : inputBase}
          placeholder={modoEdicion ? "Dejar vacío para no cambiar" : "Mínimo 6 caracteres"}
        />
        {errores.password && <p className={textoError}>{errores.password}</p>}
      </div>

      {/* Especialidad con opción de agregar nueva */}
      <div>
        <label className={labelCampo}>Especialidad</label>
        <select
          value={form.especialidad}
          onChange={(e) => onChange("especialidad", e.target.value)}
          className={selectBase}
        >
          {especialidades.map((e) => (
            <option key={e.valor} value={e.valor}>{e.etiqueta}</option>
          ))}
          {/* Opción especial para agregar una que no está en la lista */}
          <option value="__nueva__">+ Agregar otra especialidad...</option>
        </select>

        {/* Campo de texto para la especialidad nueva */}
        {estaAgregandoNueva && (
          <div className="mt-2">
            <input
              type="text"
              value={form.especialidadNueva}
              onChange={(e) => onChange("especialidadNueva", e.target.value)}
              className={inputBase}
              placeholder="Escribe la especialidad nueva"
              autoFocus
            />
            <p className={textoAyuda}>
              Esta especialidad se guardará en el perfil del médico.
            </p>
          </div>
        )}
      </div>

      {/* Cédula profesional */}
      <div>
        <label className={labelCampo}>Cédula profesional</label>
        <input
          type="text"
          value={form.cedula_profesional}
          onChange={(e) => onChange("cedula_profesional", e.target.value.replace(/\D/g, ""))}
          className={errores.cedula_profesional ? inputError : inputBase}
          placeholder="Ej: 1234567"
          maxLength={8}
        />
        {errores.cedula_profesional
          ? <p className={textoError}>{errores.cedula_profesional}</p>
          : <p className={textoAyuda}>Opcional — solo números, entre 6 y 8 dígitos</p>
        }
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────
//  SUBCOMPONENTE: Modal completo (envuelve el formulario)
// ─────────────────────────────────────────────────────────────
function ModalMedico({ abierto, onCerrar, form, errores, onChange, onGuardar, modoEdicion, especialidades }) {
  if (!abierto) return null

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50"
      style={{ background: "rgba(0,0,0,0.5)" }}
      onClick={(e) => e.target === e.currentTarget && onCerrar()}
    >
      <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-md mx-4 max-h-screen overflow-y-auto">

        {/* Encabezado del modal */}
        <div className="flex justify-between items-center mb-5">
          <h3 className="text-lg font-bold text-gray-800">
            {modoEdicion ? "Editar médico" : "Registrar nuevo médico"}
          </h3>
          <button
            onClick={onCerrar}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 text-sm transition-colors"
          >
            x
          </button>
        </div>

        {/* Formulario */}
        <FormularioMedico
          form={form}
          errores={errores}
          onChange={onChange}
          modoEdicion={modoEdicion}
          especialidades={especialidades}
        />

        {/* Nota informativa */}
        <div className="mt-4 p-3 bg-gray-50 border border-gray-200 rounded-xl">
          <p className="text-xs text-gray-500">
            Los campos con <span className="text-red-500 font-bold">*</span> son obligatorios.
            La especialidad y cédula son opcionales.
          </p>
        </div>

        {/* Botones */}
        <div className="flex gap-3 mt-5">
          <button onClick={onCerrar} className={botonSecundario + " flex-1"}>
            Cancelar
          </button>
          <button onClick={onGuardar} className={botonPrimario + " flex-1"}>
            {modoEdicion ? "Guardar cambios" : "Crear médico"}
          </button>
        </div>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────
//  COMPONENTE PRINCIPAL: AdminPanel
// ─────────────────────────────────────────────────────────────
function AdminPanel({ usuario, onLogout }) {

  // ── ESTADO ───────────────────────────────────────────────────
  const [medicos,       setMedicos]       = useState([])
  const [cargando,      setCargando]      = useState(true)
  const [modalAbierto,  setModalAbierto]  = useState(false)
  const [medicoEditar,  setMedicoEditar]  = useState(null)
  const [busqueda,      setBusqueda]      = useState("")
  const [filtroEstatus, setFiltroEstatus] = useState("todos")
  const [filtroEsp,     setFiltroEsp]     = useState("")
  const [errores,       setErrores]       = useState({})
  const [form,          setForm]          = useState(FORMULARIO_VACIO)

  // Lista de especialidades que puede crecer si el admin agrega nuevas
  const [especialidades, setEspecialidades] = useState(ESPECIALIDADES_BASE)

  // ── CARGA INICIAL ─────────────────────────────────────────────
  useEffect(() => { cargarMedicos() }, [])

  const cargarMedicos = async () => {
    setCargando(true)
    const res   = await fetch(URL_API)
    const datos = await res.json()
    setMedicos(datos.filter((u) => u.rol === "medico"))
    setCargando(false)
  }

  // ── VALIDACIÓN ────────────────────────────────────────────────
  const validar = () => {
    const e = {}
    if (!medicoEditar && !form.nombre.trim())
      e.nombre = "El nombre es obligatorio"
    if (!form.correo.includes("@"))
      e.correo = "Ingresa un correo válido"
    if (!medicoEditar && form.password.length < 6)
      e.password = "La contraseña debe tener al menos 6 caracteres"
    if (form.especialidad === "__nueva__" && !form.especialidadNueva.trim())
      e.especialidadNueva = "Escribe el nombre de la nueva especialidad"
    if (form.cedula_profesional && !/^\d{6,8}$/.test(form.cedula_profesional))
      e.cedula_profesional = "La cédula debe tener entre 6 y 8 dígitos"
    setErrores(e)
    return Object.keys(e).length === 0
  }

  // ── GUARDAR (crear o editar) ──────────────────────────────────
  const guardar = async () => {
    if (!validar()) return

    // Si el admin escribió una especialidad nueva, usarla y agregarla al selector
    const especialidadFinal =
      form.especialidad === "__nueva__"
        ? form.especialidadNueva.trim()
        : form.especialidad

    // Agregar la especialidad nueva al selector si no existía antes
    if (form.especialidad === "__nueva__" && especialidadFinal) {
      const yaExiste = especialidades.some((e) => e.valor === especialidadFinal)
      if (!yaExiste) {
        setEspecialidades((prev) => [
          ...prev,
          { valor: especialidadFinal, etiqueta: especialidadFinal },
        ])
      }
    }

    const payload = {
      ...form,
      especialidad:      especialidadFinal,
      especialidadNueva: undefined, // no guardar este campo auxiliar en la API
    }

    if (medicoEditar) {
      await fetch(URL_API + "/" + medicoEditar.id, {
        method: "PUT", headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
    } else {
      await fetch(URL_API, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...payload, rol: "medico", activo: true }),
      })
    }

    cerrarModal()
    cargarMedicos()
  }

  // ── DESACTIVAR / REACTIVAR ────────────────────────────────────
  const desactivar = async (medico) => {
    if (!confirm("¿Desactivar a " + medico.nombre + "? Ya no podrá iniciar sesión.")) return
    await fetch(URL_API + "/" + medico.id, {
      method: "PUT", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...medico, activo: false }),
    })
    cargarMedicos()
  }

  const reactivar = async (medico) => {
    await fetch(URL_API + "/" + medico.id, {
      method: "PUT", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...medico, activo: true }),
    })
    cargarMedicos()
  }

  // ── ABRIR / CERRAR MODAL ──────────────────────────────────────
  const abrirCrear = () => {
    setMedicoEditar(null)
    setForm(FORMULARIO_VACIO)
    setErrores({})
    setModalAbierto(true)
  }

  const abrirEditar = (medico) => {
    setMedicoEditar(medico)
    setForm({
      nombre:             medico.nombre             || "",
      correo:             medico.correo             || "",
      password:           "",
      especialidad:       medico.especialidad       || "",
      especialidadNueva:  "",
      cedula_profesional: medico.cedula_profesional || "",
      rol:                "medico",
      activo:             medico.activo,
    })
    setErrores({})
    setModalAbierto(true)
  }

  const cerrarModal = () => {
    setModalAbierto(false)
    setMedicoEditar(null)
    setErrores({})
  }

  // ── ACTUALIZAR CAMPO DEL FORMULARIO ──────────────────────────
  const actualizarCampo = (campo, valor) => {
    setForm({ ...form, [campo]: valor })
    setErrores({ ...errores, [campo]: "" })
  }

  // ── FILTROS ───────────────────────────────────────────────────
  const medicosFiltrados = medicos.filter((m) => {
    const texto = busqueda.toLowerCase()
    const coincideTexto = (
      m.nombre.toLowerCase().includes(texto) ||
      m.correo.toLowerCase().includes(texto) ||
      (m.cedula_profesional || "").includes(busqueda)
    )
    const coincideEstatus =
      filtroEstatus === "todos"    ? true :
      filtroEstatus === "activos"  ? m.activo === true :
      m.activo === false
    const coincideEsp =
      filtroEsp === "" ? true : (m.especialidad || "") === filtroEsp

    return coincideTexto && coincideEstatus && coincideEsp
  })

  const totalActivos   = medicos.filter((m) => m.activo).length
  const totalInactivos = medicos.filter((m) => !m.activo).length

  // ── RENDERIZADO ───────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gray-100">

      <Encabezado
        nombreAdmin={usuario.nombre}
        onLogout={onLogout}
        totalMedicos={medicos.length}
        activos={totalActivos}
        inactivos={totalInactivos}
      />

      <div className="max-w-5xl mx-auto px-6 -mt-2 pb-10">
        <div className="bg-white rounded-2xl shadow-lg p-6">

          {/* Título y botón crear */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-5">
            <div>
              <h2 className="text-lg font-bold text-gray-800">Personal Médico</h2>
              <p className="text-sm text-gray-400">Gestiona el equipo de doctores de la clínica</p>
            </div>
            <button onClick={abrirCrear} className={botonPrimario}>
              + Nuevo médico
            </button>
          </div>

          <BarraBusqueda
            busqueda={busqueda}        onBusqueda={setBusqueda}
            filtroEstatus={filtroEstatus} onFiltroEstatus={setFiltroEstatus}
            filtroEsp={filtroEsp}      onFiltroEsp={setFiltroEsp}
            especialidades={especialidades}
          />

          {/* Lista de médicos */}
          {cargando ? (
            <div className="py-16 text-center">
              <div className={spinnerClase + " mx-auto mb-3"} />
              <p className="text-gray-400 text-sm">Cargando médicos...</p>
            </div>
          ) : medicosFiltrados.length === 0 ? (
            <div className="py-16 text-center">
              <p className="text-gray-500 font-medium">No se encontraron médicos</p>
              <p className="text-gray-400 text-sm mt-1">Intenta con otro filtro o registra uno nuevo</p>
            </div>
          ) : (
            <div className="space-y-3">
              {medicosFiltrados.map((medico, i) => (
                <FilaMedico
                  key={medico.id}
                  medico={medico}
                  indice={i}
                  onEditar={abrirEditar}
                  onDesactivar={desactivar}
                  onReactivar={reactivar}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      <ModalMedico
        abierto={modalAbierto}
        onCerrar={cerrarModal}
        form={form}
        errores={errores}
        onChange={actualizarCampo}
        onGuardar={guardar}
        modoEdicion={!!medicoEditar}
        especialidades={especialidades}
      />
    </div>
  )
}

export default AdminPanel