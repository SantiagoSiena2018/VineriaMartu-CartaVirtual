import { Boton } from '../ui/Boton'

interface Props {
  onLimpiar: () => void
}

export function EstadoVacio({ onLimpiar }: Props) {
  return (
    <div className="rounded-sm border border-dashed border-carbon/20 px-6 py-20 text-center">
      <p className="font-serif text-2xl text-carbon">No encontramos nada con esos filtros</p>
      <span aria-hidden="true" className="mx-auto mt-5 block h-px w-16 bg-dorado" />
      <p className="mx-auto mt-5 max-w-md text-sm leading-relaxed text-carbon-suave">
        Probá con menos filtros o buscá por otra bodega. Si buscás algo puntual que no ves en la carta,
        escribinos: seguro lo conseguimos.
      </p>
      <div className="mt-8">
        <Boton variante="secundario" onClick={onLimpiar}>
          Limpiar filtros
        </Boton>
      </div>
    </div>
  )
}
