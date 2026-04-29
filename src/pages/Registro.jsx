import { useState } from "react"

const API  = "https://69e9c1ee15c7e2d51268ad00.mockapi.io/Clinica/Usuarios"
const FOTO = "https://images.unsplash.com/photo-1631549916768-4119b2e5f926?w=1600&auto=format&fit=crop&q=80"

function Registro({ onVolver }) {
  const [paso, setPaso]         = useState(1)
  const [cargando, setCargando] = useState(false)
  const [exito, setExito]       = useState(false)
  const [error, setError]       = useState("")

  const [form, setForm] = useState({
    nombre: "", apellido: "", correo: "", password: "",
    confirmar: "", telefono: "", fecha_nacimiento: "", sexo: "",
  })

  const actualizar = (campo, valor) => { setForm({ ...form, [campo]: valor }); setError("") }

  const validarPaso1 = () => {
    if (!form.nombre || !form.apellido)       { setError("Ingresa tu nombre completo"); return false }
    if (!form.correo.includes("@"))           { setError("Ingresa un correo valido"); return false }
    if (form.password.length < 6)             { setError("La contrasena debe tener al menos 6 caracteres"); return false }
    if (form.password !== form.confirmar)     { setError("Las contrasenas no coinciden"); return false }
    return true
  }
  const validarPaso2 = () => {
    if (!form.telefono)         { setError("Ingresa tu telefono"); return false }
    if (!form.fecha_nacimiento) { setError("Ingresa tu fecha de nacimiento"); return false }
    if (!form.sexo)             { setError("Selecciona tu sexo"); return false }
    return true
  }

  const handleSiguiente = () => {
    if (paso === 1 && validarPaso1()) { setError(""); setPaso(2) }
    if (paso === 2 && validarPaso2()) { setError(""); setPaso(3) }
  }

  const handleRegistrar = async () => {
    setCargando(true); setError("")
    try {
      const res      = await fetch(API)
      const usuarios = await res.json()
      const existe   = usuarios.find((u) => u.correo === form.correo)
      if (existe) { setError("Ya existe una cuenta con ese correo"); setCargando(false); return }
      const edad = new Date().getFullYear() - new Date(form.fecha_nacimiento).getFullYear()
      await fetch(API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nombre: form.nombre + " " + form.apellido,
          correo: form.correo, password: form.password,
          rol: "paciente", activo: true,
          telefono: form.telefono, fecha_nacimiento: form.fecha_nacimiento,
          sexo: form.sexo, edad: String(edad),
          opinion_medico: "", medico_nombre: "", fecha_opinion: "", estudio: null,
        }),
      })
      setExito(true)
    } catch { setError("Error al conectar con el servidor")
    } finally { setCargando(false) }
  }

  const FormContent = () => (
    <div className="w-full max-w-md">
      <div className="mb-6">
        <button onClick={onVolver} className="text-sm text-gray-400 hover:text-gray-600 mb-4 flex items-center gap-1">
          Volver al login
        </button>
        <h1 className="text-2xl font-bold text-gray-800 mb-1">Crear cuenta</h1>
        <p className="text-sm text-gray-400">Paso {paso} de 3</p>
        <div className="flex gap-2 mt-3">
          {[1,2,3].map((n) => (
            <div key={n} className={"h-1.5 flex-1 rounded-full transition-colors " + (n <= paso ? "bg-blue-600" : "bg-gray-200")} />
          ))}
        </div>
      </div>

      {paso === 1 && (
        <div className="space-y-4">
          <p className="text-xs font-semibold text-gray-500 uppercase">Datos de acceso</p>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
              <input type="text" value={form.nombre} onChange={(e) => actualizar("nombre", e.target.value)}
                className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Juan" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Apellido</label>
              <input type="text" value={form.apellido} onChange={(e) => actualizar("apellido", e.target.value)}
                className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Perez" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Correo electronico</label>
            <input type="email" value={form.correo} onChange={(e) => actualizar("correo", e.target.value)}
              className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="correo@ejemplo.com" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Contraseña</label>
            <input type="password" value={form.password} onChange={(e) => actualizar("password", e.target.value)}
              className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Minimo 6 caracteres" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Confirmar contrasena</label>
            <input type="password" value={form.confirmar} onChange={(e) => actualizar("confirmar", e.target.value)}
              className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Repite tu contrasena" />
          </div>
        </div>
      )}

      {paso === 2 && (
        <div className="space-y-4">
          <p className="text-xs font-semibold text-gray-500 uppercase">Datos personales</p>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Telefono</label>
            <input type="tel" value={form.telefono} onChange={(e) => actualizar("telefono", e.target.value)}
              className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="951-000-0000" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Fecha de nacimiento</label>
            <input type="date" value={form.fecha_nacimiento} onChange={(e) => actualizar("fecha_nacimiento", e.target.value)}
              className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Sexo</label>
            <div className="flex gap-3">
              {["Masculino","Femenino"].map((op) => (
                <button key={op} onClick={() => actualizar("sexo", op)}
                  className={"flex-1 py-3 rounded-xl text-sm font-medium border transition-colors " +
                    (form.sexo === op ? "bg-blue-600 text-white border-blue-600" : "bg-white text-gray-600 border-gray-300 hover:bg-gray-50")}>
                  {op}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {paso === 3 && (
        <div className="space-y-4">
          <p className="text-xs font-semibold text-gray-500 uppercase">Confirmar datos</p>
          <div className="bg-gray-50 rounded-2xl p-4 space-y-3 text-sm">
            {[
              ["Nombre", form.nombre + " " + form.apellido],
              ["Correo", form.correo],
              ["Telefono", form.telefono],
              ["Nacimiento", form.fecha_nacimiento],
              ["Sexo", form.sexo],
            ].map(([label, val]) => (
              <div key={label} className="flex justify-between items-center">
                <span className="text-gray-400">{label}</span>
                <span className="text-gray-800 font-medium">{val}</span>
              </div>
            ))}
          </div>
          <div className="bg-blue-50 border border-blue-100 rounded-xl p-3">
            <p className="text-xs text-blue-600">Tus datos seran usados unicamente para el seguimiento de tus estudios de laboratorio.</p>
          </div>
        </div>
      )}

      {error && (
        <div className="mt-4 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
          <p className="text-red-500 text-sm text-center">{error}</p>
        </div>
      )}

      <div className="flex gap-3 mt-6">
        {paso > 1 ? (
          <button onClick={() => setPaso(paso - 1)}
            className="flex-1 border border-gray-300 text-gray-600 py-3 rounded-xl text-sm hover:bg-gray-50">
            Atras
          </button>
        ) : (
          <button onClick={onVolver}
            className="flex-1 border border-gray-300 text-gray-600 py-3 rounded-xl text-sm hover:bg-gray-50">
            Ya tengo cuenta
          </button>
        )}
        {paso < 3 ? (
          <button onClick={handleSiguiente}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl text-sm font-medium shadow-md">
            Siguiente
          </button>
        ) : (
          <button onClick={handleRegistrar} disabled={cargando}
            className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl text-sm font-medium disabled:opacity-50 shadow-md">
            {cargando ? "Registrando..." : "Crear cuenta"}
          </button>
        )}
      </div>
    </div>
  )

  if (exito) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-10 rounded-2xl shadow-lg w-full max-w-sm text-center">
          <div className="text-5xl mb-4">🎉</div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">Cuenta creada</h2>
          <p className="text-gray-400 text-sm mb-6">Ya puedes iniciar sesion con tu correo y contrasena.</p>
          <button onClick={onVolver}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl text-sm font-medium shadow-md">
            Ir al inicio de sesion
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex">
      <div
        className="hidden md:flex md:w-1/4 bg-cover bg-center relative"
        style={{ backgroundImage: "url(" + FOTO + ")" }}
      >
        <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, rgba(15,110,86,0.75) 0%, rgba(29,62,130,0.65) 100%)" }} />
        <div className="relative z-10 flex flex-col justify-end p-12 text-white">
          <p className="text-4xl font-bold mb-3">Cuida tu salud hoy</p>
          <p className="text-lg leading-relaxed" style={{ color: "rgba(255,255,255,0.85)" }}>
            Registrate y comienza a llevar un historial completo de tus analisis de sangre.
          </p>
        </div>
      </div>
      <div className="flex-1 flex items-center justify-center bg-gray-50 px-6 py-10">
        <FormContent />
      </div>
    </div>
  )
}

export default Registro