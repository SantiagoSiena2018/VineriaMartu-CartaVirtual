import { Link } from 'react-router-dom'
import { PRODUCTOS } from '../../data/catalogo'
import { linkCarta } from '../../hooks/useFiltrosCarta'
import { varietalesDe } from '../../lib/vinos'
import { OTRAS_BEBIDAS } from '../layout/navegacion'
import { Imagen } from '../ui/Imagen'
import { Reveal } from '../ui/Reveal'
import { SectionTitle } from '../ui/SectionTitle'

interface Tarjeta {
  etiqueta: string
  descripcion: string
  imagen: string
  a: string
}

/**
 * Accesos rápidos a la carta ya filtrada.
 *
 * Tinto, blanco y rosado no son categorías del JSON: se derivan del varietal
 * (ver lib/vinos.ts), así el dueño solo carga el dato que tiene en la etiqueta.
 */
function tarjetas(): Tarjeta[] {
  return [
    {
      etiqueta: 'Tintos',
      descripcion: 'Malbec, Cabernet, Blends y más',
      imagen: '/img/categorias/tintos.svg',
      a: linkCarta({ categoria: 'vino', subcategorias: varietalesDe(PRODUCTOS, 'tinto') }),
    },
    {
      etiqueta: 'Blancos',
      descripcion: 'Frescos, para tomar bien fríos',
      imagen: '/img/categorias/blancos.svg',
      a: linkCarta({ categoria: 'vino', subcategorias: varietalesDe(PRODUCTOS, 'blanco') }),
    },
    {
      etiqueta: 'Rosados',
      descripcion: 'Livianos y versátiles',
      imagen: '/img/categorias/rosados.svg',
      a: linkCarta({ categoria: 'vino', subcategorias: varietalesDe(PRODUCTOS, 'rosado') }),
    },
    {
      etiqueta: 'Espumantes',
      descripcion: 'Para brindar en cualquier momento',
      imagen: '/img/categorias/espumantes.svg',
      a: linkCarta({ categoria: 'espumante' }),
    },
    {
      etiqueta: 'Otras bebidas',
      descripcion: 'Cervezas, aperitivos y destilados',
      imagen: '/img/categorias/otras-bebidas.svg',
      a: `/carta?${OTRAS_BEBIDAS.map((c) => `cat=${c}`).join('&')}`,
    },
  ]
}

export function CategoriasGrid() {
  return (
    <section aria-labelledby="categorias" className="bg-crema-oscuro py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <SectionTitle id="categorias" copete="Encontrá lo tuyo">
            Explorá por categoría
          </SectionTitle>
        </Reveal>

        <Reveal className="mt-14">
          <ul className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-5">
            {tarjetas().map((tarjeta) => (
              <li key={tarjeta.etiqueta}>
                <Link
                  to={tarjeta.a}
                  className="group relative block h-full overflow-hidden rounded-sm bg-carbon"
                >
                  <Imagen
                    src={tarjeta.imagen}
                    alt=""
                    fallback="/img/categorias/tintos.svg"
                    className="aspect-[4/5] w-full object-cover opacity-70 transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-carbon/90 to-transparent p-5">
                    <h3 className="font-serif text-xl tracking-wide text-crema">{tarjeta.etiqueta}</h3>
                    <p className="mt-1 text-xs leading-snug text-crema/75">{tarjeta.descripcion}</p>
                    <span className="mt-3 text-[0.65rem] tracking-[0.2em] text-dorado uppercase">
                      Ver más &gt;
                    </span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  )
}
