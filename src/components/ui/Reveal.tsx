import type { ReactNode } from 'react'
import { useRevealOnScroll } from '../../hooks/useRevealOnScroll'

/**
 * Envuelve un bloque para que aparezca al entrar en pantalla.
 * Con `prefers-reduced-motion` la animación no se aplica.
 */
export function Reveal({ children, className = '' }: { children: ReactNode; className?: string }) {
  const ref = useRevealOnScroll<HTMLDivElement>()
  return (
    <div ref={ref} className={`reveal ${className}`}>
      {children}
    </div>
  )
}
