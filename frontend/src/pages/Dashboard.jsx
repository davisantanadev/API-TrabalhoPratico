import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import * as api from '../api'
import { Carregando, Erro } from '../components/States'

const CARDS = [
  { chave: 'fabricantes', titulo: 'Fabricantes', icone: 'bi-building', cor: 'primary', to: '/fabricantes' },
  { chave: 'categorias', titulo: 'Categorias', icone: 'bi-tags', cor: 'info', to: '/categorias' },
  { chave: 'clientes', titulo: 'Clientes', icone: 'bi-people', cor: 'success', to: '/clientes' },
  { chave: 'veiculos', titulo: 'Veículos', icone: 'bi-car-front', cor: 'warning', to: '/veiculos' },
  { chave: 'alugueis', titulo: 'Aluguéis', icone: 'bi-key', cor: 'secondary', to: '/alugueis' },
  { chave: 'ativos', titulo: 'Aluguéis ativos', icone: 'bi-activity', cor: 'danger', to: '/alugueis' },
  { chave: 'nuncaAlugados', titulo: 'Veículos nunca alugados', icone: 'bi-slash-circle', cor: 'dark', to: '/consultas' },
]

export default function Dashboard() {
  const [dados, setDados] = useState(null)
  const [erro, setErro] = useState(null)

  const carregar = useCallback(async () => {
    setErro(null)
    setDados(null)
    try {
      const [fab, cat, cli, vei, alu, ati, nunca] = await Promise.all([
        api.fabricantes.list(),
        api.categorias.list(),
        api.clientes.list(),
        api.veiculos.list(),
        api.alugueis.list(),
        api.consultas.alugueisAtivos(),
        api.consultas.veiculosNuncaAlugados(),
      ])
      const n = (x) => (Array.isArray(x) ? x.length : 0)
      setDados({ fabricantes: n(fab), categorias: n(cat), clientes: n(cli), veiculos: n(vei), alugueis: n(alu), ativos: n(ati), nuncaAlugados: n(nunca) })
    } catch (e) {
      setErro(e)
    }
  }, [])

  useEffect(() => {
    carregar()
  }, [carregar])

  return (
    <div>
      <h2 className="h3 mb-1">
        <i className="bi bi-speedometer2 me-2 text-primary" />
        Painel
      </h2>
      <p className="text-muted">Visão geral da Locadora de Veículos, com dados em tempo real da API.</p>

      {erro ? (
        <Erro erro={erro} onRetry={carregar} />
      ) : !dados ? (
        <Carregando />
      ) : (
        <div className="row g-3 mb-4">
          {CARDS.map((c) => (
            <div key={c.chave} className="col-12 col-sm-6 col-xl-3">
              <Link to={c.to} className="text-decoration-none text-reset">
                <div className="card stat-card h-100">
                  <div className="card-body d-flex align-items-center gap-3">
                    <div className={`stat-icon bg-${c.cor}-subtle text-${c.cor}-emphasis`}>
                      <i className={`bi ${c.icone}`} />
                    </div>
                    <div>
                      <div className="stat-value">{dados[c.chave]}</div>
                      <div className="text-muted small">{c.titulo}</div>
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      )}

      <h3 className="h5">Atalhos</h3>
      <div className="d-flex flex-wrap gap-2">
        <Link to="/alugueis" className="btn btn-primary">
          <i className="bi bi-key me-1" />
          Aluguéis
        </Link>
        <Link to="/veiculos" className="btn btn-outline-primary">
          <i className="bi bi-car-front me-1" />
          Veículos
        </Link>
        <Link to="/clientes" className="btn btn-outline-primary">
          <i className="bi bi-people me-1" />
          Clientes
        </Link>
        <Link to="/consultas" className="btn btn-outline-dark">
          <i className="bi bi-diagram-3 me-1" />
          Consultas com JOIN
        </Link>
      </div>
    </div>
  )
}
