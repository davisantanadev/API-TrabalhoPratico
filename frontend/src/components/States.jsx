import { ApiError } from '../api'

export const Carregando = ({ texto = 'Carregando...' }) => (
  <div className="text-center text-muted py-5">
    <div className="spinner-border spinner-border-sm me-2" role="status" />
    {texto}
  </div>
)

export const Vazio = ({ texto = 'Nenhum registro encontrado.' }) => (
  <div className="text-center text-muted py-5">
    <i className="bi bi-inbox fs-1 d-block mb-2" />
    {texto}
  </div>
)

export function Erro({ erro, onRetry }) {
  const conexao = erro instanceof ApiError && erro.status === 0
  return (
    <div className={`alert ${conexao ? 'alert-warning' : 'alert-danger'} d-flex align-items-center`} role="alert">
      <i className="bi bi-exclamation-triangle-fill me-2" />
      <div className="flex-grow-1">
        {erro?.message || 'Ocorreu um erro inesperado.'}
        {erro?.details?.length > 0 && (
          <ul className="mb-0 mt-1">
            {erro.details.map((d, i) => (
              <li key={i}>{d}</li>
            ))}
          </ul>
        )}
      </div>
      {onRetry && (
        <button className="btn btn-sm btn-outline-secondary ms-3" onClick={onRetry}>
          Tentar novamente
        </button>
      )}
    </div>
  )
}
