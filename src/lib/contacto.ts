import { NEGOCIO } from '../data/negocio'
import type { Producto } from '../types/producto'

/**
 * Canales de consulta.
 *
 * Hoy la vinería no tiene WhatsApp, así que el CTA principal es el teléfono.
 * Cuando carguen `NEGOCIO.whatsapp`, todos los botones del sitio pasan solos
 * a WhatsApp con el mensaje prearmado: ningún componente necesita cambiar.
 */

export interface CanalConsulta {
  tipo: 'whatsapp' | 'telefono'
  etiqueta: string
  href: string
  /** Para lectores de pantalla, cuando la etiqueta sola no alcanza. */
  descripcion: string
}

export const HAY_WHATSAPP = NEGOCIO.whatsapp !== null

function mensajeConsulta(producto?: Producto): string {
  if (!producto) return '¡Hola! Quería hacer una consulta.'
  const articulo = producto.categoria === 'vino' ? 'el vino' : 'el producto'
  return `¡Hola! Quería consultar por ${articulo} ${producto.nombre}.`
}

/**
 * Canal principal de consulta, con el mensaje armado a partir del producto
 * cuando la consulta sale de una ficha.
 */
export function canalPrincipal(producto?: Producto): CanalConsulta {
  if (NEGOCIO.whatsapp) {
    return {
      tipo: 'whatsapp',
      etiqueta: producto ? 'Consultar por WhatsApp' : 'Escribinos por WhatsApp',
      href: `https://wa.me/${NEGOCIO.whatsapp}?text=${encodeURIComponent(mensajeConsulta(producto))}`,
      descripcion: 'Abre WhatsApp con un mensaje ya escrito',
    }
  }

  return {
    tipo: 'telefono',
    etiqueta: producto ? 'Consultar por teléfono' : `Llamar al ${NEGOCIO.telefono.display}`,
    href: `tel:${NEGOCIO.telefono.tel}`,
    descripcion: `Llama al ${NEGOCIO.telefono.display}`,
  }
}

/** Instagram, que es donde la vinería ya atiende consultas hoy. */
export const CANAL_INSTAGRAM = {
  etiqueta: `@${NEGOCIO.instagram}`,
  href: NEGOCIO.instagramUrl,
  descripcion: 'Abre el perfil de Instagram de la vinería',
} as const
