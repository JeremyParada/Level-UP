// cargamos productos desde productos.json
fetch('assets/data/productos.json')
    .then(response => response.json())
    .then(productos => {
        const container = document.getElementById("productosContainer");

        // mostrar solo los primeros 3 productos
        productos.slice(0, 3).forEach(prod => {
            const div = document.createElement("div");
            div.classList.add("col-md-4", "mb-3");
            div.innerHTML = `
                <div class="card card-producto h-100 text-center">
                    <img src="${prod.imagen}" class="card-img-top" alt="${prod.nombre}">
                    <div class="card-body">
                        <h5 class="card-title">${prod.nombre}</h5>
                        <p class="card-text">Precio: $${prod.precio.toLocaleString()}</p>
                        <p class="codigo">Código: ${prod.codigo || 'N/A'}</p>
                        <button class="btn btn-agregar-producto">Comprar</button>
                    </div>
                </div>
            `;
            container.appendChild(div);
        });
    })
    .catch(error => console.error("Error cargando productos:", error));
