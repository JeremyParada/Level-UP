import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useCart } from '../hooks/useCart';
import { useNotification } from '../hooks/useNotification';

const ProductDetailPage = () => {
  const { codigo } = useParams();
  const navigate = useNavigate();
  const { agregarProductoConNotificacion } = useCart();
  const { exito, error } = useNotification();

  const [producto, setProducto] = useState(null);
  const [cantidad, setCantidad] = useState(1);
  const [resenas, setResenas] = useState([]);
  const [loading, setLoading] = useState(true);

  // Estado del formulario de reseña
  const [formResena, setFormResena] = useState({
    calificacion: '',
    nombreUsuario: '',
    comentario: ''
  });

  const cargarProducto = useCallback(async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/v1/productos/codigo/${codigo}`);
      const data = await response.json();

      if (!data || data.error) {
        error('Producto no encontrado');
        setTimeout(() => navigate('/productos'), 2000);
        return;
      }

      // Mapear campos del backend al formato esperado por el frontend
      setProducto({
        ...data,
        nombre: data.nombreProducto,
        codigo: data.codigoProducto,
        id: data.idProducto,
        estado: data.estadoProducto,
      });
      setLoading(false);
    } catch (err) {
      console.error('Error cargando producto:', err);
      error('Error al cargar el producto');
      setLoading(false);
    }
  }, [codigo, error, navigate]);

  const cargarResenas = useCallback(() => {
    const resenasGuardadas = JSON.parse(localStorage.getItem('resenas')) || [];
    const resenasFiltradas = resenasGuardadas.filter(r => r.codigoProducto === codigo);
    setResenas(resenasFiltradas);
  }, [codigo]);

  useEffect(() => {
    cargarProducto();
    cargarResenas();
  }, [cargarProducto, cargarResenas]);

  const formatearPrecio = (precio) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP'
    }).format(precio);
  };

  const handleCantidadChange = (delta) => {
    const nuevaCantidad = cantidad + delta;
    if (nuevaCantidad >= 1 && nuevaCantidad <= 10) {
      setCantidad(nuevaCantidad);
    }
  };

  const handleAgregarCarrito = () => {
    agregarProductoConNotificacion(producto, cantidad);
    setCantidad(1);
  };

  const handleSubmitResena = (e) => {
    e.preventDefault();

    if (!formResena.calificacion || !formResena.nombreUsuario.trim() || !formResena.comentario.trim()) {
      error('Por favor completa todos los campos de la reseña');
      return;
    }

    const nuevaResena = {
      id: Date.now(),
      codigoProducto: producto.codigo,
      nombreProducto: producto.nombre,
      imagenProducto: producto.imagen,
      calificacion: parseInt(formResena.calificacion),
      nombreUsuario: formResena.nombreUsuario.trim(),
      comentario: formResena.comentario.trim(),
      fecha: new Date().toLocaleDateString('es-CL')
    };

    const resenasActualizadas = [nuevaResena, ...resenas];
    setResenas(resenasActualizadas);

    // Guardar en localStorage
    const todasResenas = JSON.parse(localStorage.getItem('resenas')) || [];
    todasResenas.unshift(nuevaResena);
    localStorage.setItem('resenas', JSON.stringify(todasResenas));

    // Limpiar formulario
    setFormResena({
      calificacion: '',
      nombreUsuario: '',
      comentario: ''
    });

    exito('🎉 ¡Reseña publicada exitosamente!');
  };

  const renderEstrellas = (calificacion) => {
    return '⭐'.repeat(calificacion);
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

  if (!producto) {
    return (
      <main className="container my-5">
        <div className="alert alert-warning text-center">
          <h4>Producto no encontrado</h4>
          <Link to="/productos" className="btn btn-primary mt-3">
            Volver al catálogo
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main>
      {/* Breadcrumb */}
      <section className="container mt-4">
        <nav aria-label="breadcrumb">
          <ol className="breadcrumb">
            <li className="breadcrumb-item">
              <Link to="/">Inicio</Link>
            </li>
            <li className="breadcrumb-item">
              <Link to="/productos">Productos</Link>
            </li>
            <li className="breadcrumb-item active" aria-current="page">
              {producto.nombre}
            </li>
          </ol>
        </nav>
      </section>

      {/* Detalle del producto */}
      <section className="container my-4">
        <div className="row">
          {/* Imagen del producto */}
          <div className="col-lg-5 mb-4">
            <div className="card card-producto p-4">
              <img 
                src={producto.imagen} 
                alt={producto.nombre}
                className="img-fluid"
                style={{ maxHeight: '400px', objectFit: 'contain' }}
              />
            </div>
          </div>

          {/* Información del producto */}
          <div className="col-lg-7">
            <div className="card card-formulario rounded-4 p-4">
              <span className="badge bg-secondary mb-2 align-self-start">
                {producto.categoria?.nombre}
              </span>
              <h1 className="texto-principal color-acento-azul mb-3">
                {producto.nombre}
              </h1>
              <p className="mb-3">
                <strong>Código:</strong> {producto.codigo}
              </p>
              <p className="mb-4">{producto.descripcion}</p>

              <div className="mb-4">
                <h2 className="color-acento-verde mb-3">
                  {formatearPrecio(producto.precio)}
                </h2>
              </div>

              {/* Control de cantidad */}
              <div className="mb-4">
                <label className="form-label">Cantidad:</label>
                <div className="input-group" style={{ maxWidth: '200px' }}>
                  <button 
                    className="btn btn-outline-secondary" 
                    type="button"
                    onClick={() => handleCantidadChange(-1)}
                    disabled={cantidad <= 1}
                  >
                    -
                  </button>
                  <input 
                    type="number" 
                    className="form-control text-center" 
                    value={cantidad}
                    readOnly
                  />
                  <button 
                    className="btn btn-outline-secondary" 
                    type="button"
                    onClick={() => handleCantidadChange(1)}
                    disabled={cantidad >= 10}
                  >
                    +
                  </button>
                </div>
                <small className="text-muted">Máximo 10 unidades</small>
              </div>

              {/* Botones de acción */}
              <div className="d-flex gap-2">
                <button 
                  className="btn btn-agregar-producto flex-grow-1"
                  onClick={handleAgregarCarrito}
                >
                  🛒 Agregar al Carrito
                </button>
                <Link 
                  to="/productos" 
                  className="btn btn-outline-secondary"
                >
                  ← Volver
                </Link>
              </div>

              {/* Información de envío */}
              <div className="alert alert-info mt-4">
                <h6 className="color-acento-azul mb-2">📦 Información de Envío</h6>
                <ul className="mb-0 small">
                  <li>Envío gratis en compras sobre $50.000</li>
                  <li>Entrega en 3-5 días hábiles</li>
                  <li>Retiro en tienda disponible</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Sección de reseñas */}
      <section className="container my-5">
        <div className="row">
          {/* Lista de reseñas */}
          <div className="col-lg-8 mb-4">
            <h3 className="texto-principal color-acento-azul mb-4">
              Reseñas de este producto ({resenas.length})
            </h3>

            {resenas.length === 0 ? (
              <div className="card card-producto p-4 text-center">
                <p className="mb-0">
                  Aún no hay reseñas para este producto. ¡Sé el primero en opinar!
                </p>
              </div>
            ) : (
              <div className="row">
                {resenas.map(resena => (
                  <div key={resena.id} className="col-12 mb-3">
                    <div className="card card-producto p-3">
                      <div className="d-flex justify-content-between align-items-start mb-2">
                        <div>
                          <h6 className="color-acento-azul mb-1">
                            {resena.nombreUsuario}
                          </h6>
                          <small className="color-acento-verde">
                            {renderEstrellas(resena.calificacion)} ({resena.calificacion}/5)
                          </small>
                        </div>
                        <small className="text-muted">{resena.fecha}</small>
                      </div>
                      <p className="mb-0">"{resena.comentario}"</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Formulario de reseña */}
          <div className="col-lg-4">
            <div className="card card-formulario rounded-4 p-4 sticky-top">
              <h4 className="color-acento-azul mb-3">Deja tu reseña</h4>
              <form onSubmit={handleSubmitResena}>
                <div className="mb-3">
                  <label htmlFor="calificacion" className="form-label">
                    Calificación
                  </label>
                  <select 
                    className="form-select" 
                    id="calificacion"
                    value={formResena.calificacion}
                    onChange={(e) => setFormResena({
                      ...formResena, 
                      calificacion: e.target.value
                    })}
                    required
                  >
                    <option value="">Selecciona</option>
                    <option value="5">⭐⭐⭐⭐⭐ (5)</option>
                    <option value="4">⭐⭐⭐⭐ (4)</option>
                    <option value="3">⭐⭐⭐ (3)</option>
                    <option value="2">⭐⭐ (2)</option>
                    <option value="1">⭐ (1)</option>
                  </select>
                </div>

                <div className="mb-3">
                  <label htmlFor="nombreUsuario" className="form-label">
                    Tu nombre
                  </label>
                  <input 
                    type="text" 
                    className="form-control" 
                    id="nombreUsuario"
                    placeholder="Tu nombre o gamer tag"
                    value={formResena.nombreUsuario}
                    onChange={(e) => setFormResena({
                      ...formResena, 
                      nombreUsuario: e.target.value
                    })}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="comentario" className="form-label">
                    Comentario
                  </label>
                  <textarea 
                    className="form-control" 
                    id="comentario" 
                    rows="4"
                    placeholder="Comparte tu experiencia..."
                    value={formResena.comentario}
                    onChange={(e) => setFormResena({
                      ...formResena, 
                      comentario: e.target.value
                    })}
                    required
                  />
                </div>

                <button type="submit" className="btn btn-registrarse w-100">
                  Publicar Reseña
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default ProductDetailPage;