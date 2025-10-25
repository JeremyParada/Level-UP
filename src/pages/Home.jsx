import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import ProductCard from '../components/productos/ProductCard';

const Home = () => {
  const [productosDestacados, setProductosDestacados] = useState([]);

  useEffect(() => {
    // Cargar productos destacados
    fetch('/assets/data/productos.json')
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
      {/* Banner de bienvenida */}
      <section className="registro-seccion text-center mb-5">
        <h1 className="display-4 texto-principal color-acento-azul mb-3">
          ¡Bienvenido a Level-Up Gamer!
        </h1>
        <p className="lead">
          Tu tienda online de confianza para productos gaming en Chile.
          <span className="color-acento-verde"> Descuentos exclusivos</span> y los mejores precios.
        </p>
        <div className="row mt-4">
          <div className="col-md-6">
            <Link to="/productos" className="btn btn-agregar-producto btn-lg mb-2">
              Ver Catálogo Completo
            </Link>
          </div>
          <div className="col-md-6">
            <Link to="/registro" className="btn btn-registrarse btn-lg mb-2">
              Únete a la Comunidad
            </Link>
          </div>
        </div>
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
        <div className="text-center mt-4">
          <Link to="/productos" className="btn btn-outline-secondary btn-lg">
            Ver Todos los Productos
          </Link>
        </div>
      </section>

      {/* Beneficios de registrarse */}
      <section className="mb-5">
        <div className="card card-formulario rounded-4 p-4">
          <div className="row align-items-center">
            <div className="col-md-8">
              <h3 className="color-acento-azul mb-3">¿Por qué registrarte en Level-Up Gamer?</h3>
              <div className="row">
                <div className="col-md-6">
                  <ul className="list-unstyled">
                    <li className="mb-2">✅ <span className="color-acento-verde">20% descuento</span> si eres de DuocUC</li>
                    <li className="mb-2">🎮 Sistema de puntos LevelUp</li>
                    <li className="mb-2">🏆 Acceso a torneos exclusivos</li>
                  </ul>
                </div>
                <div className="col-md-6">
                  <ul className="list-unstyled">
                    <li className="mb-2">📦 Envío gratis sobre $50.000</li>
                    <li className="mb-2">⚡ Ofertas flash para miembros</li>
                    <li className="mb-2">🎁 Regalos por referidos</li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="col-md-4 text-center">
              <Link to="/registro" className="btn btn-registrarse btn-lg">
                Registrarse Gratis
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Trailer GTA VI */}
      <section className="mb-5 text-center">
        <h2 className="texto-principal color-acento-azul mb-3">
          🎬 ¡Ya viste el último trailer de GTA VI?!
        </h2>
        <div className="d-flex justify-content-center">
          <iframe 
            width="80%" 
            height="400"
            src="https://www.youtube-nocookie.com/embed/QdBZY2fkU-0?si=SCvfg5vAlPymbuSN"
            title="YouTube video player" 
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin" 
            allowFullScreen>
          </iframe>
        </div>
      </section>

      {/* Noticias Gamer */}
      <section id="noticias-gamer" className="my-5 px-3">
        <div className="container">
          <h2 className="texto-principal color-acento-azul mb-4 text-center">📰 Noticias Gamer</h2>

          <article className="card card-producto p-3 mb-3">
            <h5 className="card-title color-acento-verde">
              Lanzamiento sorpresa de un nuevo DLC de Cyberpunk 2077
            </h5>
            <p className="card-text"><strong>Fecha:</strong> 7 de septiembre de 2025</p>
            <p className="card-text">
              CD Projekt Red ha lanzado un DLC sorpresa para Cyberpunk 2077 que incluye nuevas misiones, 
              armas y vehículos.
            </p>
          </article>

          <article className="card card-producto p-3 mb-3">
            <h5 className="card-title color-acento-verde">
              Rumores sobre GTA VI: pistas desde Rockstar Games
            </h5>
            <p className="card-text"><strong>Fecha:</strong> 7 de septiembre de 2025</p>
            <p className="card-text">
              Varios insiders aseguran que Rockstar Games está preparando el lanzamiento del tráiler 
              oficial de GTA VI.
            </p>
          </article>

          <article className="card card-producto p-3 mb-3">
            <h5 className="card-title color-acento-verde">
              Torneos de eSports en Sudamérica baten récords de asistencia
            </h5>
            <p className="card-text"><strong>Fecha:</strong> 7 de septiembre de 2025</p>
            <p className="card-text">
              Este año, los torneos de eSports en Sudamérica han registrado una asistencia sin precedentes.
            </p>
          </article>
        </div>
      </section>

      {/* Llamada a la acción final */}
      <section className="text-center py-5">
        <div className="card card-formulario rounded-4 p-4">
          <h3 className="color-acento-azul mb-3">¿Listo para subir de nivel?</h3>
          <p className="mb-4">Explora nuestro catálogo completo y descubre los mejores productos gaming</p>
          <div className="row">
            <div className="col-md-3 mb-2">
              <Link to="/productos" className="btn btn-agregar-producto w-100">Productos</Link>
            </div>
            <div className="col-md-3 mb-2">
              <Link to="/comunidad" className="btn btn-outline-secondary w-100">Comunidad</Link>
            </div>
            <div className="col-md-3 mb-2">
              <Link to="/resenas" className="btn btn-outline-secondary w-100">Reseñas</Link>
            </div>
            <div className="col-md-3 mb-2">
              <Link to="/registro" className="btn btn-registrarse w-100">Únete Ya</Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Home;