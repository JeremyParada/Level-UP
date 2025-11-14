'use strict';

// Datos del perfil
let perfilUsuario = JSON.parse(localStorage.getItem('perfilUsuario')) || {
    nombre: '',
    apellido: '',
    email: '',
    gamerTag: '',
    fechaNacimiento: '',
    telefono: '',
    juegoFavorito: '',
    puntos: 0,
    nivel: 1,
    codigoReferido: 'GAMER' + Math.random().toString(36).substr(2, 6).toUpperCase(),
    fechaRegistro: new Date().toISOString()
};

// Historial de compras simulado
let historialCompras = JSON.parse(localStorage.getItem('historialCompras')) || [];

// Cargar datos del perfil al iniciar
document.addEventListener('DOMContentLoaded', () => {
    cargarDatosPerfil();
    actualizarNivel();
    cargarDescuentos();
    cargarHistorialCompras();
});

function cargarDatosPerfil() {
    document.getElementById('perfilNombre').value = perfilUsuario.nombre;
    document.getElementById('perfilApellido').value = perfilUsuario.apellido;
    document.getElementById('perfilEmail').value = perfilUsuario.email;
    document.getElementById('perfilGamerTag').value = perfilUsuario.gamerTag;
    document.getElementById('perfilFechaNacimiento').value = perfilUsuario.fechaNacimiento;
    document.getElementById('perfilTelefono').value = perfilUsuario.telefono;
    document.getElementById('perfilJuegoFavorito').value = perfilUsuario.juegoFavorito;
    document.getElementById('codigoReferido').textContent = perfilUsuario.codigoReferido;
}

// Manejar actualización del perfil
document.getElementById('formPerfil').addEventListener('submit', (e) => {
    e.preventDefault();
    
    perfilUsuario.nombre = document.getElementById('perfilNombre').value.trim();
    perfilUsuario.apellido = document.getElementById('perfilApellido').value.trim();
    perfilUsuario.email = document.getElementById('perfilEmail').value.trim();
    perfilUsuario.gamerTag = document.getElementById('perfilGamerTag').value.trim();
    perfilUsuario.fechaNacimiento = document.getElementById('perfilFechaNacimiento').value;
    perfilUsuario.telefono = document.getElementById('perfilTelefono').value.trim();
    perfilUsuario.juegoFavorito = document.getElementById('perfilJuegoFavorito').value.trim();
    
    localStorage.setItem('perfilUsuario', JSON.stringify(perfilUsuario));
    
    // Usar el sistema de notificaciones
    NotificacionManager.exito('✅ ¡Perfil actualizado exitosamente!');
});

function actualizarNivel() {
    const puntos = perfilUsuario.puntos;
    const nivel = Math.floor(puntos / 100) + 1;
    const puntosProximoNivel = (nivel * 100) - puntos;
    const progreso = (puntos % 100);
    
    perfilUsuario.nivel = nivel;
    
    document.getElementById('nivelActual').textContent = nivel;
    document.getElementById('puntosActuales').textContent = puntos;
    document.getElementById('puntosProximoNivel').textContent = puntosProximoNivel;
    document.getElementById('barraProgreso').style.width = progreso + '%';
    
    localStorage.setItem('perfilUsuario', JSON.stringify(perfilUsuario));
}

function cargarDescuentos() {
    const contenedor = document.getElementById('descuentosActivos');
    const email = perfilUsuario.email.toLowerCase();
    
    let descuentos = [];
    
    // Descuento DuocUC
    if (email.endsWith('@duoc.cl') || email.endsWith('@duocuc.cl')) {
        descuentos.push({
            titulo: 'Descuento DuocUC',
            descripcion: '20% de descuento de por vida',
            codigo: 'DUOC20',
            tipo: 'permanente'
        });
    }
    
    // Descuentos por nivel
    if (perfilUsuario.nivel >= 5) {
        descuentos.push({
            titulo: 'Gamer Veterano',
            descripcion: '15% de descuento en accesorios',
            codigo: 'VETERAN15',
            tipo: 'nivel'
        });
    }
    
    if (perfilUsuario.nivel >= 10) {
        descuentos.push({
            titulo: 'Pro Gamer',
            descripcion: '25% de descuento en hardware',
            codigo: 'PRO25',
            tipo: 'nivel'
        });
    }
    
    if (descuentos.length === 0) {
        contenedor.innerHTML = '<p class="text-muted">No tienes descuentos activos</p>';
        return;
    }
    
    contenedor.innerHTML = '';
    descuentos.forEach(descuento => {
        const div = document.createElement('div');
        div.className = 'mb-3 p-2 border rounded';
        div.innerHTML = `
            <h6 class="color-acento-verde mb-1">${descuento.titulo}</h6>
            <p class="small mb-1">${descuento.descripcion}</p>
            <code class="small">${descuento.codigo}</code>
        `;
        contenedor.appendChild(div);
    });
}

function cargarHistorialCompras() {
    const contenedor = document.getElementById('historialCompras');
    
    if (historialCompras.length === 0) {
        contenedor.innerHTML = `
            <div class="text-center py-4">
                <p class="mb-3">Aún no has realizado compras</p>
                <a href="productos.html" class="btn btn-registrarse">Ver Productos</a>
            </div>
        `;
        return;
    }
    
    contenedor.innerHTML = '';
    historialCompras.forEach(compra => {
        const div = document.createElement('div');
        div.className = 'border-bottom py-3';
        div.innerHTML = `
            <div class="d-flex justify-content-between align-items-start">
                <div>
                    <h6 class="color-acento-azul mb-1">Pedido #${compra.id}</h6>
                    <p class="mb-1">${compra.items.length} producto(s)</p>
                    <small class="text-muted">${compra.fecha}</small>
                </div>
                <div class="text-end">
                    <span class="color-acento-verde fw-bold">$${compra.total.toLocaleString()}</span>
                    <br>
                    <span class="badge ${compra.estado === 'Entregado' ? 'bg-success' : 'bg-warning'}">${compra.estado}</span>
                </div>
            </div>
        `;
        contenedor.appendChild(div);
    });
}

function copiarCodigo() {
    const codigo = document.getElementById('codigoReferido').textContent;
    navigator.clipboard.writeText(codigo).then(() => {
        NotificacionManager.exito('📋 ¡Código copiado al portapapeles!');
    }).catch(() => {
        NotificacionManager.error('❌ No se pudo copiar el código');
    });
}

// Función para agregar puntos (llamada desde otras páginas)
function agregarPuntos(cantidad, motivo = 'Compra') {
    perfilUsuario.puntos += cantidad;
    localStorage.setItem('perfilUsuario', JSON.stringify(perfilUsuario));
    actualizarNivel();
    
    console.log(`+${cantidad} puntos LevelUp por: ${motivo}`);
}

// Función para agregar compra al historial
function agregarCompraAlHistorial(compra) {
    historialCompras.unshift(compra);
    localStorage.setItem('historialCompras', JSON.stringify(historialCompras));
    cargarHistorialCompras();
}