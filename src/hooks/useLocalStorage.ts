import { useCallback, useState } from 'react'

/**
 * Estado persistido en localStorage.
 *
 * Tolera que el almacenamiento no esté disponible (modo incógnito, cookies
 * bloqueadas): en ese caso se comporta como un useState común.
 */
export function useLocalStorage<T>(clave: string, valorInicial: T) {
  const [valor, setValorEnMemoria] = useState<T>(() => {
    try {
      const guardado = window.localStorage.getItem(clave)
      return guardado !== null ? (JSON.parse(guardado) as T) : valorInicial
    } catch {
      return valorInicial
    }
  })

  const setValor = useCallback(
    (nuevo: T) => {
      setValorEnMemoria(nuevo)
      try {
        window.localStorage.setItem(clave, JSON.stringify(nuevo))
      } catch {
        // Sin localStorage el valor vive solo en esta sesión: no es un error fatal.
      }
    },
    [clave],
  )

  return [valor, setValor] as const
}
