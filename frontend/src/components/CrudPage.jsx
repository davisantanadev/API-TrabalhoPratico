import { useCallback, useEffect, useState } from 'react'
import { ApiError } from '../api'
import Modal from './Modal'
import ConfirmModal from './ConfirmModal'
import { Carregando, Erro, Vazio } from './States'
import { useToast } from './Toasts'

// Tela CRUD genérica: filtros + tabela + modal de formulário + confirmação de exclusão.
// A configuração de cada entidade fica em src/entities.jsx.

function Campo({ f, value, onChange, error, refs }) {
  const id = `campo-${f.name}`
  const common = {
    id,
    name: f.name,
    className: `form-control ${error ? 'is-invalid' : ''}`,
    value: value ?? '',
    onChange: (e) => onChange(f.name, e.target.value),
  }
  let input
  if (f.type === 'select') {
    const opcoes = f.options ? f.options(refs) : []
    input = (
      <select {...common} className={`form-select ${error ? 'is-invalid' : ''}`}>
        <option value="">Selecione...</option>
        {opcoes.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    )
  } else {
    input = <input {...common} type={f.type || 'text'} step={f.step} min={f.min} max={f.max} placeholder={f.placeholder} />
  }
  return (
    <div className={f.col || 'col-12'}>
      <label htmlFor={id} className="form-label">
        {f.label}
        {f.required && <span className="text-danger"> *</span>}
      </label>
      {input}
      {error && <div className="invalid-feedback">{error}</div>}
      {f.help && !error && <div className="form-text">{f.help}</div>}
    </div>
  )
}

function Filtro({ f, value, onChange, refs }) {
  const common = {
    className: 'form-control form-control-sm',
    value: value ?? '',
    onChange: (e) => onChange(f.name, e.target.value),
    'aria-label': f.label,
  }
  const opcoes = f.type === 'select' ? (f.options ? f.options(refs) : []) : []
  return (
    <div className={f.col || 'col-6 col-md-4 col-lg-3'}>
      <label className="form-label small text-muted mb-1">{f.label}</label>
      {f.type === 'select' ? (
        <select {...common} className="form-select form-select-sm">
          <option value="">Todos</option>
          {opcoes.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      ) : (
        <input {...common} type={f.type || 'text'} placeholder={f.placeholder} />
      )}
    </div>
  )
}

export default function CrudPage({ config }) {
  const { titulo, singular, icone, resource, refsConfig = {}, fields, filters, columns, rowActions = [], validate, toPayload, toForm, vazio, artigo = 'o' } = config
  const toast = useToast()

  const [rows, setRows] = useState([])
  const [refs, setRefs] = useState({})
  const [loading, setLoading] = useState(true)
  const [erro, setErro] = useState(null)
  const [filtroForm, setFiltroForm] = useState({})
  const [filtroAplicado, setFiltroAplicado] = useState({})

  const [form, setForm] = useState(null) // {id, values, errors, apiError, saving}
  const [excluir, setExcluir] = useState(null) // {row, busy}
  const [extra, setExtra] = useState(null) // modal customizado (ex.: devolução)

  const carregar = useCallback(
    async (params) => {
      setLoading(true)
      setErro(null)
      try {
        const keys = Object.keys(refsConfig)
        const [lista, ...listas] = await Promise.all([resource.list(params), ...keys.map((k) => refsConfig[k].list())])
        setRows(Array.isArray(lista) ? lista : [])
        setRefs(Object.fromEntries(keys.map((k, i) => [k, listas[i] || []])))
      } catch (e) {
        setErro(e)
        setRows([])
      } finally {
        setLoading(false)
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [resource],
  )

  useEffect(() => {
    carregar(filtroAplicado)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [carregar])

  const recarregar = () => carregar(filtroAplicado)
  const filtrar = (e) => {
    e?.preventDefault()
    setFiltroAplicado(filtroForm)
    carregar(filtroForm)
  }
  const limpar = () => {
    setFiltroForm({})
    setFiltroAplicado({})
    carregar({})
  }

  const abrirNovo = () => setForm({ id: null, values: toForm ? toForm(null) : {}, errors: {}, apiError: null, saving: false })
  const abrirEditar = (row) => setForm({ id: row.id, values: toForm(row), errors: {}, apiError: null, saving: false })
  const setValor = (name, v) =>
    setForm((f) => ({ ...f, values: { ...f.values, [name]: v }, errors: { ...f.errors, [name]: undefined } }))

  const salvar = async (e) => {
    e.preventDefault()
    const errors = validate(form.values)
    if (Object.values(errors).some(Boolean)) {
      setForm((f) => ({ ...f, errors, apiError: null }))
      return
    }
    setForm((f) => ({ ...f, saving: true, apiError: null }))
    try {
      const payload = toPayload(form.values)
      if (form.id) await resource.update(form.id, payload)
      else await resource.create(payload)
      toast.sucesso(`${singular} ${form.id ? 'atualizad' : 'cadastrad'}${artigo === 'a' ? 'a' : 'o'} com sucesso.`)
      setForm(null)
      recarregar()
    } catch (err) {
      setForm((f) => ({ ...f, saving: false, apiError: err instanceof ApiError ? err : new ApiError(String(err)) }))
    }
  }

  const confirmarExclusao = async () => {
    setExcluir((x) => ({ ...x, busy: true }))
    try {
      await resource.remove(excluir.row.id)
      toast.sucesso(`${singular} excluíd${artigo === 'a' ? 'a' : 'o'} com sucesso.`)
      setExcluir(null)
      recarregar()
    } catch (err) {
      toast.erro(err.message)
      setExcluir(null)
    }
  }

  const ctx = { refs, reload: recarregar, toast, openExtra: setExtra, closeExtra: () => setExtra(null) }

  return (
    <div>
      <div className="d-flex flex-wrap justify-content-between align-items-center mb-3 gap-2">
        <h2 className="h3 mb-0">
          <i className={`bi ${icone} me-2 text-primary`} />
          {titulo}
        </h2>
        <button className="btn btn-primary" onClick={abrirNovo} disabled={!!erro && erro.status === 0}>
          <i className="bi bi-plus-lg me-1" />
          {artigo === 'a' ? 'Nova' : 'Novo'} {singular.toLowerCase()}
        </button>
      </div>

      {filters.length > 0 && (
        <form className="card card-body mb-3" onSubmit={filtrar}>
          <div className="row g-2 align-items-end">
            {filters.map((f) => (
              <Filtro key={f.name} f={f} value={filtroForm[f.name]} onChange={(n, v) => setFiltroForm((s) => ({ ...s, [n]: v }))} refs={refs} />
            ))}
            <div className="col-12 col-lg-auto ms-lg-auto d-flex gap-2">
              <button type="submit" className="btn btn-sm btn-primary">
                <i className="bi bi-funnel me-1" />
                Filtrar
              </button>
              <button type="button" className="btn btn-sm btn-outline-secondary" onClick={limpar}>
                Limpar
              </button>
            </div>
          </div>
        </form>
      )}

      <div className="card">
        <div className="card-header bg-white d-flex justify-content-between">
          <span className="fw-semibold">Resultados</span>
          {!loading && !erro && (
            <span className="badge text-bg-secondary align-self-center">
              {rows.length} {rows.length === 1 ? 'registro' : 'registros'}
            </span>
          )}
        </div>
        <div className="card-body p-0">
          {loading ? (
            <Carregando />
          ) : erro ? (
            <div className="p-3">
              <Erro erro={erro} onRetry={recarregar} />
            </div>
          ) : rows.length === 0 ? (
            <Vazio texto={vazio || 'Nenhum registro encontrado.'} />
          ) : (
            <div className="table-responsive">
              <table className="table table-striped table-hover align-middle mb-0">
                <thead>
                  <tr>
                    {columns.map((c) => (
                      <th key={c.label}>{c.label}</th>
                    ))}
                    <th className="text-end">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((r) => (
                    <tr key={r.id}>
                      {columns.map((c) => (
                        <td key={c.label} className={c.className}>
                          {c.render(r, refs)}
                        </td>
                      ))}
                      <td className="text-end text-nowrap">
                        {rowActions
                          .filter((a) => !a.show || a.show(r))
                          .map((a) => (
                            <button key={a.label} className={`btn btn-sm ${a.cls || 'btn-outline-success'} me-1`} onClick={() => a.onClick(r, ctx)}>
                              <i className={`bi ${a.icon} me-1`} />
                              {a.label}
                            </button>
                          ))}
                        <button className="btn btn-sm btn-outline-primary me-1" onClick={() => abrirEditar(r)} aria-label="Editar">
                          <i className="bi bi-pencil" />
                          <span className="d-none d-md-inline ms-1">Editar</span>
                        </button>
                        <button className="btn btn-sm btn-outline-danger" onClick={() => setExcluir({ row: r })} aria-label="Excluir">
                          <i className="bi bi-trash" />
                          <span className="d-none d-md-inline ms-1">Excluir</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {form && (
        <Modal
          titulo={form.id ? `Editar ${singular.toLowerCase()}` : `${artigo === 'a' ? 'Nova' : 'Novo'} ${singular.toLowerCase()}`}
          onClose={() => !form.saving && setForm(null)}
          size="modal-lg"
        >
          <form onSubmit={salvar} noValidate>
            {form.apiError && <Erro erro={form.apiError} />}
            <div className="row g-3">
              {fields.map((f) => (
                <Campo key={f.name} f={f} value={form.values[f.name]} onChange={setValor} error={form.errors[f.name]} refs={refs} />
              ))}
            </div>
            <div className="d-flex justify-content-end gap-2 mt-4">
              <button type="button" className="btn btn-secondary" onClick={() => setForm(null)} disabled={form.saving}>
                Cancelar
              </button>
              <button type="submit" className="btn btn-primary" disabled={form.saving}>
                {form.saving ? 'Salvando...' : 'Salvar'}
              </button>
            </div>
          </form>
        </Modal>
      )}

      {excluir && (
        <ConfirmModal
          mensagem={`Tem certeza que deseja excluir ${artigo === 'a' ? 'a' : 'o'} ${singular.toLowerCase()} "${config.rotuloLinha(excluir.row, refs)}"? Esta ação não pode ser desfeita.`}
          busy={excluir.busy}
          onClose={() => setExcluir(null)}
          onConfirm={confirmarExclusao}
        />
      )}

      {extra}
    </div>
  )
}
