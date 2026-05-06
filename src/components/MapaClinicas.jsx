// ─────────────────────────────────────────────────────────────
//  COMPONENTE: MapaClinicas
//  ARCHIVO: components/MapaClinicas.jsx
//
//  DESCRIPCIÓN:
//    Mapa interactivo que muestra clínicas y laboratorios
//    cercanos a la ubicación del paciente.
//
//  FUNCIONALIDADES:
//    - Geolocalización automática del paciente
//    - Búsqueda por nombre o dirección
//    - Filtro por tipo: todos, laboratorio, clínica, especialidad
//    - Distancia calculada desde la ubicación del usuario
//    - Lista ordenada por distancia (más cercano primero)
//    - Al seleccionar una clínica: se centra en el mapa
//      y abre Google Maps con la ruta desde tu ubicación
//    - Información completa: horarios, teléfono, tipo
//
//  DEPENDENCIAS:
//    npm install leaflet react-leaflet
// ─────────────────────────────────────────────────────────────

import { useState, useEffect } from "react"
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet"
import L from "leaflet"
import "leaflet/dist/leaflet.css"

// Corregir ícono de Leaflet en Vite
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl:       "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl:     "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
})

// ── CATÁLOGO DE CLÍNICAS ──────────────────────────────────────
// Para agregar una clínica nueva, copia un objeto y llena los datos
const CLINICAS = [
  {
    id:        1,
    nombre:    "Laboratorio Juárez",
    tipo:      "laboratorio",
    direccion: "Av. Independencia 123, Centro, Oaxaca",
    telefono:  "951-516-0101",
    horario:   "Lun-Vie 7:00-19:00 / Sáb 7:00-14:00",
    lat:       17.0732,
    lng:       -96.7266,
  },
  {
    id:        2,
    nombre:    "Clínica San Rafael",
    tipo:      "clinica",
    direccion: "Calle Reforma 456, Oaxaca",
    telefono:  "951-516-2345",
    horario:   "Lun-Dom 8:00-22:00",
    lat:       17.0701,
    lng:       -96.7198,
  },
  {
    id:        3,
    nombre:    "Centro de Análisis Clínicos",
    tipo:      "laboratorio",
    direccion: "Blvd. Juárez 789, Oaxaca",
    telefono:  "951-516-3456",
    horario:   "Lun-Vie 6:30-18:00 / Sáb 6:30-13:00",
    lat:       17.0768,
    lng:       -96.7312,
  },
  {
    id:        4,
    nombre:    "Hospital Regional de Oaxaca",
    tipo:      "especialidad",
    direccion: "Av. Juárez 100, Oaxaca Centro",
    telefono:  "951-502-0300",
    horario:   "24 horas los 365 días",
    lat:       17.0654,
    lng:       -96.7189,
  },
  {
    id:        5,
    nombre:    "Laboratorios BioMed",
    tipo:      "laboratorio",
    direccion: "Calle Pino Suárez 55, Oaxaca",
    telefono:  "951-516-7890",
    horario:   "Lun-Sáb 7:00-17:00",
    lat:       17.0712,
    lng:       -96.7241,
  },
  {
    id:        6,
    nombre:    "Clínica del Valle",
    tipo:      "clinica",
    direccion: "Periférico 210, Col. del Valle, Oaxaca",
    telefono:  "951-516-4567",
    horario:   "Lun-Vie 9:00-21:00 / Sáb 9:00-15:00",
    lat:       17.0789,
    lng:       -96.7345,
  },
]

// ── COLORES Y ETIQUETAS POR TIPO ──────────────────────────────
const TIPOS = {
  laboratorio: { etiqueta: "Laboratorio",  color: "bg-blue-100 text-blue-700"   },
  clinica:     { etiqueta: "Clínica",      color: "bg-green-100 text-green-700" },
  especialidad:{ etiqueta: "Especialidad", color: "bg-purple-100 text-purple-700"},
}

// ── FUNCIÓN: calcular distancia entre dos coordenadas (km) ────
// Usa la fórmula de Haversine
function calcularDistancia(lat1, lng1, lat2, lng2) {
  const R    = 6371
  const dLat = (lat2 - lat1) * Math.PI / 180
  const dLng = (lng2 - lng1) * Math.PI / 180
  const a    = Math.sin(dLat/2) * Math.sin(dLat/2) +
               Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
               Math.sin(dLng/2) * Math.sin(dLng/2)
  const c    = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

// ── FUNCIÓN: abrir Google Maps con ruta desde tu ubicación ────
function abrirRuta(posicionUsuario, clinica) {
  const origen  = posicionUsuario[0] + "," + posicionUsuario[1]
  const destino = clinica.lat + "," + clinica.lng
  const url     = "https://www.google.com/maps/dir/" + origen + "/" + destino
  window.open(url, "_blank")
}

// ─────────────────────────────────────────────────────────────
//  SUBCOMPONENTE: Centrar el mapa al seleccionar una clínica
// ─────────────────────────────────────────────────────────────
function CentrarMapa({ posicion }) {
  const mapa = useMap()
  useEffect(() => {
    if (posicion) mapa.setView(posicion, 16, { animate: true })
  }, [posicion, mapa])
  return null
}

// ─────────────────────────────────────────────────────────────
//  SUBCOMPONENTE: Tarjeta de una clínica en la lista lateral
// ─────────────────────────────────────────────────────────────
function TarjetaClinica({ clinica, distancia, seleccionada, posicionUsuario, onSeleccionar }) {
  const tipo = TIPOS[clinica.tipo]

  return (
    <div
      onClick={() => onSeleccionar(clinica)}
      className={"p-4 border-b border-gray-100 cursor-pointer transition-colors " +
        (seleccionada ? "bg-blue-50 border-l-4 border-l-blue-500" : "hover:bg-gray-50")}
    >
      {/* Nombre y tipo */}
      <div className="flex justify-between items-start mb-1">
        <p className="font-semibold text-gray-800 text-sm leading-tight pr-2">
          {clinica.nombre}
        </p>
        <span className={"text-xs px-2 py-0.5 rounded-full font-medium flex-shrink-0 " + tipo.color}>
          {tipo.etiqueta}
        </span>
      </div>

      {/* Dirección */}
      <p className="text-xs text-gray-400 mb-1">{clinica.direccion}</p>

      {/* Distancia */}
      {distancia !== null && (
        <p className="text-xs text-blue-600 font-medium mb-2">
          {distancia < 1
            ? Math.round(distancia * 1000) + " m de distancia"
            : distancia.toFixed(1) + " km de distancia"}
        </p>
      )}

      {/* Horario y teléfono */}
      <div className="space-y-0.5">
        <p className="text-xs text-gray-500">
          <span className="font-medium">Horario: </span>{clinica.horario}
        </p>
        <p className="text-xs text-gray-500">
          <span className="font-medium">Tel: </span>{clinica.telefono}
        </p>
      </div>

      {/* Botón de ruta — solo si el usuario dio permisos */}
      {posicionUsuario && seleccionada && (
        <button
          onClick={(e) => { e.stopPropagation(); abrirRuta(posicionUsuario, clinica) }}
          className="mt-3 w-full bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium py-1.5 rounded-lg transition-colors"
        >
          Ver ruta en Google Maps
        </button>
      )}
    </div>
  )
}

// ─────────────────────────────────────────────────────────────
//  COMPONENTE PRINCIPAL: MapaClinicas
// ─────────────────────────────────────────────────────────────
function MapaClinicas() {

  const [posicionUsuario, setPosicionUsuario] = useState(null)
  const [errorGeo,        setErrorGeo]        = useState("")
  const [seleccionada,    setSeleccionada]     = useState(null)
  const [busqueda,        setBusqueda]         = useState("")
  const [filtroTipo,      setFiltroTipo]       = useState("todos")
  const [centrando,       setCentrando]        = useState(null)

  // Pedir ubicación al cargar
  useEffect(() => {
    if (!navigator.geolocation) {
      setErrorGeo("Tu navegador no soporta geolocalización")
      return
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => setPosicionUsuario([pos.coords.latitude, pos.coords.longitude]),
      ()    => {
        setErrorGeo("No se pudo obtener tu ubicación. Mostrando mapa de Oaxaca.")
        setPosicionUsuario([17.0732, -96.7266])
      }
    )
  }, [])

  // Calcular distancia de cada clínica al usuario
  const clinicasConDistancia = CLINICAS.map((c) => ({
    ...c,
    distancia: posicionUsuario
      ? calcularDistancia(posicionUsuario[0], posicionUsuario[1], c.lat, c.lng)
      : null,
  }))

  // Aplicar filtros y ordenar por distancia
  const clinicasFiltradas = clinicasConDistancia
    .filter((c) => {
      const coincideTexto = busqueda === "" ||
        c.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
        c.direccion.toLowerCase().includes(busqueda.toLowerCase())
      const coincideTipo = filtroTipo === "todos" || c.tipo === filtroTipo
      return coincideTexto && coincideTipo
    })
    .sort((a, b) => {
      if (a.distancia === null) return 1
      if (b.distancia === null) return -1
      return a.distancia - b.distancia
    })

  const alSeleccionar = (clinica) => {
    setSeleccionada(clinica)
    setCentrando([clinica.lat, clinica.lng])
  }

  // Posición inicial del mapa
  const posicionInicial = posicionUsuario || [17.0732, -96.7266]

  if (!posicionUsuario) {
    return (
      <div className="bg-white rounded-2xl shadow p-8 text-center">
        <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-3" />
        <p className="text-gray-500 text-sm">Obteniendo tu ubicación...</p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-2xl shadow overflow-hidden">

      {/* Aviso si no hubo permisos de geo */}
      {errorGeo && (
        <div className="bg-amber-50 border-b border-amber-200 px-4 py-2">
          <p className="text-xs text-amber-700">{errorGeo}</p>
        </div>
      )}

      <div className="grid grid-cols-3" style={{ height: "520px" }}>

        {/* ── PANEL LATERAL IZQUIERDO ── */}
        <div className="col-span-1 border-r border-gray-100 flex flex-col">

          {/* Búsqueda */}
          <div className="p-3 border-b border-gray-100">
            <input
              type="text"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              placeholder="Buscar clínica o laboratorio..."
              className="w-full border border-gray-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
            />
          </div>

          {/* Filtros por tipo */}
          <div className="px-3 py-2 border-b border-gray-100 flex gap-1 flex-wrap">
            {[
              ["todos",       "Todos"],
              ["laboratorio", "Laboratorio"],
              ["clinica",     "Clínica"],
              ["especialidad","Especialidad"],
            ].map(([valor, etiqueta]) => (
              <button
                key={valor}
                onClick={() => setFiltroTipo(valor)}
                className={"text-xs px-2 py-1 rounded-lg font-medium transition-colors " +
                  (filtroTipo === valor
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200")}
              >
                {etiqueta}
              </button>
            ))}
          </div>

          {/* Contador de resultados */}
          <div className="px-3 py-1.5 border-b border-gray-100">
            <p className="text-xs text-gray-400">
              {clinicasFiltradas.length} resultado{clinicasFiltradas.length !== 1 ? "s" : ""}
              {posicionUsuario && " · ordenados por distancia"}
            </p>
          </div>

          {/* Lista de clínicas */}
          <div className="flex-1 overflow-y-auto">
            {clinicasFiltradas.length === 0 ? (
              <div className="p-6 text-center">
                <p className="text-gray-400 text-sm">No se encontraron resultados</p>
              </div>
            ) : (
              clinicasFiltradas.map((clinica) => (
                <TarjetaClinica
                  key={clinica.id}
                  clinica={clinica}
                  distancia={clinica.distancia}
                  seleccionada={seleccionada?.id === clinica.id}
                  posicionUsuario={posicionUsuario}
                  onSeleccionar={alSeleccionar}
                />
              ))
            )}
          </div>
        </div>

        {/* ── MAPA ── */}
        <div className="col-span-2">
          <MapContainer
            center={posicionInicial}
            zoom={14}
            style={{ height: "100%", width: "100%" }}
          >
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

            {/* Centra el mapa al seleccionar una clínica */}
            {centrando && <CentrarMapa posicion={centrando} />}

            {/* Pin del usuario */}
            {posicionUsuario && (
              <Marker position={posicionUsuario}>
                <Popup>
                  <strong>Tu ubicación</strong>
                </Popup>
              </Marker>
            )}

            {/* Pins de clínicas filtradas */}
            {clinicasFiltradas.map((clinica) => {
              const tipo = TIPOS[clinica.tipo]
              return (
                <Marker
                  key={clinica.id}
                  position={[clinica.lat, clinica.lng]}
                  eventHandlers={{ click: () => alSeleccionar(clinica) }}
                >
                  <Popup>
                    <div style={{ minWidth: "180px" }}>
                      <p style={{ fontWeight: "bold", marginBottom: "4px" }}>
                        {clinica.nombre}
                      </p>
                      <p style={{ fontSize: "12px", color: "#64748b", marginBottom: "4px" }}>
                        {clinica.direccion}
                      </p>
                      <p style={{ fontSize: "12px", marginBottom: "2px" }}>
                        <strong>Tel:</strong> {clinica.telefono}
                      </p>
                      <p style={{ fontSize: "12px", marginBottom: "8px" }}>
                        <strong>Horario:</strong> {clinica.horario}
                      </p>
                      {posicionUsuario && (
                        <button
                          onClick={() => abrirRuta(posicionUsuario, clinica)}
                          style={{
                            width: "100%", background: "#2563eb", color: "white",
                            border: "none", borderRadius: "6px", padding: "4px 8px",
                            fontSize: "12px", cursor: "pointer", fontWeight: "500"
                          }}
                        >
                          Ver ruta en Google Maps
                        </button>
                      )}
                    </div>
                  </Popup>
                </Marker>
              )
            })}
          </MapContainer>
        </div>
      </div>

      {/* Instrucciones en el pie */}
      <div className="px-4 py-2 bg-gray-50 border-t border-gray-100">
        <p className="text-xs text-gray-400 text-center">
          Selecciona una clínica de la lista o haz clic en un pin del mapa para ver la ruta
        </p>
      </div>
    </div>
  )
}

export default MapaClinicas