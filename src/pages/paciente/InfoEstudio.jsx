
function InfoEstudio({ pacienteInfo }) {
  if (!pacienteInfo) return null

  const campos = [
    ["Paciente",      pacienteInfo.paciente_nombre],
    ["Folio",         pacienteInfo.folio],
    ["Edad",          pacienteInfo.edad + " años"],
    ["Sexo",          pacienteInfo.sexo],
    ["Fecha muestra", pacienteInfo.fecha_muestra],
    ["Laboratorio",   pacienteInfo.laboratorio],
  ]

  return (
    <div className="bg-white rounded-2xl shadow p-4 mb-4 flex flex-wrap gap-4 text-sm">
      {campos.map(([etiqueta, valor]) => (
        <div key={etiqueta}>
          <span className="text-gray-400">{etiqueta}: </span>
          <span className="font-semibold text-gray-800">{valor}</span>
        </div>
      ))}
    </div>
  )
}

export default InfoEstudio