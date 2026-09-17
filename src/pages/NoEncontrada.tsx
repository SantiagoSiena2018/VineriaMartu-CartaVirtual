import { Link } from 'react-router-dom'
import { estilosBoton } from '../components/ui/estilosBoton'
import { SectionTitle } from '../components/ui/SectionTitle'
import { useSeo } from '../hooks/useSeo'
import { titulo } from '../lib/seo'

interface Props {
  mensaje?: string
}

export function NoEncontrada({ mensaje = 'La página que buscabas no existe o cambió de dirección.' }: Props) {
  useSeo({
    titulo: titulo('Página no encontrada'),
    descripcion: mensaje,
    ruta: '/404',
  })

  return (
    <section className="flex min-h-[70vh] items-center justify-center px-4 pt-28 pb-16">
      <div className="text-center">
        <SectionTitle como="h1" copete="Error 404" bajada={mensaje}>
          No encontramos esta página
        </SectionTitle>

        <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row">
          <Link to="/carta" className={estilosBoton('primario', 'lg')}>
            Ver la carta
          </Link>
          <Link to="/" className={estilosBoton('sutil', 'lg')}>
            Volver al inicio
          </Link>
        </div>
      </div>
    </section>
  )
}
