
function ResumenEstudio({ resumen }) {
  if (!resumen) return null

  const tarjetas = [
    {
      numero:  resumen.total_analitos,
      etiqueta:"Total",
      estilo:  "bg-white rounded-2xl shadow p-3 text-center",
      color:   "text-gray-800",
      subtexto:"text-gray-400",
    },
    {
      numero:  resumen.normales,
      etiqueta:"Normales",
      estilo:  "bg-green-50 rounded-2xl shadow p-3 text-center border border-green-100",
      color:   "text-green-700",
      subtexto:"text-green-600",
    },
    {
      numero:  resumen.altos + resumen.bajos,
      etiqueta:"Fuera de rango",
      estilo:  "bg-red-50 rounded-2xl shadow p-3 text-center border border-red-100",
      color:   "text-red-600",
      subtexto:"text-red-500",
    },
    {
      numero:  resumen.sin_referencia,
      etiqueta:"Sin referencia",
      estilo:  "bg-gray-50 rounded-2xl shadow p-3 text-center border border-gray-200",
      color:   "text-gray-500",
      subtexto:"text-gray-400",
    },
  ]

  return (
    <div className="grid grid-cols-4 gap-3 mb-4">
      {tarjetas.map(({ numero, etiqueta, estilo, color, subtexto }) => (
        <div key={etiqueta} className={estilo}>
          <p className={"text-2xl font-bold " + color}>{numero}</p>
          <p className={"text-xs mt-0.5 " + subtexto}>{etiqueta}</p>
        </div>
      ))}
    </div>
  )
}

export default ResumenEstudio