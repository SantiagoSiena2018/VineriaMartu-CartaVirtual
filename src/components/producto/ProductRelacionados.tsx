import type { Producto } from '../../types/producto'
import { SectionTitle } from '../ui/SectionTitle'
import { ProductGrid } from './ProductGrid'

interface Props {
  productos: Producto[]
}

export function ProductRelacionados({ productos }: Props) {
  if (productos.length === 0) return null

  return (
    <section aria-labelledby="relacionados" className="border-t border-carbon/10 bg-crema py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionTitle id="relacionados" alineacion="izquierda">
          También te puede gustar
        </SectionTitle>

        <div className="mt-10">
          <ProductGrid productos={productos} etiqueta="Productos relacionados" />
        </div>
      </div>
    </section>
  )
}
