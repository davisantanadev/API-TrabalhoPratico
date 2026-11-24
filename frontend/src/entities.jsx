import * as api from './api'
import DevolucaoModal from './components/DevolucaoModal'
import { fmtData, fmtMoeda, fmtNumero, paraInputData } from './utils'

const achar = (lista, id) => (lista || []).find((x) => x.id === id)
const nomeDe = (lista, id, campo = 'nome') => achar(lista, id)?.[campo] ?? `#${id}`
const opcoes = (lista, campo = 'nome') => (lista || []).map((x) => ({ value: x.id, label: typeof campo === 'function' ? campo(x) : x[campo] }))

const vazio = (v) => v === undefined || v === null || String(v).trim() === ''
const numOuNull = (v) => (vazio(v) ? null : Number(v))
// Preserva a hora original quando a data (yyyy-MM-dd) não foi alterada; senão envia meia-noite.
const dataComHora = (novo, orig) => (vazio(novo) ? null : orig && paraInputData(orig) === novo ? orig : `${novo}T00:00:00`)
const emailOk = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)

const filtroComVeiculos = {
  name: 'comVeiculos',
  label: 'Veículos vinculados',
  type: 'select',
  options: () => [
    { value: 'true', label: 'Com veículos' },
    { value: 'false', label: 'Sem veículos' },
  ],
}

export const fabricantes = {
  titulo: 'Fabricantes',
  singular: 'Fabricante',
  icone: 'bi-building',
  resource: api.fabricantes,
  fields: [{ name: 'nome', label: 'Nome', required: true }],
  filters: [{ name: 'nome', label: 'Nome', placeholder: 'Buscar por nome' }, filtroComVeiculos],
  columns: [
    { label: 'Id', render: (r) => r.id },
    { label: 'Nome', render: (r) => r.nome },
  ],
  rotuloLinha: (r) => r.nome,
  toForm: (r) => ({ nome: r?.nome ?? '' }),
  validate: (v) => ({ nome: vazio(v.nome) ? 'O nome é obrigatório.' : undefined }),
  toPayload: (v) => ({ nome: v.nome.trim() }),
}

export const categorias = {
  ...fabricantes,
  titulo: 'Categorias',
  singular: 'Categoria',
  icone: 'bi-tags',
  artigo: 'a',
  resource: api.categorias,
}

export const clientes = {
  titulo: 'Clientes',
  singular: 'Cliente',
  icone: 'bi-people',
  resource: api.clientes,
  fields: [
    { name: 'nome', label: 'Nome', required: true },
    { name: 'cpf', label: 'CPF', required: true, col: 'col-md-6', placeholder: '000.000.000-00', help: 'Entre 11 e 14 caracteres.' },
    { name: 'email', label: 'E-mail', type: 'email', required: true, col: 'col-md-6' },
  ],
  filters: [
    { name: 'nome', label: 'Nome' },
    { name: 'cpf', label: 'CPF' },
    { name: 'email', label: 'E-mail' },
  ],
  columns: [
    { label: 'Id', render: (r) => r.id },
    { label: 'Nome', render: (r) => r.nome },
    { label: 'CPF', render: (r) => r.cpf },
    { label: 'E-mail', render: (r) => r.email },
  ],
  rotuloLinha: (r) => r.nome,
  toForm: (r) => ({ nome: r?.nome ?? '', cpf: r?.cpf ?? '', email: r?.email ?? '' }),
  validate: (v) => ({
    nome: vazio(v.nome) ? 'O nome é obrigatório.' : undefined,
    cpf: vazio(v.cpf) ? 'O CPF é obrigatório.' : v.cpf.trim().length < 11 || v.cpf.trim().length > 14 ? 'O CPF deve ter entre 11 e 14 caracteres.' : undefined,
    email: vazio(v.email) ? 'O e-mail é obrigatório.' : !emailOk(v.email.trim()) ? 'Informe um e-mail válido.' : undefined,
  }),
  toPayload: (v) => ({ nome: v.nome.trim(), cpf: v.cpf.trim(), email: v.email.trim() }),
}

const optFab = (refs) => opcoes(refs.fabricantes)
const optCat = (refs) => opcoes(refs.categorias)

export const veiculos = {
  titulo: 'Veículos',
  singular: 'Veículo',
  icone: 'bi-car-front',
  resource: api.veiculos,
  refsConfig: { fabricantes: api.fabricantes, categorias: api.categorias },
  fields: [
    { name: 'modelo', label: 'Modelo', required: true },
    { name: 'fabricanteId', label: 'Fabricante', type: 'select', options: optFab, required: true, col: 'col-md-6' },
    { name: 'categoriaId', label: 'Categoria', type: 'select', options: optCat, required: true, col: 'col-md-6' },
    { name: 'anoFabricacao', label: 'Ano de fabricação', type: 'number', min: 1950, max: 2100, required: true, col: 'col-md-6' },
    { name: 'quilometragem', label: 'Quilometragem', type: 'number', min: 0, required: true, col: 'col-md-6' },
  ],
  filters: [
    { name: 'modelo', label: 'Modelo' },
    { name: 'fabricanteId', label: 'Fabricante', type: 'select', options: optFab },
    { name: 'categoriaId', label: 'Categoria', type: 'select', options: optCat },
    { name: 'anoMin', label: 'Ano a partir de', type: 'number', col: 'col-6 col-md-2' },
    { name: 'anoMax', label: 'Ano até', type: 'number', col: 'col-6 col-md-2' },
  ],
  columns: [
    { label: 'Id', render: (r) => r.id },
    { label: 'Modelo', render: (r) => r.modelo },
    { label: 'Fabricante', render: (r, refs) => nomeDe(refs.fabricantes, r.fabricanteId) },
    { label: 'Categoria', render: (r, refs) => nomeDe(refs.categorias, r.categoriaId) },
    { label: 'Ano', render: (r) => r.anoFabricacao },
    { label: 'Km', render: (r) => fmtNumero(r.quilometragem), className: 'text-end' },
  ],
  rotuloLinha: (r) => r.modelo,
  toForm: (r) => ({
    modelo: r?.modelo ?? '',
    anoFabricacao: r?.anoFabricacao ?? '',
    quilometragem: r?.quilometragem ?? '',
    fabricanteId: r?.fabricanteId ?? '',
    categoriaId: r?.categoriaId ?? '',
  }),
  validate: (v) => {
    const ano = Number(v.anoFabricacao)
    const km = Number(v.quilometragem)
    return {
      modelo: vazio(v.modelo) ? 'O modelo é obrigatório.' : undefined,
      fabricanteId: vazio(v.fabricanteId) ? 'Selecione o fabricante.' : undefined,
      categoriaId: vazio(v.categoriaId) ? 'Selecione a categoria.' : undefined,
      anoFabricacao: vazio(v.anoFabricacao) ? 'O ano é obrigatório.' : !Number.isInteger(ano) || ano < 1950 || ano > 2100 ? 'O ano deve estar entre 1950 e 2100.' : undefined,
      quilometragem: vazio(v.quilometragem) ? 'A quilometragem é obrigatória.' : !Number.isInteger(km) || km < 0 ? 'A quilometragem não pode ser negativa.' : undefined,
    }
  },
  toPayload: (v) => ({
    modelo: v.modelo.trim(),
    anoFabricacao: Number(v.anoFabricacao),
    quilometragem: Number(v.quilometragem),
    fabricanteId: Number(v.fabricanteId),
    categoriaId: Number(v.categoriaId),
  }),
}

const rotuloVeiculo = (v) => (v ? `${v.modelo} (${v.anoFabricacao})` : '')

export const alugueis = {
  titulo: 'Aluguéis',
  singular: 'Aluguel',
  icone: 'bi-key',
  resource: api.alugueis,
  refsConfig: { clientes: api.clientes, veiculos: api.veiculos },
  vazio: 'Nenhum aluguel encontrado.',
  fields: [
    { name: 'clienteId', label: 'Cliente', type: 'select', options: (refs) => opcoes(refs.clientes), required: true, col: 'col-md-6' },
    { name: 'veiculoId', label: 'Veículo', type: 'select', options: (refs) => opcoes(refs.veiculos, rotuloVeiculo), required: true, col: 'col-md-6' },
    { name: 'dataInicio', label: 'Data de início', type: 'date', required: true, col: 'col-md-6' },
    { name: 'dataFim', label: 'Data de fim (prevista)', type: 'date', required: true, col: 'col-md-6' },
    { name: 'quilometragemInicial', label: 'Km inicial', type: 'number', min: 0, required: true, col: 'col-md-6' },
    { name: 'valorDiaria', label: 'Valor da diária (R$)', type: 'number', step: '0.01', min: 0, required: true, col: 'col-md-6' },
    { name: 'dataDevolucao', label: 'Data de devolução', type: 'date', col: 'col-md-6', help: 'Deixe vazio se o aluguel está ativo.' },
    { name: 'quilometragemFinal', label: 'Km final', type: 'number', min: 0, col: 'col-md-6' },
    { name: 'valorTotal', label: 'Valor total (R$)', type: 'number', step: '0.01', min: 0, col: 'col-md-6' },
  ],
  filters: [
    { name: 'clienteId', label: 'Cliente', type: 'select', options: (refs) => opcoes(refs.clientes) },
    { name: 'veiculoId', label: 'Veículo', type: 'select', options: (refs) => opcoes(refs.veiculos, rotuloVeiculo) },
    {
      name: 'status',
      label: 'Status',
      type: 'select',
      col: 'col-6 col-md-3 col-lg-2',
      options: () => [
        { value: 'ativo', label: 'Ativo' },
        { value: 'devolvido', label: 'Devolvido' },
      ],
    },
    { name: 'dataInicioDe', label: 'Início de', type: 'date', col: 'col-6 col-md-3 col-lg-2' },
    { name: 'dataInicioAte', label: 'Início até', type: 'date', col: 'col-6 col-md-3 col-lg-2' },
  ],
  columns: [
    { label: 'Id', render: (r) => r.id },
    { label: 'Cliente', render: (r, refs) => nomeDe(refs.clientes, r.clienteId) },
    { label: 'Veículo', render: (r, refs) => nomeDe(refs.veiculos, r.veiculoId, 'modelo') },
    { label: 'Início', render: (r) => fmtData(r.dataInicio) },
    { label: 'Fim previsto', render: (r) => fmtData(r.dataFim) },
    { label: 'Devolução', render: (r) => fmtData(r.dataDevolucao) },
    { label: 'Diária', render: (r) => fmtMoeda(r.valorDiaria), className: 'text-end' },
    { label: 'Total', render: (r) => fmtMoeda(r.valorTotal), className: 'text-end' },
    {
      label: 'Status',
      render: (r) =>
        r.dataDevolucao ? <span className="badge text-bg-secondary">Devolvido</span> : <span className="badge text-bg-success">Ativo</span>,
    },
  ],
  rowActions: [
    {
      label: 'Registrar devolução',
      icon: 'bi-box-arrow-in-down',
      show: (r) => !r.dataDevolucao,
      onClick: (row, ctx) => ctx.openExtra(<DevolucaoModal aluguel={row} ctx={ctx} />),
    },
  ],
  rotuloLinha: (r, refs) => `#${r.id} - ${nomeDe(refs.clientes, r.clienteId)} / ${nomeDe(refs.veiculos, r.veiculoId, 'modelo')}`,
  toForm: (r) => ({
    clienteId: r?.clienteId ?? '',
    veiculoId: r?.veiculoId ?? '',
    dataInicio: paraInputData(r?.dataInicio),
    dataFim: paraInputData(r?.dataFim),
    dataDevolucao: paraInputData(r?.dataDevolucao),
    quilometragemInicial: r?.quilometragemInicial ?? '',
    quilometragemFinal: r?.quilometragemFinal ?? '',
    valorDiaria: r?.valorDiaria ?? '',
    valorTotal: r?.valorTotal ?? '',
    _orig: { dataInicio: r?.dataInicio, dataFim: r?.dataFim, dataDevolucao: r?.dataDevolucao },
  }),
  validate: (v) => {
    const kmI = Number(v.quilometragemInicial)
    const kmF = Number(v.quilometragemFinal)
    return {
      clienteId: vazio(v.clienteId) ? 'Selecione o cliente.' : undefined,
      veiculoId: vazio(v.veiculoId) ? 'Selecione o veículo.' : undefined,
      dataInicio: vazio(v.dataInicio) ? 'A data de início é obrigatória.' : undefined,
      dataFim: vazio(v.dataFim) ? 'A data de fim é obrigatória.' : !vazio(v.dataInicio) && v.dataFim < v.dataInicio ? 'A data de fim não pode ser anterior à data de início.' : undefined,
      dataDevolucao: !vazio(v.dataDevolucao) && !vazio(v.dataInicio) && v.dataDevolucao < v.dataInicio ? 'A devolução não pode ser anterior ao início.' : undefined,
      quilometragemInicial: vazio(v.quilometragemInicial) ? 'A quilometragem inicial é obrigatória.' : !Number.isInteger(kmI) || kmI < 0 ? 'A quilometragem inicial deve ser um inteiro não negativo.' : undefined,
      quilometragemFinal: vazio(v.quilometragemFinal)
        ? undefined
        : !Number.isInteger(kmF) || kmF < 0
          ? 'A quilometragem final deve ser um inteiro não negativo.'
          : !vazio(v.quilometragemInicial) && kmF < kmI
            ? 'A km final não pode ser menor que a km inicial.'
            : undefined,
      valorDiaria: vazio(v.valorDiaria) ? 'O valor da diária é obrigatório.' : Number(v.valorDiaria) < 0.01 || Number(v.valorDiaria) > 999999 ? 'O valor da diária deve estar entre 0,01 e 999.999.' : undefined,
      valorTotal: !vazio(v.valorTotal) && Number(v.valorTotal) < 0 ? 'O valor total não pode ser negativo.' : undefined,
    }
  },
  toPayload: (v) => ({
    clienteId: Number(v.clienteId),
    veiculoId: Number(v.veiculoId),
    dataInicio: dataComHora(v.dataInicio, v._orig?.dataInicio),
    dataFim: dataComHora(v.dataFim, v._orig?.dataFim),
    dataDevolucao: dataComHora(v.dataDevolucao, v._orig?.dataDevolucao),
    quilometragemInicial: Number(v.quilometragemInicial),
    quilometragemFinal: vazio(v.dataDevolucao) ? null : numOuNull(v.quilometragemFinal),
    valorDiaria: Number(v.valorDiaria),
    valorTotal: vazio(v.dataDevolucao) ? null : numOuNull(v.valorTotal),
  }),
}
