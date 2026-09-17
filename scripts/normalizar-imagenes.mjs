/**
 * Empareja el tamaño de las botellas.
 *
 * Las fotos vienen de fuentes distintas: algunas son cuadradas con la botella
 * chica en el medio y otras vienen ajustadas al borde. Si se muestran tal cual,
 * en la grilla una botella se ve el doble que la de al lado.
 *
 * Por cada foto: se recorta el fondo blanco que sobra, se escala la botella a
 * una altura fija y se la centra en un lienzo de 900x1200 (3:4, la proporción
 * de la tarjeta). Resultado: todas las botellas se ven del mismo alto.
 *
 * Las originales no se tocan. Las versiones emparejadas se escriben en
 * public/img/productos/normalizadas/ y son las que usa el sitio.
 */
import { mkdirSync, readdirSync, statSync } from 'node:fs'
import { basename, extname, join, resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const raiz = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const ORIGEN = join(raiz, 'public/img/productos')
const DESTINO = join(ORIGEN, 'normalizadas')

/** Lienzo final, en la proporción 3:4 que usan la tarjeta y la ficha. */
const ANCHO = 900
const ALTO = 1200

/** Margen alrededor de la botella, para que no toque los bordes. */
const MARGEN_X = 0.12
const MARGEN_Y = 0.07

const EXTENSIONES = ['.webp', '.avif', '.jpg', '.jpeg', '.png']

/**
 * Recorta el fondo uniforme y centra la botella en el lienzo.
 * Devuelve el nombre del archivo generado, o null si la foto no se pudo procesar.
 */
async function normalizar(sharp, archivo) {
  const id = basename(archivo, extname(archivo))
  const salida = join(DESTINO, `${id}.webp`)

  try {
    if (statSync(salida).mtimeMs >= statSync(join(ORIGEN, archivo)).mtimeMs) {
      return `${id}.webp` // ya está al día
    }
  } catch {
    // Todavía no existe: hay que generarla.
  }

  const interior = {
    ancho: Math.round(ANCHO * (1 - MARGEN_X * 2)),
    alto: Math.round(ALTO * (1 - MARGEN_Y * 2)),
  }

  try {
    // `trim` saca el borde de color uniforme (el blanco del fondo). Si la foto
    // no tiene un borde parejo, sigue de largo sin recortar.
    const recortada = await sharp(join(ORIGEN, archivo))
      .trim({ threshold: 12 })
      .toBuffer()
      .catch(() => sharp(join(ORIGEN, archivo)).toBuffer())

    await sharp(recortada)
      .resize(interior.ancho, interior.alto, {
        fit: 'contain',
        background: { r: 255, g: 255, b: 255, alpha: 0 },
      })
      .extend({
        top: Math.round((ALTO - interior.alto) / 2),
        bottom: ALTO - interior.alto - Math.round((ALTO - interior.alto) / 2),
        left: Math.round((ANCHO - interior.ancho) / 2),
        right: ANCHO - interior.ancho - Math.round((ANCHO - interior.ancho) / 2),
        background: { r: 255, g: 255, b: 255, alpha: 0 },
      })
      .webp({ quality: 88 })
      .toFile(salida)

    return `${id}.webp`
  } catch (error) {
    console.warn(`  no se pudo normalizar ${archivo}: ${error.message}`)
    return null
  }
}

/**
 * Deja listas las versiones emparejadas y devuelve el mapa
 * id → nombre de archivo normalizado. Si sharp no está disponible, devuelve un
 * mapa vacío y el sitio usa las fotos originales.
 */
export async function normalizarImagenes() {
  let sharp
  try {
    sharp = (await import('sharp')).default
  } catch {
    console.warn('  sharp no está instalado: se usan las fotos originales, sin emparejar tamaños')
    return {}
  }

  mkdirSync(DESTINO, { recursive: true })

  const archivos = readdirSync(ORIGEN)
    .filter((archivo) => EXTENSIONES.includes(extname(archivo).toLowerCase()))
    .filter((archivo) => basename(archivo, extname(archivo)) !== 'placeholder-botella')

  const mapa = {}
  for (const archivo of archivos) {
    const generado = await normalizar(sharp, archivo)
    if (generado) mapa[basename(archivo, extname(archivo))] = generado
  }

  return mapa
}
