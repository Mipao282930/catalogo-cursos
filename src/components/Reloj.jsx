import { useEffect, useState } from 'react'

function Reloj() {
  const [hora, setHora] = useState(new Date())

  useEffect(() => {
    const id = setInterval(() => setHora(new Date()), 1000)
    return () => clearInterval(id)
  }, [])

  return <p className="reloj">Hora actual: {hora.toLocaleTimeString()}</p>
}

export default Reloj
