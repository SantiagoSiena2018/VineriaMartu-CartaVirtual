import { CategoriasGrid } from '../components/home/CategoriasGrid'
import { Contacto } from '../components/home/Contacto'
import { Galeria } from '../components/home/Galeria'
import { Hero } from '../components/home/Hero'
import { SobreNosotros } from '../components/home/SobreNosotros'
import { VinosDestacados } from '../components/home/VinosDestacados'
import { NEGOCIO } from '../data/negocio'
import { useSeo } from '../hooks/useSeo'
import { schemaNegocio, TITULO_BASE } from '../lib/seo'

export function Home() {
  useSeo({
    titulo: TITULO_BASE,
    descripcion: `Vinería en ${NEGOCIO.direccion.zona}. Vinos argentinos, espumantes, cervezas y destilados. Mirá la carta y consultanos disponibilidad.`,
    ruta: '/',
    schema: schemaNegocio(),
  })

  return (
    <>
      <Hero />
      <VinosDestacados />
      <CategoriasGrid />
      <SobreNosotros />
      <Galeria />
      <Contacto />
    </>
  )
}
