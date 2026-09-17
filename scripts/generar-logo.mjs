/**
 * Prepara el logo para el sitio.
 *
 * El logo llega como JPEG con fondo blanco. Sobre la crema del header casi no se
 * nota, pero en el footer oscuro se vería un rectángulo blanco alrededor. Así que
 * acá se le saca el fondo y queda con transparencia: un solo archivo que
 * funciona igual sobre claro y sobre oscuro.
 *
 * El blanco se borra desde los bordes hacia adentro, no por color. Eso importa:
 * el amarillo y el blanco de adentro del cartel "VINERIA" quedan intactos porque
 * están encerrados por el contorno negro.
 *
 * Para cambiar el logo alcanza con dejar un archivo que empiece con "logo" en
 * public/img/. Se regenera en cada `npm run dev` y `npm run build`.
 */
import { readdirSync } from 'node:fs'
import { basename, extname, join, resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const raiz = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const CARPETA = join(raiz, 'public/img')
const SALIDA = join(CARPETA, 'logo.webp')

/** Ancho máximo del archivo generado; de sobra para el tamaño en que se muestra. */
const ANCHO_MAXIMO = 600

/** Un píxel es "fondo" si es casi blanco (el JPEG ensucia un poco el borde). */
const UMBRAL_BLANCO = 232

function buscarOriginal() {
  const candidatos = readdirSync(CARPETA)
    .filter((archivo) => basename(archivo, extname(archivo)).toLowerCase().startsWith('logo'))
    .filter((archivo) => archivo !== 'logo.webp')
    .filter((archivo) => ['.jpg', '.jpeg', '.png', '.webp', '.avif', '.svg'].includes(extname(archivo).toLowerCase()))

  // Si hay varios, gana el de nombre más específico para que sea previsible.
  return candidatos.sort()[0] ?? null
}

/**
 * Hace transparente el fondo, recorriéndolo desde los bordes hacia adentro.
 * Los blancos encerrados dentro del dibujo no se tocan.
 */
function borrarFondo(datos, ancho, alto, canales) {
  const esFondo = (indice) =>
    datos[indice] >= UMBRAL_BLANCO && datos[indice + 1] >= UMBRAL_BLANCO && datos[indice + 2] >= UMBRAL_BLANCO

  const visitado = new Uint8Array(ancho * alto)
  const cola = []

  const encolar = (x, y) => {
    const posicion = y * ancho + x
    if (visitado[posicion]) return
    if (!esFondo(posicion * canales)) return
    visitado[posicion] = 1
    cola.push(posicion)
  }

  for (let x = 0; x < ancho; x++) {
    encolar(x, 0)
    encolar(x, alto - 1)
  }
  for (let y = 0; y < alto; y++) {
    encolar(0, y)
    encolar(ancho - 1, y)
  }

  while (cola.length > 0) {
    const posicion = cola.pop()
    datos[posicion * canales + 3] = 0 // transparente

    const x = posicion % ancho
    const y = (posicion - x) / ancho
    if (x > 0) encolar(x - 1, y)
    if (x < ancho - 1) encolar(x + 1, y)
    if (y > 0) encolar(x, y - 1)
    if (y < alto - 1) encolar(x, y + 1)
  }
}

/**
 * Deja listo public/img/logo.webp y devuelve sus medidas, que el sitio usa para
 * reservar el espacio exacto y que no salte el layout al cargar.
 */
/**
 * A partir del logo ya recortado arma las dos piezas que el navegador pide
 * aparte: el favicon de la pestaña y la imagen que se ve al compartir el link.
 */
async function generarDerivados(sharp, logo) {
  const CREMA = { r: 250, g: 246, b: 239, alpha: 1 }
  const CARBON = { r: 28, g: 26, b: 25, alpha: 1 }

  // Favicon: el logo sobre un cuadrado crema, con aire alrededor.
  await sharp({ create: { width: 256, height: 256, channels: 4, background: CREMA } })
    .composite([{ input: await sharp(logo).resize({ width: 232 }).toBuffer(), gravity: 'centre' }])
    .png({ palette: true, compressionLevel: 9 })
    .toFile(join(raiz, 'public/favicon.png'))

  // Open Graph: así se ve el link al compartirlo por WhatsApp o redes.
  await sharp({ create: { width: 1200, height: 630, channels: 4, background: CARBON } })
    .composite([{ input: await sharp(logo).resize({ width: 620 }).toBuffer(), gravity: 'centre' }])
    .jpeg({ quality: 90 })
    .toFile(join(raiz, 'public/og-image.jpg'))
}

export async function generarLogo() {
  const original = buscarOriginal()
  if (!original) {
    console.warn('  no hay ningún archivo "logo*" en public/img/')
    return null
  }

  // Un SVG ya viene con transparencia y escala solo: se usa tal cual.
  if (extname(original).toLowerCase() === '.svg') {
    return { src: `/img/${original}`, ancho: 0, alto: 0 }
  }

  let sharp
  try {
    sharp = (await import('sharp')).default
  } catch {
    console.warn('  sharp no está instalado: se usa el logo original, con su fondo')
    return { src: `/img/${original}`, ancho: 0, alto: 0 }
  }

  try {
    const { data, info } = await sharp(join(CARPETA, original))
      .ensureAlpha()
      .raw()
      .toBuffer({ resolveWithObject: true })

    borrarFondo(data, info.width, info.height, info.channels)

    const salida = await sharp(data, {
      raw: { width: info.width, height: info.height, channels: info.channels },
    })
      .trim() // saca el margen transparente que quedó alrededor
      .resize({ width: ANCHO_MAXIMO, withoutEnlargement: true })
      // WebP con transparencia: mismo resultado que un PNG y pesa una fracción.
      .webp({ quality: 92 })
      .toFile(SALIDA)

    await generarDerivados(sharp, SALIDA)

    return { src: '/img/logo.webp', ancho: salida.width, alto: salida.height }
  } catch (error) {
    console.warn(`  no se pudo procesar el logo (${error.message}): se usa el original`)
    return { src: `/img/${original}`, ancho: 0, alto: 0 }
  }
}
