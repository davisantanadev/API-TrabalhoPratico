import { useState } from 'react'
import { NavLink, Route, Routes, useLocation } from 'react-router-dom'
import CrudPage from './components/CrudPage'
import Dashboard from './pages/Dashboard'
import Consultas from './pages/Consultas'
import * as entities from './entities'

const MENU = [
  { to: '/', label: 'Painel', icon: 'bi-speedometer2', end: true },
  { to: '/fabricantes', label: 'Fabricantes', icon: 'bi-building' },
  { to: '/categorias', label: 'Categorias', icon: 'bi-tags' },
  { to: '/clientes', label: 'Clientes', icon: 'bi-people' },
  { to: '/veiculos', label: 'Veículos', icon: 'bi-car-front' },
  { to: '/alugueis', label: 'Aluguéis', icon: 'bi-key' },
  { to: '/consultas', label: 'Consultas', icon: 'bi-diagram-3' },
]

export default function App() {
  const [aberto, setAberto] = useState(false)
  useLocation() // re-renderiza ao navegar

  return (
    <div className="app-shell">
      {aberto && <div className="sidebar-backdrop" onClick={() => setAberto(false)} />}
      <aside className={`sidebar ${aberto ? 'open' : ''}`}>
        <div className="brand">
          <i className="bi bi-car-front-fill me-2" />
          Locadora de Veículos
        </div>
        <nav className="nav flex-column mt-2">
          {MENU.map((m) => (
            <NavLink key={m.to} to={m.to} end={m.end} className="nav-link" onClick={() => setAberto(false)}>
              <i className={`bi ${m.icon}`} />
              {m.label}
            </NavLink>
          ))}
        </nav>
      </aside>

      <div className="main">
        <div className="topbar-mobile">
          <button className="btn btn-sm btn-outline-light" onClick={() => setAberto(true)} aria-label="Abrir menu">
            <i className="bi bi-list" />
          </button>
          <strong>Locadora de Veículos</strong>
        </div>
        <main className="page-pad">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/fabricantes" element={<CrudPage key="fab" config={entities.fabricantes} />} />
            <Route path="/categorias" element={<CrudPage key="cat" config={entities.categorias} />} />
            <Route path="/clientes" element={<CrudPage key="cli" config={entities.clientes} />} />
            <Route path="/veiculos" element={<CrudPage key="vei" config={entities.veiculos} />} />
            <Route path="/alugueis" element={<CrudPage key="alu" config={entities.alugueis} />} />
            <Route path="/consultas" element={<Consultas />} />
            <Route
              path="*"
              element={
                <div className="text-center py-5">
                  <h2>Página não encontrada</h2>
                </div>
              }
            />
          </Routes>
        </main>
      </div>
    </div>
  )
}
