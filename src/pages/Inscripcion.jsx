import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { cursos } from '../data/cursos'

function Inscripcion({ usuario, agregarInscrito }) {
  const ubicacion = useLocation()
  const navigate = useNavigate()

  const [datos, setDatos] = useState({
    nombre: usuario.nombre,
    correo: usuario.correo,
    curso: ubicacion.state?.curso || cursos[0].nombre,
    modalidad: 'Presencial',
    acepta: false,
  })

  const [errores, setErrores] = useState({})
  const [errorApi, setErrorApi] = useState('')
  const [enviando, setEnviando] = useState(false)

  const manejarCambio = (e) => {
    const { name, value, type, checked } = e.target
    setDatos((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  const validar = () => {
    const nuevoError = {}

    if (datos.nombre.trim().length < 3) {
      nuevoError.nombre = 'Mínimo 3 caracteres'
    }

    if (!/^\S+@\S+\.\S+$/.test(datos.correo)) {
      nuevoError.correo = 'Correo no válido'
    }

    if (!datos.acepta) {
      nuevoError.acepta = 'Debe aceptar las condiciones'
    }

    return nuevoError
  }

  const manejarEnvio = async (event) => {
    event.preventDefault()
    const nuevoError = validar()
    setErrores(nuevoError)
    setErrorApi('')

    if (Object.keys(nuevoError).length === 0) {
      setEnviando(true)
      try {
        await agregarInscrito(datos)
        navigate('/inscritos')
      } catch (error) {
        setErrorApi(error.message)
      } finally {
        setEnviando(false)
      }
    }
  }

  return (
    <section className="panel form-panel">
      <div className="detail-header">
        <span className="eyebrow">Inscripción</span>
        <h2>Reserva tu cupo</h2>
      </div>

      <form className="formulario" onSubmit={manejarEnvio}>
        <label>
          Nombre
          <input
            type="text"
            name="nombre"
            value={datos.nombre}
            readOnly
          />
          {errores.nombre && <span className="error">{errores.nombre}</span>}
        </label>

        <label>
          Correo
          <input
            type="email"
            name="correo"
            value={datos.correo}
            readOnly
          />
          {errores.correo && <span className="error">{errores.correo}</span>}
        </label>

        <label>
          Curso
          <select name="curso" value={datos.curso} onChange={manejarCambio}>
            {cursos.map((curso) => (
              <option key={curso.id} value={curso.nombre}>
                {curso.nombre}
              </option>
            ))}
          </select>
        </label>

        <fieldset>
          <legend>Modalidad</legend>
          {['Presencial', 'Virtual'].map((modalidad) => (
            <label key={modalidad} className="radio-item">
              <input
                type="radio"
                name="modalidad"
                value={modalidad}
                checked={datos.modalidad === modalidad}
                onChange={manejarCambio}
              />
              {modalidad}
            </label>
          ))}
        </fieldset>

        <label className="checkbox-item">
          <input
            type="checkbox"
            name="acepta"
            checked={datos.acepta}
            onChange={manejarCambio}
          />
          Acepto las condiciones
        </label>
        {errores.acepta && <span className="error">{errores.acepta}</span>}

        {errorApi && <span className="error">{errorApi}</span>}

        <button type="submit" className="boton" disabled={enviando}>
          {enviando ? 'Guardando...' : 'Inscribirme'}
        </button>
      </form>
    </section>
  )
}

export default Inscripcion
