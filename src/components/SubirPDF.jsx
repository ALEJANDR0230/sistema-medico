import { useState } from "react"

const API_USUARIOS = "https://69e9c1ee15c7e2d51268ad00.mockapi.io/Clinica/Usuarios"
const API_PYTHON   = "https://web-production-9b0f3.up.railway.app/procesar-pdf"

function SubirPDF({ usuario, onEstudioGuardado }) {
  const [archivo, setArchivo]   = useState(null)
  const [estado, setEstado]     = useState("idle")
  const [error, setError]       = useState("")
  const [progreso, setProgreso] = useState("")

  const handleArchivo = (e) => {
    const file = e.target.files[0]
    if (!file) return

    if (!file.name.endsWith(".pdf")) {
      setError("Solo se aceptan archivos PDF")
      return
    }
    if (file.size > 10 * 1024 * 1024) {
      setError("El archivo es demasiado grande. Máximo 10MB")
      return
    }

    setArchivo(file)
    setError("")
  }

  const handleSubir = async () => {
    if (!archivo) {
      setError("Selecciona un archivo PDF primero")
      return
    }

    setEstado("procesando")
    setError("")

    try {
      setProgreso("Enviando PDF a tu servidor...")

      const formData = new FormData()
      formData.append("pdf", archivo)

      const res = await fetch(API_PYTHON, {
        method: "POST",
        body: formData,
      })

      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error || "Error al procesar el PDF")
      }

      setProgreso("PDF procesado. Guardando resultados...")

      const resultado = await res.json()

      await fetch(`${API_USUARIOS}/${usuario.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...usuario,
          estudio: {
            paciente:     resultado.paciente,
            tipo_estudio: resultado.tipo_estudio,
            resultados:   resultado.resultados,
            resumen:      resultado.resumen,
            documento:    resultado.documento,
          }
        }),
      })

      setProgreso("¡Listo!")
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
      <div className="bg-emerald-50 border border-emerald-200 rounded-3xl p-8 text-center">
        <div className="mx-auto w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mb-4">
          <span className="text-3xl">✓</span>
        </div>
        <h3 className="text-xl font-bold text-emerald-800 mb-2">Estudio procesado correctamente</h3>
        <p className="text-emerald-700 mb-6">Tus resultados ya están disponibles en el dashboard.</p>
        
        <button
          onClick={resetear}
          className="text-emerald-700 hover:text-emerald-800 font-medium underline"
        >
          Subir otro estudio
        </button>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
      <div className="mb-6">
        <h3 className="text-xl font-bold text-gray-800">Subir estudio de laboratorio</h3>
        <p className="text-gray-500 mt-1">Sube el PDF de tus resultados y el sistema los procesará automáticamente.</p>
      </div>

      {estado === "idle" || estado === "error" ? (
        <div>
          <label
            htmlFor="pdf-upload"
            className={`flex flex-col items-center justify-center border-2 border-dashed rounded-2xl py-10 cursor-pointer transition-all ${
              archivo 
                ? "border-blue-400 bg-blue-50" 
                : "border-gray-300 hover:border-blue-400 hover:bg-blue-50"
            }`}
          >
            <div className="text-5xl mb-4">📄</div>
            
            {archivo ? (
              <div className="text-center">
                <p className="font-semibold text-blue-700">{archivo.name}</p>
                <p className="text-xs text-blue-500 mt-1">
                  {(archivo.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
            ) : (
              <div className="text-center">
                <p className="font-medium text-gray-700">Haz clic para seleccionar tu PDF</p>
                <p className="text-xs text-gray-400 mt-1">Solo archivos PDF • Máximo 10MB</p>
              </div>
            )}

            <input
              id="pdf-upload"
              type="file"
              accept=".pdf"
              onChange={handleArchivo}
              className="hidden"
            />
          </label>

          {error && (
            <div className="mt-4 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          <button
            onClick={handleSubir}
            disabled={!archivo}
            className="mt-5 w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-4 rounded-2xl transition-all disabled:cursor-not-allowed"
          >
            Procesar PDF
          </button>

          <div className="mt-5 bg-gray-50 border border-gray-200 rounded-xl p-4 text-xs text-gray-500">
            <p className="font-medium mb-1 text-gray-600">Requisitos del archivo:</p>
            <p>El PDF debe ser digital (no escaneado) para que el sistema pueda leer los valores correctamente.</p>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center py-12">
          <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-5" />
          <p className="text-gray-700 font-medium">{progreso}</p>
          <p className="text-xs text-gray-400 mt-2">Esto puede tardar unos segundos...</p>
        </div>
      )}
    </div>
  )
}

export default SubirPDF