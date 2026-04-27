import { useState } from "react"
import { usePacientePanel, RANGOS_REFERENCIA, EXPLICACIONES, DIETAS_INFO } from "../hooks/usePacientePanel"
import MapaClinicas from "../components/MapaClinicas"
import SubirPDF from "../components/SubirPDF"
import GraficaTendencia from "../components/GraficaTendencia"
import PerfilPaciente from "../components/PerfilPaciente"

const colores = {
  green:  { bg: "bg-green-50",  border: "border-green-300",  texto: "text-green-700",  badge: "bg-green-100 text-green-700",   barra: "#22c55e", label: "Normal"   },
  yellow: { bg: "bg-yellow-50", border: "border-yellow-300", texto: "text-yellow-700", badge: "bg-yellow-100 text-yellow-700", barra: "#f59e0b", label: "Limite"   },
  red:    { bg: "bg-red-50",    border: "border-red-300",    texto: "text-red-700",    badge: "bg-red-100 text-red-600",       barra: "#ef4444", label: "Atencion" },
  gray:   { bg: "bg-gray-50",   border: "border-gray-200",   texto: "text-gray-600",   badge: "bg-gray-100 text-gray-500",     barra: "#9ca3af", label: "Sin ref"  },
}

function BarraProgreso({ analito, semaforo }) {
  const estado = semaforo(analito)
  const c      = colores[estado]
  const rango  = RANGOS_REFERENCIA[analito.analito]
  if (!rango || analito.valor_numerico === null) return null
  const max  = rango.ref_high * 1.5
  const pct  = Math.min((analito.valor_numerico / max) * 100, 100)
  const pOk  = Math.min((rango.ref_high / max) * 100, 100)
  return (
    <div className="w-full">
      <div className="relative w-full h-2 bg-gray-100 rounded-full overflow-hidden">
        <div className="absolute left-0 top-0 h-full rounded-full" style={{ width: pct + "%", background: c.barra }} />
        <div className="absolute top-0 h-full w-px bg-gray-400 opacity-50" style={{ left: pOk + "%" }} />
      </div>
      <div className="flex justify-between mt-0.5">
        <span className="text-xs text-gray-400">{rango.ref_low}</span>
        <span className="text-xs text-gray-400">{rango.ref_high} {rango.unidad}</span>
      </div>
    </div>
  )
}

function TarjetaAnalito({ analito, semaforo }) {
  const [expandido, setExpandido] = useState(false)
  const estado      = semaforo(analito)
  const c           = colores[estado]
  const explicacion = EXPLICACIONES[analito.analito]
  const rango       = RANGOS_REFERENCIA[analito.analito]
  const low  = analito.ref_low  !== null ? analito.ref_low  : (rango ? rango.ref_low  : null)
  const high = analito.ref_high !== null ? analito.ref_high : (rango ? rango.ref_high : null)

  return (
    <div className={"rounded-2xl border overflow-hidden hover:shadow-md transition-shadow " + c.bg + " " + c.border}>
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <p className="text-sm font-semibold text-gray-700 leading-tight">{analito.analito}</p>
          <span className={"text-xs px-2 py-0.5 rounded-full font-medium " + c.badge}>{c.label}</span>
        </div>
        <p className={"text-2xl font-bold mb-2 " + c.texto}>
          {analito.prefijo}{analito.valor_raw}
          <span className="text-sm font-normal ml-1 text-gray-400">{analito.unidad}</span>
        </p>
        <BarraProgreso analito={analito} semaforo={semaforo} />
        {low !== null && high !== null && (
          <p className="text-xs text-gray-400 mt-2">Rango: {low} a {high} {analito.unidad}</p>
        )}
        {explicacion && (
          <button onClick={() => setExpandido(!expandido)}
            className="mt-2 text-xs text-blue-600 font-medium hover:underline">
            {expandido ? "Ocultar explicacion" : "Que significa este resultado?"}
          </button>
        )}
      </div>
      {expandido && explicacion && (
        <div className="border-t border-gray-200 bg-white px-4 py-4 space-y-3">
          <div>
            <p className="text-xs font-bold text-gray-500 uppercase mb-1">Que es?</p>
            <p className="text-sm text-gray-700 leading-relaxed">{explicacion.que_es}</p>
          </div>
          <div>
            <p className="text-xs font-bold text-gray-500 uppercase mb-1">Que significa tu resultado?</p>
            <p className="text-sm text-gray-700 leading-relaxed">{explicacion.que_significa}</p>
          </div>
          <div>
            <p className="text-xs font-bold text-gray-500 uppercase mb-1">Recomendacion</p>
            <p className="text-sm text-gray-700 leading-relaxed">{explicacion.recomendacion}</p>
          </div>
          <div className="bg-blue-50 border border-blue-100 rounded-xl px-3 py-2">
            <p className="text-xs font-bold text-blue-600 uppercase mb-1">Fuente de referencia</p>
            <p className="text-xs text-blue-700 font-medium mb-1">{explicacion.referencia}</p>
            <a href={explicacion.url} target="_blank" rel="noopener noreferrer"
              className="text-xs text-blue-500 hover:underline">Ver articulo</a>
          </div>
        </div>
      )}
    </div>
  )
}

function SeccionDieta({ dietaKey }) {
  const info = DIETAS_INFO[dietaKey]
  if (!info) return null
  return (
    <div className="bg-white rounded-2xl shadow overflow-hidden">
      <div className="relative h-40">
        <img src={info.foto} alt={info.titulo} className="w-full h-full object-cover" />
        <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(0,0,0,0.65) 0%, transparent 55%)" }} />
        <div className="absolute bottom-0 left-0 p-4">
          <p className="text-white font-bold text-base">{info.titulo}</p>
          <p className="text-white text-xs opacity-80">Recomendada por tu medico</p>
        </div>
      </div>
      <div className="p-5">
        <div className="grid grid-cols-2 gap-5 mb-4">
          <div>
            <p className="text-xs font-bold text-green-700 uppercase mb-2">Alimentos recomendados</p>
            <ul className="space-y-1.5">
              {info.comer.map((item, i) => (
                <li key={i} className="text-xs text-gray-700 flex gap-2 items-start">
                  <span className="text-green-500 font-bold mt-0.5 flex-shrink-0">+</span>{item}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-xs font-bold text-red-600 uppercase mb-2">Alimentos a evitar</p>
            <ul className="space-y-1.5">
              {info.evitar.map((item, i) => (
                <li key={i} className="text-xs text-gray-700 flex gap-2 items-start">
                  <span className="text-red-400 font-bold mt-0.5 flex-shrink-0">-</span>{item}
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-3">
          <p className="text-xs font-bold text-amber-700 mb-1">Consejo del dia</p>
          <p className="text-xs text-amber-800 leading-relaxed">{info.consejo}</p>
        </div>
      </div>
    </div>
  )
}

const TABS = [
  { key: "resultados", label: "Resultados"  },
  { key: "tendencia",  label: "Tendencia"   },
  { key: "opinion",    label: "Opinion"     },
  { key: "dieta",      label: "Mi dieta"    },
  { key: "mapa",       label: "Clinicas"    },
  { key: "perfil",     label: "Mi perfil"   },
  { key: "subir",      label: "Subir PDF"   },
]

function PacientePanel({ usuario, onLogout }) {
  const { datos, cargando, resultados, pacienteInfo, resumen, dieta, historial, semaforo, cargarDatos } = usePacientePanel(usuario)
  const [seccion, setSeccion]   = useState("resultados")
  const [usuarioLocal, setUsuarioLocal] = useState(usuario)

  const handleActualizarPerfil = (actualizado) => {
    setUsuarioLocal(actualizado)
  }

  return (
    <div className="min-h-screen bg-gray-100">

      <div className="bg-white shadow px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center">
            <span style={{ fontSize: "16px" }}>🩸</span>
          </div>
          <div>
            <h1 className="text-base font-bold text-gray-800">Mi Dashboard</h1>
            <p className="text-xs text-gray-400">{usuarioLocal.nombre}</p>
          </div>
        </div>
        <button onClick={onLogout}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-xl text-sm transition-colors">
          Cerrar sesion
        </button>
      </div>

      <div className="max-w-4xl mx-auto p-6">
        {cargando ? (
          <div className="flex flex-col items-center justify-center py-24">
            <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-4" />
            <p className="text-gray-400 text-sm">Cargando tus datos...</p>
          </div>
        ) : (
          <div>
            {resultados && pacienteInfo && (
              <div className="bg-white rounded-2xl shadow p-4 mb-4 flex flex-wrap gap-4 text-sm">
                <div><span className="text-gray-400">Paciente: </span><span className="font-semibold text-gray-800">{pacienteInfo.paciente_nombre}</span></div>
                <div><span className="text-gray-400">Folio: </span><span className="font-semibold text-gray-800">{pacienteInfo.folio}</span></div>
                <div><span className="text-gray-400">Edad: </span><span className="font-semibold text-gray-800">{pacienteInfo.edad} anos</span></div>
                <div><span className="text-gray-400">Sexo: </span><span className="font-semibold text-gray-800">{pacienteInfo.sexo}</span></div>
                <div><span className="text-gray-400">Laboratorio: </span><span className="font-semibold text-gray-800">{pacienteInfo.laboratorio}</span></div>
              </div>
            )}

            {resultados && resumen && (
              <div className="grid grid-cols-4 gap-3 mb-4">
                <div className="bg-white rounded-2xl shadow p-3 text-center">
                  <p className="text-2xl font-bold text-gray-800">{resumen.total_analitos}</p>
                  <p className="text-xs text-gray-400 mt-0.5">Total</p>
                </div>
                <div className="bg-green-50 rounded-2xl shadow p-3 text-center border border-green-100">
                  <p className="text-2xl font-bold text-green-700">{resumen.normales}</p>
                  <p className="text-xs text-green-600 mt-0.5">Normales</p>
                </div>
                <div className="bg-red-50 rounded-2xl shadow p-3 text-center border border-red-100">
                  <p className="text-2xl font-bold text-red-600">{resumen.altos + resumen.bajos}</p>
                  <p className="text-xs text-red-500 mt-0.5">Fuera de rango</p>
                </div>
                <div className="bg-gray-50 rounded-2xl shadow p-3 text-center border border-gray-200">
                  <p className="text-2xl font-bold text-gray-500">{resumen.sin_referencia}</p>
                  <p className="text-xs text-gray-400 mt-0.5">Sin referencia</p>
                </div>
              </div>
            )}

            <div className="flex gap-1 mb-5 bg-white rounded-2xl shadow p-1.5 overflow-x-auto">
              {TABS.map(({ key, label }) => (
                <button key={key} onClick={() => setSeccion(key)}
                  className={"flex-1 py-2 px-1 rounded-xl text-xs font-medium transition-colors whitespace-nowrap " +
                    (seccion === key ? "bg-blue-600 text-white shadow" : "text-gray-500 hover:bg-gray-100")}>
                  {label}
                </button>
              ))}
            </div>

            {seccion === "resultados" && (
              !resultados ? (
                <div>
                  <div className="bg-white rounded-2xl shadow p-10 text-center mb-6">
                    <p className="text-5xl mb-4">🩸</p>
                    <h2 className="text-xl font-bold text-gray-700 mb-2">Aun no tienes estudios</h2>
                    <p className="text-gray-400 text-sm">Sube el PDF de tu analisis de sangre para ver tus resultados.</p>
                  </div>
                  <SubirPDF usuario={usuarioLocal} onEstudioGuardado={cargarDatos} />
                </div>
              ) : (
                <div>
                  <p className="text-sm text-gray-400 mb-3">Toca cada resultado para ver su explicacion detallada</p>
                  <div className="grid grid-cols-2 gap-3">
                    {resultados.map((analito, i) => (
                      <TarjetaAnalito key={i} analito={analito} semaforo={semaforo} />
                    ))}
                  </div>
                </div>
              )
            )}

            {seccion === "tendencia" && (
              <div>
                <p className="text-sm text-gray-400 mb-3">
                  Evolucion de tus analitos en el tiempo — {historial.length} estudios registrados
                </p>
                <GraficaTendencia historial={historial} />
              </div>
            )}

            {seccion === "opinion" && (
              <div className="bg-white rounded-2xl shadow p-6">
                {datos && datos.opinion_medico ? (
                  <div>
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-blue-600 text-lg">👨‍⚕️</span>
                      </div>
                      <div>
                        <p className="font-semibold text-gray-800 text-sm">{datos.medico_nombre}</p>
                        <p className="text-xs text-gray-400">{datos.fecha_opinion}</p>
                      </div>
                    </div>
                    <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4">
                      <p className="text-gray-700 text-sm leading-relaxed">{datos.opinion_medico}</p>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-10">
                    <p className="text-4xl mb-3">⏳</p>
                    <p className="text-gray-500 font-medium">Esperando opinion del medico</p>
                    <p className="text-gray-400 text-sm mt-1">Tu medico revisara tus resultados pronto.</p>
                  </div>
                )}
              </div>
            )}

            {seccion === "dieta" && (
              dieta ? <SeccionDieta dietaKey={dieta} /> : (
                <div className="bg-white rounded-2xl shadow p-10 text-center">
                  <p className="text-4xl mb-3">🥗</p>
                  <p className="text-gray-500 font-medium">Sin dieta asignada aun</p>
                  <p className="text-gray-400 text-sm mt-1">Tu medico asignara una dieta cuando revise tus resultados.</p>
                </div>
              )
            )}

            {seccion === "mapa" && (
              <div>
                <p className="text-sm text-gray-400 mb-3">Encuentra donde hacerte tu proximo estudio</p>
                <MapaClinicas />
              </div>
            )}

            {seccion === "perfil" && (
              <PerfilPaciente
                usuario={datos || usuarioLocal}
                onActualizar={handleActualizarPerfil}
              />
            )}

            {seccion === "subir" && (
              <SubirPDF usuario={usuarioLocal} onEstudioGuardado={cargarDatos} />
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default PacientePanel