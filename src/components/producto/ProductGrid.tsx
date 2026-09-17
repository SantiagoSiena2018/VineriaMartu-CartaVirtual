import type { Producto } from '../../types/producto'
import { ProductCard } from './ProductCard'

interface Props {
  productos: Producto[]
  /** Etiqueta accesible de la lista, ej. "Vinos". */
  etiqueta: string
}

export function ProductGrid({ productos, etiqueta }: Props) {
  return (
    <ul aria-label={etiqueta} className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-3 xl:grid-cols-4">
      {productos.map((producto) => (
        <li key={producto.id}>
          <ProductCard producto={producto} />
        </li>
      ))}
    </ul>
  )
}
