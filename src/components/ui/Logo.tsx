import { LOGO } from '../../data/logo'
import { NEGOCIO } from '../../data/negocio'

interface Props {
  /** Alto del logo, con clases de Tailwind. El ancho se ajusta solo. */
  className?: string
  /** El del header es lo primero que se ve: conviene no diferirlo. */
  prioridad?: boolean
}

/**
 * El logo tiene fondo transparente, así que el mismo archivo sirve sobre la
 * crema del header y sobre el carbón del footer.
 */
export function Logo({ className = 'h-12 w-auto', prioridad = false }: Props) {
  return (
    <img
      src={LOGO.src}
      alt={NEGOCIO.nombre}
      className={className}
      {...(LOGO.ancho ? { width: LOGO.ancho, height: LOGO.alto } : {})}
      loading={prioridad ? 'eager' : 'lazy'}
      fetchPriority={prioridad ? 'high' : 'auto'}
      decoding="async"
    />
  )
}
