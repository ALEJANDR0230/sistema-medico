import { useState } from "react"

const API = "https://69e9c1ee15c7e2d51268ad00.mockapi.io/Clinica/Usuarios"
const FOTO = "https://images.unsplash.com/photo-1579154204601-01588f351e67?w=1600&auto=format&fit=crop&q=80"

function Login({ onLogin, onRegistro }) {
  const [correo, setCorreo]     = useState("")
  const [password, setPassword] = useState("")
  const [error, setError]       = useState("")
  const [cargando, setCargando] = useState(false)

  const handleSubmit = async () => {
    setCargando(true)
    setError("")
    try {
      const res      = await fetch(API)
      const usuarios = await res.json()
      const usuario  = usuarios.find(
        (u) => u.correo === correo && u.password === password && u.activo === true
      )
      if (usuario) {
        localStorage.setItem("usuario", JSON.stringify(usuario))
        onLogin(usuario)
      } else {
        setError("Correo o contrasena incorrectos")
      }
    } catch {
      setError("Error al conectar con el servidor")
    } finally {
      setCargando(false)
    }
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center relative"
      style={{ backgroundImage: `url(${FOTO})` }}
    >
      {/* Overlay oscuro para que se vea bien el contenido */}
      <div className="absolute inset-0 bg-black/50"></div>

      {/* Contenedor del login */}
      <div className="relative z-10 w-full max-w-sm bg-white/90 backdrop-blur-md rounded-2xl p-8 shadow-2xl">

        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <span style={{ fontSize: "28px" }}>🩸</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-800">Sistema Medico</h1>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Correo electronico
          </label>
          <input
            type="email"
            value={correo}
            onChange={(e) => setCorreo(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
            className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            placeholder="correo@ejemplo.com"
          />
        </div>

        <div className="mb-5">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Contrasena
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
            className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            placeholder="••••••••"
          />
        </div>

        {error && (
          <div className="mb-4 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
            <p className="text-red-600 text-sm text-center">{error}</p>
          </div>
        )}

        <button
          onClick={handleSubmit}
          disabled={cargando}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-xl transition-colors disabled:opacity-50 mb-4 text-sm shadow-md"
        >
          {cargando ? "Verificando..." : "Iniciar sesion"}
        </button>

        <div className="text-center">
          <p className="text-sm text-gray-600">
            No tienes cuenta?{" "}
            <button
              onClick={onRegistro}
              className="text-blue-600 font-medium hover:underline"
            >
              Registrate aqui
            </button>
          </p>
        </div>

      </div>
    </div>
  )
}

export default Login