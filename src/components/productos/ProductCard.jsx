import React from 'react';
import { Link } from 'react-router-dom';

const ProductCard = ({ producto }) => {
  const formatearPrecio = (precio) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP'
    }).format(precio);
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
        <h5 className="card-title">{producto.nombre}</h5>
        <p className="card-text">{producto.descripcion}</p>
        <h6 className="color-acento-verde">{formatearPrecio(producto.precio)}</h6>
        <Link to={`/producto-detalle/${producto.codigo}`} className="btn btn-primary mt-auto">
          Ver Detalles
        </Link>
      </div>
    </div>
  );
};

export default ProductCard;