import { Link } from 'react-router-dom'
import { NEGOCIO } from '../../data/negocio'
import { estilosBoton } from '../ui/estilosBoton'

/**
 * Hero a pantalla completa. La foto manda y el texto es mínimo:
 * una frase corta y un solo camino claro, que es ver la carta.
 */
export function Hero() {
  return (
    <section className="relative flex min-h-[100svh] items-center justify-center overflow-hidden">
      <img
        src="/img/hero.svg"
        alt=""
        aria-hidden="true"
        className="absolute inset-0 h-full w-full object-cover"
        fetchPriority="high"
      />
      <div aria-hidden="true" className="absolute inset-0 bg-carbon/55" />

      <div className="relative z-10 mx-auto max-w-3xl px-6 text-center">
        <p className="font-sans text-xs tracking-[0.35em] text-dorado uppercase">
          {NEGOCIO.direccion.zona} · desde {NEGOCIO.desde}
        </p>

        <h1 className="mt-6 text-4xl leading-[1.15] text-crema sm:text-6xl">
          Cada botella
          <br />
          guarda una historia
        </h1>

        <span aria-hidden="true" className="mx-auto mt-8 block h-px w-20 bg-dorado" />

        <p className="mx-auto mt-8 max-w-xl text-base leading-relaxed text-crema/85">
          Vinos argentinos elegidos uno por uno, y las bebidas que no pueden faltar en tu mesa.
          Pasá, mirá la carta y consultanos lo que quieras.
        </p>

        <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link to="/carta" className={estilosBoton('primario', 'lg')}>
            Ver la carta
          </Link>
          <a href="#nosotros" className={estilosBoton('claro', 'lg')}>
            Conocenos
          </a>
        </div>
      </div>
    </section>
  )
}
