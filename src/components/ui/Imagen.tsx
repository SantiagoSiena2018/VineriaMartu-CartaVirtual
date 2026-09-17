import { useState } from 'react'

const FALLBACK = '/img/productos/placeholder-botella.svg'

interface Props {
  src: string
  alt: string
  className?: string
  /** Imagen a mostrar si la original no carga. */
  fallback?: string
  /** El hero es lo primero que se ve: no conviene diferirlo. */
  prioridad?: boolean
}

/**
 * Imagen con carga diferida y fallback.
 *
 * Es habitual que falte la foto de un producto recién cargado en el JSON;
 * en ese caso se muestra la botella genérica en vez de un ícono roto.
 */
export function Imagen({ src, alt, className = '', fallback = FALLBACK, prioridad = false }: Props) {
  const [fuente, setFuente] = useState(src)

  return (
    <img
      src={fuente}
      alt={alt}
      className={className}
      loading={prioridad ? 'eager' : 'lazy'}
      decoding="async"
      fetchPriority={prioridad ? 'high' : 'auto'}
      onError={() => {
        if (fuente !== fallback) setFuente(fallback)
      }}
    />
  )
}
