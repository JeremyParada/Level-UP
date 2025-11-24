import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../hooks/useCart';
import { useNotification } from '../hooks/useNotification';
import Modal from '../components/Modal';
import DireccionForm from '../components/DireccionForm'; // Asegúrate de importar el componente
import fetchWithAuth from '../utils/api';

const Checkout = () => {
  const navigate = useNavigate();
  const { carrito, vaciarCarrito } = useCart();
  const { exito, error } = useNotification();

  const [direccion, setDireccion] = useState('');
  const [metodoPago, setMetodoPago] = useState('');
  const [procesando, setProcesando] = useState(false);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [mostrarFormularioDireccion, setMostrarFormularioDireccion] = useState(false);

  const [nuevaDireccion, setNuevaDireccion] = useState({
    calle: '',
    numero: '',
    comuna: '',
    ciudad: '',
    region: '',
    codigoPostal: ''
  });

  const [direcciones, setDirecciones] = useState([]); // Lista de direcciones del usuario
  const [direccionSeleccionada, setDireccionSeleccionada] = useState(''); // Dirección seleccionada

  // Función para normalizar las claves del objeto usuario
  const normalizarUsuario = (usuario) => {
    return Object.keys(usuario).reduce((acc, key) => {
      acc[key.toLowerCase()] = usuario[key];
      return acc;
    }, {});
  };

  const normalizarClaves = (obj) => {
    return Object.keys(obj).reduce((acc, key) => {
      acc[key.toLowerCase()] = obj[key];
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

    if (!usuarioNormalizado.id) {
      error('Debes iniciar sesión para continuar.');
      navigate('/login');
      return;
    }

    const cargarDireccion = async () => {
      try {
        const response = await fetchWithAuth(`/v1/direcciones/usuario/${usuarioNormalizado.id}`);
        const direcciones = await response.json();

        if (!Array.isArray(direcciones)) {
          throw new Error('La respuesta del servidor no es válida.');
        }

        // Normalizar las claves de cada dirección
        const direccionesNormalizadas = direcciones.map(normalizarClaves);

        setDirecciones(direccionesNormalizadas);

        const direccionPrincipal = direccionesNormalizadas.find(d => d.es_principal === 1);
        if (direccionPrincipal) {
          setDireccionSeleccionada(direccionPrincipal.id_direccion);
          setDireccion(`${direccionPrincipal.calle}, ${direccionPrincipal.numero}, ${direccionPrincipal.comuna}, ${direccionPrincipal.ciudad}, ${direccionPrincipal.region}`);
        } else {
          error('No tienes una dirección registrada. Por favor, agrega una en el checkout.');
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

      const response = await fetchWithAuth(`/v1/pedidos`, {
        method: 'POST',
        body: JSON.stringify({
          idUsuario: usuarioNormalizado.id,
          productos: carrito,
          metodoPago,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Actualizar los puntos en localStorage
        usuarioNormalizado.puntos += data.puntos;
        localStorage.setItem('usuario', JSON.stringify(usuarioNormalizado));

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

  const handleChangeDireccion = (e) => {
    setNuevaDireccion({
      ...nuevaDireccion,
      [e.target.id]: e.target.value
    });
  };

  const handleGuardarDireccion = async () => {
    try {
      const usuario = JSON.parse(localStorage.getItem('usuario'));
      const usuarioNormalizado = normalizarUsuario(usuario);
      const response = await fetchWithAuth(`/v1/direcciones`, {
        method: 'POST',
        body: JSON.stringify({
          ...nuevaDireccion,
          idUsuario: usuarioNormalizado.id,
          tipoDireccion: 'ENVIO',
          esPrincipal: 0
        }),
      });

      if (response.ok) {
        exito('¡Dirección añadida exitosamente!');
        setMostrarFormularioDireccion(false);
        setNuevaDireccion({
          calle: '',
          numero: '',
          comuna: '',
          ciudad: '',
          region: '',
          codigoPostal: ''
        });
      } else {
        const data = await response.json();
        error(data.error || 'Error al guardar la dirección.');
      }
    } catch (err) {
      console.error('Error al guardar dirección:', err);
      error('Error al guardar la dirección.');
    }
  };

  return (
    <main className="container my-5">
      <h1 className="texto-principal">Checkout</h1>
      <p className="text-muted">Completa los datos para finalizar tu compra</p>

      <div className="card card-formulario rounded-4 p-4">
        <div className="mb-3">
          <label htmlFor="direccion" className="form-label">Dirección de Envío</label>
          <select 
            className="form-select" 
            id="direccion" 
            value={direccionSeleccionada}
            onChange={(e) => {
              const direccionId = e.target.value;
              setDireccionSeleccionada(direccionId);

              const direccion = direcciones.find(d => d.id_direccion === parseInt(direccionId));
              if (direccion) {
                setDireccion(`${direccion.calle}, ${direccion.numero}, ${direccion.comuna}, ${direccion.ciudad}, ${direccion.region}`);
              }
            }}
          >
            {direcciones.map(direccion => (
              <option key={direccion.id_direccion} value={direccion.id_direccion}>
                {`${direccion.calle}, ${direccion.numero}, ${direccion.comuna}, ${direccion.ciudad}, ${direccion.region}`}
              </option>
            ))}
          </select>
          <button 
            className="btn btn-outline-primary mt-3"
            onClick={() => setMostrarFormularioDireccion(true)}
          >
            Añadir Nueva Dirección
          </button>
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

      {mostrarFormularioDireccion && (
        <Modal
          titulo="Añadir Nueva Dirección"
          mensaje={
            <DireccionForm 
              formData={nuevaDireccion} 
              handleChange={handleChangeDireccion} 
            />
          }
          onConfirmar={handleGuardarDireccion}
          onCancelar={() => setMostrarFormularioDireccion(false)}
        />
      )}
    </main>
  );
};

export default Checkout;