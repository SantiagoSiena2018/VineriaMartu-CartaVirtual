import type { Producto } from '../types/producto'
import { validarCatalogo } from '../types/producto'
import catalogoJson from './productos.json'

/**
 * Punto de entrada al catálogo. Nadie importa `productos.json` directamente:
 * así, si mañana los datos vienen de una API o un CMS, solo cambia este archivo.
 */
const productos = catalogoJson.productos as Producto[]

if (import.meta.env.DEV) {
  const problemas = validarCatalogo(productos)
  if (problemas.length > 0) {
    console.warn(
      `[Vinería Martu] Hay ${problemas.length} problema(s) en src/data/productos.json:\n` +
        problemas.map((p) => `  • ${p}`).join('\n'),
    )
  }
}

export const PRODUCTOS: readonly Producto[] = productos
