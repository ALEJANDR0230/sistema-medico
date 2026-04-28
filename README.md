<div align="center">

# Sistema de Análisis de Estudios Clínicos


## Descripción general

Sistema web diseñado para **digitalizar el análisis de estudios de sangre** . Permite a los pacientes subir sus resultados en PDF y recibir una interpretación clara, visual y comprensible, además de la evaluación de un médico y recomendaciones personalizadas.

> El sistema transforma datos clínicos complejos en información útil mediante visualización con semáforos de estado y explicaciones en lenguaje sencillo.

---

## Problema que resuelve

Los resultados de laboratorio suelen entregarse en formato PDF o papel **sin explicación clara**, lo que dificulta su interpretación para los pacientes.

| Sin el sistema | Con el sistema |
|---|---|
| Resultados en PDF sin contexto | Interpretación automática de valores |
| Terminología médica confusa | Explicaciones en lenguaje sencillo |
| Sin seguimiento histórico | Gráficas de evolución en el tiempo |
| Sin orientación profesional | Opinión médica y dieta personalizada |

---

## Funcionalidades principales

- **Autenticación por roles** — Administrador, Médico y Paciente
- **Carga de PDFs** — Subida de análisis clínicos directamente desde la app
- **Procesamiento automático** — Extracción e interpretación de resultados con Python
- **Semáforo de resultados** — Indicadores visuales: normal, alto o bajo
- **Gráficas históricas** — Evolución de valores a lo largo del tiempo
- **Opinión médica** — Revisión y notas del médico tratante
- **Asignación de dietas** — Recomendaciones nutricionales personalizadas
- **Mapa de clínicas** — Laboratorios cercanos con Leaflet y OpenStreetMap
- **Edición de perfil** — El paciente puede actualizar sus datos personales

---

## Roles del sistema

<details>
<summary><strong>Administrador</strong></summary>

- Gestión de médicos: crear, editar, activar y desactivar cuentas (baja lógica)

</details>

<details>
<summary><strong>Médico</strong></summary>

- Visualización de pacientes separados en pendientes y atendidos
- Revisión de resultados con semáforo de colores
- Emisión de opiniones médicas
- Asignación de planes de dieta personalizados

</details>

<details>
<summary><strong>Paciente</strong></summary>

- Subida de estudios en PDF
- Consulta de resultados con indicadores visuales y explicaciones expandibles
- Visualización de gráficas de evolución histórica
- Lectura de opinión del médico
- Acceso a dieta recomendada con fotos y listas de alimentos
- Mapa de clínicas cercanas
- Edición de perfil personal

</details>

---

## Flujo del sistema

```
1. El paciente se registra en el sistema
        |
2. Sube su PDF de análisis de sangre
        |
3. Python extrae los analitos y devuelve un JSON estructurado
        |
4. El sistema muestra los resultados con semáforo de colores y explicaciones
        |
5. El médico revisa y emite su opinión médica
        |
6. El médico asigna una dieta personalizada
        |
7. El paciente consulta toda la información en su panel
```

---

## Tecnologías utilizadas

### Frontend

| Tecnología | Versión | Uso |
|---|---|---|
| React | 18 | Librería principal para construir la interfaz |
| Vite | 5+ | Servidor de desarrollo y compilación |
| Tailwind CSS | 3 | Estilos con clases utilitarias |
| React Router | 6 | Navegación entre pantallas sin recarga |
| Recharts | 2 | Gráficas de tendencia histórica de analitos |
| Leaflet.js | 1.9 | Mapa interactivo de clínicas cercanas |
| MockAPI.io | — | Base de datos temporal durante el desarrollo |

---


## Instalación y ejecución

### Requisitos previos

- Node.js 18+
- Python 3.11+
- npm

### 1. Clonar el repositorio

```bash
git clone https://github.com/ALEJANDR0230/sistema-medico.git
cd sistema-medico
```

### 2. Instalar dependencias del frontend

```bash
npm install
```

### 3. Ejecutar el frontend

```bash
npm run dev
```

## Usuarios de prueba

| Rol | Correo | Contraseña |
|---|---|---|
| Administrador | admin@clinica.com | admin123 |
| Médico | medico@clinica.com | medico123 |
| Paciente | paciente@clinica.com | paciente123 |

