import { Link, useParams } from 'react-router-dom'
import { ProductRelacionados } from '../components/producto/ProductRelacionados'
import { estilosBoton } from '../components/ui/estilosBoton'
import { Imagen } from '../components/ui/Imagen'
import { PRODUCTOS } from '../data/catalogo'
import { NEGOCIO } from '../data/negocio'
import { useSeo } from '../hooks/useSeo'
import { CANAL_INSTAGRAM, canalPrincipal } from '../lib/contacto'
import { formatearPrecio } from '../lib/formato'
import { porId, relacionados } from '../lib/productos'
import { descripcionProducto, schemaProducto, titulo } from '../lib/seo'
import { ETIQUETA_CATEGORIA } from '../types/producto'
import { NoEncontrada } from './NoEncontrada'

function Dato({ etiqueta, valor }: { etiqueta: string; valor?: string | number }) {
  if (valor === undefined || valor === '') return null

  return (
    <div className="flex justify-between gap-6 border-b border-carbon/10 py-3">
      <dt className="text-xs tracking-[0.15em] text-carbon-suave uppercase">{etiqueta}</dt>
      <dd className="text-right text-sm text-carbon">{valor}</dd>
    </div>
  )
}

export function ProductoDetalle() {
  const { id } = useParams<{ id: string }>()
  const producto = id ? porId(PRODUCTOS, id) : undefined

  if (!producto) return <NoEncontrada mensaje="No encontramos ese producto en la carta." />

  const sugeridos = relacionados(PRODUCTOS, producto)
  const canal = canalPrincipal(producto)

  return (
    <>
      <FichaProducto producto={producto} canal={canal} />
      <ProductRelacionados productos={sugeridos} />
    </>
  )
}

type Canal = ReturnType<typeof canalPrincipal>

function FichaProducto({ producto, canal }: { producto: (typeof PRODUCTOS)[number]; canal: Canal }) {
  useSeo({
    titulo: titulo(producto.nombre),
    descripcion: descripcionProducto(producto),
    ruta: `/carta/${producto.id}`,
    imagen: producto.imagen,
    schema: schemaProducto(producto),
  })

  return (
    <article className="pt-28 pb-16 sm:pt-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <nav aria-label="Migas de pan" className="mb-8 text-xs tracking-[0.12em] text-carbon-suave uppercase">
          <Link to="/carta" className="transition-colors hover:text-borgona">
            Carta
          </Link>
          <span aria-hidden="true" className="mx-2">
            /
          </span>
          <span className="text-carbon">{producto.nombre}</span>
        </nav>

        <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
          <div className="relative overflow-hidden rounded-sm bg-crema-oscuro">
            <Imagen
              src={producto.imagen}
              alt={`Botella de ${producto.nombre}`}
              prioridad
              className={`aspect-[3/4] w-full object-contain p-10 ${
                producto.disponible ? '' : 'opacity-50 grayscale'
              }`}
            />
            {!producto.disponible && (
              <span className="absolute top-5 left-5 rounded-full bg-carbon/85 px-4 py-1.5 text-xs tracking-[0.12em] text-crema uppercase">
                Sin stock
              </span>
            )}
          </div>

          <div>
            <p className="text-xs tracking-[0.25em] text-borgona uppercase">
              {producto.bodega ?? ETIQUETA_CATEGORIA[producto.categoria]}
            </p>

            <h1 className="mt-3 text-4xl leading-tight tracking-[0.02em] text-carbon sm:text-5xl">
              {producto.nombre}
            </h1>

            <span aria-hidden="true" className="mt-6 block h-px w-16 bg-dorado" />

            <p className="mt-6 text-base leading-relaxed text-carbon-suave">{producto.descripcion}</p>

            <p className="mt-8 font-sans text-3xl font-medium text-carbon">
              {formatearPrecio(producto.precio)}
              {producto.precio !== undefined && (
                <span className="ml-3 align-middle text-sm font-normal text-carbon-suave">
                  {producto.presentacion}
                </span>
              )}
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a
                href={canal.href}
                {...(canal.tipo === 'whatsapp' ? { target: '_blank', rel: 'noreferrer' } : {})}
                className={estilosBoton('primario', 'lg')}
              >
                {canal.etiqueta}
              </a>
              <a
                href={CANAL_INSTAGRAM.href}
                target="_blank"
                rel="noreferrer"
                className={estilosBoton('sutil', 'lg')}
              >
                Escribinos por Instagram
              </a>
            </div>

            <p className="mt-4 text-xs text-carbon-suave">
              {producto.disponible
                ? `Consultá disponibilidad al ${NEGOCIO.telefono.display} o pasá por ${NEGOCIO.direccion.calle}.`
                : 'Este producto está sin stock por ahora. Consultanos y te avisamos cuando vuelva.'}
            </p>

            <dl className="mt-10">
              <Dato etiqueta="Categoría" valor={ETIQUETA_CATEGORIA[producto.categoria]} />
              <Dato etiqueta="Varietal / tipo" valor={producto.subcategoria} />
              <Dato etiqueta="Bodega" valor={producto.bodega} />
              <Dato etiqueta="Región" valor={producto.region} />
              <Dato etiqueta="Cosecha" valor={producto.cosecha} />
              <Dato etiqueta="Presentación" valor={producto.presentacion} />
            </dl>

            {(producto.notasCata || producto.maridaje) && (
              <div className="mt-10 flex flex-col gap-6 border-l-2 border-dorado pl-6">
                {producto.notasCata && (
                  <div>
                    <h2 className="font-sans text-xs tracking-[0.2em] text-carbon uppercase">Notas de cata</h2>
                    <p className="mt-2 text-sm leading-relaxed text-carbon-suave">{producto.notasCata}</p>
                  </div>
                )}

                {producto.maridaje && (
                  <div>
                    <h2 className="font-sans text-xs tracking-[0.2em] text-carbon uppercase">Maridaje</h2>
                    <p className="mt-2 text-sm leading-relaxed text-carbon-suave">{producto.maridaje}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </article>
  )
}
