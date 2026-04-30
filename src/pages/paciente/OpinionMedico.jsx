
function OpinionMedico({ datos }) {

  // Si el médico ya envió su opinión
  if (datos && datos.opinion_medico) {
    return (
      <div className="bg-white rounded-2xl shadow p-6">

        {/* Datos del médico que firmó la opinión */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
            <span className="text-blue-600 text-lg font-bold">M</span>
          </div>
          <div>
            <p className="font-semibold text-gray-800 text-sm">{datos.medico_nombre}</p>
            <p className="text-xs text-gray-400">{datos.fecha_opinion}</p>
          </div>
        </div>

        {/* Texto de la opinión */}
        <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4">
          <p className="text-gray-700 text-sm leading-relaxed">
            {datos.opinion_medico}
          </p>
        </div>
      </div>
    )
  }

  // Si todavía no hay opinión
  return (
    <div className="bg-white rounded-2xl shadow p-10 text-center">
      <p className="text-4xl mb-3 font-bold text-gray-300">...</p>
      <p className="text-gray-500 font-medium">Esperando opinión del médico</p>
      <p className="text-gray-400 text-sm mt-1">
        Tu médico revisará tus resultados y enviará su opinión pronto.
      </p>
    </div>
  )
}

export default OpinionMedico