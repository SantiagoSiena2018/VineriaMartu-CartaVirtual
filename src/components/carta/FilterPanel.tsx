import type { Criterios, Facetas } from '../../lib/productos'
import { formatearPrecio } from '../../lib/formato'
import { ETIQUETA_CATEGORIA } from '../../types/producto'
import { Chip } from '../ui/Chip'

interface Props {
  facetas: Facetas
  /** Varietales que tienen sentido según las categorías elegidas. */
  subcategorias: string[]
  criterios: Criterios
  alternar: (filtro: 'categorias' | 'subcategorias' | 'bodegas', valor: string) => void
  setRangoPrecio: (min?: number, max?: number) => void
}

function Grupo({ titulo, children }: { titulo: string; children: React.ReactNode }) {
  return (
    <fieldset className="border-t border-carbon/10 pt-6">
      <legend className="mb-4 font-sans text-xs tracking-[0.2em] text-carbon uppercase">{titulo}</legend>
      {children}
    </fieldset>
  )
}

/**
 * Filtros de la carta. Las opciones salen de los datos cargados, así que
 * agregar una bodega nueva al JSON la hace aparecer acá sin tocar código.
 */
export function FilterPanel({ facetas, subcategorias, criterios, alternar, setRangoPrecio }: Props) {
  const numeroOTexto = (valor: string) => (valor.trim() === '' ? undefined : Number(valor))

  return (
    <div className="flex flex-col gap-6">
      <Grupo titulo="Categoría">
        <div className="flex flex-wrap gap-2">
          {facetas.categorias.map((categoria) => (
            <Chip
              key={categoria}
              etiqueta={ETIQUETA_CATEGORIA[categoria]}
              activo={criterios.categorias.includes(categoria)}
              onClick={() => alternar('categorias', categoria)}
            />
          ))}
        </div>
      </Grupo>

      {subcategorias.length > 0 && (
        <Grupo titulo="Varietal y tipo">
          <div className="flex flex-wrap gap-2">
            {subcategorias.map((subcategoria) => (
              <Chip
                key={subcategoria}
                etiqueta={subcategoria}
                activo={criterios.subcategorias.includes(subcategoria)}
                onClick={() => alternar('subcategorias', subcategoria)}
              />
            ))}
          </div>
        </Grupo>
      )}

      {facetas.bodegas.length > 0 && (
        <Grupo titulo="Bodega">
          <div className="flex flex-wrap gap-2">
            {facetas.bodegas.map((bodega) => (
              <Chip
                key={bodega}
                etiqueta={bodega}
                activo={criterios.bodegas.includes(bodega)}
                onClick={() => alternar('bodegas', bodega)}
              />
            ))}
          </div>
        </Grupo>
      )}

      {/* Sin precios cargados, filtrar por precio dejaría la carta vacía: no se ofrece. */}
      {facetas.precioMax > 0 && (
        <Grupo titulo="Precio">
          <div className="flex items-end gap-3">
            <label className="flex-1 text-xs text-carbon-suave">
              Desde
              <input
                type="number"
                inputMode="numeric"
                min={0}
                step={1000}
                placeholder={String(facetas.precioMin)}
                value={criterios.precioMin ?? ''}
                onChange={(evento) => setRangoPrecio(numeroOTexto(evento.target.value), criterios.precioMax)}
                className="mt-1.5 w-full rounded-sm border border-carbon/20 bg-white px-3 py-2 text-sm text-carbon"
              />
            </label>

            <label className="flex-1 text-xs text-carbon-suave">
              Hasta
              <input
                type="number"
                inputMode="numeric"
                min={0}
                step={1000}
                placeholder={String(facetas.precioMax)}
                value={criterios.precioMax ?? ''}
                onChange={(evento) => setRangoPrecio(criterios.precioMin, numeroOTexto(evento.target.value))}
                className="mt-1.5 w-full rounded-sm border border-carbon/20 bg-white px-3 py-2 text-sm text-carbon"
              />
            </label>
          </div>

          <p className="mt-3 text-xs text-carbon-suave">
            En carta: de {formatearPrecio(facetas.precioMin)} a {formatearPrecio(facetas.precioMax)}. Los
            productos a consultar quedan fuera al filtrar por precio.
          </p>
        </Grupo>
      )}
    </div>
  )
}
