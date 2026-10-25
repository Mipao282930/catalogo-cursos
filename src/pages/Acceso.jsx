import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'

function Acceso({ onAuthenticated }) {
  const location = useLocation()
  const navigate = useNavigate()
  const esRegistro = location.pathname === '/registro'
  const [datos, setDatos] = useState({ nombre: '', correo: '', password: '', confirmar: '' })
  const [error, setError] = useState('')
  const [enviando, setEnviando] = useState(false)

  const manejarCambio = (event) => {
    const { name, value } = event.target
    setDatos((actuales) => ({ ...actuales, [name]: value }))
  }

  const manejarEnvio = async (event) => {
    event.preventDefault()
    setError('')

    if (esRegistro && datos.password !== datos.confirmar) {
      setError('Las contraseñas no coinciden.')
      return
    }

    setEnviando(true)
    try {
      const respuesta = await fetch('/api/auth.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          accion: esRegistro ? 'registro' : 'login',
          nombre: datos.nombre,
          correo: datos.correo,
          password: datos.password,
        }),
      })
      const resultado = await respuesta.json()
      if (!respuesta.ok) throw new Error(resultado.error || 'No se pudo iniciar sesión.')

      await onAuthenticated(resultado.usuario)
      navigate(location.state?.desde?.pathname || '/cursos', {
        replace: true,
        state: location.state?.desde?.state,
      })
    } catch (e) {
      setError(e.message)
    } finally {
      setEnviando(false)
    }
  }

  return (
    <section className="panel form-panel acceso-panel">
      <div className="detail-header">
        <span className="eyebrow">Cuenta de estudiante</span>
        <h2>{esRegistro ? 'Crea tu cuenta' : 'Inicia sesión'}</h2>
        <p className="lead">
          {esRegistro
            ? 'Regístrate para reservar tu cupo y consultar tus cursos.'
            : 'Accede a tus cursos e inscripciones.'}
        </p>
      </div>

      <form className="formulario" onSubmit={manejarEnvio}>
        {esRegistro && (
          <label>
            Nombre completo
            <input
              autoComplete="name"
              name="nombre"
              value={datos.nombre}
              onChange={manejarCambio}
              minLength={3}
              required
            />
          </label>
        )}

        <label>
          Correo electrónico
          <input
            type="email"
            autoComplete="email"
            name="correo"
            value={datos.correo}
            onChange={manejarCambio}
            required
          />
        </label>

        <label>
          Contraseña
          <input
            type="password"
            autoComplete={esRegistro ? 'new-password' : 'current-password'}
            name="password"
            value={datos.password}
            onChange={manejarCambio}
            minLength={8}
            required
          />
        </label>

        {esRegistro && (
          <label>
            Confirma tu contraseña
            <input
              type="password"
              autoComplete="new-password"
              name="confirmar"
              value={datos.confirmar}
              onChange={manejarCambio}
              minLength={8}
              required
            />
          </label>
        )}

        {error && <span className="error">{error}</span>}

        <button type="submit" className="boton" disabled={enviando}>
          {enviando ? 'Procesando...' : esRegistro ? 'Crear cuenta' : 'Iniciar sesión'}
        </button>
      </form>

      <p className="acceso-alternativa">
        {esRegistro ? '¿Ya tienes una cuenta?' : '¿Aún no tienes cuenta?'}{' '}
        <Link to={esRegistro ? '/login' : '/registro'} state={location.state}>
          {esRegistro ? 'Inicia sesión' : 'Regístrate'}
        </Link>
      </p>
    </section>
  )
}

export default Acceso
