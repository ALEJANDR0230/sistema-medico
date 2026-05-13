import { useState } from "react";
import { usePaciente } from "./paciente/usePaciente";

import NavPestanas from "./paciente/NavPestanas";
import InfoEstudio from "./paciente/InfoEstudio";
import ResumenEstudio from "./paciente/ResumenEstudio";
import ResultadoSangre from "./paciente/ResultadoSangre";
import OpinionMedico from "./paciente/OpinionMedico";
import SeccionDieta from "./paciente/SeccionDieta";
import SinEstudios from "./paciente/SinEstudios";

import GraficaTendencia from "../components/GraficaTendencia";
import MapaClinicas from "../components/MapaClinicas";
import PerfilPaciente from "../components/PerfilPaciente";
import SubirPDF from "../components/SubirPDF";

function NavbarPaciente({ nombre, onLogout }) {
  return (
    <div className="h-20 bg-white border-b border-gray-100 px-8 flex justify-between items-center flex-shrink-0 shadow-sm">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
          <span className="text-white text-xl font-bold">SM</span>
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-800 tracking-tight">Sistema Médico</h1>
          <p className="text-sm text-gray-500 -mt-1">{nombre}</p>
        </div>
      </div>

      <button
        onClick={onLogout}
        className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-2xl text-sm font-semibold transition-all active:scale-[0.985]"
      >
        Cerrar sesión
      </button>
    </div>
  );
}

function PantallaCarga() {
  return (
    <div className="flex flex-col items-center justify-center py-32">
      <div className="relative">
        <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-6 h-6 bg-blue-600 rounded-full animate-pulse" />
        </div>
      </div>
      <p className="text-gray-500 mt-6 text-lg font-medium">Cargando tus datos...</p>
    </div>
  );
}

function SeccionResultados({ resultados, semaforo, usuario, onEstudioSubido }) {
  if (!resultados) {
    return <SinEstudios usuario={usuario} onEstudioSubido={onEstudioSubido} />;
  }

  return (
    <div>
      <div className="mb-6">
        <p className="text-lg text-gray-600">Toca cada resultado para ver su explicación detallada</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {resultados.map((analito, i) => (
          <ResultadoSangre key={i} analito={analito} semaforo={semaforo} />
        ))}
      </div>
    </div>
  );
}

function PacientePanel({ usuario, onLogout }) {
  const [pestanaActiva, setPestanaActiva] = useState("resultados");
  const [usuarioLocal, setUsuarioLocal] = useState(usuario);

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
  } = usePaciente(usuarioLocal);

  const manejarActualizacionPerfil = (usuarioActualizado) => {
    setUsuarioLocal(usuarioActualizado);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <NavbarPaciente nombre={usuarioLocal.nombre} onLogout={onLogout} />

      <div className="flex flex-1 overflow-hidden">
        <NavPestanas activa={pestanaActiva} onCambiar={setPestanaActiva} />

        <main className="flex-1 overflow-y-auto">
          <div className="max-w-6xl mx-auto px-8 py-10">
            {cargando ? (
              <PantallaCarga />
            ) : (
              <>
                {/* Encabezado del estudio */}
                {pacienteInfo && <InfoEstudio pacienteInfo={pacienteInfo} />}
                {resumen && <ResumenEstudio resumen={resumen} />}

                {/* Contenido por pestaña */}
                {pestanaActiva === "resultados" && (
                  <SeccionResultados
                    resultados={resultados}
                    semaforo={semaforo}
                    usuario={usuarioLocal}
                    onEstudioSubido={cargarDatos}
                  />
                )}

                {pestanaActiva === "tendencia" && (
                  <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
                    <div className="mb-6">
                      <h3 className="text-2xl font-bold text-gray-800 tracking-tight">Evolución de tus análisis</h3>
                      <p className="text-gray-500 mt-1">
                        {historial.length} estudios registrados
                      </p>
                    </div>
                    <GraficaTendencia historial={historial} />
                  </div>
                )}

                {pestanaActiva === "opinion" && (
                  <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
                    <OpinionMedico datos={datos} />
                  </div>
                )}

                {pestanaActiva === "dieta" && (
                  <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
                    <SeccionDieta dietaClave={dieta} />
                  </div>
                )}

                {pestanaActiva === "mapa" && (
                  <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
                    <div className="mb-6">
                      <h3 className="text-2xl font-bold text-gray-800 tracking-tight">Clínicas y Laboratorios cercanos</h3>
                      <p className="text-gray-500">Encuentra dónde hacerte tu próximo estudio</p>
                    </div>
                    <MapaClinicas />
                  </div>
                )}

                {pestanaActiva === "perfil" && (
                  <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
                    <PerfilPaciente
                      usuario={datos || usuarioLocal}
                      onActualizar={manejarActualizacionPerfil}
                    />
                  </div>
                )}

                {pestanaActiva === "subir" && (
                  <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
                    <SubirPDF
                      usuario={usuarioLocal}
                      onEstudioGuardado={cargarDatos}
                    />
                  </div>
                )}
              </>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

export default PacientePanel;