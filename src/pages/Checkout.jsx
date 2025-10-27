import React, { useState, useEffect } from 'react';
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

  // Función para normalizar las claves del objeto usuario
  const normalizarUsuario = (usuario) => {
    return Object.keys(usuario).reduce((acc, key) => {
      acc[key.toLowerCase()] = usuario[key];
      return acc;
    }, {});
  };

  // Cargar dirección principal del usuario
  useEffect(() => {
    const usuario = JSON.parse(localStorage.getItem('usuario'));
    if (!usuario) {
      error('Debes iniciar sesión para continuar.');
      navigate('/login');
      return;
    }

    const usuarioNormalizado = normalizarUsuario(usuario);

    if (!usuarioNormalizado.idusuario) {
      error('Debes iniciar sesión para continuar.');
      navigate('/login');
      return;
    }

    const cargarDireccion = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/direcciones/usuario/${usuarioNormalizado.idusuario}`);
        const direcciones = await response.json();

        if (!Array.isArray(direcciones)) {
          throw new Error('La respuesta del servidor no es válida.');
        }

        const direccionPrincipal = direcciones.find(d => d.es_principal === 1);
        if (direccionPrincipal) {
          setDireccion(`${direccionPrincipal.calle}, ${direccionPrincipal.numero}, ${direccionPrincipal.comuna}, ${direccionPrincipal.ciudad}, ${direccionPrincipal.region}`);
        } else {
          error('No tienes una dirección registrada. Por favor, agrega una antes de continuar.');
          navigate('/perfil');
        }
      } catch (err) {
        console.error('Error al cargar dirección:', err);
        error('Error al cargar dirección. Intenta nuevamente.');
      }
    };

    cargarDireccion();
  }, [navigate, error]);

  const handleFinalizarCompra = () => {
    if (!direccion || !metodoPago) {
      error('Por favor completa todos los campos antes de continuar.');
      return;
    }

    setMostrarModal(true);
  };

  const confirmarCompra = async () => {
    setMostrarModal(false);
    setProcesando(true);

    try {
      const usuario = JSON.parse(localStorage.getItem('usuario'));
      const usuarioNormalizado = normalizarUsuario(usuario);

      const response = await fetch(`${process.env.REACT_APP_API_URL}/pedidos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          idUsuario: usuarioNormalizado.idusuario,
          productos: carrito,
          metodoPago,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        exito(`🎉 ¡Compra realizada exitosamente!<br>Has ganado ${data.puntos} puntos LevelUp.`);
        vaciarCarrito();
        navigate('/perfil');
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
            value={direccion} 
            readOnly 
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