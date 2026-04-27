import { useState } from "react"

const API = "https://69e9c1ee15c7e2d51268ad00.mockapi.io/Clinica/Usuarios"

const FOTOS_AVATAR = [
  "https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=200&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=200&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=200&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?w=200&auto=format&fit=crop&q=80",
]

function PerfilPaciente({ usuario, onActualizar }) {
  const [editando, setEditando]           = useState(false)
  const [guardando, setGuardando]         = useState(false)
  const [exito, setExito]                 = useState(false)
  const [avatarIdx, setAvatarIdx]         = useState(0)
  const [mostrarAvatars, setMostrarAvatars] = useState(false)
  const [form, setForm] = useState({
    nombre:           usuario.nombre           || "",
    telefono:         usuario.telefono         || "",
    fecha_nacimiento: usuario.fecha_nacimiento || "",
    sexo:             usuario.sexo             || "",
  })

  const actualizar = (campo, valor) => setForm({ ...form, [campo]: valor })

  const calcularEdad = (fecha) => {
    if (!fecha) return usuario.edad || "-"
    return String(new Date().getFullYear() - new Date(fecha).getFullYear())
  }

  const handleGuardar = async () => {
    if (!form.nombre.trim()) { alert("El nombre no puede estar vacio"); return }
    setGuardando(true)
    try {
      const payload = {
        ...usuario,
        nombre:           form.nombre,
        telefono:         form.telefono,
        fecha_nacimiento: form.fecha_nacimiento,
        sexo:             form.sexo,
        edad:             calcularEdad(form.fecha_nacimiento),
      }
      const res        = await fetch(API + "/" + usuario.id, {
        method:  "PUT",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify(payload),
      })
      const actualizado = await res.json()
      localStorage.setItem("usuario", JSON.stringify(actualizado))
      if (onActualizar) onActualizar(actualizado)
      setEditando(false)
      setMostrarAvatars(false)
      setExito(true)
      setTimeout(() => setExito(false), 3000)
    } catch {
      alert("Error al guardar. Intenta de nuevo.")
    } finally {
      setGuardando(false)
    }
  }

  const totalEstudios   = usuario.historial ? usuario.historial.length : (usuario.estudio ? 1 : 0)
  const tieneOpinion    = usuario.opinion_medico ? 1 : 0
  const tieneDieta      = usuario.dieta_recomendada ? 1 : 0

  return (
    <div className="space-y-4">

      <div className="bg-white rounded-2xl shadow overflow-hidden">

        <div className="h-24" style={{ background: "linear-gradient(135deg, #1e3a8a 0%, #0f6e56 100%)" }} />

        <div className="px-6 pb-6">
          <div className="flex items-end justify-between -mt-12 mb-5">
            <div className="relative">
              <img
                src={FOTOS_AVATAR[avatarIdx]}
                alt="Foto de perfil"
                className="w-20 h-20 rounded-2xl object-cover border-4 border-white shadow-lg"
              />
              {editando && (
                <button
                  onClick={() => setMostrarAvatars(!mostrarAvatars)}
                  className="absolute -bottom-1 -right-1 w-6 h-6 bg-blue-600 text-white rounded-full text-xs flex items-center justify-center shadow-md"
                >
                  +
                </button>
              )}
            </div>

            <div className="flex items-center gap-2">
              {exito && (
                <span className="text-xs text-green-600 font-medium px-3 py-2 bg-green-50 rounded-xl border border-green-200">
                  Guardado
                </span>
              )}
              {!editando ? (
                <button
                  onClick={() => setEditando(true)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-sm font-medium transition-colors shadow-sm"
                >
                  Editar perfil
                </button>
              ) : (
                <div className="flex gap-2">
                  <button
                    onClick={() => { setEditando(false); setMostrarAvatars(false) }}
                    className="border border-gray-300 text-gray-600 px-4 py-2 rounded-xl text-sm hover:bg-gray-50 transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleGuardar}
                    disabled={guardando}
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-xl text-sm font-medium disabled:opacity-50 transition-colors shadow-sm"
                  >
                    {guardando ? "Guardando..." : "Guardar cambios"}
                  </button>
                </div>
              )}
            </div>
          </div>

          {mostrarAvatars && editando && (
            <div className="mb-5 p-4 bg-gray-50 border border-gray-200 rounded-2xl">
              <p className="text-xs text-gray-500 font-medium mb-3">Elige tu foto de perfil</p>
              <div className="flex gap-3 flex-wrap">
                {FOTOS_AVATAR.map((foto, i) => (
                  <button
                    key={i}
                    onClick={() => { setAvatarIdx(i); setMostrarAvatars(false) }}
                    className={"rounded-xl overflow-hidden border-2 transition-all " +
                      (avatarIdx === i ? "border-blue-500 scale-110 shadow-md" : "border-transparent hover:border-gray-300")}
                  >
                    <img src={foto} alt={"Avatar " + (i + 1)} className="w-14 h-14 object-cover" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {!editando ? (
            <div>
              <h2 className="text-xl font-bold text-gray-800 mb-0.5">{usuario.nombre}</h2>
              <p className="text-sm text-gray-400 mb-5">{usuario.correo}</p>

              <div className="grid grid-cols-2 gap-3">
                {[
                  ["Edad",             calcularEdad(usuario.fecha_nacimiento) + " anos"],
                  ["Sexo",             usuario.sexo             || "No especificado"],
                  ["Telefono",         usuario.telefono         || "No registrado"],
                  ["Fecha nacimiento", usuario.fecha_nacimiento || "No registrada"],
                  ["Rol",              "Paciente"],
                  ["Estado",           usuario.activo ? "Cuenta activa" : "Cuenta inactiva"],
                ].map(([label, valor]) => (
                  <div key={label} className="bg-gray-50 rounded-xl p-3 border border-gray-100">
                    <p className="text-xs text-gray-400 mb-0.5">{label}</p>
                    <p className="text-sm font-medium text-gray-800">{valor}</p>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <h2 className="text-base font-bold text-gray-700">Editando tu perfil</h2>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nombre completo</label>
                <input
                  type="text"
                  value={form.nombre}
                  onChange={(e) => actualizar("nombre", e.target.value)}
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Telefono</label>
                  <input
                    type="tel"
                    value={form.telefono}
                    onChange={(e) => actualizar("telefono", e.target.value)}
                    className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                    placeholder="951-000-0000"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Fecha de nacimiento</label>
                  <input
                    type="date"
                    value={form.fecha_nacimiento}
                    onChange={(e) => actualizar("fecha_nacimiento", e.target.value)}
                    className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Sexo</label>
                <div className="flex gap-3">
                  {["Masculino", "Femenino"].map((op) => (
                    <button
                      key={op}
                      onClick={() => actualizar("sexo", op)}
                      className={"flex-1 py-3 rounded-xl text-sm font-medium border transition-colors " +
                        (form.sexo === op
                          ? "bg-blue-600 text-white border-blue-600"
                          : "bg-white text-gray-600 border-gray-300 hover:bg-gray-50")}
                    >
                      {op}
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-amber-50 border border-amber-200 rounded-xl p-3">
                <p className="text-xs text-amber-700">
                  El correo electronico no se puede cambiar desde aqui. Si necesitas actualizarlo contacta al administrador.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow p-5">
        <h3 className="text-sm font-bold text-gray-700 mb-4">Resumen de actividad</h3>
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 text-center">
            <p className="text-2xl font-bold text-blue-700">{totalEstudios}</p>
            <p className="text-xs text-blue-600 mt-1">Estudios subidos</p>
          </div>
          <div className="bg-green-50 border border-green-100 rounded-xl p-4 text-center">
            <p className="text-2xl font-bold text-green-700">{tieneOpinion}</p>
            <p className="text-xs text-green-600 mt-1">Opiniones recibidas</p>
          </div>
          <div className="bg-amber-50 border border-amber-100 rounded-xl p-4 text-center">
            <p className="text-2xl font-bold text-amber-700">{tieneDieta}</p>
            <p className="text-xs text-amber-600 mt-1">Dietas asignadas</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow p-5">
        <h3 className="text-sm font-bold text-gray-700 mb-3">Informacion de cuenta</h3>
        <div className="divide-y divide-gray-100">
          {[
            ["Correo electronico", usuario.correo, null],
            ["Rol en el sistema",  null, { label: "Paciente",        style: "bg-blue-100 text-blue-700" }],
            ["Estado de cuenta",   null, { label: usuario.activo ? "Activa" : "Inactiva", style: usuario.activo ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600" }],
          ].map(([label, valor, badge]) => (
            <div key={label} className="flex justify-between items-center py-3">
              <span className="text-sm text-gray-500">{label}</span>
              {badge ? (
                <span className={"text-xs font-medium px-2 py-1 rounded-full " + badge.style}>{badge.label}</span>
              ) : (
                <span className="text-sm font-medium text-gray-800">{valor}</span>
              )}
            </div>
          ))}
        </div>
      </div>

    </div>
  )
}

export default PerfilPaciente