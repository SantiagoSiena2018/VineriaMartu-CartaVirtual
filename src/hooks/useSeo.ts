import { useEffect } from 'react'
import { NEGOCIO } from '../data/negocio'
import { urlAbsoluta } from '../lib/seo'

interface OpcionesSeo {
  titulo: string
  descripcion: string
  /** Ruta del sitio, no URL completa. Ej: '/carta'. */
  ruta: string
  /** Ruta de la imagen para compartir. Por defecto, la imagen general del sitio. */
  imagen?: string
  /** Objeto JSON-LD con los datos estructurados de la página. */
  schema?: object
}

function meta(atributo: 'name' | 'property', clave: string, contenido: string) {
  let etiqueta = document.head.querySelector<HTMLMetaElement>(`meta[${atributo}="${clave}"]`)
  if (!etiqueta) {
    etiqueta = document.createElement('meta')
    etiqueta.setAttribute(atributo, clave)
    document.head.appendChild(etiqueta)
  }
  etiqueta.content = contenido
}

/**
 * Actualiza el <head> por página: título, descripción, Open Graph y JSON-LD.
 *
 * Como es una SPA, estas etiquetas se escriben en el cliente. Alcanzan para que
 * el link se vea bien al compartirlo (los crawlers de buscadores ejecutan JS);
 * si en el futuro hace falta prerender real, la alternativa es vite-react-ssg.
 */
export function useSeo({ titulo, descripcion, ruta, imagen = '/og-image.jpg', schema }: OpcionesSeo) {
  useEffect(() => {
    const url = urlAbsoluta(ruta)
    const imagenAbsoluta = urlAbsoluta(imagen)

    document.title = titulo
    meta('name', 'description', descripcion)

    meta('property', 'og:type', 'website')
    meta('property', 'og:site_name', NEGOCIO.nombre)
    meta('property', 'og:locale', 'es_AR')
    meta('property', 'og:title', titulo)
    meta('property', 'og:description', descripcion)
    meta('property', 'og:url', url)
    meta('property', 'og:image', imagenAbsoluta)

    meta('name', 'twitter:card', 'summary_large_image')
    meta('name', 'twitter:title', titulo)
    meta('name', 'twitter:description', descripcion)
    meta('name', 'twitter:image', imagenAbsoluta)

    let canonical = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]')
    if (!canonical) {
      canonical = document.createElement('link')
      canonical.rel = 'canonical'
      document.head.appendChild(canonical)
    }
    canonical.href = url
  }, [titulo, descripcion, ruta, imagen])

  useEffect(() => {
    if (!schema) return

    const etiqueta = document.createElement('script')
    etiqueta.type = 'application/ld+json'
    etiqueta.textContent = JSON.stringify(schema)
    document.head.appendChild(etiqueta)

    return () => etiqueta.remove()
    // El schema se arma en cada render, así que comparamos por contenido.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(schema)])
}
