import { Link } from 'react-router-dom'
import { NEGOCIO } from '../../data/negocio'
import { Imagen } from '../ui/Imagen'
import { Reveal } from '../ui/Reveal'
import { SectionTitle } from '../ui/SectionTitle'

/**
 * Bloque imagen + texto.
 * El texto es un borrador: reemplazar por la historia real del local.
 */
export function SobreNosotros() {
  return (
    <section id="nosotros" aria-labelledby="nosotros-titulo" className="bg-crema py-20 sm:py-28">
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:gap-20 lg:px-8">
        <Reveal>
          <Imagen
            src="/img/nosotros.svg"
            alt="Interior de Vinería Martu"
            fallback="/img/hero.svg"
            className="aspect-[4/5] w-full rounded-sm object-cover"
          />
        </Reveal>

        <Reveal>
          <SectionTitle id="nosotros-titulo" copete={`Desde ${NEGOCIO.desde}`} alineacion="izquierda">
            Sobre Vinería Martu
          </SectionTitle>

          <div className="mt-8 flex flex-col gap-5 text-base leading-relaxed text-carbon-suave">
            <p>
              [COMPLETAR historia del local: cómo empezó la vinería en {NEGOCIO.desde}, quiénes están
              detrás del mostrador y qué los diferencia.]
            </p>
            <p>
              [COMPLETAR: un párrafo sobre cómo eligen lo que venden, el trato con los clientes del barrio
              y qué se van a encontrar al entrar.]
            </p>
            <p>
              Estamos en {NEGOCIO.direccion.calle}, {NEGOCIO.direccion.localidad}, y nos atendemos nosotros
              mismos: si no sabés qué llevar, preguntanos.
            </p>
          </div>

          <Link
            to="/carta"
            className="mt-8 inline-block text-xs tracking-[0.2em] text-borgona uppercase underline underline-offset-8 transition-colors hover:text-borgona-oscuro"
          >
            Ver la carta &gt;
          </Link>
        </Reveal>
      </div>
    </section>
  )
}
