
import SubirPDF from "../../components/SubirPDF"

function SinEstudios({ usuario, onEstudioSubido }) {
  return (
    <div>
      {/* Mensaje informativo */}
      <div className="bg-white rounded-2xl shadow p-10 text-center mb-6">
        <p className="text-5xl mb-4 font-black text-gray-200">?</p>
        <h2 className="text-xl font-bold text-gray-700 mb-2">
          Aún no tienes estudios
        </h2>
        <p className="text-gray-400 text-sm">
          Sube el PDF de tu análisis de sangre para ver tus resultados,
          recibir la opinión de tu médico y obtener recomendaciones personalizadas.
        </p>
      </div>

      {/* Formulario de subida */}
      <SubirPDF usuario={usuario} onEstudioGuardado={onEstudioSubido} />
    </div>
  )
}

export default SinEstudios