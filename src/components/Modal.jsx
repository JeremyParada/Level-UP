import React from 'react';

const Modal = ({ titulo, mensaje, onConfirmar, onCancelar }) => {
  return (
    <div className="modal-backdrop">
      <div className="modal-container">
        <div className="modal-header">
          <h5 className="modal-title">{titulo}</h5>
        </div>
        <div className="modal-body">
          <p>{mensaje}</p>
        </div>
        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onCancelar}>
            Cancelar
          </button>
          <button className="btn btn-primary" onClick={onConfirmar}>
            Confirmar
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;