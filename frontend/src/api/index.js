import { request } from './client'

// CRUD genérico para /api/{nome}
function crud(nome) {
  const base = `/api/${nome}`
  return {
    list: (params) => request(base, { params }),
    get: (id) => request(`${base}/${id}`),
    create: (data) => request(base, { method: 'POST', body: data }),
    update: (id, data) => request(`${base}/${id}`, { method: 'PUT', body: { ...data, id } }),
    remove: (id) => request(`${base}/${id}`, { method: 'DELETE' }),
  }
}

export const fabricantes = crud('Fabricantes')
export const categorias = crud('Categorias')
export const clientes = crud('Clientes')
export const veiculos = crud('Veiculos')
export const alugueis = crud('Alugueis')

// Consultas com JOIN (somente leitura)
export const consultas = {
  clientesComOuSemAlugueis: () => request('/api/Clientes/ComOuSemAlugueis'),
  veiculosDetalhes: () => request('/api/Veiculos/Detalhes'),
  veiculosNuncaAlugados: () => request('/api/Veiculos/NuncaAlugados'),
  alugueisAtivos: () => request('/api/Alugueis/Ativos'),
  alugueisPorCategoria: (categoriaId) => request(`/api/Alugueis/PorCategoria/${categoriaId}`),
}

export { ApiError, MSG_CONEXAO } from './client'
