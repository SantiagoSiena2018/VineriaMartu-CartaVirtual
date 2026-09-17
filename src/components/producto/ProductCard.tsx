import { Link } from 'react-router-dom'
import { formatearPrecio, unir } from '../../lib/formato'
import type { Producto } from '../../types/producto'
import { Imagen } from '../ui/Imagen'

interface Props {
  producto: Producto
}

/**
 * Tarjeta de producto. La botella se muestra sobre un fondo neutro para que
 * fotos de distintas fuentes convivan sin quedar desprolijas.
 */
export function ProductCard({ producto }: Props) {
  const detalle = unir([producto.subcategoria, producto.presentacion])

  return (
    <article className="group h-full">
      <Link
        to={`/carta/${producto.id}`}
        className="flex h-full flex-col rounded-sm bg-white shadow-[0_1px_3px_rgba(28,26,25,0.06)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_28px_rgba(28,26,25,0.12)]"
      >
        <div className="relative overflow-hidden rounded-t-sm bg-white">
          <Imagen
            src={producto.imagen}
            alt={`Botella de ${producto.nombre}`}
            className={`aspect-[3/4] w-full object-contain p-4 transition-transform duration-500 group-hover:scale-105 ${
              producto.disponible ? '' : 'opacity-45 grayscale'
            }`}
          />

          {!producto.disponible && (
            <span className="absolute top-3 left-3 rounded-full bg-carbon/85 px-3 py-1 text-[0.65rem] tracking-[0.12em] text-crema uppercase">
              Sin stock
            </span>
          )}

          {producto.destacado && producto.disponible && (
            <span className="absolute top-3 left-3 rounded-full bg-borgona px-3 py-1 text-[0.65rem] tracking-[0.12em] text-crema uppercase">
              Destacado
            </span>
          )}
        </div>

        <div className={`flex flex-1 flex-col p-5 ${producto.disponible ? '' : 'opacity-60'}`}>
          {producto.bodega && (
            <p className="text-[0.65rem] tracking-[0.2em] text-borgona uppercase">{producto.bodega}</p>
          )}

          <h3 className="mt-2 font-serif text-xl leading-snug text-carbon">{producto.nombre}</h3>

          {detalle && <p className="mt-1 text-sm text-carbon-suave">{detalle}</p>}

          <p className="mt-4 pt-4 font-sans text-base font-medium text-carbon border-t border-carbon/10">
            {formatearPrecio(producto.precio)}
          </p>
        </div>
      </Link>
    </article>
  )
}
