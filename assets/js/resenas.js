'use strict';

let productos = [];
let resenas = JSON.parse(localStorage.getItem('resenas')) || [];

// Cargar productos para el select
fetch('assets/data/productos.json')
    .then(response => response.json())
    .then(data => {
        productos = data;
        const selectProducto = document.getElementById('nombreProducto');
        
        productos.forEach(producto => {
            const option = document.createElement('option');
            option.value = producto.codigo;
            option.textContent = producto.nombre;
            selectProducto.appendChild(option);
        });
        
        renderizarResenas();
    })
    .catch(error => console.error('Error cargando productos:', error));

// Manejar envío de formulario
document.getElementById('formResena').addEventListener('submit', (e) => {
    e.preventDefault();
    
    const codigoProducto = document.getElementById('nombreProducto').value;
    const calificacion = parseInt(document.getElementById('calificacion').value);
    const nombreUsuario = document.getElementById('nombreUsuario').value.trim();
    const comentario = document.getElementById('comentario').value.trim();
    
    const producto = productos.find(p => p.codigo === codigoProducto);
    
    const nuevaResena = {
        id: Date.now(),
        codigoProducto: codigoProducto,
        nombreProducto: producto.nombre,
        imagenProducto: producto.imagen,
        calificacion: calificacion,
        nombreUsuario: nombreUsuario,
        comentario: comentario,
        fecha: new Date().toLocaleDateString('es-CL')
    };
    
    resenas.unshift(nuevaResena); // Agregar al inicio
    localStorage.setItem('resenas', JSON.stringify(resenas));
    
    // Limpiar formulario
    document.getElementById('formResena').reset();
    
    // Renderizar reseñas
    renderizarResenas();
    
    // Usar el sistema de notificaciones
    NotificacionManager.exito('🎉 ¡Reseña publicada exitosamente!');
});

function renderizarResenas() {
    const listaResenas = document.getElementById('listaResenas');
    
    if (resenas.length === 0) {
        listaResenas.innerHTML = `
            <div class="col-12">
                <div class="card card-producto p-4 text-center">
                    <p class="mb-0">Aún no hay reseñas. ¡Sé el primero en compartir tu opinión!</p>
                </div>
            </div>
        `;
        return;
    }
    
    listaResenas.innerHTML = '';
    
    resenas.forEach(resena => {
        const estrellas = '⭐'.repeat(resena.calificacion);
        
        const div = document.createElement('div');
        div.className = 'col-md-6 mb-4';
        div.innerHTML = `
            <div class="card card-producto h-100">
                <div class="card-body">
                    <div class="d-flex align-items-center mb-3">
                        <img src="${resena.imagenProducto}" alt="${resena.nombreProducto}" style="width: 60px; height: 60px; object-fit: contain;" class="me-3 rounded">
                        <div>
                            <h6 class="card-title mb-0 color-acento-azul">${resena.nombreProducto}</h6>
                            <small class="color-acento-verde">${estrellas} (${resena.calificacion}/5)</small>
                        </div>
                    </div>
                    <p class="card-text">"${resena.comentario}"</p>
                    <div class="d-flex justify-content-between">
                        <small class="color-acento-verde">- ${resena.nombreUsuario}</small>
                        <small class="text-muted">${resena.fecha}</small>
                    </div>
                </div>
            </div>
        `;
        listaResenas.appendChild(div);
    });
}