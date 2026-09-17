import type { ReactNode } from 'react'

interface Props {
  children: ReactNode
  /** Texto chico sobre el título. */
  copete?: string
  /** Bajada explicativa debajo del título. */
  bajada?: string
  alineacion?: 'centro' | 'izquierda'
  tono?: 'oscuro' | 'claro'
  /** Nivel del encabezado; el h1 se reserva para el título principal de cada página. */
  como?: 'h1' | 'h2' | 'h3'
  id?: string
}

/**
 * Título de sección: mayúsculas con una línea dorada fina debajo,
 * el recurso que ordena visualmente todo el sitio.
 */
export function SectionTitle({
  children,
  copete,
  bajada,
  alineacion = 'centro',
  tono = 'oscuro',
  como: Encabezado = 'h2',
  id,
}: Props) {
  const centrado = alineacion === 'centro'
  const claro = tono === 'claro'

  return (
    <div className={centrado ? 'text-center' : 'text-left'}>
      {copete && (
        <p
          className={`mb-3 font-sans text-xs tracking-[0.3em] uppercase ${
            claro ? 'text-dorado' : 'text-borgona'
          }`}
        >
          {copete}
        </p>
      )}

      <Encabezado
        id={id}
        className={`text-3xl tracking-[0.08em] uppercase sm:text-4xl ${claro ? 'text-crema' : 'text-carbon'}`}
      >
        {children}
      </Encabezado>

      <span
        aria-hidden="true"
        className={`mt-5 block h-px w-16 bg-dorado ${centrado ? 'mx-auto' : ''}`}
      />

      {bajada && (
        <p
          className={`mt-5 max-w-2xl text-base leading-relaxed ${centrado ? 'mx-auto' : ''} ${
            claro ? 'text-crema/80' : 'text-carbon-suave'
          }`}
        >
          {bajada}
        </p>
      )}
    </div>
  )
}
