import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { AgeGate } from './components/AgeGate'
import { Layout } from './components/layout/Layout'
import { Carta } from './pages/Carta'
import { Home } from './pages/Home'
import { NoEncontrada } from './pages/NoEncontrada'
import { ProductoDetalle } from './pages/ProductoDetalle'

export function App() {
  return (
    <BrowserRouter>
      <AgeGate>
        <Routes>
          <Route element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="carta" element={<Carta />} />
            <Route path="carta/:id" element={<ProductoDetalle />} />
            <Route path="*" element={<NoEncontrada />} />
          </Route>
        </Routes>
      </AgeGate>
    </BrowserRouter>
  )
}
