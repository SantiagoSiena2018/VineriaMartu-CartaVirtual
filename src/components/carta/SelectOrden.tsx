import type { Orden } from '../../lib/productos'
import { ETIQUETA_ORDEN } from '../../lib/productos'

interface Props {
  valor: Orden
  onCambio: (orden: Orden) => void
}

export function SelectOrden({ valor, onCambio }: Props) {
  return (
    <div className="flex min-w-0 flex-1 items-center gap-2 sm:flex-none">
      {/* En pantallas chicas el espacio es escaso: la etiqueta queda solo para lectores de pantalla. */}
      <label htmlFor="orden" className="sr-only shrink-0 text-xs tracking-[0.15em] text-carbon-suave uppercase sm:not-sr-only">
        Ordenar
      </label>
      <select
        id="orden"
        value={valor}
        onChange={(evento) => onCambio(evento.target.value as Orden)}
        className="w-full min-w-0 rounded-full border border-carbon/20 bg-white px-4 py-2.5 text-sm text-carbon sm:w-auto"
      >
        {Object.entries(ETIQUETA_ORDEN).map(([clave, etiqueta]) => (
          <option key={clave} value={clave}>
            {etiqueta}
          </option>
        ))}
      </select>
    </div>
  )
}
