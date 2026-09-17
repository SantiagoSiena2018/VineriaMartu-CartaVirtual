import { useEffect, useState } from 'react'

interface Props {
  valor: string
  onCambio: (termino: string) => void
}

/**
 * Buscador por nombre o bodega.
 *
 * Mantiene su propio estado y recién avisa hacia afuera tras una pausa, para
 * no reescribir la URL en cada tecla.
 */
export function Buscador({ valor, onCambio }: Props) {
  const [texto, setTexto] = useState(valor)

  // Si los filtros se limpian desde otro lado, el input tiene que acompañar.
  // Es el patrón de React para ajustar estado cuando cambia una prop, sin efecto.
  const [valorPrevio, setValorPrevio] = useState(valor)
  if (valor !== valorPrevio) {
    setValorPrevio(valor)
    setTexto(valor)
  }

  useEffect(() => {
    if (texto === valor) return
    const id = setTimeout(() => onCambio(texto), 250)
    return () => clearTimeout(id)
  }, [texto, valor, onCambio])

  return (
    <div className="relative">
      <label htmlFor="buscador" className="sr-only">
        Buscar por nombre o bodega
      </label>
      <input
        id="buscador"
        type="search"
        value={texto}
        onChange={(evento) => setTexto(evento.target.value)}
        placeholder="Buscar por nombre o bodega…"
        className="w-full rounded-full border border-carbon/20 bg-white py-3 pr-4 pl-11 text-sm text-carbon placeholder:text-carbon-suave"
      />
      <svg
        viewBox="0 0 24 24"
        aria-hidden="true"
        className="pointer-events-none absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-carbon-suave"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <circle cx="11" cy="11" r="7" />
        <path d="m20 20-3.5-3.5" strokeLinecap="round" />
      </svg>
    </div>
  )
}
