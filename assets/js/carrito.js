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
    const btnVaciar = document.getElementById('btnVaciarCarrito');
    
    if (carrito.length === 0) {
        contenedor.innerHTML = `
            <div class="carrito-vacio">
                <div class="icono-carrito">🛒</div>
                <h4 class="color-acento-azul mb-3">Tu carrito está vacío</h4>
                <p class="mb-4">¡Descubre nuestros increíbles productos gaming!</p>
                <a href="productos.html" class="btn btn-registrarse btn-lg">
                    🎮 Explorar Productos
                </a>
            </div>
        `;
        btnVaciar.style.display = 'none';
        actualizarTotales();
        return;
    }
    
    btnVaciar.style.display = 'block';
    contenedor.innerHTML = '';
    
    carrito.forEach((item, index) => {
        const producto = obtenerProducto(item.codigo);
        if (!producto) return;
        
        const subtotalProducto = producto.precio * item.cantidad;
        
        const div = document.createElement('div');
        div.className = 'producto-carrito';
        div.innerHTML = `
            <div class="row align-items-center">
                <!-- Imagen del producto -->
                <div class="col-12 col-lg-2 text-center mb-3 mb-lg-0">
                    <img src="${producto.imagen}" alt="${producto.nombre}" 
                         class="img-fluid" style="width: 80px; height: 80px; object-fit: contain;">
                </div>
                
                <!-- Información del producto -->
                <div class="col-12 col-lg-3 mb-3 mb-lg-0">
                    <div class="producto-info">
                        <h6 class="mb-1">${producto.nombre}</h6>
                        <div class="producto-codigo">Código: ${producto.codigo}</div>
                        <div class="d-lg-none mt-2">
                            <span class="precio-unitario">${formatearPrecio(producto.precio)}</span> c/u
                        </div>
                    </div>
                </div>
                
                <!-- Precio unitario (solo desktop) -->
                <div class="col-lg-2 d-none d-lg-block text-center">
                    <div class="precio-unitario">${formatearPrecio(producto.precio)}</div>
                </div>
                
                <!-- Controles de cantidad -->
                <div class="col-12 col-lg-2 mb-3 mb-lg-0">
                    <div class="cantidad-control d-flex align-items-center justify-content-center">
                        <button class="btn btn-outline-secondary" type="button" 
                                onclick="cambiarCantidad(${index}, -1)" 
                                ${item.cantidad <= 1 ? 'disabled' : ''}>−</button>
                        <input type="text" class="form-control mx-2" value="${item.cantidad}" readonly>
                        <button class="btn btn-outline-secondary" type="button" 
                                onclick="cambiarCantidad(${index}, 1)">+</button>
                    </div>
                </div>
                
                <!-- Subtotal -->
                <div class="col-6 col-lg-2 text-center">
                    <div class="precio-subtotal">${formatearPrecio(subtotalProducto)}</div>
                    <small class="text-muted d-lg-none">Subtotal</small>
                </div>
                
                <!-- Botón eliminar -->
                <div class="col-6 col-lg-1 text-center">
                    <button class="btn-eliminar" onclick="eliminarProducto(${index})" 
                            title="Eliminar producto">
                        🗑️
                    </button>
                </div>
            </div>
        `;
        
        // Añadir animación
        div.classList.add('nuevo');
        setTimeout(() => div.classList.remove('nuevo'), 500);
        
        contenedor.appendChild(div);
    });
    
    actualizarTotales();
}

function cambiarCantidad(index, cambio) {
    const productoDiv = document.querySelectorAll('.producto-carrito')[index];
    
    carrito[index].cantidad += cambio;
    
    if (carrito[index].cantidad <= 0) {
        eliminarProducto(index);
        return;
    }
    
    localStorage.setItem('carrito', JSON.stringify(carrito));
    renderizarCarrito();
    
    // Feedback visual
    productoDiv.style.transform = 'scale(1.05)';
    setTimeout(() => {
        if (productoDiv) productoDiv.style.transform = 'scale(1)';
    }, 200);
}

function eliminarProducto(index) {
    const productoDiv = document.querySelectorAll('.producto-carrito')[index];
    
    if (productoDiv) {
        productoDiv.classList.add('eliminando');
        setTimeout(() => {
            carrito.splice(index, 1);
            localStorage.setItem('carrito', JSON.stringify(carrito));
            renderizarCarrito();
        }, 300);
    }
}

function vaciarCarrito() {
    if (confirm('¿Estás seguro de que quieres vaciar el carrito?')) {
        carrito = [];
        localStorage.setItem('carrito', JSON.stringify(carrito));
        renderizarCarrito();
    }
}

function actualizarTotales() {
    let subtotal = 0;
    let totalProductos = 0;
    
    carrito.forEach(item => {
        const producto = obtenerProducto(item.codigo);
        if (producto) {
            subtotal += producto.precio * item.cantidad;
            totalProductos += item.cantidad;
        }
    });
    
    const envio = carrito.length > 0 ? (subtotal >= 50000 ? 0 : 5990) : 0;
    let descuento = 0;
    
    if (descuentoAplicado) {
        descuento = Math.floor(subtotal * 0.2);
        document.getElementById('descuentoContainer').style.display = 'flex';
        document.getElementById('descuento').textContent = formatearPrecio(descuento);
    } else {
        document.getElementById('descuentoContainer').style.display = 'none';
    }
    
    const total = subtotal + envio - descuento;
    
    // Actualizar elementos del DOM
    document.getElementById('totalProductos').textContent = `${totalProductos} ${totalProductos === 1 ? 'producto' : 'productos'}`;
    document.getElementById('subtotal').textContent = formatearPrecio(subtotal);
    document.getElementById('envio').textContent = envio === 0 ? 'GRATIS' : formatearPrecio(envio);
    document.getElementById('total').textContent = formatearPrecio(total);
    
    // Mostrar información de envío gratis
    const infoEnvio = document.querySelector('.info-envio small');
    if (infoEnvio) {
        if (subtotal >= 50000) {
            infoEnvio.innerHTML = '🎉 <strong>¡Envío gratis aplicado!</strong><br>🚚 Entrega en 3-5 días hábiles';
        } else {
            const faltante = 50000 - subtotal;
            infoEnvio.innerHTML = `📦 Envío gratis en compras sobre $50.000<br>💰 Te faltan ${formatearPrecio(faltante)} para envío gratis<br>🚚 Entrega en 3-5 días hábiles`;
        }
    }
}

// Aplicar descuento
document.getElementById('aplicarDescuento').addEventListener('click', () => {
    const codigo = document.getElementById('codigoDescuento').value.trim().toUpperCase();
    
    if (codigo === 'DUOC20') {
        descuentoAplicado = true;
        document.getElementById('codigoDescuento').disabled = true;
        const btnAplicar = document.getElementById('aplicarDescuento');
        btnAplicar.textContent = '✅ Aplicado';
        btnAplicar.disabled = true;
        btnAplicar.classList.remove('btn-outline-secondary');
        btnAplicar.classList.add('btn-success');
        actualizarTotales();
        
        // Mostrar mensaje de éxito
        const mensaje = document.createElement('div');
        mensaje.className = 'alert alert-success mt-2';
        mensaje.innerHTML = '🎉 ¡Descuento DuocUC del 20% aplicado correctamente!';
        document.getElementById('codigoDescuento').parentNode.parentNode.appendChild(mensaje);
        setTimeout(() => mensaje.remove(), 5000);
    } else {
        // Mostrar mensaje de error
        const mensaje = document.createElement('div');
        mensaje.className = 'alert alert-danger mt-2';
        mensaje.innerHTML = '❌ Código de descuento inválido. Prueba con: DUOC20';
        document.getElementById('codigoDescuento').parentNode.parentNode.appendChild(mensaje);
        setTimeout(() => mensaje.remove(), 3000);
    }
});

// Finalizar compra
document.getElementById('btnFinalizarCompra').addEventListener('click', () => {
    if (carrito.length === 0) {
        alert('Tu carrito está vacío');
        return;
    }
    
    const total = document.getElementById('total').textContent;
    const confirmacion = confirm(`¿Confirmas tu compra por ${total}?\n\nRecibirás un email de confirmación con los detalles del pedido.`);
    
    if (confirmacion) {
        // Simular proceso de compra
        const procesando = document.createElement('div');
        procesando.className = 'alert alert-info text-center';
        procesando.innerHTML = `
            <div class="spinner-border spinner-border-sm me-2" role="status"></div>
            Procesando tu compra...
        `;
        document.getElementById('btnFinalizarCompra').parentNode.appendChild(procesando);
        
        setTimeout(() => {
            procesando.remove();
            alert('🎉 ¡Compra realizada exitosamente!\n\n✅ Recibirás un email de confirmación\n📦 Tu pedido llegará en 3-5 días hábiles\n🎮 ¡Gracias por elegir Level-UP Gamer!');
            
            // Limpiar carrito
            carrito = [];
            localStorage.setItem('carrito', JSON.stringify(carrito));
            renderizarCarrito();
        }, 2000);
    }
});

// Función global para agregar productos al carrito (con mejores notificaciones)
function agregarAlCarrito(codigo) {
    const itemExistente = carrito.find(item => item.codigo === codigo);
    const producto = obtenerProducto(codigo);
    
    if (!producto) return;
    
    if (itemExistente) {
        itemExistente.cantidad += 1;
    } else {
        carrito.push({ codigo: codigo, cantidad: 1 });
    }
    
    localStorage.setItem('carrito', JSON.stringify(carrito));
    
    // Notificación mejorada
    const mensaje = document.createElement('div');
    mensaje.className = 'alert alert-success position-fixed top-0 end-0 m-3';
    mensaje.style.zIndex = '9999';
    mensaje.innerHTML = `
        ✅ <strong>${producto.nombre}</strong> agregado al carrito<br>
        <small>Cantidad: ${itemExistente ? itemExistente.cantidad : 1}</small>
    `;
    document.body.appendChild(mensaje);
    
    setTimeout(() => mensaje.remove(), 3000);
}