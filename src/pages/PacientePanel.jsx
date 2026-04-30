
import { useState } from "react"

// Hook con toda la lógica de datos
import { usePaciente }      from "./paciente/usePaciente"

// Subcomponentes del paciente
import NavPestanas           from "./paciente/NavPestanas"
import InfoEstudio           from "./paciente/InfoEstudio"
import ResumenEstudio        from "./paciente/ResumenEstudio"
import ResultadoSangre        from "./paciente/ResultadoSangre"
import OpinionMedico         from "./paciente/OpinionMedico"
import SeccionDieta          from "./paciente/SeccionDieta"
import SinEstudios           from "./paciente/SinEstudios"

// Componentes compartidos con otros paneles
import GraficaTendencia      from "../components/GraficaTendencia"
import MapaClinicas          from "../components/MapaClinicas"
import PerfilPaciente        from "../components/PerfilPaciente"
import SubirPDF              from "../components/SubirPDF"

// ─────────────────────────────────────────────────────────────
//  SUBCOMPONENTE: Navbar del paciente
// ─────────────────────────────────────────────────────────────
function NavbarPaciente({ nombre, onLogout }) {
  return (
    <div className="bg-white shadow px-6 py-4 flex justify-between items-center">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center">
          <span className="text-white text-sm font-bold">SM</span>
        </div>
        <div>
          <h1 className="text-base font-bold text-gray-800">Mi Dashboard</h1>
          <p className="text-xs text-gray-400">{nombre}</p>
        </div>
      </div>
      <button
        onClick={onLogout}
        className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-xl text-sm transition-colors"
      >
        Cerrar sesión
      </button>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────
//  SUBCOMPONENTE: Spinner de carga
// ─────────────────────────────────────────────────────────────
function PantallaCarga() {
  return (
    <div className="flex flex-col items-center justify-center py-24">
      <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-4" />
      <p className="text-gray-400 text-sm">Cargando tus datos...</p>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────
//  SUBCOMPONENTE: Sección de resultados con grid de tarjetas
// ─────────────────────────────────────────────────────────────
function SeccionResultados({ resultados, semaforo, usuario, onEstudioSubido }) {

  // Si no tiene estudios, mostrar la pantalla de subida
  if (!resultados) {
    return <SinEstudios usuario={usuario} onEstudioSubido={onEstudioSubido} />
  }

  return (
    <div>
      <p className="text-sm text-gray-400 mb-3">
        Toca cada resultado para ver su explicación detallada
      </p>
      <div className="grid grid-cols-2 gap-3">
        {resultados.map((analito, i) => (
          <ResultadoSangre key={i} analito={analito} semaforo={semaforo} />
        ))}
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────
//  COMPONENTE PRINCIPAL: PacientePanel
// ─────────────────────────────────────────────────────────────
function PacientePanel({ usuario, onLogout }) {

  // Pestaña activa — empieza en resultados
  const [pestanaActiva, setPestanaActiva] = useState("resultados")

  // Estado local del usuario para actualizarlo sin recargar
  const [usuarioLocal, setUsuarioLocal] = useState(usuario)

  // Todos los datos vienen del hook
  const {
    datos,
    cargando,
    resultados,
    pacienteInfo,
    resumen,
    dieta,
    historial,
    semaforo,
    cargarDatos,
  } = usePaciente(usuarioLocal)

  // Cuando el paciente edita su perfil, actualizar el estado local
  const manejarActualizacionPerfil = (usuarioActualizado) => {
    setUsuarioLocal(usuarioActualizado)
  }

  // ── RENDERIZADO ───────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gray-100">

      {/* Barra de navegación superior */}
      <NavbarPaciente nombre={usuarioLocal.nombre} onLogout={onLogout} />

      <div className="max-w-4xl mx-auto p-6">

        {/* Mientras carga los datos */}
        {cargando ? (
          <PantallaCarga />

        ) : (
          <div>
            {/* Encabezado del estudio (folio, laboratorio, etc.) */}
            {pacienteInfo && <InfoEstudio pacienteInfo={pacienteInfo} />}

            {/* Contadores del estudio */}
            {resumen && <ResumenEstudio resumen={resumen} />}

            {/* Barra de pestañas */}
            <NavPestanas activa={pestanaActiva} onCambiar={setPestanaActiva} />

            {/* ── CONTENIDO POR PESTAÑA ── */}

            {pestanaActiva === "resultados" && (
              <SeccionResultados
                resultados={resultados}
                semaforo={semaforo}
                usuario={usuarioLocal}
                onEstudioSubido={cargarDatos}
              />
            )}

            {pestanaActiva === "tendencia" && (
              <div>
                <p className="text-sm text-gray-400 mb-3">
                  Evolución de tus analitos a lo largo del tiempo — {historial.length} estudios registrados
                </p>
                <GraficaTendencia historial={historial} />
              </div>
            )}

            {pestanaActiva === "opinion" && (
              <OpinionMedico datos={datos} />
            )}

            {pestanaActiva === "dieta" && (
              <SeccionDieta dietaClave={dieta} />
            )}

            {pestanaActiva === "mapa" && (
              <div>
                <p className="text-sm text-gray-400 mb-3">
                  Encuentra dónde hacerte tu próximo estudio
                </p>
                <MapaClinicas />
              </div>
            )}

            {pestanaActiva === "perfil" && (
              <PerfilPaciente
                usuario={datos || usuarioLocal}
                onActualizar={manejarActualizacionPerfil}
              />
            )}

            {pestanaActiva === "subir" && (
              <SubirPDF
                usuario={usuarioLocal}
                onEstudioGuardado={cargarDatos}
              />
            )}

          </div>
        )}
      </div>
    </div>
  )
}

export default PacientePanel