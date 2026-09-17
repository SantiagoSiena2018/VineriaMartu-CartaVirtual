import { useCallback, type ReactNode } from 'react'
import { useScrollBloqueado, useTrampaDeFoco } from '../../hooks/useTrampaDeFoco'
import { Boton } from '../ui/Boton'

interface Props {
  abierto: boolean
  alCerrar: () => void
  /** Cantidad de resultados, para que se vea el efecto del filtro sin cerrar. */
  resultados: number
  onLimpiar: () => void
  children: ReactNode
}

/**
 * Panel de filtros en mobile: se desliza desde abajo y ocupa casi toda la
 * pantalla, con el resumen de resultados siempre visible al pie.
 */
export function FilterDrawer({ abierto, alCerrar, resultados, onLimpiar, children }: Props) {
  const cerrar = useCallback(() => alCerrar(), [alCerrar])
  const ref = useTrampaDeFoco<HTMLDivElement>(abierto, cerrar)
  useScrollBloqueado(abierto)

  if (!abierto) return null

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      <button
        type="button"
        aria-label="Cerrar filtros"
        tabIndex={-1}
        onClick={cerrar}
        className="absolute inset-0 h-full w-full bg-carbon/60"
      />

      <div
        ref={ref}
        role="dialog"
        aria-modal="true"
        aria-label="Filtros de la carta"
        className="absolute inset-x-0 bottom-0 flex max-h-[88vh] flex-col rounded-t-2xl bg-crema"
      >
        <div className="flex items-center justify-between border-b border-carbon/10 px-5 py-4">
          <h2 className="font-sans text-xs tracking-[0.2em] text-carbon uppercase">Filtrar</h2>
          <button
            type="button"
            onClick={cerrar}
            aria-label="Cerrar filtros"
            className="flex h-10 w-10 items-center justify-center text-2xl text-carbon"
          >
            <span aria-hidden="true">×</span>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-2">{children}</div>

        <div className="flex items-center gap-3 border-t border-carbon/10 px-5 py-4">
          <Boton variante="sutil" onClick={onLimpiar} className="flex-1">
            Limpiar
          </Boton>
          <Boton variante="primario" onClick={cerrar} className="flex-[2]">
            Ver {resultados} {resultados === 1 ? 'producto' : 'productos'}
          </Boton>
        </div>
      </div>
    </div>
  )
}
