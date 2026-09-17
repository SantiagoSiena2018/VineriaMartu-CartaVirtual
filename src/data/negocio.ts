/**
 * Datos del local. Todo lo que cambia sin tocar código vive acá.
 *
 * Los valores marcados con [COMPLETAR] son los únicos que faltan confirmar.
 */

export interface Horario {
  dias: string
  /** Vacío = cerrado. */
  franjas: string[]
}

export const NEGOCIO = {
  nombre: 'Vinería Martu',
  desde: 1991,

  direccion: {
    calle: 'Morelli 918',
    localidad: 'Pérez',
    provincia: 'Santa Fe',
    cp: 'S2121',
    pais: 'Argentina',
    /** Cómo se nombra la zona en textos y SEO. */
    zona: 'Pérez, Gran Rosario',
  },

  telefono: {
    display: '0341 495-1237',
    /** Formato internacional para el link tel: */
    tel: '+543414951237',
  },

  /**
   * [COMPLETAR] Número de WhatsApp en formato internacional sin signos ni espacios,
   * por ejemplo '5493416123456'.
   *
   * Mientras sea null, el sitio ofrece "Llamar" + Instagram como vías de consulta.
   * Al cargar el número, todos los botones de consulta pasan solos a WhatsApp:
   * no hay que tocar ningún componente.
   */
  whatsapp: null as string | null,

  instagram: 'vineria.martu',
  instagramUrl: 'https://www.instagram.com/vineria.martu/',

  horarios: [
    { dias: 'Lunes a sábado', franjas: ['08:00 – 12:30', '16:30 – 20:30'] },
    { dias: 'Domingo', franjas: [] },
  ] satisfies Horario[],

  /** Formato schema.org (openingHours) para el JSON-LD de SEO local. */
  horariosSchema: ['Mo-Sa 08:00-12:30', 'Mo-Sa 16:30-20:30'],

  /** [COMPLETAR] Dominio definitivo, para las URLs canónicas y las Open Graph. */
  sitioUrl: 'https://vineriamartu.netlify.app',
} as const

/** Dirección en una línea, como se muestra y se busca en el mapa. */
export const DIRECCION_COMPLETA = `${NEGOCIO.direccion.calle}, ${NEGOCIO.direccion.localidad}, ${NEGOCIO.direccion.provincia}`

export const MAPA_EMBED_URL = `https://www.google.com/maps?q=${encodeURIComponent(
  `${DIRECCION_COMPLETA}, ${NEGOCIO.direccion.pais}`,
)}&output=embed`

export const MAPA_LINK_URL = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
  `${NEGOCIO.nombre}, ${DIRECCION_COMPLETA}`,
)}`

/** Texto legal obligatorio en la comunicación de bebidas alcohólicas. */
export const LEYENDA_LEGAL = 'Beber con moderación | Prohibida su venta a menores de 18 años'
