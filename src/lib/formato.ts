const formateadorPesos = new Intl.NumberFormat('es-AR', {
  style: 'currency',
  currency: 'ARS',
  maximumFractionDigits: 0,
})

/** Precio en pesos, o "Consultar" cuando el producto no tiene precio cargado. */
export function formatearPrecio(precio?: number): string {
  if (precio === undefined || precio === null) return 'Consultar'
  return formateadorPesos.format(precio)
}

/** Quita acentos y pasa a minúsculas, para buscar sin que importe cómo se escriba. */
export function normalizar(texto: string): string {
  return texto
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
}

/** Une las partes que existen con un separador, ignorando las vacías. */
export function unir(partes: (string | number | undefined)[], separador = ' · '): string {
  return partes.filter(Boolean).join(separador)
}
