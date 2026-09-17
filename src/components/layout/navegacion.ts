import { linkCarta } from '../../hooks/useFiltrosCarta'
import type { Categoria } from '../../types/producto'

/** Todo lo que no es vino ni espumante se agrupa como "otras bebidas". */
export const OTRAS_BEBIDAS: Categoria[] = ['cerveza', 'aperitivo', 'destilado', 'sin-alcohol']

export interface ItemNav {
  etiqueta: string
  a: string
}

export const NAVEGACION: ItemNav[] = [
  { etiqueta: 'Inicio', a: '/' },
  { etiqueta: 'Vinos', a: linkCarta({ categoria: 'vino' }) },
  { etiqueta: 'Otras bebidas', a: `/carta?${OTRAS_BEBIDAS.map((c) => `cat=${c}`).join('&')}` },
  { etiqueta: 'Nosotros', a: '/#nosotros' },
  { etiqueta: 'Contacto', a: '/#contacto' },
]
