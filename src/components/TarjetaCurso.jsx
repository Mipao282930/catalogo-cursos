import { Link } from 'react-router-dom'

function TarjetaCurso({ curso }) {
  return (
    <article className="tarjeta">
      <span className="badge">{curso.nivel}</span>
      <h3>{curso.nombre}</h3>
      <p>{curso.descripcion}</p>
      <p className="meta">{curso.horas} horas</p>
      <Link to={`/cursos/${curso.id}`} className="boton boton-secondary">
        Ver detalle
      </Link>
    </article>
  )
}

export default TarjetaCurso
