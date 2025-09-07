const catalogo = document.getElementById("catalogo");

function formatearPrecio(valor) {
  return new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(valor);
}

function renderizarProductos(productos) {
  catalogo.innerHTML = ""; // limpiar antes de renderizar
  productos.forEach(p => {
    catalogo.innerHTML += `
        <div class="col">
            <div class="card shadow-sm h-100 p-2">
                <img src="${p.imagen}" class="card-img-top mb-3" alt="${p.nombre}">
                <div class="card-body d-flex flex-column">
                    <h5 class="card-title mb-2">${p.nombre}</h5>
                    <p class="card-text mb-2">${p.descripcion}</p>
        
                    <div class="d-flex justify-content-between mb-3">
                        <span class="fw-bold text-primary">${formatearPrecio(p.precio)}</span>
                        <span class="text-muted">${p.codigo}</span>
                    </div>
        
                    <div class="mt-auto">
                        <button class="btn btn-sm btn-outline-success w-100">Agregar al carrito</button>
                    </div>
                </div>
            </div>
        </div>
    `;
  });
}

// Leer archivo JSON usando fetch
fetch("assets/data/productos.json")
  .then(response => {
    if (!response.ok) {
      throw new Error("No se pudo cargar el JSON");
    }
    return response.json();
  })
  .then(data => {
    renderizarProductos(data);
  })
  .catch(error => console.error("Error cargando productos:", error));
