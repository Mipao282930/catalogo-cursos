import { useNavigate, useParams } from 'react-router-dom'
import { cursos } from '../data/cursos'

function CursoDetalle() {
  const { id } = useParams()
  const navigate = useNavigate()
  const curso = cursos.find((item) => item.id === Number(id))

  if (!curso) {
    return (
      <section className="panel">
        <h2>El curso no existe.</h2>
        <button className="boton" onClick={() => navigate('/cursos')}>
          Volver
        </button>
      </section>
    )
  }

  return (
    <section className="panel detail-panel">
      <div className="detail-header">
        <span className="eyebrow">Curso destacado</span>
        <h2>{curso.nombre}</h2>
      </div>

      <p className="lead detail-description">{curso.descripcion}</p>

      <div className="detail-grid">
        <div className="detail-info">
          <ul className="lista-detalle">
            <li><strong>Nivel:</strong> {curso.nivel}</li>
            <li><strong>Duración:</strong> {curso.horas} horas</li>
          </ul>
        </div>

        <div className="detail-side">
          <div className="mini-summary">
            <span className="mini-label">Formato</span>
            <strong>{curso.nivel}</strong>
            <small>{curso.horas} horas de aprendizaje</small>
          </div>
        </div>
      </div>

      <div className="acciones">
        <button
          className="boton"
          onClick={() => navigate('/inscripcion', { state: { curso: curso.nombre } })}
        >
          Inscribirme
        </button>
        <button className="boton boton-secondary" onClick={() => navigate(-1)}>
          Volver
        </button>
      </div>
    </section>
  )
}

export default CursoDetalle
