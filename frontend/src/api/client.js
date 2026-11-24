// Cliente fetch central. Base configurável via VITE_API_URL (padrão '' = mesmo host, usa o proxy do Vite).
const BASE = (import.meta.env.VITE_API_URL ?? '').replace(/\/$/, '')

export class ApiError extends Error {
  constructor(message, status = 0, details = []) {
    super(message)
    this.status = status
    this.details = details // lista de mensagens (validação)
  }
}

export const MSG_CONEXAO =
  'Não foi possível conectar à API. Verifique se o back-end está rodando em https://localhost:7001.'

function buildQuery(params) {
  const q = new URLSearchParams()
  Object.entries(params || {}).forEach(([k, v]) => {
    if (v !== undefined && v !== null && String(v).trim() !== '') q.append(k, String(v).trim())
  })
  const s = q.toString()
  return s ? `?${s}` : ''
}

// Extrai mensagens do corpo: texto puro, ProblemDetails ou ModelState {errors:{Campo:[msg]}}
function parseErro(text, status) {
  if (!text) return { message: `Erro ${status} ao processar a requisição.`, details: [] }
  try {
    const j = JSON.parse(text)
    if (j && typeof j === 'object') {
      if (j.errors && typeof j.errors === 'object') {
        const details = Object.entries(j.errors).flatMap(([campo, msgs]) =>
          (Array.isArray(msgs) ? msgs : [msgs]).map((m) => (campo ? `${campo}: ${m}` : m)),
        )
        return { message: 'Verifique os campos informados.', details }
      }
      const msg = j.detail || j.message || j.title
      if (msg) return { message: String(msg), details: [] }
    }
    if (typeof j === 'string') return { message: j, details: [] }
  } catch {
    /* corpo não é JSON: usa o texto */
  }
  return { message: text.replace(/^"|"$/g, ''), details: [] }
}

export async function request(path, { method = 'GET', body, params } = {}) {
  let res
  try {
    res = await fetch(`${BASE}${path}${buildQuery(params)}`, {
      method,
      headers: body !== undefined ? { 'Content-Type': 'application/json' } : undefined,
      body: body !== undefined ? JSON.stringify(body) : undefined,
    })
  } catch {
    throw new ApiError(MSG_CONEXAO, 0)
  }
  const text = await res.text()
  if (!res.ok) {
    // proxy do Vite devolve 5xx/504 quando a API está fora do ar
    if (res.status >= 502 && res.status <= 504 && !text.trim()) throw new ApiError(MSG_CONEXAO, res.status)
    const { message, details } = parseErro(text, res.status)
    throw new ApiError(message, res.status, details)
  }
  if (res.status === 204 || !text) return null
  try {
    return JSON.parse(text)
  } catch {
    return text
  }
}
