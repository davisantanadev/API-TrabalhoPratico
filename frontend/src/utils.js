const pad = (n) => String(n).padStart(2, '0')

// Aceita "2025-03-10", "2025-03-10T00:00:00" etc. -> dd/mm/aaaa (sem deslocar fuso)
export function fmtData(v) {
  if (!v) return '—'
  const m = String(v).match(/^(\d{4})-(\d{2})-(\d{2})/)
  if (m) return `${m[3]}/${m[2]}/${m[1]}`
  const d = new Date(v)
  return isNaN(d) ? String(v) : `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()}`
}

export const paraInputData = (v) => (v ? String(v).slice(0, 10) : '')
export const hojeISO = () => {
  const d = new Date()
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
}

export const fmtMoeda = (v) =>
  v === null || v === undefined || v === '' ? '—' : Number(v).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })

export const fmtNumero = (v) => (v === null || v === undefined || v === '' ? '—' : Number(v).toLocaleString('pt-BR'))

// Dias entre duas datas yyyy-MM-dd (mínimo 1)
export function diasEntre(inicio, fim) {
  const a = new Date(paraInputData(inicio) + 'T00:00:00')
  const b = new Date(paraInputData(fim) + 'T00:00:00')
  const d = Math.round((b - a) / 86400000)
  return Math.max(1, isNaN(d) ? 1 : d)
}
