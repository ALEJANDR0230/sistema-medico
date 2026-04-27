import { useState } from "react"
import Login from "./pages/Login"
import Registro from "./pages/Registro"
import AdminPanel from "./pages/AdminPanel"
import MedicoPanel from "./pages/MedicoPanel"
import PacientePanel from "./pages/PacientePanel"

function App() {
  const usuarioGuardado = JSON.parse(localStorage.getItem("usuario"))
  const [usuario, setUsuario]   = useState(usuarioGuardado)
  const [pantalla, setPantalla] = useState("login")

  const handleLogin = (u) => {
    setUsuario(u)
    setPantalla("login")
  }

  const handleLogout = () => {
    localStorage.removeItem("usuario")
    setUsuario(null)
    setPantalla("login")
  }

  if (!usuario) {
    if (pantalla === "registro") {
      return <Registro onVolver={() => setPantalla("login")} />
    }
    return <Login onLogin={handleLogin} onRegistro={() => setPantalla("registro")} />
  }

  if (usuario.rol === "administrador") return <AdminPanel    usuario={usuario} onLogout={handleLogout} />
  if (usuario.rol === "medico")        return <MedicoPanel   usuario={usuario} onLogout={handleLogout} />
  if (usuario.rol === "paciente")      return <PacientePanel usuario={usuario} onLogout={handleLogout} />
}

export default App