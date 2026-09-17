import { IMAGEN_GENERICA } from '../lib/imagenes'
import type { Producto, ProductoJson } from '../types/producto'
import { validarCatalogo } from '../types/producto'
import imagenesGeneradas from './imagenes.generado.json'
import catalogoJson from './productos.json'

/**
 * Punto de entrada al catálogo. Nadie importa `productos.json` directamente:
 * así, si mañana los datos vienen de una API o un CMS, solo cambia este archivo.
 */

const imagenes = imagenesGeneradas as Record<string, string>

/**
 * Resuelve la foto de un producto, en este orden:
 *   1. el campo `imagen` del JSON, si alguien lo puso a mano;
 *   2. el archivo de public/img/productos/ que se llame como el id
 *      (lo detecta scripts/generar-imagenes.mjs al arrancar o compilar);
 *   3. la botella genérica.
 */
function conImagen(producto: ProductoJson): Producto {
  return { ...producto, imagen: producto.imagen ?? imagenes[producto.id] ?? IMAGEN_GENERICA }
}

const productos = (catalogoJson.productos as ProductoJson[]).map(conImagen)

if (import.meta.env.DEV) {
  const problemas = validarCatalogo(catalogoJson.productos as ProductoJson[])
  if (problemas.length > 0) {
    console.warn(
      `[Vinería Martu] Hay ${problemas.length} problema(s) en src/data/productos.json:\n` +
        problemas.map((p) => `  • ${p}`).join('\n'),
    )
  }

  const sinFoto = productos.filter((producto) => producto.imagen === IMAGEN_GENERICA)
  if (sinFoto.length > 0) {
    console.info(
      `[Vinería Martu] ${sinFoto.length} producto(s) sin foto. Guardá cada una en ` +
        'public/img/productos/ con el id como nombre de archivo:\n' +
        sinFoto.map((p) => `  • ${p.id}.jpg`).join('\n'),
    )
  }
}

export const PRODUCTOS: readonly Producto[] = productos
