import { createContext, useCallback, useContext, useMemo, useState } from 'react'

const ToastCtx = createContext(null)
export const useToast = () => useContext(ToastCtx)

export function ToastProvider({ children }) {
  const [items, setItems] = useState([])

  const remover = useCallback((id) => setItems((l) => l.filter((t) => t.id !== id)), [])
  const push = useCallback(
    (tipo, texto) => {
      const id = Date.now() + Math.random()
      setItems((l) => [...l, { id, tipo, texto }])
      setTimeout(() => remover(id), tipo === 'danger' ? 7000 : 3500)
    },
    [remover],
  )
  const api = useMemo(() => ({ sucesso: (t) => push('success', t), erro: (t) => push('danger', t) }), [push])

  return (
    <ToastCtx.Provider value={api}>
      {children}
      <div className="toast-area" aria-live="polite">
        {items.map((t) => (
          <div key={t.id} className={`alert alert-${t.tipo} shadow d-flex align-items-start mb-0`} role="alert">
            <i className={`bi ${t.tipo === 'success' ? 'bi-check-circle-fill' : 'bi-exclamation-triangle-fill'} me-2`} />
            <div className="flex-grow-1">{t.texto}</div>
            <button type="button" className="btn-close ms-2" aria-label="Fechar" onClick={() => remover(t.id)} />
          </div>
        ))}
      </div>
    </ToastCtx.Provider>
  )
}
