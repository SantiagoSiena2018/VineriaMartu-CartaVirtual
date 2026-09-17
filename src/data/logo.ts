import logoGenerado from './logo.generado.json'

/**
 * El logo del sitio, ya sin fondo (lo prepara scripts/generar-logo.mjs).
 *
 * Para cambiarlo: dejar el archivo nuevo en public/img/ con un nombre que
 * empiece con "logo" y volver a correr `npm run dev` o `npm run build`.
 * `ancho` y `alto` son los del archivo generado; sirven para reservar el
 * espacio exacto y que no salte el layout mientras carga.
 */
export const LOGO = logoGenerado as { src: string; ancho: number; alto: number }
