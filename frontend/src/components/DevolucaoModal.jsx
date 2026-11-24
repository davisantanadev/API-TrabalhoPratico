import { useState } from 'react'
import { alugueis, ApiError } from '../api'
import Modal from './Modal'
import { Erro } from './States'
import { diasEntre, fmtMoeda, hojeISO, paraInputData } from '../utils'

// Registrar devolução: PUT preenchendo dataDevolucao, quilometragemFinal e valorTotal (dias x diária, editável).
export default function DevolucaoModal({ aluguel, ctx }) {
  const inicial = hojeISO() < paraInputData(aluguel.dataInicio) ? paraInputData(aluguel.dataInicio) : hojeISO()
  const calc = (data) => (diasEntre(aluguel.dataInicio, data) * Number(aluguel.valorDiaria)).toFixed(2)

  const [data, setData] = useState(inicial)
  const [km, setKm] = useState(String(aluguel.quilometragemInicial ?? 0))
  const [total, setTotal] = useState(calc(inicial))
  const [totalEditado, setTotalEditado] = useState(false)
  const [erros, setErros] = useState({})
  const [apiErro, setApiErro] = useState(null)
  const [saving, setSaving] = useState(false)

  const mudarData = (v) => {
    setData(v)
    if (!totalEditado && v) setTotal(calc(v))
  }

  const salvar = async (e) => {
    e.preventDefault()
    const er = {}
    if (!data) er.data = 'Informe a data de devolução.'
    else if (data < paraInputData(aluguel.dataInicio)) er.data = 'A devolução não pode ser anterior ao início.'
    if (km === '' || Number(km) < 0) er.km = 'Informe uma quilometragem válida (≥ 0).'
    else if (Number(km) < Number(aluguel.quilometragemInicial)) er.km = 'A km final não pode ser menor que a km inicial.'
    if (total === '' || Number(total) < 0) er.total = 'Informe um valor total válido.'
    setErros(er)
    if (Object.keys(er).length) return

    setSaving(true)
    setApiErro(null)
    try {
      await alugueis.update(aluguel.id, {
        ...aluguel,
        dataDevolucao: data,
        quilometragemFinal: Number(km),
        valorTotal: Number(total),
      })
      ctx.toast.sucesso('Devolução registrada com sucesso.')
      ctx.closeExtra()
      ctx.reload()
    } catch (err) {
      setApiErro(err instanceof ApiError ? err : new ApiError(String(err)))
      setSaving(false)
    }
  }

  const dias = data ? diasEntre(aluguel.dataInicio, data) : 0

  return (
    <Modal titulo={`Registrar devolução - aluguel #${aluguel.id}`} onClose={() => !saving && ctx.closeExtra()}>
      <form onSubmit={salvar} noValidate>
        {apiErro && <Erro erro={apiErro} />}
        <div className="row g-3">
          <div className="col-12">
            <label className="form-label">Data de devolução</label>
            <input type="date" className={`form-control ${erros.data ? 'is-invalid' : ''}`} value={data} onChange={(e) => mudarData(e.target.value)} />
            {erros.data && <div className="invalid-feedback">{erros.data}</div>}
          </div>
          <div className="col-12">
            <label className="form-label">Quilometragem final</label>
            <input type="number" min="0" className={`form-control ${erros.km ? 'is-invalid' : ''}`} value={km} onChange={(e) => setKm(e.target.value)} />
            {erros.km && <div className="invalid-feedback">{erros.km}</div>}
          </div>
          <div className="col-12">
            <label className="form-label">Valor total (R$)</label>
            <input
              type="number"
              step="0.01"
              min="0"
              className={`form-control ${erros.total ? 'is-invalid' : ''}`}
              value={total}
              onChange={(e) => {
                setTotal(e.target.value)
                setTotalEditado(true)
              }}
            />
            {erros.total && <div className="invalid-feedback">{erros.total}</div>}
            <div className="form-text">
              Sugestão: {dias} dia(s) × {fmtMoeda(aluguel.valorDiaria)} = {fmtMoeda(dias * Number(aluguel.valorDiaria))}. Você pode editar.
            </div>
          </div>
        </div>
        <div className="d-flex justify-content-end gap-2 mt-4">
          <button type="button" className="btn btn-secondary" onClick={ctx.closeExtra} disabled={saving}>
            Cancelar
          </button>
          <button type="submit" className="btn btn-success" disabled={saving}>
            {saving ? 'Salvando...' : 'Confirmar devolução'}
          </button>
        </div>
      </form>
    </Modal>
  )
}
