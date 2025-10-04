import React, { useState, useEffect } from 'react';
import ProductCard from '../components/productos/ProductCard';

const Products = () => {
  const [productos, setProductos] = useState([]);
  const [productosFiltrados, setProductosFiltrados] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState('');
  const [busqueda, setBusqueda] = useState('');

  useEffect(() => {
    fetch('/assets/data/productos.json')
      .then(res => res.json())
      .then(data => {
        setProductos(data);
        setProductosFiltrados(data);
        const categoriasUnicas = [...new Set(data.map(p => p.categoria))];
        setCategorias(categoriasUnicas);
      })
      .catch(err => console.error('Error cargando productos:', err));
  }, []);

  useEffect(() => {
    filtrarProductos();
  }, [categoriaSeleccionada, busqueda, productos]);

  const filtrarProductos = () => {
    let resultados = [...productos];

    if (categoriaSeleccionada) {
      resultados = resultados.filter(p => p.categoria === categoriaSeleccionada);
    }

    if (busqueda.trim()) {
      const termino = busqueda.toLowerCase();
      resultados = resultados.filter(p => 
        p.nombre.toLowerCase().includes(termino) ||
        p.descripcion.toLowerCase().includes(termino) ||
        p.codigo.toLowerCase().includes(termino)
      );
    }

    setProductosFiltrados(resultados);
  };

  const handleBuscar = (e) => {
    e.preventDefault();
    filtrarProductos();
  };

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
                <option key={cat} value={cat}>{cat}</option>
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