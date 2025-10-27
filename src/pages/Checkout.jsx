import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../hooks/useCart';
import { useNotification } from '../hooks/useNotification';

const Checkout = () => {
  const navigate = useNavigate();
  const { carrito, vaciarCarrito } = useCart();
  const { exito, error } = useNotification();

  const [direccion, setDireccion] = useState('');
  const [metodoPago, setMetodoPago] = useState('');
  const [procesando, setProcesando] = useState(false);

  const handleFinalizarCompra = () => {
    if (!direccion || !metodoPago) {
      error('Por favor completa todos los campos');
      return;
    }

    setProcesando(true);

    setTimeout(() => {
      exito('🎉 ¡Compra realizada exitosamente!');
      vaciarCarrito();
      navigate('/perfil'); // Redirigir al perfil o historial de compras
    }, 2000);
  };

  return (
    <main className="container my-5">
      <h1 className="texto-principal">Checkout</h1>
      <p className="text-muted">Completa los datos para finalizar tu compra</p>

      <div className="card card-formulario rounded-4 p-4">
        <div className="mb-3">
          <label htmlFor="direccion" className="form-label">Dirección de Envío</label>
          <input 
            type="text" 
            className="form-control" 
            id="direccion" 
            placeholder="Ingresa tu dirección"
            value={direccion}
            onChange={(e) => setDireccion(e.target.value)}
          />
        </div>

        <div className="mb-3">
          <label htmlFor="metodoPago" className="form-label">Método de Pago</label>
          <select 
            className="form-select" 
            id="metodoPago" 
            value={metodoPago}
            onChange={(e) => setMetodoPago(e.target.value)}
          >
            <option value="">Selecciona un método</option>
            <option value="WEBPAY">WebPay</option>
            <option value="TRANSFERENCIA">Transferencia Bancaria</option>
          </select>
        </div>

        <button 
          className="btn btn-primary w-100" 
          onClick={handleFinalizarCompra}
          disabled={procesando}
        >
          {procesando ? 'Procesando...' : 'Finalizar Compra'}
        </button>
      </div>
    </main>
  );
};

export default Checkout;