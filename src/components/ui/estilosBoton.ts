export type VarianteBoton = 'primario' | 'secundario' | 'claro' | 'sutil'
export type TamanoBoton = 'md' | 'lg'

const BASE =
  'inline-flex items-center justify-center gap-2 rounded-full font-sans font-medium uppercase ' +
  'tracking-[0.12em] transition-colors duration-200 disabled:cursor-not-allowed disabled:opacity-50'

const VARIANTES: Record<VarianteBoton, string> = {
  primario: 'bg-borgona text-crema hover:bg-borgona-oscuro',
  secundario: 'border border-borgona text-borgona hover:bg-borgona hover:text-crema',
  claro: 'border border-crema/70 text-crema hover:bg-crema hover:text-borgona-oscuro',
  sutil: 'border border-carbon/20 text-carbon hover:border-carbon hover:bg-carbon hover:text-crema',
}

const TAMANOS: Record<TamanoBoton, string> = {
  md: 'px-5 py-2.5 text-xs',
  lg: 'px-8 py-3.5 text-sm',
}

/**
 * Estilos del botón como clases sueltas, para reusarlos en <Link> y <a>
 * sin tener que hacer el componente polimórfico.
 */
export function estilosBoton(variante: VarianteBoton = 'primario', tamano: TamanoBoton = 'md'): string {
  return `${BASE} ${VARIANTES[variante]} ${TAMANOS[tamano]}`
}
