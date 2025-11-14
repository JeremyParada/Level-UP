import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import ProductCard from '../components/productos/ProductCard';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

const Products = () => {
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [productosFiltrados, setProductosFiltrados] = useState([]);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState('');
  const [busqueda, setBusqueda] = useState('');
  const [loading, setLoading] = useState(true);

  // Cargar productos desde la API
  const cargarProductos = useCallback(async () => {
    try {
      const response = await axios.get(`${API_URL}/productos`);
      setProductos(response.data);
      setProductosFiltrados(response.data);
      setLoading(false);
    } catch (err) {
      console.error('Error cargando productos:', err);
      setLoading(false);
    }
  }, []);

  // Cargar categorías desde la API
  const cargarCategorias = useCallback(async () => {
    try {
      const response = await axios.get(`${API_URL}/productos/categorias`);
      setCategorias(response.data);
    } catch (err) {
      console.error('Error cargando categorías:', err);
    }
  }, []);

  // Filtrar productos según la categoría y la búsqueda
  const filtrarProductos = useCallback(() => {
    let resultados = [...productos];

    if (categoriaSeleccionada) {
      resultados = resultados.filter(p => p.categoria === categoriaSeleccionada);
    }

    if (busqueda.trim()) {
      const termino = busqueda.toLowerCase();
      resultados = resultados.filter(
        p =>
          p.nombre.toLowerCase().includes(termino) ||
          p.descripcion.toLowerCase().includes(termino) ||
          p.codigo.toLowerCase().includes(termino)
      );
    }

    setProductosFiltrados(resultados);
  }, [categoriaSeleccionada, busqueda, productos]);

  // Efectos para cargar datos y filtrar productos
  useEffect(() => {
    cargarProductos();
    cargarCategorias();
  }, [cargarProductos, cargarCategorias]);

  useEffect(() => {
    filtrarProductos();
  }, [filtrarProductos]);

  // Manejar la búsqueda
  const handleBuscar = (e) => {
    e.preventDefault();
    filtrarProductos();
  };

  if (loading) {
    return <div>Cargando productos...</div>;
  }

  return (
    <main>
      <section className="text-center fondo-catalogo">
        <div className="row py-lg-5 fondo-texto-catalogo">
          <div className="col-lg-6 col-md-8 mx-auto">
            <h1 className="texto-principal">Catálogo de productos</h1>
          </div>
        </div>
      </section>

      <section className="container my-4">
        <div className="row g-2 justify-content-center">
          <div className="col-12 col-md-3">
            <select
              className="form-select"
              value={categoriaSeleccionada}
              onChange={(e) => setCategoriaSeleccionada(e.target.value)}
            >
              <option value="">Todas las categorías</option>
              {categorias.map(cat => (
                <option key={cat.ID_CATEGORIA} value={cat.NOMBRE_CATEGORIA}>
                  {cat.NOMBRE_CATEGORIA}
                </option>
              ))}
            </select>
          </div>

          <div className="col-12 col-md-6">
            <form onSubmit={handleBuscar}>
              <div className="input-group">
                <input
                  type="text"
                  className="form-control"
                  placeholder="¿Qué producto quieres?"
                  value={busqueda}
                  onChange={(e) => setBusqueda(e.target.value)}
                />
                <button type="submit" className="btn" id="btnBuscarProducto">
                  Buscar producto
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>

      <section>
        <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-3 px-5 pb-5">
          {productosFiltrados.length > 0 ? (
            productosFiltrados.map(producto => (
              <div key={producto.codigo} className="col">
                <ProductCard producto={producto} />
              </div>
            ))
          ) : (
            <div className="col-12 text-center py-5">
              <h4 className="color-acento-verde">No se encontraron productos</h4>
              <p>Intenta con otros términos de búsqueda</p>
            </div>
          )}
        </div>
      </section>
    </main>
  );
};

export default Products;