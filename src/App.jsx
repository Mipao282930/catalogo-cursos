import { useEffect, useState } from 'react'
import { Link, Navigate, Route, Routes, useLocation } from 'react-router-dom'
import Acceso from './pages/Acceso'
import Navbar from './components/Navbar'
import Contacto from './pages/Contacto'
import CursoDetalle from './pages/CursoDetalle'
import Cursos from './pages/Cursos'
import Inicio from './pages/Inicio'
import Inscripcion from './pages/Inscripcion'
import Inscritos from './pages/Inscritos'
import NoEncontrado from './pages/NoEncontrado'

function RutaProtegida({ usuario, cargando, children }) {
  const location = useLocation()

  if (cargando) return <p className="empty-state">Verificando sesión...</p>
  if (!usuario) {
    const destino = { desde: location }

    return (
      <section className="panel acceso-requerido">
        <span className="eyebrow">Acceso para estudiantes</span>
        <h2>Necesitas una cuenta para inscribirte</h2>
        <p className="lead">Regístrate o inicia sesión para reservar tu cupo y consultar tus cursos.</p>
        <div className="acciones">
          <Link className="boton" to="/registro" state={destino}>Crear cuenta</Link>
          <Link className="boton boton-secondary" to="/login" state={destino}>Iniciar sesión</Link>
        </div>
      </section>
    )
  }
  return children
}

function App() {
  const [usuario, setUsuario] = useState(null)
  const [cargandoAuth, setCargandoAuth] = useState(true)
  const [inscritos, setInscritos] = useState([])

  useEffect(() => {
    let activo = true

    const cargarSesion = async () => {
      try {
        const respuestaAuth = await fetch('/api/auth.php')
        const sesion = await respuestaAuth.json()
        if (!respuestaAuth.ok) throw new Error('No se pudo verificar la sesión.')
        if (!activo) return

        setUsuario(sesion.usuario)
        if (sesion.usuario) {
          const respuesta = await fetch('/api/inscripciones.php')
          if (!respuesta.ok) throw new Error('No se pudieron cargar las inscripciones.')
          const registros = await respuesta.json()
          if (activo) setInscritos(registros)
        }
      } catch (error) {
        console.error('No se pudo cargar la sesión:', error)
      } finally {
        if (activo) setCargandoAuth(false)
      }
    }

    cargarSesion()
    return () => {
      activo = false
    }
  }, [])

  const autenticar = async (cuenta) => {
    const respuesta = await fetch('/api/inscripciones.php')
    if (!respuesta.ok) throw new Error('No se pudieron cargar tus inscripciones.')
    const registros = await respuesta.json()
    setUsuario(cuenta)
    setInscritos(registros)
  }

  const cerrarSesion = async () => {
    try {
      const respuesta = await fetch('/api/auth.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ accion: 'logout' }),
      })
      if (!respuesta.ok) throw new Error('No se pudo cerrar la sesión.')
      setUsuario(null)
      setInscritos([])
    } catch (error) {
      console.error(error)
    }
  }

  const agregarInscrito = async (nuevo) => {
    const respuesta = await fetch('/api/inscripciones.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        curso: nuevo.curso,
        modalidad: nuevo.modalidad,
        acepta: nuevo.acepta,
      }),
    })
    const registro = await respuesta.json()
    if (!respuesta.ok) throw new Error(registro.error || 'No se pudo guardar la inscripción.')
    setInscritos((prev) => [registro, ...prev.filter((item) => item.id !== registro.id)])
  }

  const eliminarInscrito = async (id) => {
    const respuesta = await fetch(`/api/inscripciones.php?id=${id}`, { method: 'DELETE' })
    if (!respuesta.ok) throw new Error('No se pudo eliminar la inscripción.')
    setInscritos((prev) => prev.filter((item) => item.id !== id))
  }

  return (
    <>
      <Navbar totalInscritos={inscritos.length} usuario={usuario} onCerrarSesion={cerrarSesion} />
      <main className="contenedor">
        <Routes>
          <Route path="/" element={<Inicio />} />
          <Route path="/cursos" element={<Cursos />} />
          <Route path="/cursos/:id" element={<CursoDetalle />} />
          <Route
            path="/registro"
            element={usuario ? <Navigate to="/cursos" replace /> : <Acceso onAuthenticated={autenticar} />}
          />
          <Route
            path="/login"
            element={usuario ? <Navigate to="/cursos" replace /> : <Acceso onAuthenticated={autenticar} />}
          />
          <Route
            path="/inscripcion"
            element={
              <RutaProtegida usuario={usuario} cargando={cargandoAuth}>
                <Inscripcion usuario={usuario} agregarInscrito={agregarInscrito} />
              </RutaProtegida>
            }
          />
          <Route
            path="/inscritos"
            element={
              <RutaProtegida usuario={usuario} cargando={cargandoAuth}>
                <Inscritos inscritos={inscritos} eliminarInscrito={eliminarInscrito} />
              </RutaProtegida>
            }
          />
          <Route path="/contacto" element={<Contacto />} />
          <Route path="*" element={<NoEncontrado />} />
        </Routes>
      </main>
    </>
  )
}

export default App
