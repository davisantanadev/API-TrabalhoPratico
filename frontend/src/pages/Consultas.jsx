import { useCallback, useEffect, useRef, useState } from 'react'
import * as api from '../api'
import DynamicTable from '../components/DynamicTable'
import { Carregando, Erro, Vazio } from '../components/States'

const CONSULTAS = [
  {
    id: 'clientes',
    titulo: 'Clientes com ou sem aluguéis',
    rota: () => '/api/Clientes/ComOuSemAlugueis',
    join: 'LEFT JOIN',
    descricao:
      'LEFT JOIN entre Clientes e Aluguéis: lista todos os clientes, inclusive os que nunca alugaram nada (colunas do aluguel vêm vazias).',
    sql: 'FROM Clientes c\nLEFT JOIN Alugueis a ON a.ClienteId = c.Id',
    chamar: () => api.consultas.clientesComOuSemAlugueis(),
  },
  {
    id: 'detalhes',
    titulo: 'Detalhes dos veículos',
    rota: () => '/api/Veiculos/Detalhes',
    join: 'INNER JOIN',
    descricao:
      'INNER JOIN entre Veículos, Fabricantes e Categorias: mostra o modelo do veículo junto com o nome do fabricante e da categoria.',
    sql: 'FROM Veiculos v\nINNER JOIN Fabricantes f ON f.Id = v.FabricanteId\nINNER JOIN Categorias c ON c.Id = v.CategoriaId',
    chamar: () => api.consultas.veiculosDetalhes(),
  },
  {
    id: 'nunca',
    titulo: 'Veículos nunca alugados',
    rota: () => '/api/Veiculos/NuncaAlugados',
    join: 'LEFT JOIN + IS NULL',
    descricao:
      'LEFT JOIN entre Veículos e Aluguéis filtrando WHERE a.Id IS NULL: sobram apenas os veículos que não têm nenhum aluguel.',
    sql: 'FROM Veiculos v\nLEFT JOIN Alugueis a ON a.VeiculoId = v.Id\nWHERE a.Id IS NULL',
    chamar: () => api.consultas.veiculosNuncaAlugados(),
  },
  {
    id: 'ativos',
    titulo: 'Aluguéis ativos',
    rota: () => '/api/Alugueis/Ativos',
    join: 'INNER JOIN',
    descricao:
      'INNER JOIN entre Aluguéis, Clientes e Veículos, apenas aluguéis ainda sem data de devolução: mostra quem está com qual veículo.',
    sql: 'FROM Alugueis a\nINNER JOIN Clientes c ON c.Id = a.ClienteId\nINNER JOIN Veiculos v ON v.Id = a.VeiculoId\nWHERE a.DataDevolucao IS NULL',
    chamar: () => api.consultas.alugueisAtivos(),
  },
  {
    id: 'categoria',
    titulo: 'Aluguéis por categoria',
    rota: (cat) => `/api/Alugueis/PorCategoria/${cat || '{categoriaId}'}`,
    join: 'INNER JOIN',
    descricao:
      'Aluguéis ligados a Veículos e Categorias por JOIN, filtrados pela categoria escolhida: todos os aluguéis de veículos daquela categoria.',
    sql: 'FROM Alugueis a\nINNER JOIN Veiculos v ON v.Id = a.VeiculoId\nINNER JOIN Categorias c ON c.Id = v.CategoriaId\nWHERE c.Id = @categoriaId',
    chamar: (cat) => api.consultas.alugueisPorCategoria(cat),
    precisaCategoria: true,
  },
]

export default function Consultas() {
  const [ativa, setAtiva] = useState(CONSULTAS[0].id)
  const [categorias, setCategorias] = useState([])
  const [categoriaId, setCategoriaId] = useState('')
  const [dados, setDados] = useState(null)
  const [erro, setErro] = useState(null)
  const [loading, setLoading] = useState(false)

  const q = CONSULTAS.find((c) => c.id === ativa)

  useEffect(() => {
    api.categorias.list().then(setCategorias).catch(() => {})
  }, [])

  const reqId = useRef(0)
  const executar = useCallback(async () => {
    const id = ++reqId.current
    if (q.precisaCategoria && !categoriaId) {
      setDados(null)
      setErro(null)
      setLoading(false)
      return
    }
    setLoading(true)
    setErro(null)
    try {
      const r = await q.chamar(categoriaId)
      if (id !== reqId.current) return
      setDados(Array.isArray(r) ? r : r ? [r] : [])
    } catch (e) {
      if (id !== reqId.current) return
      setErro(e)
      setDados(null)
    } finally {
      if (id === reqId.current) setLoading(false)
    }
  }, [q, categoriaId])

  useEffect(() => {
    executar()
  }, [executar])

  return (
    <div>
      <h2 className="h3 mb-1">
        <i className="bi bi-diagram-3 me-2 text-primary" />
        Consultas com JOIN
      </h2>
      <p className="text-muted">Consultas somente leitura que combinam várias tabelas. Escolha uma aba para executar.</p>

      <ul className="nav nav-tabs mb-3 flex-nowrap overflow-auto">
        {CONSULTAS.map((c) => (
          <li className="nav-item" key={c.id}>
            <button className={`nav-link text-nowrap ${c.id === ativa ? 'active' : ''}`} onClick={() => setAtiva(c.id)}>
              {c.titulo}
            </button>
          </li>
        ))}
      </ul>

      <div className="card">
        <div className="card-body">
          <div className="d-flex flex-wrap align-items-center gap-2 mb-3">
            <span className="route-pill">
              <span className="verb">GET</span>
              {q.rota(categoriaId)}
            </span>
            <span className="badge text-bg-primary">{q.join}</span>
          </div>
          <div className="join-desc mb-2">{q.descricao}</div>
          <div className="sql-box mb-3">{q.sql}</div>

          {q.precisaCategoria && (
            <div className="mb-3" style={{ maxWidth: 360 }}>
              <label className="form-label">Categoria</label>
              <select className="form-select" value={categoriaId} onChange={(e) => setCategoriaId(e.target.value)}>
                <option value="">Selecione uma categoria...</option>
                {categorias.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.nome}
                  </option>
                ))}
              </select>
            </div>
          )}

          {loading ? (
            <Carregando />
          ) : erro ? (
            <Erro erro={erro} onRetry={executar} />
          ) : q.precisaCategoria && !categoriaId ? (
            <Vazio texto="Selecione uma categoria para executar a consulta." />
          ) : dados && dados.length === 0 ? (
            <Vazio texto="A consulta não retornou resultados." />
          ) : dados ? (
            <>
              <div className="mb-2">
                <span className="badge text-bg-secondary">
                  {dados.length} {dados.length === 1 ? 'registro' : 'registros'}
                </span>
              </div>
              <DynamicTable dados={dados} />
            </>
          ) : null}
        </div>
      </div>
    </div>
  )
}
