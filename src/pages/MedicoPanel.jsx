import { useState, useEffect } from "react"

const API = "https://69e9c1ee15c7e2d51268ad00.mockapi.io/Clinica/Usuarios"

const colores = {
  green: { bg: "bg-green-50", border: "border-green-300", texto: "text-green-700", badge: "bg-green-100 text-green-700", label: "Normal"   },
  red:   { bg: "bg-red-50",   border: "border-red-300",   texto: "text-red-700",   badge: "bg-red-100 text-red-600",   label: "Atencion" },
  gray:  { bg: "bg-gray-50",  border: "border-gray-200",  texto: "text-gray-600",  badge: "bg-gray-100 text-gray-500", label: "Sin ref"  },
}

const semaforo = (analito) => {
  if (analito.estatus === "normal") return "green"
  if (analito.estatus === "alto")   return "red"
  if (analito.estatus === "bajo")   return "red"
  return "gray"
}

const DIETAS = {
  colesterol_alto: {
    titulo: "Colesterol elevado",
    descripcion: "Dieta para reducir el colesterol LDL y trigliceridos",
    foto: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&auto=format&fit=crop&q=80",
    comer: [
      "Avena y cereales integrales",
      "Salmon, sardinas, atun (omega-3)",
      "Nueces, almendras, aguacate",
      "Aceite de oliva extra virgen",
      "Verduras de hoja verde (espinaca, brocoli)",
      "Leguminosas (lentejas, frijoles, garbanzos)",
      "Frutas con fibra (manzana, pera, naranja)",
    ],
    evitar: [
      "Carnes rojas y embutidos",
      "Productos lacteos enteros",
      "Frituras y comida rapida",
      "Margarinas y grasas trans",
      "Reposteria y galletas industriales",
      "Alcohol en exceso",
    ],
    consejo: "Caminar 30 minutos diarios puede reducir el colesterol LDL hasta un 10% en 3 meses.",
  },
  trigliceridos_altos: {
    titulo: "Trigliceridos elevados",
    descripcion: "Dieta para bajar los trigliceridos en sangre",
    foto: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=400&auto=format&fit=crop&q=80",
    comer: [
      "Pescados grasos 2-3 veces por semana",
      "Verduras sin almidon (calabaza, pepino, apio)",
      "Proteinas magras (pollo sin piel, pavo, claras)",
      "Nueces y semillas (chia, linaza)",
      "Aguacate con moderacion",
      "Aceite de oliva para cocinar",
    ],
    evitar: [
      "Azucar y refrescos azucarados",
      "Pan blanco, arroz blanco, pasta",
      "Jugos de fruta (aunque sean naturales)",
      "Alcohol (aumenta trigliceridos rapidamente)",
      "Miel, mermeladas y dulces",
      "Frutas muy dulces en exceso (mango, platano, uva)",
    ],
    consejo: "Eliminar el alcohol y el azucar por 3 semanas puede reducir los trigliceridos hasta un 30%.",
  },
  glucosa_alta: {
    titulo: "Glucosa elevada",
    descripcion: "Dieta para controlar el azucar en sangre",
    foto: "https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=400&auto=format&fit=crop&q=80",
    comer: [
      "Verduras de hoja verde en abundancia",
      "Proteinas magras en cada comida",
      "Granos enteros (avena, quinoa, cebada)",
      "Canela (mejora sensibilidad a la insulina)",
      "Leguminosas (frijoles, lentejas)",
      "Nueces y semillas",
      "Frutas con bajo indice glucemico (fresa, manzana)",
    ],
    evitar: [
      "Azucar, miel y endulzantes naturales en exceso",
      "Pan blanco y tortillas de harina",
      "Refrescos y jugos",
      "Papas fritas y botanitas",
      "Cereales azucarados",
      "Postres y galletas",
    ],
    consejo: "Comer cada 3-4 horas en porciones moderadas ayuda a mantener el azucar estable durante el dia.",
  },
  general: {
    titulo: "Dieta equilibrada general",
    descripcion: "Plan nutricional para mantener una salud optima",
    foto: "https://images.unsplash.com/photo-1547592180-85f173990554?w=400&auto=format&fit=crop&q=80",
    comer: [
      "Verduras de colores variados en cada comida",
      "Frutas frescas de temporada",
      "Proteinas magras (pollo, pescado, huevo, leguminosas)",
      "Granos enteros (avena, arroz integral, quinoa)",
      "Grasas saludables (aguacate, nueces, aceite de oliva)",
      "Agua — minimo 2 litros al dia",
      "Productos lacteos bajos en grasa",
    ],
    evitar: [
      "Ultraprocesados y comida rapida",
      "Azucar y refrescos en exceso",
      "Sal en exceso",
      "Alcohol",
      "Grasas trans (margarinas, frituras)",
    ],
    consejo: "El plato saludable: la mitad verduras, un cuarto proteinas, un cuarto granos enteros.",
  },
}

function detectarDieta(resultados) {
  if (!resultados || resultados.length === 0) return "general"
  const colesterol = resultados.find((r) => r.analito === "COLESTEROL" && r.estatus === "alto")
  const trigli     = resultados.find((r) => r.analito === "TRIGLICERIDOS" && r.estatus === "alto")
  const glucosa    = resultados.find((r) => r.analito === "GLUCOSA" && r.estatus === "alto")
  if (glucosa)    return "glucosa_alta"
  if (trigli)     return "trigliceridos_altos"
  if (colesterol) return "colesterol_alto"
  return "general"
}

function TarjetaDieta({ dieta, dietaKey, onChange }) {
  const info = DIETAS[dietaKey]
  return (
    <div className="bg-white rounded-2xl shadow overflow-hidden">
      <div className="relative h-40">
        <img src={info.foto} alt={info.titulo} className="w-full h-full object-cover" />
        <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 60%)" }} />
        <div className="absolute bottom-0 left-0 p-4">
          <p className="text-white font-bold text-base">{info.titulo}</p>
          <p className="text-white text-xs opacity-80">{info.descripcion}</p>
        </div>
      </div>

      <div className="p-4">
        <div className="flex gap-2 mb-4 flex-wrap">
          {Object.keys(DIETAS).map((key) => (
            <button
              key={key}
              onClick={() => onChange(key)}
              className={"text-xs px-3 py-1.5 rounded-full font-medium transition-colors " +
                (dietaKey === key ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200")}
            >
              {DIETAS[key].titulo.split(" ")[0]}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <p className="text-xs font-bold text-green-700 uppercase mb-2">Recomendar comer</p>
            <ul className="space-y-1">
              {info.comer.map((item, i) => (
                <li key={i} className="text-xs text-gray-700 flex gap-1.5 items-start">
                  <span className="text-green-500 mt-0.5 flex-shrink-0">+</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-xs font-bold text-red-600 uppercase mb-2">Recomendar evitar</p>
            <ul className="space-y-1">
              {info.evitar.map((item, i) => (
                <li key={i} className="text-xs text-gray-700 flex gap-1.5 items-start">
                  <span className="text-red-400 mt-0.5 flex-shrink-0">-</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="bg-amber-50 border border-amber-200 rounded-xl p-3">
          <p className="text-xs font-semibold text-amber-700 mb-1">Consejo del dia</p>
          <p className="text-xs text-amber-800">{info.consejo}</p>
        </div>
      </div>
    </div>
  )
}

function ResultadosMedico({ paciente }) {
  const resultados = paciente && paciente.estudio ? paciente.estudio.resultados : null
  const info       = paciente && paciente.estudio ? paciente.estudio.paciente   : null
  const resumen    = paciente && paciente.estudio ? paciente.estudio.resumen    : null

  if (!resultados) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-4">
        <p className="text-sm text-yellow-700 font-medium">Este paciente aun no tiene estudios subidos.</p>
      </div>
    )
  }

  return (
    <div className="mb-4">
      {info && (
        <div className="bg-gray-50 rounded-xl p-3 mb-3 flex flex-wrap gap-3 text-xs">
          <span><span className="text-gray-400">Folio: </span><span className="font-medium">{info.folio}</span></span>
          <span><span className="text-gray-400">Edad: </span><span className="font-medium">{info.edad} anos</span></span>
          <span><span className="text-gray-400">Sexo: </span><span className="font-medium">{info.sexo}</span></span>
          <span><span className="text-gray-400">Lab: </span><span className="font-medium">{info.laboratorio}</span></span>
        </div>
      )}
      {resumen && (
        <div className="grid grid-cols-4 gap-2 mb-3">
          <div className="bg-white border border-gray-200 rounded-lg p-2 text-center">
            <p className="text-lg font-bold text-gray-800">{resumen.total_analitos}</p>
            <p className="text-xs text-gray-400">Total</p>
          </div>
          <div className="bg-green-50 border border-green-200 rounded-lg p-2 text-center">
            <p className="text-lg font-bold text-green-700">{resumen.normales}</p>
            <p className="text-xs text-green-600">Normales</p>
          </div>
          <div className="bg-red-50 border border-red-200 rounded-lg p-2 text-center">
            <p className="text-lg font-bold text-red-600">{resumen.altos + resumen.bajos}</p>
            <p className="text-xs text-red-500">Alterados</p>
          </div>
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-2 text-center">
            <p className="text-lg font-bold text-gray-500">{resumen.sin_referencia}</p>
            <p className="text-xs text-gray-400">Sin ref</p>
          </div>
        </div>
      )}
      <div className="grid grid-cols-2 gap-2">
        {resultados.map((analito, i) => {
          const estado = semaforo(analito)
          const c      = colores[estado]
          return (
            <div key={i} className={"rounded-lg border p-3 " + c.bg + " " + c.border}>
              <div className="flex justify-between items-start mb-1">
                <p className="text-xs font-medium text-gray-700">{analito.analito}</p>
                <span className={"text-xs px-1.5 py-0.5 rounded-full font-medium " + c.badge}>{c.label}</span>
              </div>
              <p className={"text-lg font-bold " + c.texto}>
                {analito.prefijo}{analito.valor_raw}
                <span className="text-xs font-normal ml-1 text-gray-400">{analito.unidad}</span>
              </p>
              {analito.ref_low !== null && analito.ref_high !== null && (
                <p className="text-xs text-gray-400 mt-0.5">Ref: {analito.ref_low} a {analito.ref_high}</p>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

function MedicoPanel({ usuario, onLogout }) {
  const [pacientes, setPacientes]       = useState([])
  const [seleccionado, setSeleccionado] = useState(null)
  const [opinion, setOpinion]           = useState("")
  const [enviando, setEnviando]         = useState(false)
  const [exito, setExito]               = useState(false)
  const [vista, setVista]               = useState("resultados")
  const [dietaKey, setDietaKey]         = useState("general")

  useEffect(() => { cargarPacientes() }, [])

  const cargarPacientes = async () => {
    const res   = await fetch(API)
    const datos = await res.json()
    setPacientes(datos.filter((u) => u.rol === "paciente"))
  }

  const seleccionarPaciente = (p) => {
    setSeleccionado(p)
    setOpinion(p.opinion_medico || "")
    setExito(false)
    setVista("resultados")
    const key = detectarDieta(p.estudio ? p.estudio.resultados : null)
    setDietaKey(key)
  }

  const handleEnviarOpinion = async () => {
    if (!opinion.trim()) { alert("Escribe una opinion antes de enviar"); return }
    setEnviando(true)
    await fetch(API + "/" + seleccionado.id, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...seleccionado,
        opinion_medico: opinion,
        fecha_opinion:  new Date().toLocaleDateString("es-MX"),
        medico_nombre:  usuario.nombre,
        dieta_recomendada: dietaKey,
      }),
    })
    setEnviando(false)
    setExito(true)
    cargarPacientes()
    setTimeout(() => setExito(false), 3000)
  }

  const pendientes = pacientes.filter((p) => !p.opinion_medico && p.estudio)
  const atendidos  = pacientes.filter((p) => p.opinion_medico)
  const sinEstudio = pacientes.filter((p) => !p.estudio)

  const FOTOS_PERFIL = [
    "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=80&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=80&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1551601651-2a8555f1a136?w=80&auto=format&fit=crop&q=80",
  ]

  return (
    <div className="min-h-screen bg-gray-100">

      <div className="bg-white shadow px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <img
            src={FOTOS_PERFIL[0]}
            alt="Medico"
            className="w-10 h-10 rounded-full object-cover border-2 border-blue-200"
          />
          <div>
            <h1 className="text-base font-bold text-gray-800">Panel Medico</h1>
            <p className="text-xs text-gray-400">Dr(a). {usuario.nombre}</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          {pendientes.length > 0 && (
            <span className="bg-red-100 text-red-600 text-xs font-medium px-2 py-1 rounded-full">
              {pendientes.length} pendiente{pendientes.length > 1 ? "s" : ""}
            </span>
          )}
          <button onClick={onLogout} className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-xl text-sm transition-colors">
            Cerrar sesion
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-6 grid grid-cols-3 gap-6">

        <div className="col-span-1">
          <h2 className="text-xs font-bold text-gray-500 uppercase mb-3">Pacientes</h2>

          {pendientes.length > 0 && (
            <div className="mb-3">
              <p className="text-xs text-red-500 font-medium mb-1">Pendientes de opinion</p>
              <div className="bg-white rounded-2xl shadow overflow-hidden">
                {pendientes.map((p, i) => (
                  <div key={p.id} onClick={() => seleccionarPaciente(p)}
                    className={"px-4 py-3 border-b border-gray-100 cursor-pointer hover:bg-red-50 transition-colors flex items-center gap-3 " +
                      (seleccionado && seleccionado.id === p.id ? "bg-red-50 border-l-4 border-l-red-400" : "")}>
                    <img src={FOTOS_PERFIL[i % FOTOS_PERFIL.length]} alt="" className="w-8 h-8 rounded-full object-cover flex-shrink-0" />
                    <div>
                      <p className="font-medium text-gray-800 text-sm">{p.nombre}</p>
                      <span className="text-xs text-red-500 font-medium">Sin opinion</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {atendidos.length > 0 && (
            <div className="mb-3">
              <p className="text-xs text-green-600 font-medium mb-1">Con opinion enviada</p>
              <div className="bg-white rounded-2xl shadow overflow-hidden">
                {atendidos.map((p, i) => (
                  <div key={p.id} onClick={() => seleccionarPaciente(p)}
                    className={"px-4 py-3 border-b border-gray-100 cursor-pointer hover:bg-green-50 transition-colors flex items-center gap-3 " +
                      (seleccionado && seleccionado.id === p.id ? "bg-green-50 border-l-4 border-l-green-400" : "")}>
                    <img src={FOTOS_PERFIL[i % FOTOS_PERFIL.length]} alt="" className="w-8 h-8 rounded-full object-cover flex-shrink-0" />
                    <div>
                      <p className="font-medium text-gray-800 text-sm">{p.nombre}</p>
                      <span className="text-xs text-green-600 font-medium">Opinion enviada</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {sinEstudio.length > 0 && (
            <div>
              <p className="text-xs text-gray-400 font-medium mb-1">Sin estudio aun</p>
              <div className="bg-white rounded-2xl shadow overflow-hidden">
                {sinEstudio.map((p, i) => (
                  <div key={p.id} onClick={() => seleccionarPaciente(p)}
                    className={"px-4 py-3 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors flex items-center gap-3 " +
                      (seleccionado && seleccionado.id === p.id ? "bg-gray-50 border-l-4 border-l-gray-300" : "")}>
                    <img src={FOTOS_PERFIL[i % FOTOS_PERFIL.length]} alt="" className="w-8 h-8 rounded-full object-cover flex-shrink-0" />
                    <div>
                      <p className="font-medium text-gray-800 text-sm">{p.nombre}</p>
                      <span className="text-xs text-gray-400">Sin estudio</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {pacientes.length === 0 && (
            <div className="bg-white rounded-2xl shadow p-4 text-center">
              <p className="text-gray-400 text-sm">Sin pacientes registrados</p>
            </div>
          )}
        </div>

        <div className="col-span-2">
          {!seleccionado ? (
            <div className="bg-white rounded-2xl shadow flex flex-col items-center justify-center h-64">
              <p className="text-4xl mb-3">👈</p>
              <p className="text-gray-400 text-sm">Selecciona un paciente de la lista</p>
            </div>
          ) : (
            <div>
              <div className="bg-white rounded-2xl shadow p-6 mb-4">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-gray-800">{seleccionado.nombre}</h3>
                    <p className="text-sm text-gray-400">{seleccionado.correo}</p>
                  </div>
                  <div className="flex gap-2">
                    {["resultados","opinion","dieta"].map((v) => (
                      <button key={v} onClick={() => setVista(v)}
                        className={"text-xs px-3 py-1.5 rounded-xl font-medium transition-colors capitalize " +
                          (vista === v ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200")}>
                        {v}
                      </button>
                    ))}
                  </div>
                </div>

                {vista === "resultados" && <ResultadosMedico paciente={seleccionado} />}

                {vista === "opinion" && (
                  <div>
                    {seleccionado.opinion_medico && (
                      <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-4">
                        <p className="text-xs text-green-600 font-medium mb-1">Opinion enviada el {seleccionado.fecha_opinion}</p>
                        <p className="text-sm text-green-800 leading-relaxed">{seleccionado.opinion_medico}</p>
                      </div>
                    )}
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {seleccionado.opinion_medico ? "Actualizar opinion medica" : "Escribir opinion medica"}
                    </label>
                    <textarea value={opinion} onChange={(e) => setOpinion(e.target.value)} rows={5}
                      className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                      placeholder="Escribe tu evaluacion, diagnostico y recomendaciones basadas en los resultados del paciente..." />
                    <div className="mt-2 p-3 bg-blue-50 border border-blue-100 rounded-xl">
                      <p className="text-xs text-blue-600">Esta opinion sera visible para el paciente en su dashboard junto con la dieta recomendada.</p>
                    </div>
                    {exito && <p className="text-green-600 text-sm mt-2 font-medium">Opinion enviada correctamente.</p>}
                    <button onClick={handleEnviarOpinion} disabled={enviando}
                      className="mt-3 w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl text-sm font-medium disabled:opacity-50 shadow-md transition-colors">
                      {enviando ? "Enviando..." : (seleccionado.opinion_medico ? "Actualizar opinion" : "Enviar opinion")}
                    </button>
                  </div>
                )}

                {vista === "dieta" && (
                  <div>
                    <p className="text-sm text-gray-500 mb-3">
                      Dieta sugerida automaticamente segun los resultados. Puedes cambiarla manualmente.
                    </p>
                    <TarjetaDieta dieta={DIETAS[dietaKey]} dietaKey={dietaKey} onChange={setDietaKey} />
                    <button onClick={handleEnviarOpinion} disabled={enviando}
                      className="mt-4 w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl text-sm font-medium disabled:opacity-50 shadow-md transition-colors">
                      {enviando ? "Guardando..." : "Guardar dieta con la opinion"}
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default MedicoPanel