import { Imagen } from '../ui/Imagen'
import { Reveal } from '../ui/Reveal'
import { SectionTitle } from '../ui/SectionTitle'

/** Fotos del local. Reemplazar los placeholders de /public/img/galeria/. */
const FOTOS = [
  { archivo: 'galeria-1.svg', alt: 'Salón de la vinería' },
  { archivo: 'galeria-2.svg', alt: 'Estantería con botellas de vino' },
  { archivo: 'galeria-3.svg', alt: 'Mostrador de atención' },
  { archivo: 'galeria-4.svg', alt: 'Selección de vinos tintos' },
  { archivo: 'galeria-5.svg', alt: 'Vidriera del local' },
  { archivo: 'galeria-6.svg', alt: 'Detalle de etiquetas' },
  { archivo: 'galeria-7.svg', alt: 'Sector de guarda' },
  { archivo: 'galeria-8.svg', alt: 'Fachada de Vinería Martu' },
]

export function Galeria() {
  return (
    <section aria-labelledby="galeria" className="bg-carbon py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <SectionTitle id="galeria" copete="Nuestro local" tono="claro">
            Galería
          </SectionTitle>
        </Reveal>

        <Reveal className="mt-14">
          <ul className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
            {FOTOS.map((foto) => (
              <li key={foto.archivo} className="overflow-hidden rounded-sm">
                <Imagen
                  src={`/img/galeria/${foto.archivo}`}
                  alt={foto.alt}
                  fallback="/img/hero.svg"
                  className="aspect-square w-full object-cover transition-transform duration-500 hover:scale-105"
                />
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  )
}
