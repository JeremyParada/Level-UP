import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../hooks/useCart';
import { useNotification } from '../hooks/useNotification';
import Modal from '../components/Modal';

const Checkout = () => {
  const navigate = useNavigate();
  const { carrito, vaciarCarrito } = useCart();
  const { exito, error } = useNotification();

  const [direccion, setDireccion] = useState('');
  const [metodoPago, setMetodoPago] = useState('');
  const [procesando, setProcesando] = useState(false);
  const [mostrarModal, setMostrarModal] = useState(false);

  const handleFinalizarCompra = () => {
    if (!direccion || !metodoPago) {
      error('Por favor completa todos los campos antes de continuar.');
      return;
    }

    // Mostrar el modal para confirmar la compra
    setMostrarModal(true);
  };

  const confirmarCompra = async () => {
    setMostrarModal(false);
    setProcesando(true);

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/pedidos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          idUsuario: JSON.parse(localStorage.getItem('usuario')).id,
          productos: carrito,
          metodoPago,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        exito(`🎉 ¡Compra realizada exitosamente!<br>Has ganado ${data.puntos} puntos LevelUp.`);
        vaciarCarrito();
        navigate('/perfil'); // Redirigir al perfil o historial de compras
      } else {
        error(data.error || 'Error al procesar la compra');
      }
    } catch (err) {
      console.error('Error al finalizar compra:', err);
      error('Error al procesar la compra');
    } finally {
      setProcesando(false);
    }
  };

  const cancelarCompra = () => {
    setMostrarModal(false);
    info('La compra ha sido cancelada.');
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

      {/* Modal para confirmar la compra */}
      {mostrarModal && (
        <Modal
          titulo="Confirmar Compra"
          mensaje={`¿Confirmas tu compra por un total de ${carrito.reduce((sum, p) => sum + p.precio * p.cantidad, 0)}?`}
          onConfirmar={confirmarCompra}
          onCancelar={cancelarCompra}
        />
      )}
    </main>
  );
};

export default Checkout;