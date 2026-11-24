import Modal from './Modal'

export default function ConfirmModal({ titulo = 'Confirmar exclusão', mensagem, onConfirm, onClose, busy }) {
  return (
    <Modal
      titulo={titulo}
      onClose={onClose}
      footer={
        <>
          <button className="btn btn-secondary" onClick={onClose} disabled={busy}>
            Cancelar
          </button>
          <button className="btn btn-danger" onClick={onConfirm} disabled={busy}>
            {busy ? 'Excluindo...' : 'Excluir'}
          </button>
        </>
      }
    >
      {mensagem}
    </Modal>
  )
}
