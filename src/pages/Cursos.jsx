import { useState } from 'react'
import { cursos } from '../data/cursos'
import TarjetaCurso from '../components/TarjetaCurso'

function Cursos() {
  const [busqueda, setBusqueda] = useState('')
  const [nivel, setNivel] = useState('Todos')

  const filtrados = cursos.filter(
    (curso) =>
      curso.nombre.toLowerCase().includes(busqueda.toLowerCase()) &&
      (nivel === 'Todos' || curso.nivel === nivel),
  )

  return (
    <section className="panel">
      <div className="section-header">
        <div>
          <span className="eyebrow">Catálogo</span>
          <h2>Cursos disponibles</h2>
        </div>
        <span className="results-pill">{filtrados.length} resultados</span>
      </div>

      <div className="filtros">
        <input
          type="text"
          placeholder="Buscar curso"
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
        />

        <select value={nivel} onChange={(e) => setNivel(e.target.value)}>
          <option value="Todos">Todos</option>
          <option value="Básico">Básico</option>
          <option value="Intermedio">Intermedio</option>
          <option value="Avanzado">Avanzado</option>
        </select>
      </div>

      {filtrados.length === 0 ? (
        <p className="empty-state">No se encontraron cursos.</p>
      ) : (
        <div className="rejilla">
          {filtrados.map((curso) => (
            <TarjetaCurso key={curso.id} curso={curso} />
          ))}
        </div>
      )}
    </section>
  )
}

export default Cursos
