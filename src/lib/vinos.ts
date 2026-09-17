import type { Producto } from '../types/producto'
import { normalizar } from './formato'

/**
 * Tipo de vino (tinto / blanco / rosado).
 *
 * La gente busca "tintos", pero el JSON guarda el varietal, que es el dato que
 * el dueño tiene a mano en la etiqueta. Así que el tipo se deriva del varietal
 * en vez de pedirle un campo más al cargar cada producto.
 */

export type TipoVino = 'tinto' | 'blanco' | 'rosado'

const VARIETALES_BLANCOS = [
  'chardonnay',
  'torrontes',
  'sauvignon blanc',
  'chenin',
  'semillon',
  'viognier',
  'riesling',
  'pinot grigio',
  'blanco',
]

const VARIETALES_ROSADOS = ['rosado', 'rose']

/** Clasifica un vino por su varietal. Lo que no es blanco ni rosado, es tinto. */
export function tipoDeVino(producto: Producto): TipoVino | undefined {
  if (producto.categoria !== 'vino') return undefined

  const varietal = normalizar(producto.subcategoria ?? '')
  if (VARIETALES_ROSADOS.some((v) => varietal.includes(v))) return 'rosado'
  if (VARIETALES_BLANCOS.some((v) => varietal.includes(v))) return 'blanco'
  return 'tinto'
}

/** Varietales del catálogo que corresponden a un tipo de vino. */
export function varietalesDe(productos: readonly Producto[], tipo: TipoVino): string[] {
  const varietales = new Set<string>()
  for (const producto of productos) {
    if (tipoDeVino(producto) === tipo && producto.subcategoria) varietales.add(producto.subcategoria)
  }
  return [...varietales].sort()
}
