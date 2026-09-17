import { canalPrincipal } from '../../lib/contacto'

/**
 * Botón flotante de consulta, presente en todas las páginas.
 * Muestra WhatsApp o teléfono según lo que haya cargado en `negocio.ts`.
 */
export function ContactoFab() {
  const canal = canalPrincipal()
  const esWhatsapp = canal.tipo === 'whatsapp'

  return (
    <a
      href={canal.href}
      {...(esWhatsapp ? { target: '_blank', rel: 'noreferrer' } : {})}
      aria-label={canal.descripcion}
      className={`fixed right-4 bottom-4 z-30 flex h-14 w-14 items-center justify-center rounded-full text-crema shadow-lg transition-transform duration-200 hover:scale-105 sm:right-6 sm:bottom-6 ${
        esWhatsapp ? 'bg-[#25d366] text-white' : 'bg-borgona'
      }`}
    >
      {esWhatsapp ? (
        <svg viewBox="0 0 24 24" className="h-7 w-7" fill="currentColor" aria-hidden="true">
          <path d="M17.47 14.38c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.48-.89-.79-1.49-1.77-1.66-2.07-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.61-.92-2.21-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.8.37-.27.3-1.04 1.02-1.04 2.48 0 1.46 1.07 2.88 1.22 3.08.15.2 2.1 3.2 5.08 4.49.71.3 1.26.49 1.69.63.71.22 1.36.19 1.87.12.57-.09 1.76-.72 2.01-1.41.25-.7.25-1.29.17-1.41-.07-.13-.27-.2-.57-.35zM12.04 21.5h-.01a9.4 9.4 0 0 1-4.79-1.31l-.34-.2-3.56.93.95-3.47-.22-.36a9.38 9.38 0 0 1-1.44-5.01c0-5.19 4.23-9.41 9.42-9.41 2.51 0 4.88.98 6.65 2.76a9.35 9.35 0 0 1 2.76 6.66c0 5.19-4.23 9.41-9.42 9.41zM20.5 3.49A11.8 11.8 0 0 0 12.04 0C5.5 0 .18 5.32.17 11.86c0 2.09.55 4.13 1.59 5.93L.07 24l6.35-1.66a11.85 11.85 0 0 0 5.62 1.43h.01c6.54 0 11.86-5.32 11.87-11.86a11.8 11.8 0 0 0-3.42-8.42z" />
        </svg>
      ) : (
        <svg viewBox="0 0 24 24" className="h-6 w-6" fill="currentColor" aria-hidden="true">
          <path d="M6.6 10.8a15.1 15.1 0 0 0 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1C10.6 21 3 13.4 3 4c0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.2.2 2.4.6 3.6.1.3 0 .7-.2 1l-2.3 2.2z" />
        </svg>
      )}
    </a>
  )
}
