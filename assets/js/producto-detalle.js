'use strict';

let productoActual = null;
let productos = [];
let resenas = JSON.parse(localStorage.getItem('resenas')) || [];

// Obtener código del producto desde URL
function obtenerCodigoProducto() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('codigo');
}

// Formatear precio
function formatearPrecio(valor) {
    return new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(valor);
}

// Cargar producto y reseñas
fetch('assets/data/productos.json')
    .then(response => response.json())
    .then(data => {
        productos = data;
        const codigo = obtenerCodigoProducto();
        
        if (!codigo) {
            window.location.href = 'productos.html';
            return;
        }
        
        productoActual = productos.find(p => p.codigo === codigo);
        
        if (!productoActual) {
            NotificacionManager.error('Producto no encontrado');
            setTimeout(() => window.location.href = 'productos.html', 2000);
            return;
        }
        
        cargarProducto();
        cargarResenasProducto();
    })
    .catch(error => {
        console.error('Error cargando productos:', error);
        NotificacionManager.error('Error cargando el producto');
        setTimeout(() => window.location.href = 'productos.html', 2000);
    });

function obtenerProducto(codigo) {
    return productos.find(p => p.codigo === codigo);
}

function cargarProducto() {
    document.title = `${productoActual.nombre} - Level-Up Gamer`;
    document.getElementById('imagenProducto').src = productoActual.imagen;
    document.getElementById('imagenProducto').alt = productoActual.nombre;
    document.getElementById('categoriaProducto').textContent = productoActual.categoria;
    document.getElementById('nombreProducto').textContent = productoActual.nombre;
    document.getElementById('codigoProducto').textContent = `Código: ${productoActual.codigo}`;
    document.getElementById('precioProducto').textContent = formatearPrecio(productoActual.precio);
    document.getElementById('descripcionProducto').textContent = productoActual.descripcion;
}

function cargarResenasProducto() {
    const resenasProducto = resenas.filter(r => r.codigoProducto === productoActual.codigo);
    const contenedor = document.getElementById('resenaProducto');
    
    if (resenasProducto.length === 0) {
        contenedor.innerHTML = `
            <div class="text-center py-4">
                <p class="mb-0 text-light">Este producto aún no tiene reseñas. ¡Sé el primero en opinar!</p>
            </div>
        `;
        return;
    }
    
    contenedor.innerHTML = '';
    
    resenasProducto.forEach(resena => {
        const estrellas = '⭐'.repeat(resena.calificacion);
        const div = document.createElement('div');
        div.className = 'border-bottom pb-3 mb-3';
        div.innerHTML = `
            <div class="d-flex justify-content-between align-items-start mb-2">
                <div>
                    <strong class="color-acento-azul">${resena.nombreUsuario}</strong>
                    <div class="color-acento-verde">${estrellas} (${resena.calificacion}/5)</div>
                </div>
                <small class="text-muted">${resena.fecha}</small>
            </div>
            <p class="mb-0 text-light">"${resena.comentario}"</p>
        `;
        contenedor.appendChild(div);
    });
}

// Agregar al carrito
document.getElementById('btnAgregarCarrito').addEventListener('click', () => {
    const cantidad = parseInt(document.getElementById('cantidad').value);
    let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    
    const itemExistente = carrito.find(item => item.codigo === productoActual.codigo);
    
    if (itemExistente) {
        itemExistente.cantidad += cantidad;
    } else {
        carrito.push({ codigo: productoActual.codigo, cantidad: cantidad });
    }
    
    localStorage.setItem('carrito', JSON.stringify(carrito));
    CarritoContador.actualizar();
    
    // Usar el sistema de notificaciones
    NotificacionManager.exito(
        `<strong>${productoActual.nombre}</strong> agregado al carrito<br>Cantidad: ${cantidad}`
    );
});

// Formulario de reseña
document.getElementById('formResenaProducto').addEventListener('submit', (e) => {
    e.preventDefault();
    
    const calificacion = parseInt(document.getElementById('calificacionProducto').value);
    const nombreUsuario = document.getElementById('nombreUsuarioProducto').value.trim();
    const comentario = document.getElementById('comentarioProducto').value.trim();
    
    const nuevaResena = {
        id: Date.now(),
        codigoProducto: productoActual.codigo,
        nombreProducto: productoActual.nombre,
        imagenProducto: productoActual.imagen,
        calificacion: calificacion,
        nombreUsuario: nombreUsuario,
        comentario: comentario,
        fecha: new Date().toLocaleDateString('es-CL')
    };
    
    resenas.unshift(nuevaResena);
    localStorage.setItem('resenas', JSON.stringify(resenas));
    
    // Limpiar formulario
    document.getElementById('formResenaProducto').reset();
    
    // Recargar reseñas
    cargarResenasProducto();
    
    // Usar el sistema de notificaciones
    NotificacionManager.exito('🎉 ¡Reseña publicada exitosamente!');
});

// Función global para agregar productos al carrito (sin alerts)
function agregarAlCarrito(codigo) {
    const itemExistente = JSON.parse(localStorage.getItem('carrito'))?.find(item => item.codigo === codigo);
    const producto = obtenerProducto(codigo);
    
    if (!producto) return;
    
    let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    const existente = carrito.find(item => item.codigo === codigo);
    
    if (existente) {
        existente.cantidad += 1;
    } else {
        carrito.push({ codigo: codigo, cantidad: 1 });
    }
    
    localStorage.setItem('carrito', JSON.stringify(carrito));
    CarritoContador.actualizar();
    
    // Notificación elegante
    NotificacionManager.exito(
        `<strong>${producto.nombre}</strong> agregado al carrito<br>Cantidad: ${existente ? existente.cantidad : 1}`
    );
}