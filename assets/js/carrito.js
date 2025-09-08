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
    const producto = obtenerProducto(carrito[index].codigo);
    
    carrito[index].cantidad += cambio;
    
    if (carrito[index].cantidad <= 0) {
        eliminarProducto(index);
        return;
    }
    
    localStorage.setItem('carrito', JSON.stringify(carrito));
    CarritoContador.actualizar();
    
    // Notificación de cambio de cantidad
    NotificacionManager.info(
        `<strong>${producto.nombre}</strong><br>Cantidad actualizada: ${carrito[index].cantidad}`, 
        2000
    );
    
    renderizarCarrito();
    
    // Feedback visual
    productoDiv.style.transform = 'scale(1.05)';
    setTimeout(() => {
        if (productoDiv) productoDiv.style.transform = 'scale(1)';
    }, 200);
}

function eliminarProducto(index) {
    const productoDiv = document.querySelectorAll('.producto-carrito')[index];
    const producto = obtenerProducto(carrito[index].codigo);
    
    if (productoDiv) {
        productoDiv.classList.add('eliminando');
        setTimeout(() => {
            carrito.splice(index, 1);
            localStorage.setItem('carrito', JSON.stringify(carrito));
            CarritoContador.actualizar();
            
            NotificacionManager.info(
                `<strong>${producto.nombre}</strong> eliminado del carrito`, 
                2500
            );
            
            renderizarCarrito();
        }, 300);
    }
}

function vaciarCarrito() {
    ConfirmacionManager.confirmar(
        '¿Estás seguro de que quieres vaciar el carrito? Esta acción no se puede deshacer.',
        () => {
            carrito = [];
            localStorage.setItem('carrito', JSON.stringify(carrito));
            CarritoContador.actualizar();
            NotificacionManager.exito('Carrito vaciado correctamente');
            renderizarCarrito();
        },
        {
            titulo: 'Vaciar carrito',
            confirmar: 'Sí, vaciar',
            cancelar: 'Cancelar'
        }
    );
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
        
        NotificacionManager.exito(
            '🎉 <strong>Descuento DuocUC aplicado!</strong><br>20% de descuento en tu compra'
        );
    } else {
        NotificacionManager.error(
            '❌ <strong>Código inválido</strong><br>Prueba con: <code>DUOC20</code>'
        );
    }
});

// Finalizar compra
document.getElementById('btnFinalizarCompra').addEventListener('click', () => {
    if (carrito.length === 0) {
        NotificacionManager.advertencia('Tu carrito está vacío. Agrega productos antes de finalizar la compra.');
        return;
    }
    
    const total = document.getElementById('total').textContent;
    
    ConfirmacionManager.confirmar(
        `¿Confirmas tu compra por <strong>${total}</strong>?<br><br>Recibirás un email de confirmación con los detalles del pedido.`,
        () => {
            // Mostrar proceso de compra
            NotificacionManager.info(
                '⏳ <strong>Procesando tu compra...</strong><br>Por favor espera un momento',
                2000
            );
            
            setTimeout(() => {
                NotificacionManager.exito(
                    '🎉 <strong>¡Compra realizada exitosamente!</strong><br>📧 Recibirás confirmación por email<br>📦 Entrega en 3-5 días hábiles',
                    5000
                );
                
                // Limpiar carrito
                carrito = [];
                localStorage.setItem('carrito', JSON.stringify(carrito));
                CarritoContador.actualizar();
                renderizarCarrito();
            }, 2000);
        },
        {
            titulo: 'Finalizar compra',
            confirmar: 'Confirmar compra',
            cancelar: 'Seguir editando'
        }
    );
});

// Función global para agregar productos al carrito (sin alerts)
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
    CarritoContador.actualizar();
    
    // Notificación elegante
    NotificacionManager.exito(
        `<strong>${producto.nombre}</strong> agregado al carrito<br>Cantidad: ${itemExistente ? itemExistente.cantidad : 1}`
    );
}