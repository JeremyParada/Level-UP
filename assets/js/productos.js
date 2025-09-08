const catalogo = document.getElementById("catalogo");
const buscador = document.getElementById("buscador");
const btnBuscarProducto = document.getElementById("btnBuscarProducto");

let productosGlobal = []; // variable global para guardar todos los productos

function formatearPrecio(valor) {
    return new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(valor);
}

// funcion normalizar texto (limpia mayusculas y tildes)
function normalizarTexto(texto) {
    return texto
        .normalize("NFD") // descompone letras y tildes
        .replace(/[\u0300-\u036f]/g, "") // elimina tildes (diacriticos) por regex
        .toLowerCase(); // convierte todo a minuscula
}

function renderizarProductos(productos) {
    catalogo.innerHTML = ""; // limpiar antes de renderizar

    if (productos.length === 0) {
        catalogo.innerHTML = `<p class="text-center">No se encontraron productos</p>`; // en caso que no retorne nada
        return;
    }

    productos.forEach(p => {
        catalogo.innerHTML += `
        <div class="col">
            <div class="card card-producto h-100 shadow-sm rounded-4">
                <img src="${p.imagen}" class="card-img-top mb-3 rounded-top" alt="${p.nombre}" style="cursor: pointer;" onclick="verDetalle('${p.codigo}')">
                <div class="card-body d-flex flex-column">
                    <h5 class="card-title mb-2" style="cursor: pointer;" onclick="verDetalle('${p.codigo}')">${p.nombre}</h5>
                    <p class="card-text mb-3">${p.descripcion}</p>
        
                    <div class="mt-auto">
                        <div class="d-flex justify-content-between mb-2">
                            <span class="precio fw-bold">${formatearPrecio(p.precio)}</span>
                            <span class="codigo">${p.codigo}</span>
                        </div>
                        <div class="row g-2">
                            <div class="col-12">
                                <button class="btn btn-outline-secondary w-100 btn-sm" onclick="verDetalle('${p.codigo}')">Ver Detalles</button>
                            </div>
                            <div class="col-12">
                                <button class="btn btn-agregar-producto w-100" onclick="agregarAlCarrito('${p.codigo}')">Agregar al carrito</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        `;
    });
}

// Función para ver detalle del producto
function verDetalle(codigo) {
    window.location.href = `producto-detalle.html?codigo=${codigo}`;
}

// Función global para agregar productos al carrito
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

// Leer archivo JSON usando fetch
fetch("assets/data/productos.json")
    .then(response => {
        if (!response.ok) { // si la respuesta no es OK
            throw new Error("No se pudo cargar el JSON");
        }
        return response.json();
    })
    .then(data => {
        productosGlobal = data;       // guardamos todos los productos
        renderizarProductos(data);    // mostramos todos al inicio

        // llenar select de categorias (el del html)
        const filtroCategoriaProducto = document.getElementById("filtroCategoriaProducto");
        const categorias = [...new Set(data.map(p => p.categoria))]; // para obtener una lista unica de categorias
        categorias.forEach(cat => {
            const option = document.createElement("option");
            option.value = cat;
            option.textContent = cat;
            filtroCategoriaProducto.appendChild(option);
        });
    })
    .catch(error => console.error("Error cargando productos:", error));

// funcion busqueda
function buscarProductos() {
    const texto = normalizarTexto(buscador.value.trim()); // trim quita los espacios al inicio-fin. Esto trae el texto del buscador "limpio"
    const categoriaSeleccionada = document.getElementById("filtroCategoriaProducto").value; // categoria seleccionada

    const resultados = productosGlobal.filter(p => {
        // primero las condiciones del buscador
        const cumpleTexto = normalizarTexto(p.nombre).includes(texto) || normalizarTexto(p.descripcion).includes(texto) || normalizarTexto(p.codigo).includes(texto);

        // segundo las condiciones de la categoria
        const cumpleCategoria = (categoriaSeleccionada === "") || (categoriaSeleccionada === p.categoria);

        return cumpleTexto && cumpleCategoria; // por cada producto
    });

    renderizarProductos(resultados); // se renderiza con los filtros (o no filtros) aplicados
}
// categorias cambian al ser seleccionadas
document.getElementById("filtroCategoriaProducto").addEventListener("change", buscarProductos);

// click boton buscar
btnBuscarProducto.addEventListener("click", buscarProductos);

// tambien puede usar enter
buscador.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
        buscarProductos();
    }
});
