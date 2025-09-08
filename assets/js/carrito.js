/js/carrito.js
'use strict';

let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
let productos = [];
let descuentoAplicado = false;

// Formatear precio
function formatearPrecio(valor) {
    return new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(valor);
}

// Cargar productos
fetch('assets/data/productos.json')
    .then(response => response.json())
    .then(data => {
        productos = data;
        renderizarCarrito();
    })
    .catch(error => console.error('Error cargando productos:', error));

function obtenerProducto(codigo) {
    return productos.find(p => p.codigo === codigo);
}

function renderizarCarrito() {
    const contenedor = document.getElementById('productosCarrito');
    
    if (carrito.length === 0) {
        contenedor.innerHTML = `
            <div class="text-center py-5">
                <p class="mb-3">Tu carrito está vacío</p>
                <a href="productos.html" class="btn btn-registrarse">Ver Productos</a>
            </div>
        `;
        actualizarTotales();
        return;
    }
    
    contenedor.innerHTML = '';
    
    carrito.forEach((item, index) => {
        const producto = obtenerProducto(item.codigo);
        if (!producto) return;
        
        const div = document.createElement('div');
        div.className = 'row align-items-center py-3 border-bottom';
        div.innerHTML = `
            <div class="col-md-2">
                <img src="${producto.imagen}" alt="${producto.nombre}" class="img-fluid rounded" style="height: 80px; object-fit: contain;">
            </div>
            <div class="col-md-4">
                <h6 class="mb-1 color-acento-azul">${producto.nombre}</h6>
                <small class="text-muted">${producto.codigo}</small>
            </div>
            <div class="col-md-2">
                <div class="input-group input-group-sm">
                    <button class="btn btn-outline-secondary" type="button" onclick="cambiarCantidad(${index}, -1)">-</button>
                    <input type="text" class="form-control text-center" value="${item.cantidad}" readonly>
                    <button class="btn btn-outline-secondary" type="button" onclick="cambiarCantidad(${index}, 1)">+</button>
                </div>
            </div>
            <div class="col-md-2">
                <span class="color-acento-verde fw-bold">${formatearPrecio(producto.precio)}</span>
            </div>
            <div class="col-md-2">
                <span class="color-acento-verde fw-bold">${formatearPrecio(producto.precio * item.cantidad)}</span>
            </div>
            <div class="col-md-12 col-lg-auto mt-2 mt-lg-0">
                <button class="btn btn-sm btn-outline-danger" onclick="eliminarProducto(${index})">🗑️</button>
            </div>
        `;
        contenedor.appendChild(div);
    });
    
    actualizarTotales();
}

function cambiarCantidad(index, cambio) {
    carrito[index].cantidad += cambio;
    
    if (carrito[index].cantidad <= 0) {
        carrito.splice(index, 1);
    }
    
    localStorage.setItem('carrito', JSON.stringify(carrito));
    renderizarCarrito();
}

function eliminarProducto(index) {
    carrito.splice(index, 1);
    localStorage.setItem('carrito', JSON.stringify(carrito));
    renderizarCarrito();
}

function actualizarTotales() {
    let subtotal = 0;
    
    carrito.forEach(item => {
        const producto = obtenerProducto(item.codigo);
        if (producto) {
            subtotal += producto.precio * item.cantidad;
        }
    });
    
    const envio = carrito.length > 0 ? 5990 : 0;
    let descuento = 0;
    
    if (descuentoAplicado) {
        descuento = Math.floor(subtotal * 0.2); // 20% descuento
        document.getElementById('descuentoContainer').style.display = 'flex';
        document.getElementById('descuento').textContent = formatearPrecio(descuento);
    } else {
        document.getElementById('descuentoContainer').style.display = 'none';
    }
    
    const total = subtotal + envio - descuento;
    
    document.getElementById('subtotal').textContent = formatearPrecio(subtotal);
    document.getElementById('envio').textContent = formatearPrecio(envio);
    document.getElementById('total').textContent = formatearPrecio(total);
}

// Aplicar descuento
document.getElementById('aplicarDescuento').addEventListener('click', () => {
    const codigo = document.getElementById('codigoDescuento').value.trim().toUpperCase();
    
    if (codigo === 'DUOC20') {
        descuentoAplicado = true;
        document.getElementById('codigoDescuento').disabled = true;
        document.getElementById('aplicarDescuento').textContent = '✓ Aplicado';
        document.getElementById('aplicarDescuento').disabled = true;
        actualizarTotales();
        alert('¡Descuento DuocUC aplicado correctamente!');
    } else {
        alert('Código de descuento inválido');
    }
});

// Finalizar compra
document.getElementById('btnFinalizarCompra').addEventListener('click', () => {
    if (carrito.length === 0) {
        alert('Tu carrito está vacío');
        return;
    }
    
    // Simular proceso de compra
    alert('¡Compra realizada exitosamente! Recibirás un email de confirmación.');
    
    // Limpiar carrito
    carrito = [];
    localStorage.setItem('carrito', JSON.stringify(carrito));
    renderizarCarrito();
});

// Función global para agregar productos al carrito
function agregarAlCarrito(codigo) {
    const itemExistente = carrito.find(item => item.codigo === codigo);
    
    if (itemExistente) {
        itemExistente.cantidad += 1;
    } else {
        carrito.push({ codigo: codigo, cantidad: 1 });
    }
    
    localStorage.setItem('carrito', JSON.stringify(carrito));
    alert('Producto agregado al carrito');
}