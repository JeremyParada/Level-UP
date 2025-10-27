import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import ProductCard from '../components/productos/ProductCard';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

const Home = () => {
  const [productosDestacados, setProductosDestacados] = useState([]);

  useEffect(() => {
    // Cargar productos destacados desde el backend
    fetch(`${API_URL}/productos`)
      .then(res => res.json())
      .then(data => {
        // Obtener los primeros 3 productos aleatorios
        const destacados = data.sort(() => 0.5 - Math.random()).slice(0, 3);
        setProductosDestacados(destacados);
      })
      .catch(err => console.error('Error cargando productos:', err));
  }, []);

  return (
    <main className="container my-5">
      <section className="registro-seccion text-center mb-5">
        <h1 className="display-4 texto-principal color-acento-azul mb-3">
          ¡Bienvenido a Level-Up Gamer!
        </h1>
        <p className="lead">
          Tu tienda online de confianza para productos gaming en Chile.
        </p>
      </section>

      {/* Productos destacados */}
      <section className="mb-5">
        <h2 className="texto-principal color-acento-azul mb-4 text-center">
          🔥 Productos Destacados
        </h2>
        <div className="row">
          {productosDestacados.map(producto => (
            <div key={producto.codigo} className="col-md-4 mb-4">
              <ProductCard producto={producto} />
            </div>
          ))}
        </div>
      </section>
    </main>
  );
};

export default Home;