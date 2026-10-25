import { useRef, useState } from 'react'

function Contacto() {
  const nombre = useRef(null)
  const mensaje = useRef(null)
  const [respuesta, setRespuesta] = useState('')

  const enviar = (e) => {
    e.preventDefault()
    setRespuesta(
      `Gracias ${nombre.current.value}, recibimos: "${mensaje.current.value}"`,
    )
    e.target.reset()
  }

  return (
    <section className="panel form-panel">
      <div className="detail-header">
        <span className="eyebrow">Contacto</span>
        <h2>Escríbenos</h2>
      </div>

      <form className="formulario" onSubmit={enviar}>
        <label>
          Nombre
          <input type="text" ref={nombre} />
        </label>

        <label>
          Mensaje
          <textarea ref={mensaje} rows="4" />
        </label>

        <button type="submit" className="boton">
          Enviar
        </button>
      </form>

      {respuesta && <p className="ok">{respuesta}</p>}
    </section>
  )
}

export default Contacto
