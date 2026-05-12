import { useAdminPanel } from "../hooks/useAdminPanel";
import {
  botonPrimario, botonSecundario,
  botonAmbar, botonRojoSuave, botonVerdeSuave,
  spinnerClase,
} from "../estilos/clases";

// ================== IMÁGENES DE AVATAR ==================
const FOTOS_AVATAR = [
  "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=80&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=80&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1551601651-2a8555f1a136?w=80&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=80&auto=format&fit=crop&q=80",
];

// ================== COMPONENTE PRINCIPAL ==================
function AdminPanel({ usuario, onLogout }) {
  const {
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
    cerrarModal,
  } = useAdminPanel();

  const totalActivos = medicos.filter(m => m.activo).length;
  const totalInactivos = medicos.filter(m => !m.activo).length;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ========== HEADER MODERNO ========== */}
      <div className="bg-gradient-to-r from-blue-700 to-indigo-700 text-white">
        <div className="max-w-7xl mx-auto px-8 py-6 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow">
              <span className="text-3xl font-bold text-blue-700">SM</span>
            </div>
            <div>
              <h1 className="text-3xl font-bold">Panel Administrador</h1>
              <p className="text-blue-100">Gestión de Personal Médico</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="font-medium">{usuario.nombre}</p>
              <p className="text-xs text-blue-200">Administrador</p>
            </div>
            <button
              onClick={onLogout}
              className="bg-white/20 hover:bg-white/30 px-6 py-3 rounded-2xl text-sm font-medium transition"
            >
              Cerrar Sesión
            </button>
          </div>
        </div>

        {/* Estadísticas */}
        <div className="max-w-7xl mx-auto px-8 pb-8 grid grid-cols-3 gap-6">
          {[
            { titulo: "Total Médicos", valor: medicos.length, color: "bg-white/10" },
            { titulo: "Activos", valor: totalActivos, color: "bg-emerald-500/20" },
            { titulo: "Inactivos", valor: totalInactivos, color: "bg-red-500/20" },
          ].map((stat, i) => (
            <div key={i} className={`${stat.color} backdrop-blur-md rounded-3xl p-6 text-center`}>
              <p className="text-5xl font-bold text-white mb-1">{stat.valor}</p>
              <p className="text-blue-100 font-medium">{stat.titulo}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ========== CONTENIDO ========== */}
      <div className="max-w-7xl mx-auto px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-800">Personal Médico</h2>
            <p className="text-gray-500">Gestiona los doctores registrados en el sistema</p>
          </div>
          <button onClick={abrirModalNuevo} className={`${botonPrimario} flex items-center gap-2 text-base px-6 py-3.5`}>
            + Nuevo Médico
          </button>
        </div>

        {cargando ? (
          <div className="py-32 flex flex-col items-center">
            <div className={spinnerClase} />
            <p className="text-gray-500 mt-4">Cargando médicos...</p>
          </div>
        ) : medicos.length === 0 ? (
          <div className="py-20 text-center text-gray-500">
            Aún no hay médicos registrados
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {medicos.map((medico, i) => (
              <div key={medico.id} className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 hover:shadow-xl transition-all duration-300">
                <div className="flex gap-5">
                  <img
                    src={FOTOS_AVATAR[i % FOTOS_AVATAR.length]}
                    alt={medico.nombre}
                    className="w-20 h-20 rounded-2xl object-cover"
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold text-xl text-gray-800">{medico.nombre}</h3>
                    <p className="text-gray-500 text-sm mt-1">{medico.correo}</p>
                    
                    <div className="mt-4 flex gap-2">
                      <span className={`text-xs px-4 py-1.5 rounded-full font-medium ${medico.activo ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"}`}>
                        {medico.activo ? "Activo" : "Inactivo"}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 mt-6">
                  <button onClick={() => abrirModalEditar(medico)} className={botonAmbar + " flex-1"}>
                    Editar
                  </button>
                  {medico.activo ? (
                    <button onClick={() => handleDesactivar(medico)} className={botonRojoSuave + " flex-1"}>
                      Desactivar
                    </button>
                  ) : (
                    <button onClick={() => handleReactivar(medico)} className={botonVerdeSuave + " flex-1"}>
                      Reactivar
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ========== MODAL ========== */}
      {modalAbierto && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50" onClick={(e) => e.target === e.currentTarget && cerrarModal()}>
          <div className="bg-white rounded-3xl w-full max-w-md mx-4 overflow-hidden">
            <div className="p-8">
              <h2 className="text-2xl font-bold mb-6">
                {medicoEditando ? "Editar Médico" : "Nuevo Médico"}
              </h2>

              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nombre completo</label>
                  <input
                    type="text"
                    value={form.nombre}
                    onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                    className="w-full border border-gray-300 rounded-2xl px-5 py-3.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Dr. Juan Pérez"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Correo electrónico</label>
                  <input
                    type="email"
                    value={form.correo}
                    onChange={(e) => setForm({ ...form, correo: e.target.value })}
                    className="w-full border border-gray-300 rounded-2xl px-5 py-3.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="medico@clinica.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {medicoEditando ? "Nueva contraseña (dejar vacío para no cambiar)" : "Contraseña"}
                  </label>
                  <input
                    type="password"
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    className="w-full border border-gray-300 rounded-2xl px-5 py-3.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder={medicoEditando ? "Dejar vacío si no quieres cambiar" : "Mínimo 6 caracteres"}
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-8">
                <button onClick={cerrarModal} className={botonSecundario + " flex-1 py-4"}>
                  Cancelar
                </button>
                <button onClick={handleGuardar} className={botonPrimario + " flex-1 py-4"}>
                  {medicoEditando ? "Guardar Cambios" : "Crear Médico"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminPanel;