import { Link, NavLink } from 'react-router-dom'

function Navbar({ totalInscritos, usuario, onCerrarSesion }) {
  const clase = ({ isActive }) => (isActive ? 'enlace activo' : 'enlace')

  return (
    <header className="navbar">
      <Link to="/" className="logo">Catálogo de Cursos</Link>
      <nav className="nav">
        <NavLink to="/" className={clase}>Inicio</NavLink>
        <NavLink to="/cursos" className={clase}>Cursos</NavLink>
        <NavLink to="/inscripcion" className={clase}>Inscripción</NavLink>
        <NavLink to="/inscritos" className={clase}>
          {usuario ? `Mis cursos (${totalInscritos})` : 'Mis cursos'}
        </NavLink>
        {usuario ? (
          <>
            <button type="button" className="enlace boton-salida" onClick={onCerrarSesion}>Salir</button>
          </>
        ) : (
          <>
            <NavLink to="/login" className={clase}>Iniciar sesión</NavLink>
            <NavLink to="/registro" className={clase}>Registrarse</NavLink>
          </>
        )}
        <NavLink to="/contacto" className={clase}>Contacto</NavLink>
      </nav>
    </header>
  )
}

export default Navbar
