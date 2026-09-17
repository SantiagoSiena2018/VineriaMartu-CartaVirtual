import { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { ContactoFab } from './ContactoFab'
import { Footer } from './Footer'
import { Header } from './Header'

/**
 * Al navegar, el router no mueve el scroll por su cuenta: hay que llevarlo
 * arriba en cada página nueva, o a la sección si la URL trae un ancla.
 */
function ControlDeScroll() {
  const { pathname, hash } = useLocation()

  useEffect(() => {
    if (hash) {
      const destino = document.querySelector(hash)
      if (destino) {
        destino.scrollIntoView({ behavior: 'smooth', block: 'start' })
        return
      }
    }
    window.scrollTo({ top: 0 })
  }, [pathname, hash])

  return null
}

export function Layout() {
  return (
    <div className="flex min-h-screen flex-col">
      <a
        href="#contenido"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:rounded-full focus:bg-borgona focus:px-5 focus:py-3 focus:text-xs focus:tracking-[0.15em] focus:text-crema focus:uppercase"
      >
        Saltar al contenido
      </a>

      <ControlDeScroll />
      <Header />

      <main id="contenido" className="flex-1">
        <Outlet />
      </main>

      <Footer />
      <ContactoFab />
    </div>
  )
}
