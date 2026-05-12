import { useState } from "react";

const API = "https://69e9c1ee15c7e2d51268ad00.mockapi.io/Clinica/Usuarios";
const FOTO = "https://images.unsplash.com/photo-1579154204601-01588f351e67?w=1600&auto=format&fit=crop&q=80";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function Login({ onLogin, onRegistro }) {
  const [form, setForm] = useState({
    correo: "",
    password: "",
  });

  const [errores, setErrores] = useState({});
  const [errorGeneral, setErrorGeneral] = useState("");
  const [cargando, setCargando] = useState(false);
  const [mostrarPassword, setMostrarPassword] = useState(false);

  const validarCampo = (campo, valor) => {
    const nuevosErrores = { ...errores };

    if (campo === "correo") {
      if (!valor.trim()) {
        nuevosErrores.correo = "El correo es obligatorio";
      } else if (!EMAIL_REGEX.test(valor)) {
        nuevosErrores.correo = "Ingresa un correo electrónico válido";
      } else {
        delete nuevosErrores.correo;
      }
    }

    if (campo === "password") {
      if (!valor) {
        nuevosErrores.password = "La contraseña es obligatoria";
      } else if (valor.length < 6) {
        nuevosErrores.password = "La contraseña debe tener al menos 6 caracteres";
      } else {
        delete nuevosErrores.password;
      }
    }

    setErrores(nuevosErrores);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    setErrorGeneral("");
    validarCampo(name, value);
  };

  const esFormularioValido = () => {
    return (
      form.correo.trim() !== "" &&
      EMAIL_REGEX.test(form.correo) &&
      form.password.length >= 6 &&
      Object.keys(errores).length === 0
    );
  };

  const handleSubmit = async () => {
    if (!esFormularioValido()) {
      setErrorGeneral("Por favor corrige los errores antes de continuar");
      return;
    }

    setCargando(true);
    setErrorGeneral("");

    try {
      const res = await fetch(API);
      if (!res.ok) throw new Error("Error de conexión");

      const usuarios = await res.json();
      
      const usuario = usuarios.find(
        (u) => 
          u.correo?.toLowerCase() === form.correo.toLowerCase() && 
          u.password === form.password && 
          u.activo === true
      );

      if (usuario) {
        localStorage.setItem("usuario", JSON.stringify(usuario));
        onLogin(usuario);
      } else {
        setErrorGeneral("Correo o contraseña incorrectos");
      }
    } catch (err) {
      setErrorGeneral("Error al conectar con el servidor. Inténtalo de nuevo.");
      console.error(err);
    } finally {
      setCargando(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSubmit();
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center relative"
      style={{ backgroundImage: `url(${FOTO})` }}
    >
      <div className="absolute inset-0 bg-black/60"></div>

      <div className="relative z-10 w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden">
        
        {/* Header con nuevo logo */}
        <div className="bg-gradient-to-r from-blue-700 to-indigo-700 px-8 py-10 text-white text-center">
          <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
            <span className="text-4xl font-bold text-blue-700 tracking-tighter">SM</span>
          </div>
          <h1 className="text-3xl font-bold">Sistema Médico</h1>
          <p className="text-blue-100 mt-2 text-lg">Bienvenido de nuevo</p>
        </div>

        <div className="p-8">
          <div className="space-y-6">
            {/* Correo */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Correo electrónico
              </label>
              <input
                type="email"
                name="correo"
                value={form.correo}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                className={`w-full border rounded-2xl px-5 py-3.5 text-sm focus:outline-none focus:ring-2 transition-all
                  ${errores.correo 
                    ? "border-red-300 focus:ring-red-200" 
                    : "border-gray-300 focus:ring-blue-500"}`}
                placeholder="paciente@ejemplo.com"
                autoComplete="email"
              />
              {errores.correo && (
                <p className="text-red-500 text-xs mt-1.5">{errores.correo}</p>
              )}
            </div>

            {/* Contraseña */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Contraseña
              </label>
              <div className="relative">
                <input
                  type={mostrarPassword ? "text" : "password"}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  onKeyDown={handleKeyDown}
                  className={`w-full border rounded-2xl px-5 py-3.5 text-sm focus:outline-none focus:ring-2 transition-all pr-12
                    ${errores.password 
                      ? "border-red-300 focus:ring-red-200" 
                      : "border-gray-300 focus:ring-blue-500"}`}
                  placeholder="••••••••"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setMostrarPassword(!mostrarPassword)}
                  className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 font-medium text-sm"
                >
                  {mostrarPassword ? "Ocultar" : "Mostrar"}
                </button>
              </div>
              {errores.password && (
                <p className="text-red-500 text-xs mt-1.5">{errores.password}</p>
              )}
            </div>
          </div>

          {/* Error general */}
          {errorGeneral && (
            <div className="mt-6 bg-red-50 border border-red-200 rounded-2xl p-4">
              <p className="text-red-600 text-sm text-center font-medium">
                {errorGeneral}
              </p>
            </div>
          )}

          {/* Botón */}
          <button
            onClick={handleSubmit}
            disabled={cargando || !esFormularioValido()}
            className="w-full mt-8 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-4 rounded-2xl text-base transition-all shadow-lg disabled:shadow-none"
          >
            {cargando ? "Verificando credenciales..." : "Iniciar Sesión"}
          </button>

          {/* Registro */}
          <div className="text-center mt-6">
            <p className="text-sm text-gray-600">
              ¿No tienes cuenta?{" "}
              <button
                onClick={onRegistro}
                className="text-blue-600 hover:text-blue-700 font-semibold hover:underline"
              >
                Regístrate aquí
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;