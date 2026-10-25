import { Link } from 'react-router-dom'
import Reloj from '../components/Reloj'

function Inicio() {
  return (
    <section className="hero-panel">
      <div className="hero-copy">
        <span className="eyebrow">Plataforma educativa</span>
        <h1>Aprende habilidades que impulsan tu carrera.</h1>
        <p className="lead">
          Consulta los cursos disponibles, revisa su detalle e inscríbete en
          programas diseñados para ayudarte a crecer profesionalmente.
        </p>
        <div className="hero-actions">
          <Link to="/cursos" className="boton">
            Ver cursos
          </Link>
          <Link to="/inscripcion" className="boton boton-secondary">
            Inscribirme
          </Link>
        </div>
        <Reloj />

        <div className="hero-stats">
          <div className="stat-card">
            <strong>5</strong>
            <span>Cursos</span>
          </div>
          <div className="stat-card">
            <strong>3</strong>
            <span>Niveles</span>
          </div>
          <div className="stat-card">
            <strong>100%</strong>
            <span>Práctico</span>
          </div>
        </div>
      </div>

      <div className="hero-visual">
        <div className="image-frame">
          <img
            src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=900&q=80"
            alt="Estudiantes aprendiendo"
          />
        </div>

        <div className="floating-badge badge-top">
          <span className="dot" />
          +2.4k estudiantes activos
        </div>

        <div className="floating-card card-bottom">
          <span className="mini-label">Curso destacado</span>
          <strong>Frontend con React</strong>
          <small>Nuevo · 60 horas</small>
        </div>
      </div>
    </section>
  )
}

export default Inicio
