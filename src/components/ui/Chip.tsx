interface Props {
  etiqueta: string
  activo: boolean
  onClick: () => void
}

/** Filtro de una sola opción, del tipo que se activa y desactiva al tocar. */
export function Chip({ etiqueta, activo, onClick }: Props) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={activo}
      className={`rounded-full border px-3.5 py-1.5 text-xs transition-colors duration-200 ${
        activo
          ? 'border-borgona bg-borgona text-crema'
          : 'border-carbon/20 bg-transparent text-carbon-suave hover:border-borgona hover:text-borgona'
      }`}
    >
      {etiqueta}
    </button>
  )
}
