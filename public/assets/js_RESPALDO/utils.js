'use strict';

// Sistema de notificaciones mejorado
class NotificacionManager {
    static mostrar(mensaje, tipo = 'exito', duracion = 3000) {
        const notificacion = document.createElement('div');
        notificacion.className = `notificacion notificacion-${tipo}`;
        
        const iconos = {
            exito: '✅',
            error: '❌',
            info: 'ℹ️',
            advertencia: '⚠️'
        };
        
        notificacion.innerHTML = `
            <button class="btn-cerrar" onclick="this.parentElement.remove()">×</button>
            <div style="padding-right: 20px;">
                <span style="font-size: 1.1em; margin-right: 8px;">${iconos[tipo]}</span>
                ${mensaje}
            </div>
        `;
        
        document.body.appendChild(notificacion);
        
        // Mostrar con animación
        setTimeout(() => notificacion.classList.add('mostrar'), 100);
        
        // Ocultar automáticamente
        setTimeout(() => {
            notificacion.classList.remove('mostrar');
            setTimeout(() => notificacion.remove(), 300);
        }, duracion);
        
        return notificacion;
    }
    
    static exito(mensaje, duracion = 3000) {
        return this.mostrar(mensaje, 'exito', duracion);
    }
    
    static error(mensaje, duracion = 4000) {
        return this.mostrar(mensaje, 'error', duracion);
    }
    
    static info(mensaje, duracion = 3000) {
        return this.mostrar(mensaje, 'info', duracion);
    }
    
    static advertencia(mensaje, duracion = 3500) {
        return this.mostrar(mensaje, 'advertencia', duracion);
    }
}

// Gestor del contador del carrito
class CarritoContador {
    static actualizar() {
        const carrito = JSON.parse(localStorage.getItem('carrito')) || [];
        const totalItems = carrito.reduce((total, item) => total + item.cantidad, 0);
        
        const contador = document.getElementById('carritoContador');
        if (contador) {
            if (totalItems > 0) {
                contador.textContent = totalItems > 99 ? '99+' : totalItems;
                contador.style.display = 'flex';
                // Animación de pulso
                contador.style.animation = 'none';
                setTimeout(() => contador.style.animation = 'pulse 0.5s ease-in-out', 10);
            } else {
                contador.style.display = 'none';
            }
        }
    }
    
    static inicializar() {
        // Actualizar al cargar la página
        document.addEventListener('DOMContentLoaded', () => {
            setTimeout(() => this.actualizar(), 100); // Pequeño delay para asegurar que el DOM esté cargado
        });
        
        // Escuchar cambios en localStorage
        window.addEventListener('storage', (e) => {
            if (e.key === 'carrito') {
                this.actualizar();
            }
        });
    }
}

// Funciones de confirmación mejoradas
class ConfirmacionManager {
    static confirmar(mensaje, callback, opciones = {}) {
        const modal = document.createElement('div');
        modal.className = 'position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center';
        modal.style.cssText = 'background: rgba(0,0,0,0.7); z-index: 10000;';
        
        modal.innerHTML = `
            <div class="card card-formulario p-4" style="max-width: 400px; margin: 20px;">
                <h5 class="color-acento-azul mb-3">${opciones.titulo || 'Confirmar acción'}</h5>
                <p class="mb-4">${mensaje}</p>
                <div class="d-flex gap-2 justify-content-end">
                    <button class="btn btn-outline-secondary" onclick="this.closest('.position-fixed').remove()">
                        ${opciones.cancelar || 'Cancelar'}
                    </button>
                    <button class="btn btn-registrarse" id="confirmarBtn">
                        ${opciones.confirmar || 'Confirmar'}
                    </button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        modal.querySelector('#confirmarBtn').onclick = () => {
            modal.remove();
            callback();
        };
        
        // Cerrar al hacer click fuera
        modal.onclick = (e) => {
            if (e.target === modal) modal.remove();
        };
    }
}

// Inicializar contador del carrito
CarritoContador.inicializar();

// Hacer disponibles globalmente
window.NotificacionManager = NotificacionManager;
window.CarritoContador = CarritoContador;
window.ConfirmacionManager = ConfirmacionManager;