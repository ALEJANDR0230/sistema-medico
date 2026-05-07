import { useState } from "react"

import { usePaciente }      from "./paciente/usePaciente"

import NavPestanas           from "./paciente/NavPestanas"
import InfoEstudio           from "./paciente/InfoEstudio"
import ResumenEstudio        from "./paciente/ResumenEstudio"
import ResultadoSangre       from "./paciente/ResultadoSangre"
import OpinionMedico         from "./paciente/OpinionMedico"
import SeccionDieta          from "./paciente/SeccionDieta"
import SinEstudios           from "./paciente/SinEstudios"

import GraficaTendencia      from "../components/GraficaTendencia"
import MapaClinicas          from "../components/MapaClinicas"
import PerfilPaciente        from "../components/PerfilPaciente"
import SubirPDF              from "../components/SubirPDF"

function NavbarPaciente({ nombre, onLogout }) {
  return (
    <div className="h-20 bg-white shadow px-8 flex justify-between items-center flex-shrink-0">
      <div className="flex items-center gap-4">
        <div className="w-11 h-11 bg-blue-600 rounded-xl flex items-center justify-center">
          <span className="text-white text-base font-bold">SM</span>
        </div>
        <div>
          <h1 className="text-lg font-bold text-gray-800">Sistema Médico</h1>
          <p className="text-sm text-gray-400">{nombre}</p>
        </div>
      </div>
      <button
        onClick={onLogout}
        className="bg-red-500 hover:bg-red-600 text-white px-6 py-2.5 rounded-xl text-base transition-colors"
      >
        Cerrar sesión
      </button>
    </div>
  )
}

function PantallaCarga() {
  return (
    <div className="flex flex-col items-center justify-center py-24">
      <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-4" />
      <p className="text-gray-400 text-base">Cargando tus datos...</p>
    </div>
  )
}

function SeccionResultados({ resultados, semaforo, usuario, onEstudioSubido }) {
  if (!resultados) {
    return <SinEstudios usuario={usuario} onEstudioSubido={onEstudioSubido} />
  }
  return (
    <div>
      <p className="text-base text-gray-400 mb-4">
        Toca cada resultado para ver su explicación detallada
      </p>
      <div className="grid grid-cols-2 gap-4">
        {resultados.map((analito, i) => (
          <ResultadoSangre key={i} analito={analito} semaforo={semaforo} />
        ))}
      </div>
    </div>
  )
}

function PacientePanel({ usuario, onLogout }) {

  const [pestanaActiva, setPestanaActiva] = useState("resultados")
  const [usuarioLocal, setUsuarioLocal] = useState(usuario)

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

  const manejarActualizacionPerfil = (usuarioActualizado) => {
    setUsuarioLocal(usuarioActualizado)
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">

      <NavbarPaciente nombre={usuarioLocal.nombre} onLogout={onLogout} />

      <div className="flex flex-1 overflow-hidden">

        <NavPestanas activa={pestanaActiva} onCambiar={setPestanaActiva} />

        <main className="flex-1 overflow-y-auto p-8">
          {cargando ? (
            <PantallaCarga />
          ) : (
            <div className="max-w-5xl mx-auto">
              {pacienteInfo && <InfoEstudio pacienteInfo={pacienteInfo} />}
              {resumen && <ResumenEstudio resumen={resumen} />}

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
                  <p className="text-base text-gray-400 mb-4">
                    Evolución de tus analitos — {historial.length} estudios registrados
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
                  <p className="text-base text-gray-400 mb-4">
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
        </main>
      </div>
    </div>
  )
}

export default PacientePanel