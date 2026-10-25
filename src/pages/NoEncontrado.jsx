import { Link } from 'react-router-dom'

function NoEncontrado() {
  return (
    <section className="panel not-found-panel">
      <span className="eyebrow">Error 404</span>
      <h2>Página no encontrada</h2>
      <p className="lead">La ruta que buscas no existe o fue movida.</p>
      <Link to="/" className="boton">
        Volver al inicio
      </Link>
    </section>
  )
}

export default NoEncontrado
