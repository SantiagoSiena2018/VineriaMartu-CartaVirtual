import { useEffect, useRef } from 'react'

/**
 * Hace aparecer un bloque cuando entra en pantalla.
 *
 * La animación vive en la clase `.reveal` de index.css, que ya se desactiva
 * sola con `prefers-reduced-motion`. Si el navegador no soporta
 * IntersectionObserver, el contenido se muestra igual.
 */
export function useRevealOnScroll<T extends HTMLElement = HTMLDivElement>() {
  const ref = useRef<T>(null)

  useEffect(() => {
    const elemento = ref.current
    if (!elemento) return

    if (typeof IntersectionObserver === 'undefined') {
      elemento.classList.add('reveal-visible')
      return
    }

    const observador = new IntersectionObserver(
      ([entrada]) => {
        if (entrada.isIntersecting) {
          entrada.target.classList.add('reveal-visible')
          observador.disconnect()
        }
      },
      { threshold: 0.12, rootMargin: '0px 0px -60px 0px' },
    )

    observador.observe(elemento)
    return () => observador.disconnect()
  }, [])

  return ref
}
