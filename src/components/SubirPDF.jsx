import { useState } from "react"

const API_USUARIOS = "https://69e9c1ee15c7e2d51268ad00.mockapi.io/Clinica/Usuarios"
const API_PYTHON   = "http://localhost:5000/procesar-pdf"

function SubirPDF({ usuario, onEstudioGuardado }) {
  const [archivo, setArchivo]     = useState(null)
  const [estado, setEstado]       = useState("idle")
  const [error, setError]         = useState("")
  const [progreso, setProgreso]   = useState("")

  const handleArchivo = (e) => {
    const file = e.target.files[0]
    if (!file) return
    if (!file.name.endsWith(".pdf")) {
      setError("Solo se aceptan archivos PDF")
      return
    }
    if (file.size > 10 * 1024 * 1024) {
      setError("El archivo es demasiado grande. Maximo 10MB")
      return
    }
    setArchivo(file)
    setError("")
  }

  const handleSubir = async () => {
    if (!archivo) { setError("Selecciona un archivo PDF primero"); return }

    setEstado("procesando")
    setError("")

    try {
      setProgreso("Enviando PDF al servidor Python...")
      const formData = new FormData()
      formData.append("pdf", archivo)

      const res = await fetch(API_PYTHON, {
        method: "POST",
        body:   formData,
      })

      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error || "Error al procesar el PDF")
      }

      setProgreso("PDF procesado. Guardando resultados...")
      const resultado = await res.json()

      await fetch(API_USUARIOS + "/" + usuario.id, {
        method:  "PUT",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({
          ...usuario,
          estudio: {
            paciente:    resultado.paciente,
            tipo_estudio: resultado.tipo_estudio,
            resultados:  resultado.resultados,
            resumen:     resultado.resumen,
            documento:   resultado.documento,
          }
        }),
      })

      setProgreso("Listo")
      setEstado("exito")
      setArchivo(null)
      if (onEstudioGuardado) onEstudioGuardado()

    } catch (err) {
      setError(err.message)
      setEstado("error")
    }
  }

  const resetear = () => {
    setEstado("idle")
    setError("")
    setProgreso("")
    setArchivo(null)
  }

  if (estado === "exito") {
    return (
      <div className="bg-green-50 border border-green-300 rounded-xl p-6 text-center">
        <p className="text-3xl mb-2">🎉</p>
        <h3 className="text-lg font-bold text-green-800 mb-1">Estudio procesado</h3>
        <p className="text-sm text-green-700 mb-4">
          Tus resultados ya estan disponibles en el dashboard.
        </p>
        <button
          onClick={resetear}
          className="text-sm text-green-700 underline hover:no-underline"
        >
          Subir otro estudio
        </button>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl shadow p-6">
      <h3 className="text-base font-bold text-gray-800 mb-1">Subir estudio de laboratorio</h3>
      <p className="text-sm text-gray-400 mb-4">
        Sube el PDF de tus resultados y el sistema los procesara automaticamente.
      </p>

      {estado === "idle" || estado === "error" ? (
        <div>
          <label
            htmlFor="pdf-input"
            className={"flex flex-col items-center justify-center border-2 border-dashed rounded-xl py-8 px-4 cursor-pointer transition-colors " +
              (archivo ? "border-blue-400 bg-blue-50" : "border-gray-300 hover:border-blue-400 hover:bg-blue-50")}
          >
            <p className="text-3xl mb-2">📄</p>
            {archivo ? (
              <div className="text-center">
                <p className="text-sm font-medium text-blue-700">{archivo.name}</p>
                <p className="text-xs text-blue-500 mt-1">
                  {(archivo.size / 1024).toFixed(1)} KB
                </p>
              </div>
            ) : (
              <div className="text-center">
                <p className="text-sm font-medium text-gray-600">Haz clic para seleccionar</p>
                <p className="text-xs text-gray-400 mt-1">Solo archivos PDF, maximo 10MB</p>
              </div>
            )}
            <input
              id="pdf-input"
              type="file"
              accept=".pdf"
              onChange={handleArchivo}
              className="hidden"
            />
          </label>

          {error && (
            <div className="mt-3 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          <button
            onClick={handleSubir}
            disabled={!archivo}
            className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg text-sm font-medium disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            Procesar PDF
          </button>

          <div className="mt-3 p-3 bg-gray-50 border border-gray-200 rounded-lg">
            <p className="text-xs text-gray-500 font-medium mb-1">Requisitos del archivo:</p>
            <p className="text-xs text-gray-400">El PDF debe ser digital (no escaneado) para que el sistema pueda leer los valores correctamente.</p>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center py-8">
          <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-4" />
          <p className="text-sm text-gray-600 font-medium">{progreso}</p>
          <p className="text-xs text-gray-400 mt-1">Esto puede tardar unos segundos...</p>
        </div>
      )}
    </div>
  )
}

export default SubirPDF