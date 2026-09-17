/**
 * Genera public/sitemap.xml a partir del catálogo.
 * Se ejecuta solo antes de cada build (npm run build), así el sitemap nunca
 * queda desactualizado respecto de productos.json.
 */
import { readFileSync, writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'

const raiz = resolve(dirname(fileURLToPath(import.meta.url)), '..')

// El dominio también está en src/data/negocio.ts; se lee de ahí para no duplicarlo.
const negocio = readFileSync(resolve(raiz, 'src/data/negocio.ts'), 'utf8')
const sitio = negocio.match(/sitioUrl:\s*'([^']+)'/)?.[1] ?? 'https://vineriamartu.netlify.app'

const { productos } = JSON.parse(readFileSync(resolve(raiz, 'src/data/productos.json'), 'utf8'))
const hoy = new Date().toISOString().slice(0, 10)

const urls = [
  { loc: '/', prioridad: '1.0' },
  { loc: '/carta', prioridad: '0.9' },
  ...productos.map((producto) => ({ loc: `/carta/${producto.id}`, prioridad: '0.7' })),
]

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    ({ loc, prioridad }) =>
      `  <url>\n    <loc>${sitio}${loc}</loc>\n    <lastmod>${hoy}</lastmod>\n    <priority>${prioridad}</priority>\n  </url>`,
  )
  .join('\n')}
</urlset>
`

writeFileSync(resolve(raiz, 'public/sitemap.xml'), xml)
console.log(`sitemap.xml generado con ${urls.length} URLs`)
