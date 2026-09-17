import type { ButtonHTMLAttributes } from 'react'
import { estilosBoton, type TamanoBoton, type VarianteBoton } from './estilosBoton'

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variante?: VarianteBoton
  tamano?: TamanoBoton
}

export function Boton({ variante, tamano, className = '', ...props }: Props) {
  return <button {...props} className={`${estilosBoton(variante, tamano)} ${className}`} />
}
