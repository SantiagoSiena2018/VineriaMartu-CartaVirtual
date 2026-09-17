/**
 * Contratos de datos del catálogo.
 *
 * `productos.json` es la única fuente de verdad y se edita a mano. Como nadie
 * lo valida al guardarlo, `validarCatalogo` avisa por consola en desarrollo si
 * un producto quedó mal cargado, en vez de romper el sitio en silencio.
 */

export const CATEGORIAS = [
  'vino',
  'espumante',
  'cerveza',
  'aperitivo',
  'destilado',
  'sin-alcohol',
] as const

export type Categoria = (typeof CATEGORIAS)[number]

/** Etiquetas visibles de cada categoría, en singular y plural. */
export const ETIQUETA_CATEGORIA: Record<Categoria, string> = {
  vino: 'Vinos',
  espumante: 'Espumantes',
  cerveza: 'Cervezas',
  aperitivo: 'Aperitivos',
  destilado: 'Destilados',
  'sin-alcohol': 'Sin alcohol',
}

/**
 * Orden en el que se muestran las categorías en la carta.
 * Los vinos van primero por decisión del negocio.
 */
export const ORDEN_CATEGORIAS: Categoria[] = [
  'vino',
  'espumante',
  'cerveza',
  'aperitivo',
  'destilado',
  'sin-alcohol',
]

/**
 * Producto tal como se carga en productos.json.
 * `imagen` es opcional: si no está, se resuelve por el id (ver data/catalogo.ts).
 */
export interface ProductoJson {
  id: string
  nombre: string
  categoria: Categoria
  /** Varietal en vinos (Malbec, Blend) o tipo en el resto (Gin, IPA). */
  subcategoria?: string
  bodega?: string
  region?: string
  cosecha?: number
  presentacion: string
  /** Sin precio se muestra "Consultar". */
  precio?: number
  descripcion: string
  notasCata?: string
  maridaje?: string
  imagen?: string
  destacado: boolean
  disponible: boolean
}

/** Producto ya listo para mostrar: la imagen siempre está resuelta. */
export interface Producto extends ProductoJson {
  imagen: string
}

function esCategoria(valor: unknown): valor is Categoria {
  return CATEGORIAS.includes(valor as Categoria)
}

/**
 * Revisa el catálogo y devuelve los problemas encontrados.
 * Se ejecuta solo en desarrollo (ver `src/data/productos.ts`).
 */
export function validarCatalogo(productos: ProductoJson[]): string[] {
  const problemas: string[] = []
  const vistos = new Set<string>()

  for (const [indice, producto] of productos.entries()) {
    const donde = `producto #${indice + 1} (${producto.nombre ?? 'sin nombre'})`

    if (!producto.id) problemas.push(`${donde}: falta "id"`)
    else if (vistos.has(producto.id)) problemas.push(`${donde}: el id "${producto.id}" está repetido`)
    else vistos.add(producto.id)

    if (!producto.nombre) problemas.push(`${donde}: falta "nombre"`)
    if (!producto.presentacion) problemas.push(`${donde}: falta "presentacion"`)

    if (!esCategoria(producto.categoria)) {
      problemas.push(
        `${donde}: categoría "${producto.categoria}" desconocida. Válidas: ${CATEGORIAS.join(', ')}`,
      )
    }

    if (producto.precio !== undefined && (typeof producto.precio !== 'number' || producto.precio < 0)) {
      problemas.push(`${donde}: "precio" debe ser un número positivo, o no estar para mostrar "Consultar"`)
    }

    if (typeof producto.destacado !== 'boolean') problemas.push(`${donde}: "destacado" debe ser true o false`)
    if (typeof producto.disponible !== 'boolean') problemas.push(`${donde}: "disponible" debe ser true o false`)
  }

  return problemas
}
