'use strict';

// Esperar a que el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', () => {
    cargarProductosDestacados();
});

function cargarProductosDestacados() {
    // cargamos productos desde productos.json
    fetch('assets/data/productos.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('No se pudo cargar el archivo JSON');
            }
            return response.json();
        })
        .then(productos => {
            const container = document.getElementById("productosContainer");
            
            if (!container) {
                console.error('No se encontró el contenedor de productos');
                return;
            }

            // Limpiar contenedor
            container.innerHTML = '';

            // mostrar solo los primeros 3 productos
            productos.slice(0, 3).forEach(prod => {
                const div = document.createElement("div");
                div.classList.add("col-md-4", "mb-3");
                div.innerHTML = `
                    <div class="card card-producto h-100 text-center">
                        <img src="${prod.imagen}" class="card-img-top" alt="${prod.nombre}" 
                             style="height: 200px; object-fit: contain; cursor: pointer;" 
                             onclick="verDetalle('${prod.codigo}')">
                        <div class="card-body d-flex flex-column">
                            <h5 class="card-title color-acento-azul" style="cursor: pointer;" 
                                onclick="verDetalle('${prod.codigo}')">${prod.nombre}</h5>
                            <p class="card-text flex-grow-1">${prod.descripcion}</p>
                            <p class="precio fw-bold">$${prod.precio.toLocaleString('es-CL')}</p>
                            <p class="codigo small">Código: ${prod.codigo || 'N/A'}</p>
                            <div class="row g-2">
                                <div class="col-12">
                                    <button class="btn btn-outline-secondary w-100 btn-sm" 
                                            onclick="verDetalle('${prod.codigo}')">Ver Detalles</button>
                                </div>
                                <div class="col-12">
                                    <button class="btn btn-agregar-producto" 
                                            onclick="agregarAlCarrito('${prod.codigo}')">
                                        Agregar al Carrito
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                `;
                container.appendChild(div);
            });
        })
        .catch(error => {
            console.error("Error cargando productos:", error);
            const container = document.getElementById("productosContainer");
            if (container) {
                container.innerHTML = `
                    <div class="col-12">
                        <div class="alert alert-warning text-center">
                            <p>Error cargando productos destacados. Verifica la conexión.</p>
                        </div>
                    </div>
                `;
            }
        });
}

// Función para ver detalle del producto
function verDetalle(codigo) {
    window.location.href = `producto-detalle.html?codigo=${codigo}`;
}

// Función para agregar al carrito (reutilizable)
function agregarAlCarrito(codigo) {
    let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    const itemExistente = carrito.find(item => item.codigo === codigo);
    
    if (itemExistente) {
        itemExistente.cantidad += 1;
    } else {
        carrito.push({ codigo: codigo, cantidad: 1 });
    }
    
    localStorage.setItem('carrito', JSON.stringify(carrito));
    alert('Producto agregado al carrito');
}
