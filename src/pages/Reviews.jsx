import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useNotification } from '../hooks/useNotification';

const Reviews = () => {
  const { exito, error } = useNotification();
  const [resenas, setResenas] = useState([]);
  const [productos, setProductos] = useState([]);
  const [filtroProducto, setFiltroProducto] = useState('');
  const [filtroCalificacion, setFiltroCalificacion] = useState('');

  const [formResena, setFormResena] = useState({
    nombreProducto: '',
    calificacion: '',
    nombreUsuario: '',
    comentario: ''
  });

  const formRef = useRef(null);

  useEffect(() => {
    cargarProductos();
    cargarResenas();
  }, []);

  const cargarProductos = async () => {
    try {
      const response = await fetch('/assets/data/productos.json');
      const data = await response.json();
      setProductos(data);
    } catch (err) {
      console.error('Error cargando productos:', err);
    }
  };

  const cargarResenas = () => {
    const resenasGuardadas = JSON.parse(localStorage.getItem('resenas')) || [];
    setResenas(resenasGuardadas);
  };

  const limpiarFormulario = () => {
    setFormResena({
      nombreProducto: '',
      calificacion: '',
      nombreUsuario: '',
      comentario: ''
    });

    if (formRef.current) {
      formRef.current.reset();
    }
  };

  const publicarResena = (e) => {
    e.preventDefault();
    
    // Validación básica
    if (!formResena.nombreProducto || !formResena.calificacion || 
        !formResena.nombreUsuario.trim() || !formResena.comentario.trim()) {
      error('Por favor completa todos los campos');
      return;
    }

    const productoSeleccionado = productos.find(p => p.nombre === formResena.nombreProducto);

    const nuevaResena = {
      id: Date.now(),
      codigoProducto: productoSeleccionado?.codigo || 'UNKNOWN',
      nombreProducto: formResena.nombreProducto,
      imagenProducto: productoSeleccionado?.imagen || '/assets/img/default.jpg',
      calificacion: parseInt(formResena.calificacion),
      nombreUsuario: formResena.nombreUsuario.trim(),
      comentario: formResena.comentario.trim(),
      fecha: new Date().toLocaleDateString('es-CL')
    };

    const resenasActualizadas = [nuevaResena, ...resenas];
    setResenas(resenasActualizadas);
    localStorage.setItem('resenas', JSON.stringify(resenasActualizadas));

    limpiarFormulario();
    exito('🎉 ¡Reseña publicada exitosamente!');
  };

  const handleChange = (e) => {
    setFormResena({
      ...formResena,
      [e.target.id]: e.target.value
    });
  };

  const renderEstrellas = (calificacion) => {
    return '⭐'.repeat(calificacion);
  };

  const resenasFiltradas = resenas.filter(resena => {
    const coincideProducto = !filtroProducto || resena.nombreProducto.includes(filtroProducto);
    const coincideCalificacion = !filtroCalificacion || resena.calificacion === parseInt(filtroCalificacion);
    return coincideProducto && coincideCalificacion;
  });

  const promedioCalificaciones = resenas.length > 0
    ? (resenas.reduce((sum, r) => sum + r.calificacion, 0) / resenas.length).toFixed(1)
    : 0;

  return (
    <main>
      {/* Header */}
      <section className="text-center fondo-catalogo">
        <div className="row py-lg-5 fondo-texto-catalogo">
          <div className="col-lg-6 col-md-8 mx-auto">
            <h1 className="texto-principal">Reseñas de Productos</h1>
            <p className="color-acento-verde">
              Conoce las opiniones de otros gamers
            </p>
          </div>
        </div>
      </section>

      {/* Formulario para agregar reseña */}
      <section className="container my-5">
        <div className="row justify-content-center">
          <div className="col-lg-8">
            <div className="card card-formulario rounded-4 p-4 mb-5">
              <h3 className="texto-principal color-acento-azul mb-4">
                Deja tu reseña
              </h3>
              <form onSubmit={publicarResena} className="mb-4" ref={formRef}>
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label htmlFor="nombreProducto" className="form-label">
                      Producto
                    </label>
                    <select 
                      className="form-select" 
                      id="nombreProducto"
                      value={formResena.nombreProducto}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Selecciona un producto</option>
                      {productos.map(producto => (
                        <option key={producto.codigo} value={producto.nombre}>
                          {producto.nombre}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="col-md-6 mb-3">
                    <label htmlFor="calificacion" className="form-label">
                      Calificación
                    </label>
                    <select 
                      className="form-select" 
                      id="calificacion"
                      value={formResena.calificacion}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Selecciona calificación</option>
                      <option value="5">⭐⭐⭐⭐⭐ (5 estrellas)</option>
                      <option value="4">⭐⭐⭐⭐ (4 estrellas)</option>
                      <option value="3">⭐⭐⭐ (3 estrellas)</option>
                      <option value="2">⭐⭐ (2 estrellas)</option>
                      <option value="1">⭐ (1 estrella)</option>
                    </select>
                  </div>
                </div>
                <div className="mb-3">
                  <label htmlFor="nombreUsuario" className="form-label">
                    Tu nombre
                  </label>
                  <input 
                    type="text" 
                    className="form-control" 
                    id="nombreUsuario"
                    placeholder="Tu nombre gamer"
                    value={formResena.nombreUsuario}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="comentario" className="form-label">
                    Tu reseña
                  </label>
                  <textarea 
                    className="form-control" 
                    id="comentario" 
                    rows="4"
                    placeholder="Comparte tu experiencia con este producto..."
                    value={formResena.comentario}
                    onChange={handleChange}
                    required
                  />
                </div>
                <button type="submit" className="btn btn-primary">
                  Publicar Reseña
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Estadísticas y filtros */}
      <section className="container mb-4">
        <div className="row">
          <div className="col-lg-3 mb-3">
            <div className="card card-producto p-3 text-center">
              <h4 className="color-acento-verde mb-2">
                {renderEstrellas(Math.round(promedioCalificaciones))}
              </h4>
              <p className="mb-0">
                <strong>{promedioCalificaciones}</strong> de 5
              </p>
              <small className="text-muted">{resenas.length} reseñas</small>
            </div>
          </div>
          <div className="col-lg-9">
            <div className="card card-producto p-3">
              <div className="row align-items-center">
                <div className="col-md-6 mb-2 mb-md-0">
                  <input 
                    type="text" 
                    className="form-control" 
                    placeholder="Buscar por producto..."
                    value={filtroProducto}
                    onChange={(e) => setFiltroProducto(e.target.value)}
                  />
                </div>
                <div className="col-md-6">
                  <select 
                    className="form-select"
                    value={filtroCalificacion}
                    onChange={(e) => setFiltroCalificacion(e.target.value)}
                  >
                    <option value="">Todas las calificaciones</option>
                    <option value="5">⭐⭐⭐⭐⭐ (5)</option>
                    <option value="4">⭐⭐⭐⭐ (4)</option>
                    <option value="3">⭐⭐⭐ (3)</option>
                    <option value="2">⭐⭐ (2)</option>
                    <option value="1">⭐ (1)</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Lista de reseñas */}
      <section className="container mb-5">
        <h3 className="texto-principal color-acento-azul mb-4">
          Reseñas de la Comunidad
        </h3>
        <div className="row">
          {resenasFiltradas.length === 0 ? (
            <div className="col-12">
              <div className="card card-producto p-5 text-center">
                <h5 className="color-acento-azul mb-3">
                  {resenas.length === 0 
                    ? 'Aún no hay reseñas' 
                    : 'No se encontraron reseñas con esos filtros'}
                </h5>
                <p className="mb-3">
                  {resenas.length === 0 
                    ? '¡Sé el primero en compartir tu opinión!' 
                    : 'Intenta con otros criterios de búsqueda'}
                </p>
                <Link to="/productos" className="btn btn-agregar-producto">
                  Ver Productos
                </Link>
              </div>
            </div>
          ) : (
            resenasFiltradas.map(resena => (
              <div key={resena.id} className="col-lg-6 mb-4">
                <div className="card card-producto p-3 h-100">
                  <div className="d-flex align-items-start mb-3">
                    <img 
                      src={resena.imagenProducto} 
                      alt={resena.nombreProducto}
                      className="img-thumbnail me-3"
                      style={{ width: '80px', height: '80px', objectFit: 'cover' }}
                    />
                    <div className="flex-grow-1">
                      <h6 className="color-acento-azul mb-1">
                        {resena.nombreProducto}
                      </h6>
                      <div className="d-flex justify-content-between align-items-center">
                        <span className="color-acento-verde">
                          {renderEstrellas(resena.calificacion)} ({resena.calificacion}/5)
                        </span>
                        <small className="text-muted">{resena.fecha}</small>
                      </div>
                    </div>
                  </div>
                  <p className="mb-2">"{resena.comentario}"</p>
                  <small className="text-muted">
                    Por: <strong>{resena.nombreUsuario}</strong>
                  </small>
                </div>
              </div>
            ))
          )}
        </div>
      </section>
    </main>
  );
};

export default Reviews;