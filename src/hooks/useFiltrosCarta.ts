import { useCallback, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import type { Criterios, Orden } from '../lib/productos'
import { ETIQUETA_ORDEN } from '../lib/productos'
import type { Categoria } from '../types/producto'
import { CATEGORIAS } from '../types/producto'

/**
 * Filtros de la carta, viviendo en la URL.
 *
 * Que el estado esté en la querystring hace que la búsqueda sea compartible
 * (mandar por WhatsApp "mirá los Malbec") y que el botón atrás del celular
 * deshaga el último filtro, que es lo que la gente espera.
 */

const PARAMS = {
  busqueda: 'q',
  categoria: 'cat',
  subcategoria: 'var',
  bodega: 'bodega',
  precioMin: 'min',
  precioMax: 'max',
  orden: 'orden',
} as const

function esOrden(valor: string | null): valor is Orden {
  return valor !== null && valor in ETIQUETA_ORDEN
}

function numeroOpcional(valor: string | null): number | undefined {
  if (valor === null || valor.trim() === '') return undefined
  const numero = Number(valor)
  return Number.isFinite(numero) ? numero : undefined
}

export function useFiltrosCarta() {
  const [params, setParams] = useSearchParams()

  const criterios = useMemo<Criterios>(
    () => ({
      busqueda: params.get(PARAMS.busqueda) ?? '',
      categorias: params.getAll(PARAMS.categoria).filter((c): c is Categoria => CATEGORIAS.includes(c as Categoria)),
      subcategorias: params.getAll(PARAMS.subcategoria),
      bodegas: params.getAll(PARAMS.bodega),
      precioMin: numeroOpcional(params.get(PARAMS.precioMin)),
      precioMax: numeroOpcional(params.get(PARAMS.precioMax)),
    }),
    [params],
  )

  const orden: Orden = esOrden(params.get(PARAMS.orden)) ? (params.get(PARAMS.orden) as Orden) : 'destacados'

  /** Escribe los params nuevos sin pisar los que no se tocan. */
  const actualizar = useCallback(
    (cambios: (siguientes: URLSearchParams) => void, reemplazar = false) => {
      const siguientes = new URLSearchParams(params)
      cambios(siguientes)
      setParams(siguientes, { replace: reemplazar, preventScrollReset: true })
    },
    [params, setParams],
  )

  const setBusqueda = useCallback(
    (termino: string) => {
      // `replace` para no llenar el historial con una entrada por tecla.
      actualizar((siguientes) => {
        if (termino.trim()) siguientes.set(PARAMS.busqueda, termino)
        else siguientes.delete(PARAMS.busqueda)
      }, true)
    },
    [actualizar],
  )

  /** Agrega o saca un valor de un filtro de selección múltiple. */
  const alternar = useCallback(
    (filtro: 'categorias' | 'subcategorias' | 'bodegas', valor: string) => {
      const clave =
        filtro === 'categorias' ? PARAMS.categoria : filtro === 'subcategorias' ? PARAMS.subcategoria : PARAMS.bodega

      actualizar((siguientes) => {
        const actuales = siguientes.getAll(clave)
        siguientes.delete(clave)
        const nuevos = actuales.includes(valor) ? actuales.filter((v) => v !== valor) : [...actuales, valor]
        for (const v of nuevos) siguientes.append(clave, v)

        // Si cambia la categoría, los varietales elegidos pueden dejar de existir.
        if (filtro === 'categorias') siguientes.delete(PARAMS.subcategoria)
      })
    },
    [actualizar],
  )

  const setRangoPrecio = useCallback(
    (min?: number, max?: number) => {
      actualizar((siguientes) => {
        if (min === undefined) siguientes.delete(PARAMS.precioMin)
        else siguientes.set(PARAMS.precioMin, String(min))

        if (max === undefined) siguientes.delete(PARAMS.precioMax)
        else siguientes.set(PARAMS.precioMax, String(max))
      })
    },
    [actualizar],
  )

  const setOrden = useCallback(
    (nuevo: Orden) => {
      actualizar((siguientes) => {
        if (nuevo === 'destacados') siguientes.delete(PARAMS.orden)
        else siguientes.set(PARAMS.orden, nuevo)
      })
    },
    [actualizar],
  )

  const limpiar = useCallback(() => {
    setParams(new URLSearchParams(), { preventScrollReset: true })
  }, [setParams])

  return { criterios, orden, setBusqueda, alternar, setRangoPrecio, setOrden, limpiar }
}

/** Arma el link a la carta ya filtrada, para las tarjetas de categoría del home. */
export function linkCarta(filtros: { categoria?: Categoria; subcategorias?: string[] }): string {
  const params = new URLSearchParams()
  if (filtros.categoria) params.set(PARAMS.categoria, filtros.categoria)
  for (const subcategoria of filtros.subcategorias ?? []) params.append(PARAMS.subcategoria, subcategoria)
  const query = params.toString()
  return query ? `/carta?${query}` : '/carta'
}
