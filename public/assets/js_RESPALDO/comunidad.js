'use strict';

// Datos de eventos
const eventos = [
    {
        id: 1,
        titulo: "Torneo League of Legends 2025",
        fecha: "15 de Enero, 2025",
        ubicacion: "Santiago, Centro de Convenciones",
        descripcion: "El torneo más grande del año con premios de $2.000.000 CLP",
        imagen: "assets/img/evento-lol.jpg",
        puntos: 200,
        estado: "Inscripciones Abiertas"
    },
    {
        id: 2,
        titulo: "Gaming Expo Valparaíso",
        fecha: "22 de Enero, 2025",
        ubicacion: "Valparaíso, Mall Marina",
        descripcion: "Exhibición de los últimos productos gaming y demos exclusivos",
        imagen: "assets/img/gaming-expo.jpg",
        puntos: 150,
        estado: "Próximamente"
    },
    {
        id: 3,
        titulo: "Torneo Counter-Strike 2",
        fecha: "5 de Febrero, 2025",
        ubicacion: "Concepción, Universidad del Bío-Bío",
        descripcion: "Competencia universitaria con equipos de todo el sur de Chile",
        imagen: "assets/img/evento-cs2.jpg",
        puntos: 180,
        estado: "Inscripciones Abiertas"
    }
];

// Artículos del blog
const articulosBlog = [
    {
        id: 1,
        titulo: "Guía: Optimiza tu PC para Gaming",
        resumen: "Aprende los mejores tips para sacar el máximo rendimiento de tu setup gamer",
        fecha: "10 de Enero, 2025",
        autor: "Team Level-UP",
        imagen: "assets/img/guia-pc.jpg",
        categoria: "Hardware"
    },
    {
        id: 2,
        titulo: "Los mejores periféricos gaming 2025",
        resumen: "Review completo de mouse, teclados y auriculares que marcarán tendencia",
        fecha: "8 de Enero, 2025",
        autor: "Pro Gamer Reviews",
        imagen: "assets/img/perifericos-2025.jpg",
        categoria: "Reviews"
    },
    {
        id: 3,
        titulo: "Ergonomía Gaming: Cuida tu salud",
        resumen: "Consejos para mantener una postura saludable durante largas sesiones de juego",
        fecha: "5 de Enero, 2025",
        autor: "Dr. Gaming Health",
        imagen: "assets/img/ergonomia-gaming.jpg",
        categoria: "Salud"
    }
];

// Ranking de gamers simulado
const rankingGamers = [
    { nombre: "ProGamer_CL", nivel: 15, puntos: 2340, juego: "Valorant" },
    { nombre: "ChileGamer99", nivel: 12, puntos: 1890, juego: "League of Legends" },
    { nombre: "SantiagoWarrior", nivel: 11, puntos: 1650, juego: "Counter-Strike 2" },
    { nombre: "ConcepcionMaster", nivel: 10, puntos: 1420, juego: "Overwatch 2" },
    { nombre: "ValpoGaming", nivel: 9, puntos: 1180, juego: "Apex Legends" }
];

// Desafíos de la comunidad
const desafiosComunidad = [
    {
        titulo: "Compra tu primer producto",
        descripcion: "Realiza tu primera compra y gana 50 puntos",
        puntos: 50,
        completado: false
    },
    {
        titulo: "Recomienda a un amigo",
        descripcion: "Invita a un amigo con tu código de referido",
        puntos: 100,
        completado: false
    },
    {
        titulo: "Deja una reseña",
        descripcion: "Comparte tu opinión sobre un producto",
        puntos: 25,
        completado: false
    },
    {
        titulo: "Participa en un evento",
        descripcion: "Asiste a cualquier evento de la comunidad",
        puntos: 200,
        completado: false
    }
];

document.addEventListener('DOMContentLoaded', () => {
    cargarEventos();
    cargarProximosEventos();
    cargarBlog();
    cargarRanking();
    cargarDesafios();
});

function cargarEventos() {
    const container = document.getElementById('eventosContainer');
    
    eventos.forEach(evento => {
        const div = document.createElement('div');
        div.className = 'col-lg-4 mb-4';
        div.innerHTML = `
            <div class="card card-producto h-100">
                <div class="card-body">
                    <h5 class="card-title color-acento-azul">${evento.titulo}</h5>
                    <p class="card-text mb-2"><strong>📅 ${evento.fecha}</strong></p>
                    <p class="card-text mb-2"><strong>📍 ${evento.ubicacion}</strong></p>
                    <p class="card-text">${evento.descripcion}</p>
                    <div class="d-flex justify-content-between align-items-center mt-3">
                        <span class="badge ${evento.estado === 'Inscripciones Abiertas' ? 'bg-success' : 'bg-warning'}">${evento.estado}</span>
                        <span class="color-acento-verde"><strong>+${evento.puntos} puntos</strong></span>
                    </div>
                    <button class="btn btn-registrarse w-100 mt-3" onclick="inscribirseEvento(${evento.id})">
                        ${evento.estado === 'Inscripciones Abiertas' ? 'Inscribirse' : 'Más Info'}
                    </button>
                </div>
            </div>
        `;
        container.appendChild(div);
    });
}

function cargarProximosEventos() {
    const container = document.getElementById('proximosEventos');
    
    const proximosTres = eventos.slice(0, 3);
    proximosTres.forEach(evento => {
        const div = document.createElement('div');
        div.className = 'border-bottom pb-2 mb-3';
        div.innerHTML = `
            <h6 class="color-acento-azul mb-1">${evento.titulo}</h6>
            <small class="text-muted">${evento.fecha}</small>
            <br>
            <small class="color-acento-verde">+${evento.puntos} puntos LevelUp</small>
        `;
        container.appendChild(div);
    });
}

function cargarBlog() {
    const container = document.getElementById('blogContainer');
    
    articulosBlog.forEach(articulo => {
        const div = document.createElement('div');
        div.className = 'col-lg-4 mb-4';
        div.innerHTML = `
            <div class="card card-producto h-100">
                <div class="card-body">
                    <span class="badge bg-secondary mb-2">${articulo.categoria}</span>
                    <h5 class="card-title color-acento-azul">${articulo.titulo}</h5>
                    <p class="card-text">${articulo.resumen}</p>
                    <div class="mt-auto">
                        <small class="text-muted">Por ${articulo.autor} - ${articulo.fecha}</small>
                        <br>
                        <button class="btn btn-outline-secondary btn-sm mt-2" onclick="leerArticulo(${articulo.id})">Leer Más</button>
                    </div>
                </div>
            </div>
        `;
        container.appendChild(div);
    });
}

function cargarRanking() {
    const container = document.getElementById('rankingGamers');
    
    rankingGamers.forEach((gamer, index) => {
        const div = document.createElement('div');
        div.className = 'd-flex justify-content-between align-items-center py-2 border-bottom';
        
        let medallaIcon = '';
        if (index === 0) medallaIcon = '🥇';
        else if (index === 1) medallaIcon = '🥈';
        else if (index === 2) medallaIcon = '🥉';
        else medallaIcon = `${index + 1}.`;
        
        div.innerHTML = `
            <div>
                <span class="me-2">${medallaIcon}</span>
                <strong class="color-acento-azul">${gamer.nombre}</strong>
                <br>
                <small class="text-muted">Nivel ${gamer.nivel} - ${gamer.juego}</small>
            </div>
            <span class="color-acento-verde">${gamer.puntos} pts</span>
        `;
        container.appendChild(div);
    });
}

function cargarDesafios() {
    const container = document.getElementById('desafiosComunidad');
    
    desafiosComunidad.forEach((desafio, index) => {
        const div = document.createElement('div');
        div.className = 'border rounded p-3 mb-3';
        div.innerHTML = `
            <div class="d-flex justify-content-between align-items-start">
                <div>
                    <h6 class="color-acento-azul mb-1">${desafio.titulo}</h6>
                    <p class="small mb-2">${desafio.descripcion}</p>
                    <span class="color-acento-verde">+${desafio.puntos} puntos</span>
                </div>
                <span class="badge ${desafio.completado ? 'bg-success' : 'bg-secondary'}">
                    ${desafio.completado ? '✓' : '○'}
                </span>
            </div>
        `;
        container.appendChild(div);
    });
}

function inscribirseEvento(eventoId) {
    const evento = eventos.find(e => e.id === eventoId);
    if (evento.estado === 'Inscripciones Abiertas') {
        NotificacionManager.exito(
            `🎉 <strong>¡Inscrito exitosamente!</strong><br>${evento.titulo}<br>+${evento.puntos} puntos LevelUp ganados`
        );
    } else {
        NotificacionManager.info(
            `ℹ️ <strong>${evento.titulo}</strong><br>Pronto abriremos las inscripciones`
        );
    }
}

function leerArticulo(articuloId) {
    const articulo = articulosBlog.find(a => a.id === articuloId);
    NotificacionManager.info(
        `📖 <strong>${articulo.titulo}</strong><br>${articulo.resumen}<br><br>Próximamente artículo completo disponible`
    );
}