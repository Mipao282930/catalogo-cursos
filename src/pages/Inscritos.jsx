import { useState } from 'react'

function Inscritos({ inscritos, eliminarInscrito }) {
  const [error, setError] = useState('')

  const manejarEliminacion = async (id) => {
    setError('')
    try {
      await eliminarInscrito(id)
    } catch (e) {
      setError(e.message)
    }
  }

  return (
    <section className="panel table-panel">
      <div className="detail-header">
        <span className="eyebrow">Lista</span>
        <h2>Inscritos ({inscritos.length})</h2>
      </div>

      {inscritos.length === 0 ? (
        <p className="empty-state">Aún no hay inscripciones.</p>
      ) : (
        <table className="tabla">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Correo</th>
              <th>Curso</th>
              <th>Modalidad</th>
              <th>Acción</th>
            </tr>
          </thead>
          <tbody>
            {inscritos.map((inscrito) => (
              <tr key={inscrito.id}>
                <td>{inscrito.nombre}</td>
                <td>{inscrito.correo}</td>
                <td>{inscrito.curso}</td>
                <td>{inscrito.modalidad}</td>
                <td>
                  <button
                    className="boton boton-danger"
                    onClick={() => manejarEliminacion(inscrito.id)}
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {error && <p className="error">{error}</p>}
    </section>
  )
}

export default Inscritos
