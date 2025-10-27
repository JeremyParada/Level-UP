import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../hooks/useCart';

const ProductCard = ({ producto }) => {
  const { agregarProductoConNotificacion } = useCart();

  const formatearPrecio = (precio) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP'
    }).format(precio);
  };

  const handleAgregarAlCarrito = () => {
    agregarProductoConNotificacion(producto, 1);
  };

  return (
    <div className="card card-producto h-100">
      <img 
        src={producto.imagen || '/assets/img/default.jpg'} 
        className="card-img-top p-3" 
        alt={producto.nombre || 'Producto sin nombre'}
        style={{ height: '200px', objectFit: 'contain' }}
      />
      <div className="card-body d-flex flex-column">
        <span className="badge bg-secondary mb-2 align-self-start">
          {producto.categoria || 'Sin categoría'}
        </span>
        <h5 className="card-title">{producto.nombre || 'Producto sin nombre'}</h5>
        <p className="card-text flex-grow-1">
          {producto.descripcion ? producto.descripcion.substring(0, 100) + '...' : 'Sin descripción'}
        </p>
        <div className="mt-auto">
          <p className="precio mb-2">{formatearPrecio(producto.precio || 0)}</p>
          <p className="codigo small mb-3">Código: {producto.codigo || 'N/A'}</p>
          <div className="d-grid gap-2">
            <button 
              className="btn btn-agregar-producto"
              onClick={handleAgregarAlCarrito}
            >
              🛒 Agregar al carrito
            </button>
            <Link 
              to={`/producto-detalle/${producto.codigo}`}
              className="btn btn-outline-secondary"
            >
              Ver detalles
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;