import { fmtData, fmtMoeda } from '../utils'

// Rótulos amigáveis para chaves conhecidas; as demais são "humanizadas" a partir do camelCase.
const ROTULOS = {
  id: 'Id', nome: 'Nome', cpf: 'CPF', email: 'E-mail', modelo: 'Modelo', anoFabricacao: 'Ano',
  quilometragem: 'Km', fabricanteNome: 'Fabricante', categoriaNome: 'Categoria',
  clienteNome: 'Cliente', veiculoModelo: 'Veículo', dataInicio: 'Início', dataFim: 'Fim previsto',
  dataDevolucao: 'Devolução', quilometragemInicial: 'Km inicial', quilometragemFinal: 'Km final',
  valorDiaria: 'Valor da diária', valorTotal: 'Valor total', fabricanteId: 'Id fabricante',
  categoriaId: 'Id categoria', clienteId: 'Id cliente', veiculoId: 'Id veículo', aluguelId: 'Id aluguel',
  totalAlugueis: 'Total de aluguéis', quantidadeAlugueis: 'Qtd. aluguéis',
}
const rotulo = (k) => ROTULOS[k] || k.replace(/([A-Z])/g, ' $1').replace(/^./, (c) => c.toUpperCase())

function celula(k, v) {
  if (v === null || v === undefined || v === '') return <span className="text-muted">—</span>
  if (/^data/i.test(k)) return fmtData(v)
  if (/^valor/i.test(k)) return fmtMoeda(v)
  if (typeof v === 'boolean') return v ? 'Sim' : 'Não'
  if (typeof v === 'object') return <code>{JSON.stringify(v)}</code>
  return String(v)
}

export default function DynamicTable({ dados }) {
  const chaves = [...new Set(dados.flatMap((r) => Object.keys(r)))]
  return (
    <div className="table-responsive">
      <table className="table table-striped table-hover align-middle mb-0">
        <thead>
          <tr>
            {chaves.map((k) => (
              <th key={k}>{rotulo(k)}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {dados.map((r, i) => (
            <tr key={i}>
              {chaves.map((k) => (
                <td key={k}>{celula(k, r[k])}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
