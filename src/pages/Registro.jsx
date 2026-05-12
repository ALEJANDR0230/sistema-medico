import { useState } from "react";

const API = "https://69e9c1ee15c7e2d51268ad00.mockapi.io/Clinica/Usuarios";
const FOTO = "https://images.unsplash.com/photo-1631549916768-4119b2e5f926?w=1600&auto=format&fit=crop&q=80";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_REGEX = /^\d{10}$/;

function Registro({ onVolver }) {
  const [paso, setPaso] = useState(1);
  const [cargando, setCargando] = useState(false);
  const [exito, setExito] = useState(false);
  const [errorGeneral, setErrorGeneral] = useState("");

  const [form, setForm] = useState({
    nombre: "",
    apellido: "",
    correo: "",
    password: "",
    confirmar: "",
    telefono: "",
    fecha_nacimiento: "",
    sexo: "",
  });

  const [errores, setErrores] = useState({});

  // Validación en tiempo real
  const validarCampo = (campo, valor) => {
    const nuevosErrores = { ...errores };

    switch (campo) {
      case "nombre":
      case "apellido":
        if (!valor.trim()) {
          nuevosErrores[campo] = "Este campo es obligatorio";
        } else {
          delete nuevosErrores[campo];
        }
        break;

      case "correo":
        if (!valor.trim()) {
          nuevosErrores.correo = "El correo es obligatorio";
        } else if (!EMAIL_REGEX.test(valor)) {
          nuevosErrores.correo = "Ingresa un correo válido";
        } else {
          delete nuevosErrores.correo;
        }
        break;

      case "password":
        if (!valor) {
          nuevosErrores.password = "La contraseña es obligatoria";
        } else if (valor.length < 6) {
          nuevosErrores.password = "Mínimo 6 caracteres";
        } else {
          delete nuevosErrores.password;
        }
        break;

      case "confirmar":
        if (valor !== form.password) {
          nuevosErrores.confirmar = "Las contraseñas no coinciden";
        } else {
          delete nuevosErrores.confirmar;
        }
        break;

      case "telefono":
        if (!valor) {
          nuevosErrores.telefono = "El teléfono es obligatorio";
        } else if (!PHONE_REGEX.test(valor)) {
          nuevosErrores.telefono = "Debe tener 10 dígitos";
        } else {
          delete nuevosErrores.telefono;
        }
        break;

      case "fecha_nacimiento":
        if (!valor) nuevosErrores.fecha_nacimiento = "Selecciona tu fecha de nacimiento";
        else delete nuevosErrores.fecha_nacimiento;
        break;

      case "sexo":
        if (!valor) nuevosErrores.sexo = "Selecciona tu sexo";
        else delete nuevosErrores.sexo;
        break;

      default:
        break;
    }

    setErrores(nuevosErrores);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    setErrorGeneral("");
    validarCampo(name, value);
  };

  const esPasoValido = (numeroPaso) => {
    if (numeroPaso === 1) {
      return (
        form.nombre.trim() &&
        form.apellido.trim() &&
        EMAIL_REGEX.test(form.correo) &&
        form.password.length >= 6 &&
        form.password === form.confirmar &&
        Object.keys(errores).length === 0
      );
    }
    if (numeroPaso === 2) {
      return (
        PHONE_REGEX.test(form.telefono) &&
        form.fecha_nacimiento &&
        form.sexo &&
        Object.keys(errores).length === 0
      );
    }
    return true;
  };

  const handleSiguiente = () => {
    if (esPasoValido(paso)) {
      setPaso(prev => prev + 1);
    }
  };

  const handleRegistrar = async () => {
    if (!esPasoValido(2)) return;

    setCargando(true);
    setErrorGeneral("");

    try {
      const res = await fetch(API);
      const usuarios = await res.json();

      const existe = usuarios.find(u => u.correo?.toLowerCase() === form.correo.toLowerCase());
      if (existe) {
        setErrorGeneral("Ya existe una cuenta con este correo");
        setCargando(false);
        return;
      }

      const edad = new Date().getFullYear() - new Date(form.fecha_nacimiento).getFullYear();

      await fetch(API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nombre: `${form.nombre} ${form.apellido}`,
          correo: form.correo,
          password: form.password,
          rol: "paciente",
          activo: true,
          telefono: form.telefono,
          fecha_nacimiento: form.fecha_nacimiento,
          sexo: form.sexo,
          edad: String(edad),
          opinion_medico: "",
          medico_nombre: "",
          fecha_opinion: "",
          estudio: null,
          dieta_recomendada: null,
        }),
      });

      setExito(true);
    } catch (err) {
      setErrorGeneral("Error al conectar con el servidor. Inténtalo nuevamente.");
    } finally {
      setCargando(false);
    }
  };

  // Pantalla de éxito
  if (exito) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-10 rounded-3xl shadow-xl w-full max-w-md text-center">
          <div className="w-20 h-20 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <span className="text-5xl">✓</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">¡Cuenta creada exitosamente!</h2>
          <p className="text-gray-600 mb-8">Ya puedes iniciar sesión con tus credenciales.</p>
          <button
            onClick={onVolver}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 rounded-2xl transition-all"
          >
            Ir al Inicio de Sesión
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex">
      {/* Panel izquierdo */}
      <div
        className="hidden md:flex md:w-5/12 bg-cover bg-center relative"
        style={{ backgroundImage: `url(${FOTO})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/80 to-indigo-900/70" />
        <div className="relative z-10 flex flex-col justify-end p-12 text-white">
          <div className="mb-6">
            <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center">
              <span className="text-4xl font-bold text-white">SM</span>
            </div>
          </div>
          <h2 className="text-4xl font-bold mb-4">Cuida tu salud</h2>
          <p className="text-lg text-blue-100 leading-relaxed">
            Regístrate y lleva un control completo de tus análisis clínicos en un solo lugar.
          </p>
        </div>
      </div>

      {/* Formulario */}
      <div className="flex-1 flex items-center justify-center bg-gray-50 p-6">
        <div className="w-full max-w-lg">
          <div className="mb-8">
            <button
              onClick={onVolver}
              className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-2 mb-6"
            >
              ← Volver al inicio de sesión
            </button>

            <h1 className="text-3xl font-bold text-gray-800">Crear cuenta</h1>
            <p className="text-gray-500 mt-1">Paso {paso} de 3</p>

            {/* Progress Bar */}
            <div className="flex gap-2 mt-4">
              {[1, 2, 3].map((n) => (
                <div
                  key={n}
                  className={`h-1.5 flex-1 rounded-full transition-all ${
                    n <= paso ? "bg-blue-600" : "bg-gray-200"
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Paso 1: Datos de acceso */}
          {paso === 1 && (
            <div className="space-y-5">
              <p className="text-xs uppercase font-semibold text-gray-500 tracking-widest">Datos de acceso</p>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
                  <input
                    type="text"
                    name="nombre"
                    value={form.nombre}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-2xl px-5 py-3.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Juan"
                  />
                  {errores.nombre && <p className="text-red-500 text-xs mt-1">{errores.nombre}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Apellido</label>
                  <input
                    type="text"
                    name="apellido"
                    value={form.apellido}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-2xl px-5 py-3.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Pérez"
                  />
                  {errores.apellido && <p className="text-red-500 text-xs mt-1">{errores.apellido}</p>}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Correo electrónico</label>
                <input
                  type="email"
                  name="correo"
                  value={form.correo}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-2xl px-5 py-3.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="ejemplo@correo.com"
                />
                {errores.correo && <p className="text-red-500 text-xs mt-1">{errores.correo}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Contraseña</label>
                <input
                  type="password"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-2xl px-5 py-3.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Mínimo 6 caracteres"
                />
                {errores.password && <p className="text-red-500 text-xs mt-1">{errores.password}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Confirmar contraseña</label>
                <input
                  type="password"
                  name="confirmar"
                  value={form.confirmar}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-2xl px-5 py-3.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Repite tu contraseña"
                />
                {errores.confirmar && <p className="text-red-500 text-xs mt-1">{errores.confirmar}</p>}
              </div>
            </div>
          )}

          {/* Paso 2: Datos personales */}
          {paso === 2 && (
            <div className="space-y-5">
              <p className="text-xs uppercase font-semibold text-gray-500 tracking-widest">Datos personales</p>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
                <input
                  type="tel"
                  name="telefono"
                  value={form.telefono}
                  onChange={handleChange}
                  maxLength={10}
                  className="w-full border border-gray-300 rounded-2xl px-5 py-3.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="9511234567"
                />
                {errores.telefono && <p className="text-red-500 text-xs mt-1">{errores.telefono}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Fecha de nacimiento</label>
                <input
                  type="date"
                  name="fecha_nacimiento"
                  value={form.fecha_nacimiento}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-2xl px-5 py-3.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {errores.fecha_nacimiento && <p className="text-red-500 text-xs mt-1">{errores.fecha_nacimiento}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Sexo</label>
                <div className="flex gap-3">
                  {["Masculino", "Femenino"].map((op) => (
                    <button
                      key={op}
                      onClick={() => {
                        setForm(prev => ({ ...prev, sexo: op }));
                        validarCampo("sexo", op);
                      }}
                      className={`flex-1 py-4 rounded-2xl text-sm font-medium border transition-all ${
                        form.sexo === op
                          ? "bg-blue-600 text-white border-blue-600"
                          : "bg-white text-gray-600 border-gray-300 hover:bg-gray-50"
                      }`}
                    >
                      {op}
                    </button>
                  ))}
                </div>
                {errores.sexo && <p className="text-red-500 text-xs mt-1">{errores.sexo}</p>}
              </div>
            </div>
          )}

          {/* Paso 3: Confirmación */}
          {paso === 3 && (
            <div className="space-y-5">
              <p className="text-xs uppercase font-semibold text-gray-500 tracking-widest">Confirmar información</p>
              <div className="bg-gray-50 rounded-3xl p-6 space-y-4 text-sm">
                {[
                  ["Nombre completo", `${form.nombre} ${form.apellido}`],
                  ["Correo", form.correo],
                  ["Teléfono", form.telefono],
                  ["Fecha de nacimiento", form.fecha_nacimiento],
                  ["Sexo", form.sexo],
                ].map(([label, valor]) => (
                  <div key={label} className="flex justify-between">
                    <span className="text-gray-500">{label}</span>
                    <span className="font-medium text-gray-800">{valor}</span>
                  </div>
                ))}
              </div>

              <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 text-xs text-blue-700">
                Tus datos serán utilizados únicamente para el seguimiento de tus estudios clínicos.
              </div>
            </div>
          )}

          {errorGeneral && (
            <div className="mt-6 bg-red-50 border border-red-200 rounded-2xl p-4">
              <p className="text-red-600 text-sm text-center">{errorGeneral}</p>
            </div>
          )}

          {/* Botones de navegación */}
          <div className="flex gap-3 mt-8">
            {paso > 1 ? (
              <button
                onClick={() => setPaso(paso - 1)}
                className="flex-1 border border-gray-300 text-gray-700 py-4 rounded-2xl font-medium hover:bg-gray-50 transition-colors"
              >
                Atrás
              </button>
            ) : (
              <button
                onClick={onVolver}
                className="flex-1 border border-gray-300 text-gray-700 py-4 rounded-2xl font-medium hover:bg-gray-50 transition-colors"
              >
                Ya tengo cuenta
              </button>
            )}

            {paso < 3 ? (
              <button
                onClick={handleSiguiente}
                disabled={!esPasoValido(paso)}
                className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-4 rounded-2xl transition-all"
              >
                Siguiente
              </button>
            ) : (
              <button
                onClick={handleRegistrar}
                disabled={cargando}
                className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-semibold py-4 rounded-2xl transition-all"
              >
                {cargando ? "Creando cuenta..." : "Crear cuenta"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Registro;