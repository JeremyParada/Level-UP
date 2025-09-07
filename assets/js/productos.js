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
    .normalize("NFD") // separa letras y tildes
    .replace(/[\u0300-\u036f]/g, "") // elimina tildes
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
            <img src="${p.imagen}" class="card-img-top mb-3 rounded-top" alt="${p.nombre}">
            <div class="card-body d-flex flex-column">
                <h5 class="card-title mb-2">${p.nombre}</h5>
                <p class="card-text mb-3">${p.descripcion}</p>
    
                <div class="mt-auto">
                    <div class="d-flex justify-content-between mb-2">
                        <span class="precio fw-bold">${formatearPrecio(p.precio)}</span>
                        <span class="codigo">${p.codigo}</span>
                    </div>
                    <button class="btn btn-agregar-producto w-100">Agregar al carrito</button>
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
    if (!response.ok) { // si la respuesta no es OK
      throw new Error("No se pudo cargar el JSON");
    }
    return response.json();
  })
  .then(data => {
    productosGlobal = data;       // guardamos todos los productos
    renderizarProductos(data);    // mostramos todos al inicio
  })
  .catch(error => console.error("Error cargando productos:", error));

// funcion busqueda
function buscarProductos() {
  const texto = normalizarTexto(buscador.value.trim()); // trim quita los espacios al inicio-fin. Esto trae el texto del buscador "limpio"

  if (texto === "") {
    renderizarProductos(productosGlobal); // si vacio, mostrar todos (recordemos que ya estaba todo el json guardado)
  } else {
    const resultados = productosGlobal.filter(p => // filter: metodo de arrays que crea un nuevo array solo con los elementos que cumplan alguna de las condiciones aplicadas
      normalizarTexto(p.nombre).includes(texto) || normalizarTexto(p.descripcion).includes(texto) || normalizarTexto(p.codigo).includes(texto)
    );
    renderizarProductos(resultados); // se renderiza con los filtros (o no filtros) aplicados
  }
}

// click boton buscar
btnBuscarProducto.addEventListener("click", buscarProductos);

// tambien puede usar enter
buscador.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    buscarProductos();
  }
});
