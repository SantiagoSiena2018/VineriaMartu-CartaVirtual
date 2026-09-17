import type { Categoria, Producto } from '../types/producto'
import { ORDEN_CATEGORIAS } from '../types/producto'
import { normalizar } from './formato'

/**
 * Lógica del catálogo: filtrar, buscar, ordenar y agrupar.
 *
 * Funciones puras, sin React ni acceso al DOM: los componentes solo las
 * consumen. Las opciones de filtro se derivan de los datos, así agregar una
 * bodega nueva al JSON la hace aparecer sola en el panel.
 */

export type Orden = 'destacados' | 'precio-asc' | 'precio-desc' | 'nombre'

export const ETIQUETA_ORDEN: Record<Orden, string> = {
  destacados: 'Destacados primero',
  'precio-asc': 'Menor precio',
  'precio-desc': 'Mayor precio',
  nombre: 'Nombre (A–Z)',
}

export interface Criterios {
  categorias: Categoria[]
  subcategorias: string[]
  bodegas: string[]
  precioMin?: number
  precioMax?: number
  busqueda: string
}

export const CRITERIOS_VACIOS: Criterios = {
  categorias: [],
  subcategorias: [],
  bodegas: [],
  busqueda: '',
}

export function hayFiltrosActivos(criterios: Criterios): boolean {
  return contarFiltrosActivos(criterios) > 0
}

export function contarFiltrosActivos(criterios: Criterios): number {
  return (
    criterios.categorias.length +
    criterios.subcategorias.length +
    criterios.bodegas.length +
    (criterios.precioMin !== undefined || criterios.precioMax !== undefined ? 1 : 0) +
    (criterios.busqueda.trim() ? 1 : 0)
  )
}

/** Texto sobre el que corre el buscador: nombre, bodega, varietal y región. */
function textoBuscable(producto: Producto): string {
  return normalizar(
    [producto.nombre, producto.bodega, producto.subcategoria, producto.region].filter(Boolean).join(' '),
  )
}

/**
 * Busca por nombre o bodega. Cada palabra del término tiene que aparecer,
 * en cualquier orden: "catena malbec" y "malbec catena" dan lo mismo.
 */
export function buscar(productos: readonly Producto[], termino: string): Producto[] {
  const palabras = normalizar(termino.trim()).split(/\s+/).filter(Boolean)
  if (palabras.length === 0) return [...productos]

  return productos.filter((producto) => {
    const texto = textoBuscable(producto)
    return palabras.every((palabra) => texto.includes(palabra))
  })
}

export function filtrar(productos: readonly Producto[], criterios: Criterios): Producto[] {
  return buscar(productos, criterios.busqueda).filter((producto) => {
    if (criterios.categorias.length > 0 && !criterios.categorias.includes(producto.categoria)) return false

    if (
      criterios.subcategorias.length > 0 &&
      (!producto.subcategoria || !criterios.subcategorias.includes(producto.subcategoria))
    ) {
      return false
    }

    if (criterios.bodegas.length > 0 && (!producto.bodega || !criterios.bodegas.includes(producto.bodega))) {
      return false
    }

    // Los productos sin precio ("Consultar") quedan fuera si se acota el rango:
    // no podemos afirmar que entren.
    const acotaPrecio = criterios.precioMin !== undefined || criterios.precioMax !== undefined
    if (acotaPrecio) {
      if (producto.precio === undefined) return false
      if (criterios.precioMin !== undefined && producto.precio < criterios.precioMin) return false
      if (criterios.precioMax !== undefined && producto.precio > criterios.precioMax) return false
    }

    return true
  })
}

const comparadorNombre = new Intl.Collator('es-AR', { sensitivity: 'base' })

export function ordenar(productos: readonly Producto[], orden: Orden): Producto[] {
  const lista = [...productos]

  switch (orden) {
    case 'precio-asc':
    case 'precio-desc': {
      const signo = orden === 'precio-asc' ? 1 : -1
      return lista.sort((a, b) => {
        // Los "Consultar" van siempre al final, ordene como ordene.
        if (a.precio === undefined && b.precio === undefined) return comparadorNombre.compare(a.nombre, b.nombre)
        if (a.precio === undefined) return 1
        if (b.precio === undefined) return -1
        return (a.precio - b.precio) * signo
      })
    }

    case 'nombre':
      return lista.sort((a, b) => comparadorNombre.compare(a.nombre, b.nombre))

    case 'destacados':
    default:
      // Sin stock al final, destacados arriba, y entre iguales por nombre.
      return lista.sort((a, b) => {
        if (a.disponible !== b.disponible) return a.disponible ? -1 : 1
        if (a.destacado !== b.destacado) return a.destacado ? -1 : 1
        return comparadorNombre.compare(a.nombre, b.nombre)
      })
  }
}

export interface Facetas {
  categorias: Categoria[]
  subcategorias: string[]
  bodegas: string[]
  precioMin: number
  precioMax: number
}

/** Opciones de filtro derivadas de los datos que hay cargados. */
export function facetas(productos: readonly Producto[]): Facetas {
  const categorias = new Set<Categoria>()
  const subcategorias = new Set<string>()
  const bodegas = new Set<string>()
  const precios: number[] = []

  for (const producto of productos) {
    categorias.add(producto.categoria)
    if (producto.subcategoria) subcategorias.add(producto.subcategoria)
    if (producto.bodega) bodegas.add(producto.bodega)
    if (producto.precio !== undefined) precios.push(producto.precio)
  }

  return {
    categorias: ORDEN_CATEGORIAS.filter((categoria) => categorias.has(categoria)),
    subcategorias: [...subcategorias].sort(comparadorNombre.compare),
    bodegas: [...bodegas].sort(comparadorNombre.compare),
    precioMin: precios.length > 0 ? Math.min(...precios) : 0,
    precioMax: precios.length > 0 ? Math.max(...precios) : 0,
  }
}

/**
 * Varietales disponibles según las categorías elegidas.
 * Evita ofrecer "Malbec" cuando el usuario ya filtró por cervezas.
 */
export function subcategoriasDe(productos: readonly Producto[], categorias: Categoria[]): string[] {
  const alcance = categorias.length > 0 ? productos.filter((p) => categorias.includes(p.categoria)) : productos
  return facetas(alcance).subcategorias
}

export function porId(productos: readonly Producto[], id: string): Producto | undefined {
  return productos.find((producto) => producto.id === id)
}

export function destacados(productos: readonly Producto[]): Producto[] {
  return ordenar(
    productos.filter((producto) => producto.destacado && producto.disponible),
    'destacados',
  )
}

/**
 * Sugerencias para la ficha de producto: mismo varietal primero,
 * después el resto de la categoría.
 */
export function relacionados(productos: readonly Producto[], producto: Producto, cantidad = 4): Producto[] {
  const candidatos = productos.filter(
    (otro) => otro.id !== producto.id && otro.categoria === producto.categoria && otro.disponible,
  )

  const mismoVarietal = candidatos.filter((otro) => otro.subcategoria && otro.subcategoria === producto.subcategoria)
  const resto = candidatos.filter((otro) => !mismoVarietal.includes(otro))

  return [...mismoVarietal, ...ordenar(resto, 'destacados')].slice(0, cantidad)
}

export interface GrupoCategoria {
  categoria: Categoria
  productos: Producto[]
}

/** Agrupa por categoría respetando el orden del negocio (vinos primero). */
export function agruparPorCategoria(productos: readonly Producto[]): GrupoCategoria[] {
  return ORDEN_CATEGORIAS.map((categoria) => ({
    categoria,
    productos: productos.filter((producto) => producto.categoria === categoria),
  })).filter((grupo) => grupo.productos.length > 0)
}
