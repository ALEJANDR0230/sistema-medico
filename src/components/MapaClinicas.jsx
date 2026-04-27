import { useEffect, useState } from "react"
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet"
import "leaflet/dist/leaflet.css"
import L from "leaflet"

delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl:       "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl:     "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
})

const CLINICAS = [
  { id: 1, nombre: "Laboratorio Médico Central", direccion: "Av. Independencia 123", tel: "951-123-4567", lat: 17.0732, lng: -96.7266 },
  { id: 2, nombre: "Clínica San Rafael",         direccion: "Calle Reforma 456",     tel: "951-234-5678", lat: 17.0701, lng: -96.7198 },
  { id: 3, nombre: "Centro de Análisis Clínicos", direccion: "Blvd. Juárez 789",     tel: "951-345-6789", lat: 17.0768, lng: -96.7312 },
]

function MapaClinicas() {
  const [posicion, setPosicion] = useState(null)
  const [error, setError]       = useState("")

  useEffect(() => {
    if (!navigator.geolocation) {
      setError("Tu navegador no soporta geolocalización")
      return
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => setPosicion([pos.coords.latitude, pos.coords.longitude]),
      ()    => setPosicion([17.0732, -96.7266])
    )
  }, [])

  if (!posicion) return (
    <div className="bg-white rounded-xl shadow p-6 text-center">
      <p className="text-gray-400 text-sm">Obteniendo tu ubicación...</p>
    </div>
  )

  return (
    <div className="bg-white rounded-xl shadow overflow-hidden">
      <div className="px-4 py-3 border-b border-gray-100">
        <h3 className="text-sm font-bold text-gray-700">Clínicas y laboratorios cercanos</h3>
        <p className="text-xs text-gray-400">Encuentra dónde realizar tu próximo estudio</p>
      </div>

      <MapContainer center={posicion} zoom={14} style={{ height: "320px", width: "100%" }}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

        {/* Pin de tu ubicación */}
        <Marker position={posicion}>
          <Popup>Tu ubicación actual</Popup>
        </Marker>

        {/* Pins de clínicas */}
        {CLINICAS.map((c) => (
          <Marker key={c.id} position={[c.lat, c.lng]}>
            <Popup>
              <strong>{c.nombre}</strong><br />
              {c.direccion}<br />
              Tel: {c.tel}
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      {/* Lista de clínicas */}
      <div className="divide-y divide-gray-100">
        {CLINICAS.map((c) => (
          <div key={c.id} className="px-4 py-3 flex justify-between items-center">
            <div>
              <p className="text-sm font-medium text-gray-800">{c.nombre}</p>
              <p className="text-xs text-gray-400">{c.direccion}</p>
            </div>
            <a href={`tel:${c.tel}`} className="text-xs text-blue-600 font-medium hover:underline">
              {c.tel}
            </a>
          </div>
        ))}
      </div>
    </div>
  )
}

export default MapaClinicas