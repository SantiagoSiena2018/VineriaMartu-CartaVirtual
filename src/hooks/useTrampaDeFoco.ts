import { useEffect, useRef } from 'react'

const SELECTOR_FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'

/**
 * Mantiene el foco dentro de un panel mientras está abierto y lo devuelve al
 * cerrarse. Lo usan el modal de edad, el menú mobile y el panel de filtros:
 * sin esto, con Tab se navega "detrás" del panel abierto.
 */
export function useTrampaDeFoco<T extends HTMLElement>(abierto: boolean, alCerrar?: () => void) {
  const ref = useRef<T>(null)

  useEffect(() => {
    if (!abierto) return

    const contenedor = ref.current
    const focoPrevio = document.activeElement as HTMLElement | null

    const focusables = () => Array.from(contenedor?.querySelectorAll<HTMLElement>(SELECTOR_FOCUSABLE) ?? [])
    focusables()[0]?.focus()

    const alPresionar = (evento: KeyboardEvent) => {
      if (evento.key === 'Escape' && alCerrar) {
        evento.preventDefault()
        alCerrar()
        return
      }

      if (evento.key !== 'Tab') return

      const elementos = focusables()
      if (elementos.length === 0) return

      const primero = elementos[0]
      const ultimo = elementos[elementos.length - 1]

      if (evento.shiftKey && document.activeElement === primero) {
        evento.preventDefault()
        ultimo.focus()
      } else if (!evento.shiftKey && document.activeElement === ultimo) {
        evento.preventDefault()
        primero.focus()
      }
    }

    document.addEventListener('keydown', alPresionar)
    return () => {
      document.removeEventListener('keydown', alPresionar)
      focoPrevio?.focus()
    }
  }, [abierto, alCerrar])

  return ref
}

/** Bloquea el scroll del fondo mientras hay un panel abierto. */
export function useScrollBloqueado(bloqueado: boolean) {
  useEffect(() => {
    if (!bloqueado) return
    const anterior = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = anterior
    }
  }, [bloqueado])
}
