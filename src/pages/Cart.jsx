import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../hooks/useCart';
import { useNotification } from '../hooks/useNotification';
import Modal from '../components/Modal';

const Cart = () => {
  const navigate = useNavigate();
  const usuario = JSON.parse(localStorage.getItem('usuario'));
  const { 
    carrito, 
    totalItems, 
    totalPrecio,
    eliminarDelCarrito,
    actualizarCantidad,
    vaciarCarrito 
  } = useCart();
  const { exito, advertencia, info } = useNotification();

  const [productos, setProductos] = useState([]);
  const [codigoDescuento, setCodigoDescuento] = useState('');
  const [descuentoAplicado, setDescuentoAplicado] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mostrarModal, setMostrarModal] = useState(false);

  const cargarProductos = useCallback(async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/v1/productos`);
      const todosLosProductos = await response.json();

      const productosCarrito = carrito.map(item => {
        const producto = todosLosProductos.find(p => p.codigo === item.codigo);
        return {
          ...producto,
          cantidad: item.cantidad
        };
      }).filter(p => p.codigo);

      setProductos(productosCarrito);
      setLoading(false);
    } catch (err) {
      console.error('Error cargando productos:', err);
      setLoading(false);
    }
  }, [carrito]);

  useEffect(() => {
    cargarProductos();
  }, [cargarProductos]);

  const formatearPrecio = (precio) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP'
    }).format(precio);
  };

  const handleCantidadChange = (codigo, nuevaCantidad) => {
    if (nuevaCantidad < 1) {
      handleEliminar(codigo);
      return;
    }
    if (nuevaCantidad > 10) {
      advertencia('Máximo 10 unidades por producto');
      return;
    }
    actualizarCantidad(codigo, nuevaCantidad);
  };

  const handleEliminar = (codigo) => {
    const producto = productos.find(p => p.codigo === codigo);
    eliminarDelCarrito(codigo);
    info(`${producto?.nombre} eliminado del carrito`);
  };

  const handleVaciarCarrito = () => {
    setMostrarModal(true);
  };

  const confirmarVaciarCarrito = () => {
    vaciarCarrito();
    setMostrarModal(false);
    advertencia('Carrito vaciado');
  };

  const cancelarVaciarCarrito = () => {
    setMostrarModal(false);
  };

  const handleAplicarDescuento = () => {
    const codigo = codigoDescuento.trim().toUpperCase();
    
    if (codigo === 'DUOC20') {
      setDescuentoAplicado({
        codigo: 'DUOC20',
        porcentaje: 20,
        descripcion: 'Descuento DuocUC'
      });
      exito('🎉 ¡Descuento DuocUC aplicado!<br>20% de descuento en tu compra');
    } else {
      advertencia('❌ Código inválido<br>Prueba con: <strong>DUOC20</strong>');
    }
  };

  const calcularSubtotal = () => {
    return productos.reduce((sum, p) => sum + (p.precio * p.cantidad), 0);
  };

  const calcularDescuento = () => {
    if (!descuentoAplicado) return 0;
    return calcularSubtotal() * (descuentoAplicado.porcentaje / 100);
  };

  const calcularTotal = () => {
    return calcularSubtotal() - calcularDescuento();
  };

  const handleFinalizarCompra = () => {
    if (productos.length === 0) {
      advertencia('Tu carrito está vacío. Agrega productos antes de finalizar la compra.');
      return;
    }

    if (!usuario) {
      if (window.confirm('Para finalizar la compra, debes registrarte o iniciar sesión. ¿Deseas registrarte ahora?')) {
        navigate('/registro'); // Redirigir a la página de registro
      } else {
        advertencia('Debes registrarte o iniciar sesión para continuar con la compra.');
      }
      return;
    }

    // Redirigir al Checkout
    navigate('/checkout');
  };

  if (loading) {
    return (
      <main className="container my-5">
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Cargando...</span>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main>
      {/* Header */}
      <section className="text-center fondo-catalogo">
        <div className="row py-lg-5 fondo-texto-catalogo">
          <div className="col-lg-6 col-md-8 mx-auto">
            <h1 className="texto-principal">🛒 Carrito de Compras</h1>
            <p className="color-acento-verde">
              Revisa tus productos antes de finalizar
            </p>
          </div>
        </div>
      </section>

      <div className="container my-5">
        <div className="row">
          {/* Lista de productos */}
          <div className="col-lg-8">
            <div className="card card-formulario rounded-4 p-4 mb-4">
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h3 className="texto-principal color-acento-azul mb-0">
                  Tus Productos ({totalItems})
                </h3>
                {productos.length > 0 && (
                  <button 
                    className="btn btn-outline-danger btn-sm"
                    onClick={handleVaciarCarrito}
                  >
                    🗑️ Vaciar Carrito
                  </button>
                )}
              </div>

              {productos.length === 0 ? (
                <div className="text-center py-5">
                  <h4 className="color-acento-azul mb-3">
                    Tu carrito está vacío
                  </h4>
                  <p className="mb-4">
                    ¡Explora nuestro catálogo y encuentra los mejores productos gaming!
                  </p>
                  <Link to="/productos" className="btn btn-agregar-producto">
                    Ver Productos
                  </Link>
                </div>
              ) : (
                <>
                  {/* Header tabla (desktop) */}
                  <div className="d-none d-md-block mb-3">
                    <div className="row fw-bold border-bottom pb-2">
                      <div className="col-md-6">Producto</div>
                      <div className="col-md-2 text-center">Precio</div>
                      <div className="col-md-2 text-center">Cantidad</div>
                      <div className="col-md-2 text-center">Subtotal</div>
                    </div>
                  </div>

                  {/* Productos */}
                  {productos.map(producto => (
                    <div key={producto.codigo} className="border-bottom py-3">
                      <div className="row align-items-center">
                        {/* Producto info */}
                        <div className="col-md-6 mb-3 mb-md-0">
                          <div className="d-flex align-items-center">
                            <img 
                              src={producto.imagen} 
                              alt={producto.nombre}
                              className="img-thumbnail me-3"
                              style={{ width: '80px', height: '80px', objectFit: 'cover' }}
                            />
                            <div>
                              <h6 className="color-acento-azul mb-1">
                                {producto.nombre}
                              </h6>
                              <small className="text-muted">
                                Código: {producto.codigo}
                              </small>
                            </div>
                          </div>
                        </div>

                        {/* Precio */}
                        <div className="col-6 col-md-2 text-center">
                          <small className="d-md-none text-muted">Precio:</small>
                          <div className="color-acento-verde">
                            {formatearPrecio(producto.precio)}
                          </div>
                        </div>

                        {/* Cantidad */}
                        <div className="col-6 col-md-2">
                          <small className="d-md-none text-muted">Cantidad:</small>
                          <div className="input-group input-group-sm">
                            <button 
                              className="btn btn-outline-secondary" 
                              type="button"
                              onClick={() => handleCantidadChange(
                                producto.codigo, 
                                producto.cantidad - 1
                              )}
                            >
                              -
                            </button>
                            <input 
                              type="number" 
                              className="form-control text-center" 
                              value={producto.cantidad}
                              readOnly
                              style={{ maxWidth: '60px' }}
                            />
                            <button 
                              className="btn btn-outline-secondary" 
                              type="button"
                              onClick={() => handleCantidadChange(
                                producto.codigo, 
                                producto.cantidad + 1
                              )}
                            >
                              +
                            </button>
                          </div>
                        </div>

                        {/* Subtotal */}
                        <div className="col-6 col-md-2 text-center">
                          <small className="d-md-none text-muted">Subtotal:</small>
                          <div className="fw-bold color-acento-verde">
                            {formatearPrecio(producto.precio * producto.cantidad)}
                          </div>
                          <button 
                            className="btn btn-sm btn-outline-danger mt-2"
                            onClick={() => handleEliminar(producto.codigo)}
                          >
                            Eliminar
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </>
              )}
            </div>
          </div>

          {/* Resumen del pedido */}
          <div className="col-lg-4">
            <div className="card card-formulario rounded-4 p-4 sticky-top">
              <h4 className="color-acento-azul mb-4">Resumen del Pedido</h4>

              <div className="mb-3">
                <div className="d-flex justify-content-between mb-2">
                  <span>Subtotal:</span>
                  <span>{formatearPrecio(calcularSubtotal())}</span>
                </div>

                {descuentoAplicado && (
                  <div className="d-flex justify-content-between mb-2 color-acento-verde">
                    <span>Descuento ({descuentoAplicado.porcentaje}%):</span>
                    <span>-{formatearPrecio(calcularDescuento())}</span>
                  </div>
                )}

                <div className="d-flex justify-content-between mb-2">
                  <span>Envío:</span>
                  <span className="color-acento-verde">
                    {calcularSubtotal() >= 50000 ? 'GRATIS' : formatearPrecio(5000)}
                  </span>
                </div>

                <hr />

                <div className="d-flex justify-content-between fw-bold fs-5">
                  <span>Total:</span>
                  <span className="color-acento-verde">
                    {formatearPrecio(
                      calcularTotal() + (calcularSubtotal() >= 50000 ? 0 : 5000)
                    )}
                  </span>
                </div>
              </div>

              {/* Código de descuento */}
              <div className="mb-3">
                <label htmlFor="codigoDescuento" className="form-label">
                  🎫 Código de descuento
                </label>
                <div className="input-group">
                  <input 
                    type="text" 
                    className="form-control" 
                    id="codigoDescuento"
                    placeholder="Ej: DUOC20"
                    value={codigoDescuento}
                    onChange={(e) => setCodigoDescuento(e.target.value)}
                    disabled={!!descuentoAplicado}
                  />
                  <button 
                    className={`btn ${descuentoAplicado ? 'btn-success' : 'btn-outline-secondary'}`}
                    type="button"
                    onClick={handleAplicarDescuento}
                    disabled={!!descuentoAplicado}
                  >
                    {descuentoAplicado ? '✅ Aplicado' : 'Aplicar'}
                  </button>
                </div>
                <small className="text-muted">Prueba con: DUOC20</small>
              </div>

              {/* Información de envío */}
              <div className="alert alert-info mb-3">
                <small>
                  📦 <strong>Envío gratis</strong> en compras sobre $50.000<br/>
                  🚚 Entrega en 3-5 días hábiles
                </small>
              </div>

              {/* Botones de acción */}
              <button 
                className="btn btn-registrarse w-100 mb-2"
                onClick={handleFinalizarCompra}
                disabled={productos.length === 0}
              >
                💳 Finalizar Compra
              </button>
              <Link 
                to="/productos" 
                className="btn btn-outline-secondary w-100"
              >
                🛍️ Seguir Comprando
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      {mostrarModal && (
        <Modal
          titulo="Confirmar acción"
          mensaje="¿Estás seguro de que deseas vaciar el carrito?"
          onConfirmar={confirmarVaciarCarrito}
          onCancelar={cancelarVaciarCarrito}
        />
      )}
    </main>
  );
};

export default Cart;