import { useMemo, useState } from 'react'
import { Buscador } from '../components/carta/Buscador'
import { EstadoVacio } from '../components/carta/EstadoVacio'
import { FilterDrawer } from '../components/carta/FilterDrawer'
import { FilterPanel } from '../components/carta/FilterPanel'
import { SelectOrden } from '../components/carta/SelectOrden'
import { ProductGrid } from '../components/producto/ProductGrid'
import { Boton } from '../components/ui/Boton'
import { SectionTitle } from '../components/ui/SectionTitle'
import { PRODUCTOS } from '../data/catalogo'
import { NEGOCIO } from '../data/negocio'
import { useFiltrosCarta } from '../hooks/useFiltrosCarta'
import { useSeo } from '../hooks/useSeo'
import {
  agruparPorCategoria,
  contarFiltrosActivos,
  facetas as calcularFacetas,
  filtrar,
  ordenar,
  subcategoriasDe,
} from '../lib/productos'
import { schemaNegocio, titulo } from '../lib/seo'
import { ETIQUETA_CATEGORIA } from '../types/producto'

/**
 * La carta: la pantalla más importante del sitio.
 * Los vinos van primero y el resto de las bebidas después, agrupados.
 */
export function Carta() {
  const { criterios, orden, setBusqueda, alternar, setRangoPrecio, setOrden, limpiar } = useFiltrosCarta()
  const [filtrosAbiertos, setFiltrosAbiertos] = useState(false)

  const facetas = useMemo(() => calcularFacetas(PRODUCTOS), [])
  const subcategorias = useMemo(() => subcategoriasDe(PRODUCTOS, criterios.categorias), [criterios.categorias])

  const resultados = useMemo(() => ordenar(filtrar(PRODUCTOS, criterios), orden), [criterios, orden])
  const filtrosActivos = contarFiltrosActivos(criterios)

  /**
   * Con el orden por defecto la carta se agrupa por categoría, con los vinos
   * primero. Pero si la persona pidió un orden explícito (precio o nombre),
   * agrupar lo rompería: ahí va una lista única, que es lo que espera ver.
   */
  const agrupada = orden === 'destacados'
  const grupos = useMemo(() => (agrupada ? agruparPorCategoria(resultados) : []), [agrupada, resultados])

  useSeo({
    titulo: titulo('Carta de vinos y bebidas'),
    descripcion: `Mirá la carta completa de ${NEGOCIO.nombre}: vinos argentinos, espumantes, cervezas y destilados en ${NEGOCIO.direccion.zona}.`,
    ruta: '/carta',
    schema: schemaNegocio(),
  })

  const panel = (
    <FilterPanel
      facetas={facetas}
      subcategorias={subcategorias}
      criterios={criterios}
      alternar={alternar}
      setRangoPrecio={setRangoPrecio}
    />
  )

  return (
    <>
      <div className="bg-crema-oscuro pt-32 pb-12 sm:pt-36">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionTitle como="h1" copete="Vinería Martu" alineacion="izquierda" bajada="Vinos argentinos, espumantes y bebidas seleccionadas. Los precios pueden variar: consultanos para confirmar disponibilidad.">
            Nuestra carta
          </SectionTitle>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <div className="flex-1">
            <Buscador valor={criterios.busqueda} onCambio={setBusqueda} />
          </div>

          {/* El panel lateral solo existe en lg: abajo de eso, los filtros van en el drawer. */}
          <div className="flex items-center gap-3 sm:shrink-0">
            <Boton variante="sutil" onClick={() => setFiltrosAbiertos(true)} className="flex-1 lg:hidden">
              Filtrar{filtrosActivos > 0 ? ` (${filtrosActivos})` : ''}
            </Boton>
            <SelectOrden valor={orden} onCambio={setOrden} />
          </div>
        </div>

        <div className="mt-10 flex gap-10">
          <aside className="hidden w-64 shrink-0 lg:block" aria-label="Filtros de la carta">
            <div className="sticky top-28">
              <div className="flex items-center justify-between">
                <h2 className="font-sans text-xs tracking-[0.2em] text-carbon uppercase">Filtrar</h2>
                {filtrosActivos > 0 && (
                  <button
                    type="button"
                    onClick={limpiar}
                    className="text-xs text-borgona underline underline-offset-4"
                  >
                    Limpiar ({filtrosActivos})
                  </button>
                )}
              </div>
              <div className="mt-6 max-h-[calc(100vh-12rem)] overflow-y-auto pr-2">{panel}</div>
            </div>
          </aside>

          <div className="min-w-0 flex-1">
            <p aria-live="polite" className="mb-6 text-sm text-carbon-suave">
              {resultados.length === 0
                ? 'Sin resultados'
                : `${resultados.length} ${resultados.length === 1 ? 'producto' : 'productos'}`}
              {filtrosActivos > 0 && ' con los filtros aplicados'}
            </p>

            {resultados.length === 0 ? (
              <EstadoVacio onLimpiar={limpiar} />
            ) : !agrupada ? (
              <ProductGrid productos={resultados} etiqueta="Resultados de la carta" />
            ) : (
              <div className="flex flex-col gap-16">
                {grupos.map((grupo) => (
                  <section key={grupo.categoria} aria-labelledby={`grupo-${grupo.categoria}`}>
                    <h2
                      id={`grupo-${grupo.categoria}`}
                      className="mb-6 font-sans text-xs tracking-[0.25em] text-borgona uppercase"
                    >
                      {ETIQUETA_CATEGORIA[grupo.categoria]}
                      <span className="ml-3 text-carbon-suave">({grupo.productos.length})</span>
                    </h2>
                    <ProductGrid
                      productos={grupo.productos}
                      etiqueta={ETIQUETA_CATEGORIA[grupo.categoria]}
                    />
                  </section>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <FilterDrawer
        abierto={filtrosAbiertos}
        alCerrar={() => setFiltrosAbiertos(false)}
        resultados={resultados.length}
        onLimpiar={limpiar}
      >
        {panel}
      </FilterDrawer>
    </>
  )
}
