'use strict';

// Función para cargar partials con mejor manejo de errores
function cargarPartial(archivo, contenedorId, nombrePartial) {
    fetch(archivo)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            return response.text();
        })
        .then(data => {
            const contenedor = document.getElementById(contenedorId);
            if (contenedor) {
                contenedor.innerHTML = data;
                // Actualizar contador después de cargar navbar
                if (contenedorId === 'navbar-container') {
                    setTimeout(() => CarritoContador.actualizar(), 100);
                }
            } else {
                console.error(`No se encontró el contenedor: ${contenedorId}`);
            }
        })
        .catch(err => {
            console.error(`Error cargando ${nombrePartial}:`, err);
            // Fallback content
            const contenedor = document.getElementById(contenedorId);
            if (contenedor && contenedorId === 'header-container') {
                contenedor.innerHTML = `
                    <div class="navbar bg-dark border-bottom">
                        <div class="container-fluid justify-content-center">
                            <span class="navbar-brand texto-principal">Level-Up Gamer Store</span>
                        </div>
                    </div>
                `;
            }
        });
}

// Cargar todos los partials
document.addEventListener('DOMContentLoaded', () => {
    cargarPartial('partials/header.html', 'header-container', 'header');
    cargarPartial('partials/navbar.html', 'navbar-container', 'navbar');
    cargarPartial('partials/footer.html', 'footer-container', 'footer');
});