import { DIRECCION_COMPLETA, MAPA_EMBED_URL, MAPA_LINK_URL, NEGOCIO } from '../../data/negocio'
import { CANAL_INSTAGRAM, canalPrincipal } from '../../lib/contacto'
import { estilosBoton } from '../ui/estilosBoton'
import { Reveal } from '../ui/Reveal'
import { SectionTitle } from '../ui/SectionTitle'

export function Contacto() {
  const canal = canalPrincipal()

  return (
    <section id="contacto" aria-labelledby="contacto-titulo" className="bg-crema py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <SectionTitle id="contacto-titulo" copete="Te esperamos">
            Dónde encontrarnos
          </SectionTitle>
        </Reveal>

        <Reveal className="mt-14">
          <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
            <div>
              <dl className="flex flex-col gap-8">
                <div>
                  <dt className="font-sans text-xs tracking-[0.2em] text-borgona uppercase">Dirección</dt>
                  <dd className="mt-2 text-base text-carbon">
                    <a href={MAPA_LINK_URL} target="_blank" rel="noreferrer" className="hover:text-borgona">
                      {DIRECCION_COMPLETA} ({NEGOCIO.direccion.cp})
                    </a>
                  </dd>
                </div>

                <div>
                  <dt className="font-sans text-xs tracking-[0.2em] text-borgona uppercase">Horarios</dt>
                  <dd className="mt-2">
                    <ul className="flex flex-col gap-1.5 text-base text-carbon">
                      {NEGOCIO.horarios.map((horario) => (
                        <li key={horario.dias} className="flex flex-wrap justify-between gap-x-6 gap-y-1">
                          <span>{horario.dias}</span>
                          <span className="text-carbon-suave">
                            {horario.franjas.length > 0 ? horario.franjas.join(' · ') : 'Cerrado'}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </dd>
                </div>

                <div>
                  <dt className="font-sans text-xs tracking-[0.2em] text-borgona uppercase">Teléfono</dt>
                  <dd className="mt-2 text-base text-carbon">
                    <a href={`tel:${NEGOCIO.telefono.tel}`} className="hover:text-borgona">
                      {NEGOCIO.telefono.display}
                    </a>
                  </dd>
                </div>

                <div>
                  <dt className="font-sans text-xs tracking-[0.2em] text-borgona uppercase">Instagram</dt>
                  <dd className="mt-2 text-base text-carbon">
                    <a
                      href={CANAL_INSTAGRAM.href}
                      target="_blank"
                      rel="noreferrer"
                      className="hover:text-borgona"
                    >
                      {CANAL_INSTAGRAM.etiqueta}
                    </a>
                  </dd>
                </div>
              </dl>

              <div className="mt-10 flex flex-col gap-3 sm:flex-row">
                <a
                  href={canal.href}
                  {...(canal.tipo === 'whatsapp' ? { target: '_blank', rel: 'noreferrer' } : {})}
                  className={estilosBoton('primario', 'lg')}
                >
                  {canal.etiqueta}
                </a>
                <a
                  href={MAPA_LINK_URL}
                  target="_blank"
                  rel="noreferrer"
                  className={estilosBoton('sutil', 'lg')}
                >
                  Cómo llegar
                </a>
              </div>
            </div>

            <div className="overflow-hidden rounded-sm border border-carbon/10">
              <iframe
                title={`Mapa con la ubicación de ${NEGOCIO.nombre}`}
                src={MAPA_EMBED_URL}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="h-80 w-full lg:h-full lg:min-h-[26rem]"
              />
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
