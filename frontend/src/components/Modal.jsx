import { useEffect, useRef } from 'react'

export default function Modal({ titulo, onClose, children, footer, size = '' }) {
  const closeRef = useRef(onClose)
  closeRef.current = onClose

  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && closeRef.current()
    document.addEventListener('keydown', onKey)
    document.body.classList.add('modal-open')
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.classList.remove('modal-open')
    }
  }, [])

  return (
    <>
      <div className="modal-backdrop-custom" onClick={onClose} />
      <div className="modal show-custom" role="dialog" aria-modal="true" aria-label={titulo} onClick={onClose}>
        <div className={`modal-dialog modal-dialog-centered ${size}`} onClick={(e) => e.stopPropagation()}>
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">{titulo}</h5>
              <button type="button" className="btn-close" aria-label="Fechar" onClick={onClose} />
            </div>
            <div className="modal-body">{children}</div>
            {footer && <div className="modal-footer">{footer}</div>}
          </div>
        </div>
      </div>
    </>
  )
}
