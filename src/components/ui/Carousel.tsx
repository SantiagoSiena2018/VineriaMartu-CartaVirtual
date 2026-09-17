import useEmblaCarousel from 'embla-carousel-react'
import { useCallback, useEffect, useState, type ReactNode } from 'react'

interface Props {
  children: ReactNode[]
  /** Se anuncia a lectores de pantalla como región navegable. */
  etiqueta: string
}

function prefiereMenosMovimiento() {
  return typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

/**
 * Carrusel con swipe en mobile y flechas en desktop.
 *
 * Es una lista scrolleable de verdad, así que también se puede recorrer con el
 * teclado (Tab pasa de una tarjeta a la siguiente y el carrusel la sigue).
 */
export function Carousel({ children, etiqueta }: Props) {
  const [emblaRef, embla] = useEmblaCarousel({
    align: 'start',
    containScroll: 'trimSnaps',
    loop: false,
    duration: prefiereMenosMovimiento() ? 0 : 25,
  })

  const [puedeAnterior, setPuedeAnterior] = useState(false)
  const [puedeSiguiente, setPuedeSiguiente] = useState(false)
  const [snapActual, setSnapActual] = useState(0)
  const [snaps, setSnaps] = useState<number[]>([])

  const actualizar = useCallback(() => {
    if (!embla) return
    setPuedeAnterior(embla.canScrollPrev())
    setPuedeSiguiente(embla.canScrollNext())
    setSnapActual(embla.selectedScrollSnap())
    setSnaps(embla.scrollSnapList())
  }, [embla])

  useEffect(() => {
    if (!embla) return
    // Sincronización con embla, que es estado externo a React: el primer
    // llamado copia la posición inicial del carrusel ya montado.
    // oxlint-disable-next-line react/set-state-in-effect
    actualizar()
    embla.on('select', actualizar).on('reInit', actualizar)
    return () => {
      embla.off('select', actualizar).off('reInit', actualizar)
    }
  }, [embla, actualizar])

  return (
    <div className="relative" role="region" aria-roledescription="carrusel" aria-label={etiqueta}>
      <div className="overflow-hidden" ref={emblaRef}>
        <ul className="flex gap-5 sm:gap-7">
          {children.map((hijo, indice) => (
            <li
              // Las slides no se reordenan, así que el índice alcanza como key.
              key={indice}
              className="min-w-0 shrink-0 basis-[72%] sm:basis-[45%] lg:basis-[28%]"
            >
              {hijo}
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-8 flex items-center justify-center gap-4">
        <button
          type="button"
          onClick={() => embla?.scrollPrev()}
          disabled={!puedeAnterior}
          aria-label="Ver anteriores"
          className="flex h-10 w-10 items-center justify-center rounded-full border border-carbon/20 text-carbon transition-colors hover:border-borgona hover:text-borgona disabled:opacity-30 disabled:hover:border-carbon/20 disabled:hover:text-carbon"
        >
          <span aria-hidden="true">←</span>
        </button>

        <ol className="flex items-center gap-2">
          {snaps.map((_, indice) => (
            <li key={indice}>
              <button
                type="button"
                onClick={() => embla?.scrollTo(indice)}
                aria-label={`Ir al grupo ${indice + 1} de ${snaps.length}`}
                aria-current={indice === snapActual}
                className={`block h-1.5 rounded-full transition-all duration-300 ${
                  indice === snapActual ? 'w-6 bg-borgona' : 'w-1.5 bg-carbon/25 hover:bg-carbon/50'
                }`}
              />
            </li>
          ))}
        </ol>

        <button
          type="button"
          onClick={() => embla?.scrollNext()}
          disabled={!puedeSiguiente}
          aria-label="Ver siguientes"
          className="flex h-10 w-10 items-center justify-center rounded-full border border-carbon/20 text-carbon transition-colors hover:border-borgona hover:text-borgona disabled:opacity-30 disabled:hover:border-carbon/20 disabled:hover:text-carbon"
        >
          <span aria-hidden="true">→</span>
        </button>
      </div>
    </div>
  )
}
