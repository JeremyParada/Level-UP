import React, { useState, useEffect } from 'react';
import { useNotification } from '../hooks/useNotification';

const Community = () => {
  const { exito, info } = useNotification();
  const [eventos, setEventos] = useState([]);
  const [articulosBlog, setArticulosBlog] = useState([]);
  const [ranking, setRanking] = useState([]);

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = () => {
    // Eventos
    const eventosData = [
      {
        id: 1,
        titulo: "Torneo League of Legends 2025",
        fecha: "15 de Enero, 2025",
        ubicacion: "Santiago, Centro de Convenciones",
        descripcion: "El torneo más grande del año con premios de $2.000.000 CLP",
        imagen: "/assets/img/evento-lol.jpg",
        puntos: 200,
        estado: "Inscripciones Abiertas"
      },
      {
        id: 2,
        titulo: "Gaming Expo Valparaíso",
        fecha: "22 de Enero, 2025",
        ubicacion: "Valparaíso, Mall Marina",
        descripcion: "Exhibición de los últimos productos gaming y demos exclusivos",
        imagen: "/assets/img/gaming-expo.jpg",
        puntos: 150,
        estado: "Próximamente"
      },
      {
        id: 3,
        titulo: "Torneo Counter-Strike 2",
        fecha: "5 de Febrero, 2025",
        ubicacion: "Concepción, Universidad del Bío-Bío",
        descripcion: "Competencia universitaria con equipos de todo el sur de Chile",
        imagen: "/assets/img/evento-cs2.jpg",
        puntos: 180,
        estado: "Inscripciones Abiertas"
      }
    ];

    // Blog
    const blogData = [
      {
        id: 1,
        titulo: "Guía: Optimiza tu PC para Gaming",
        resumen: "Aprende los mejores tips para sacar el máximo rendimiento de tu setup gamer",
        fecha: "10 de Enero, 2025",
        autor: "Team Level-UP",
        categoria: "Hardware"
      },
      {
        id: 2,
        titulo: "Los mejores periféricos gaming 2025",
        resumen: "Review completo de mouse, teclados y auriculares que marcarán tendencia",
        fecha: "8 de Enero, 2025",
        autor: "Pro Gamer Reviews",
        categoria: "Reviews"
      },
      {
        id: 3,
        titulo: "Ergonomía Gaming: Cuida tu salud",
        resumen: "Consejos para mantener una postura saludable durante largas sesiones de juego",
        fecha: "5 de Enero, 2025",
        autor: "Dr. Gaming Health",
        categoria: "Salud"
      }
    ];

    // Ranking
    const rankingData = [
      { nombre: "ProGamer_CL", nivel: 15, puntos: 2340, juego: "Valorant" },
      { nombre: "ChileGamer99", nivel: 12, puntos: 1890, juego: "League of Legends" },
      { nombre: "SantiagoWarrior", nivel: 11, puntos: 1650, juego: "Counter-Strike 2" },
      { nombre: "ConcepcionMaster", nivel: 10, puntos: 1420, juego: "Overwatch 2" },
      { nombre: "ValpoGaming", nivel: 9, puntos: 1180, juego: "Apex Legends" }
    ];

    setEventos(eventosData);
    setArticulosBlog(blogData);
    setRanking(rankingData);
  };

  const handleInscribirse = (eventoId) => {
    const evento = eventos.find(e => e.id === eventoId);
    exito(`✅ ¡Inscripción exitosa!<br>Te esperamos en: <strong>${evento.titulo}</strong><br>+${evento.puntos} puntos LevelUp`);
  };

  return (
    <main>
      {/* Header */}
      <section className="text-center fondo-catalogo">
        <div className="row py-lg-5 fondo-texto-catalogo">
          <div className="col-lg-6 col-md-8 mx-auto">
            <h1 className="texto-principal">Comunidad Gamer</h1>
            <p className="color-acento-verde">
              Conecta con otros gamers y participa en eventos
            </p>
          </div>
        </div>
      </section>

      <div className="container my-5">
        {/* Eventos y torneos */}
        <section className="mb-5">
          <h2 className="texto-principal color-acento-azul mb-4">
            Eventos y Torneos
          </h2>
          <div className="row">
            {eventos.map(evento => (
              <div key={evento.id} className="col-lg-4 mb-4">
                <div className="card card-producto h-100">
                  <img 
                    src={evento.imagen} 
                    className="card-img-top" 
                    alt={evento.titulo}
                    style={{ height: '200px', objectFit: 'cover' }}
                    onError={(e) => {
                      e.target.src = '/assets/img/default-event.jpg';
                    }}
                  />
                  <div className="card-body">
                    <span className="badge bg-success mb-2">{evento.estado}</span>
                    <h5 className="card-title color-acento-azul">{evento.titulo}</h5>
                    <p className="card-text">
                      <small className="text-muted">
                        📅 {evento.fecha}<br/>
                        📍 {evento.ubicacion}
                      </small>
                    </p>
                    <p className="card-text">{evento.descripcion}</p>
                    <div className="d-flex justify-content-between align-items-center">
                      <span className="color-acento-verde">
                        +{evento.puntos} puntos
                      </span>
                      <button 
                        className="btn btn-agregar-producto btn-sm"
                        onClick={() => handleInscribirse(evento.id)}
                      >
                        Inscribirme
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Mapa de eventos */}
        <section className="mb-5">
          <h2 className="texto-principal color-acento-azul mb-4">
            Mapa de Eventos en Chile
          </h2>
          <div className="card card-formulario rounded-4 p-4">
            <div className="row">
              <div className="col-lg-8">
                <div className="ratio ratio-16x9">
                  <iframe 
                    src="https://www.google.com/maps/d/embed?mid=1example&hl=es"
                    style={{ border: 0, borderRadius: '8px' }}
                    allowFullScreen
                    loading="lazy"
                    title="Mapa de eventos"
                  />
                </div>
              </div>
              <div className="col-lg-4">
                <h5 className="color-acento-verde mb-3">Próximos Eventos</h5>
                {eventos.slice(0, 3).map(evento => (
                  <div key={evento.id} className="border-bottom pb-2 mb-3">
                    <h6 className="color-acento-azul mb-1">{evento.titulo}</h6>
                    <small className="text-muted">{evento.fecha}</small><br/>
                    <small className="color-acento-verde">+{evento.puntos} puntos LevelUp</small>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Blog y guías */}
        <section className="mb-5">
          <h2 className="texto-principal color-acento-azul mb-4">
            Blog y Guías Gaming
          </h2>
          <div className="row">
            {articulosBlog.map(articulo => (
              <div key={articulo.id} className="col-lg-4 mb-4">
                <div className="card card-producto h-100">
                  <div className="card-body">
                    <span className="badge bg-secondary mb-2">{articulo.categoria}</span>
                    <h5 className="card-title color-acento-azul">{articulo.titulo}</h5>
                    <p className="card-text">{articulo.resumen}</p>
                    <p className="card-text">
                      <small className="text-muted">
                        Por: {articulo.autor}<br/>
                        {articulo.fecha}
                      </small>
                    </p>
                    <button 
                      className="btn btn-outline-secondary btn-sm"
                      onClick={() => info('📖 Artículo próximamente disponible')}
                    >
                      Leer más →
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Soporte técnico */}
        <section className="mb-5">
          <h2 className="texto-principal color-acento-azul mb-4">
            Soporte Técnico
          </h2>
          <div className="card card-formulario rounded-4 p-4">
            <div className="row align-items-center">
              <div className="col-md-8">
                <h5 className="color-acento-verde mb-2">¿Necesitas ayuda técnica?</h5>
                <p className="mb-0">
                  Nuestro equipo de soporte está listo para ayudarte con cualquier problema técnico, 
                  instalación de hardware o configuración de software.
                </p>
              </div>
              <div className="col-md-4 text-center">
                <a 
                  href="https://wa.me/56912345678?text=Hola, necesito soporte técnico desde Level-UP Gamer" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="btn btn-success btn-lg"
                >
                  📱 Chat WhatsApp
                </a>
                <p className="small mt-2 text-muted">Atención de 9:00 a 18:00 hrs</p>
              </div>
            </div>
          </div>
        </section>

        {/* Ranking de la comunidad */}
        <section>
          <h2 className="texto-principal color-acento-azul mb-4">
            Ranking de Gamers
          </h2>
          <div className="card card-formulario rounded-4 p-4">
            <div className="row">
              <div className="col-lg-6">
                <h5 className="color-acento-verde mb-3">🏆 Top Gamers del Mes</h5>
                <div className="table-responsive">
                  <table className="table table-dark table-hover">
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Gamer</th>
                        <th>Nivel</th>
                        <th>Puntos</th>
                      </tr>
                    </thead>
                    <tbody>
                      {ranking.map((gamer, index) => (
                        <tr key={index}>
                          <td>
                            {index === 0 && '🥇'}
                            {index === 1 && '🥈'}
                            {index === 2 && '🥉'}
                            {index > 2 && index + 1}
                          </td>
                          <td>
                            <strong className="color-acento-azul">{gamer.nombre}</strong>
                            <br/>
                            <small className="text-muted">{gamer.juego}</small>
                          </td>
                          <td>{gamer.nivel}</td>
                          <td className="color-acento-verde">{gamer.puntos}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              <div className="col-lg-6">
                <h5 className="color-acento-verde mb-3">🎯 Desafíos de la Comunidad</h5>
                <div className="list-group list-group-flush">
                  <div className="list-group-item bg-dark border-secondary">
                    <div className="d-flex justify-content-between align-items-center">
                      <div>
                        <h6 className="mb-1">Compra tu primer producto</h6>
                        <small className="text-muted">Realiza tu primera compra</small>
                      </div>
                      <span className="badge bg-success">+50 puntos</span>
                    </div>
                  </div>
                  <div className="list-group-item bg-dark border-secondary">
                    <div className="d-flex justify-content-between align-items-center">
                      <div>
                        <h6 className="mb-1">Recomienda a un amigo</h6>
                        <small className="text-muted">Invita con tu código de referido</small>
                      </div>
                      <span className="badge bg-success">+100 puntos</span>
                    </div>
                  </div>
                  <div className="list-group-item bg-dark border-secondary">
                    <div className="d-flex justify-content-between align-items-center">
                      <div>
                        <h6 className="mb-1">Deja una reseña</h6>
                        <small className="text-muted">Comparte tu opinión</small>
                      </div>
                      <span className="badge bg-success">+25 puntos</span>
                    </div>
                  </div>
                  <div className="list-group-item bg-dark border-secondary">
                    <div className="d-flex justify-content-between align-items-center">
                      <div>
                        <h6 className="mb-1">Participa en un evento</h6>
                        <small className="text-muted">Asiste a cualquier evento</small>
                      </div>
                      <span className="badge bg-success">+200 puntos</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
};

export default Community;