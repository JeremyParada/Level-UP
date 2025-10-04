import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useNotification } from '../hooks/useNotification';

const Profile = () => {
  const { exito, info } = useNotification();

  const [perfil, setPerfil] = useState({
    nombre: '',
    apellido: '',
    email: '',
    gamerTag: '',
    fechaNacimiento: '',
    telefono: '',
    juegoFavorito: '',
    puntos: 100,
    nivel: 1,
    codigoReferido: '',
    fechaRegistro: ''
  });

  const [historialCompras, setHistorialCompras] = useState([]);
  const [descuentosActivos, setDescuentosActivos] = useState([]);

  useEffect(() => {
    cargarDatosPerfil();
    cargarHistorialCompras();
    calcularDescuentos();
  }, []);

  const cargarDatosPerfil = () => {
    const usuario = JSON.parse(localStorage.getItem('usuario'));
    if (usuario) {
      setPerfil({
        ...usuario,
        gamerTag: usuario.gamerTag || `${usuario.nombre}_${Math.random().toString(36).substr(2, 4)}`.toUpperCase(),
        telefono: usuario.telefono || '',
        juegoFavorito: usuario.juegoFavorito || '',
        codigoReferido: usuario.codigoReferido || 'GAMER' + Math.random().toString(36).substr(2, 6).toUpperCase()
      });
    }
  };

  const cargarHistorialCompras = () => {
    const historial = JSON.parse(localStorage.getItem('historialCompras')) || [];
    setHistorialCompras(historial);
  };

  const calcularDescuentos = () => {
    const usuario = JSON.parse(localStorage.getItem('usuario'));
    if (!usuario) return;

    const descuentos = [];

    // Descuento DuocUC
    if (usuario.email.endsWith('@duoc.cl') || usuario.email.endsWith('@duocuc.cl')) {
      descuentos.push({
        titulo: 'Descuento DuocUC 🎓',
        descripcion: '20% de descuento de por vida',
        codigo: 'DUOC20',
        tipo: 'permanente'
      });
    }

    // Descuentos por nivel
    const nivel = Math.floor(usuario.puntos / 200);
    
    if (nivel >= 5) {
      descuentos.push({
        titulo: 'Gamer Veterano 🏅',
        descripcion: '15% de descuento en accesorios',
        codigo: 'VETERAN15',
        tipo: 'nivel'
      });
    }

    if (nivel >= 10) {
      descuentos.push({
        titulo: 'Pro Gamer 🏆',
        descripcion: '25% de descuento en hardware',
        codigo: 'PRO25',
        tipo: 'nivel'
      });
    }

    setDescuentosActivos(descuentos);
  };

  const calcularNivel = () => {
    return Math.floor(perfil.puntos / 200) + 1;
  };

  const puntosParaSiguienteNivel = () => {
    const nivelActual = calcularNivel();
    const puntosNecesarios = nivelActual * 200;
    return puntosNecesarios - perfil.puntos;
  };

  const porcentajeProgreso = () => {
    const nivelActual = calcularNivel();
    const puntosBase = (nivelActual - 1) * 200;
    const puntosEnNivel = perfil.puntos - puntosBase;
    return (puntosEnNivel / 200) * 100;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const usuarioActualizado = {
      ...perfil,
      nivel: calcularNivel()
    };

    localStorage.setItem('usuario', JSON.stringify(usuarioActualizado));
    exito('✅ ¡Perfil actualizado exitosamente!');
  };

  const handleChange = (e) => {
    setPerfil({
      ...perfil,
      [e.target.id]: e.target.value
    });
  };

  const copiarCodigoReferido = () => {
    navigator.clipboard.writeText(perfil.codigoReferido)
      .then(() => {
        exito('📋 ¡Código copiado al portapapeles!');
      })
      .catch(() => {
        info('Código: ' + perfil.codigoReferido);
      });
  };

  const formatearPrecio = (precio) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP'
    }).format(precio);
  };

  return (
    <main>
      {/* Header */}
      <section className="text-center fondo-catalogo">
        <div className="row py-lg-5 fondo-texto-catalogo">
          <div className="col-lg-6 col-md-8 mx-auto">
            <h1 className="texto-principal">Mi Perfil Gamer</h1>
            <p className="color-acento-verde">
              Gestiona tu información y puntos LevelUp
            </p>
          </div>
        </div>
      </section>

      <div className="container my-5">
        <div className="row">
          {/* Información del perfil */}
          <div className="col-lg-8">
            <div className="card card-formulario rounded-4 p-4 mb-4">
              <h3 className="texto-principal color-acento-azul mb-4">
                Información Personal
              </h3>
              <form id="formPerfil" onSubmit={handleSubmit}>
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label htmlFor="nombre" className="form-label">Nombre</label>
                    <input 
                      type="text" 
                      className="form-control" 
                      id="nombre"
                      placeholder="Tu nombre"
                      value={perfil.nombre}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label htmlFor="apellido" className="form-label">Apellido</label>
                    <input 
                      type="text" 
                      className="form-control" 
                      id="apellido"
                      placeholder="Tu apellido"
                      value={perfil.apellido}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label htmlFor="email" className="form-label">Email</label>
                    <input 
                      type="email" 
                      className="form-control" 
                      id="email"
                      placeholder="correo@ejemplo.com"
                      value={perfil.email}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label htmlFor="gamerTag" className="form-label">Gamer Tag</label>
                    <input 
                      type="text" 
                      className="form-control" 
                      id="gamerTag"
                      placeholder="Tu nombre gamer"
                      value={perfil.gamerTag}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label htmlFor="fechaNacimiento" className="form-label">
                      Fecha de Nacimiento
                    </label>
                    <input 
                      type="date" 
                      className="form-control" 
                      id="fechaNacimiento"
                      value={perfil.fechaNacimiento}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label htmlFor="telefono" className="form-label">Teléfono</label>
                    <input 
                      type="tel" 
                      className="form-control" 
                      id="telefono"
                      placeholder="+56 9 1234 5678"
                      value={perfil.telefono}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="mb-3">
                  <label htmlFor="juegoFavorito" className="form-label">
                    Juego Favorito
                  </label>
                  <input 
                    type="text" 
                    className="form-control" 
                    id="juegoFavorito"
                    placeholder="¿Cuál es tu juego favorito?"
                    value={perfil.juegoFavorito}
                    onChange={handleChange}
                  />
                </div>

                <button type="submit" className="btn btn-registrarse">
                  Actualizar Perfil
                </button>
              </form>
            </div>

            {/* Historial de compras */}
            <div className="card card-formulario rounded-4 p-4">
              <h3 className="texto-principal color-acento-azul mb-4">
                Historial de Compras
              </h3>
              <div id="historialCompras">
                {historialCompras.length === 0 ? (
                  <div className="text-center py-4">
                    <p className="mb-3">Aún no has realizado compras</p>
                    <Link to="/productos" className="btn btn-registrarse">
                      Ver Productos
                    </Link>
                  </div>
                ) : (
                  historialCompras.map(compra => (
                    <div key={compra.id} className="border-bottom py-3">
                      <div className="d-flex justify-content-between align-items-start">
                        <div>
                          <h6 className="color-acento-azul mb-1">
                            Pedido #{compra.id}
                          </h6>
                          <p className="mb-1">{compra.items.length} producto(s)</p>
                          <small className="text-muted">{compra.fecha}</small>
                        </div>
                        <div className="text-end">
                          <p className="mb-0 fw-bold color-acento-verde">
                            {formatearPrecio(compra.total)}
                          </p>
                          {compra.codigoDescuento && (
                            <small className="text-success">
                              Descuento: {compra.codigoDescuento}
                            </small>
                          )}
                        </div>
                      </div>
                      <div className="mt-2">
                        {compra.items.map((item, idx) => (
                          <small key={idx} className="d-block text-muted">
                            • {item.nombre} x{item.cantidad}
                          </small>
                        ))}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Panel lateral - Estadísticas */}
          <div className="col-lg-4">
            {/* Sistema de puntos */}
            <div className="card card-formulario rounded-4 p-4 mb-4">
              <h4 className="color-acento-azul mb-3">🎮 LevelUp Points</h4>
              <div className="text-center mb-3">
                <h2 className="color-acento-verde mb-0">{perfil.puntos}</h2>
                <small className="text-muted">puntos totales</small>
              </div>

              <div className="mb-3">
                <div className="d-flex justify-content-between mb-1">
                  <small>Nivel {calcularNivel()}</small>
                  <small>Nivel {calcularNivel() + 1}</small>
                </div>
                <div className="progress" style={{ height: '20px' }}>
                  <div 
                    className="progress-bar bg-success" 
                    role="progressbar"
                    style={{ width: `${porcentajeProgreso()}%` }}
                    aria-valuenow={porcentajeProgreso()}
                    aria-valuemin="0" 
                    aria-valuemax="100"
                  >
                    {Math.round(porcentajeProgreso())}%
                  </div>
                </div>
                <small className="text-muted">
                  {puntosParaSiguienteNivel()} puntos para nivel {calcularNivel() + 1}
                </small>
              </div>

              <div className="alert alert-info mb-0">
                <small>
                  <strong>¿Cómo ganar puntos?</strong><br/>
                  • Compras: 10 puntos por cada $1.000<br/>
                  • Referidos: 100 puntos<br/>
                  • Reseñas: 25 puntos
                </small>
              </div>
            </div>

            {/* Descuentos activos */}
            <div className="card card-formulario rounded-4 p-4 mb-4">
              <h4 className="color-acento-azul mb-3">🎫 Descuentos Activos</h4>
              <div id="descuentosActivos">
                {descuentosActivos.length === 0 ? (
                  <p className="text-muted mb-0">
                    No tienes descuentos activos
                  </p>
                ) : (
                  descuentosActivos.map((descuento, idx) => (
                    <div key={idx} className="mb-3 p-2 border rounded">
                      <h6 className="color-acento-verde mb-1">
                        {descuento.titulo}
                      </h6>
                      <p className="small mb-1">{descuento.descripcion}</p>
                      <code className="small">{descuento.codigo}</code>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Código de referido */}
            <div className="card card-formulario rounded-4 p-4">
              <h4 className="color-acento-azul mb-3">🎁 Código de Referido</h4>
              <p className="small mb-2">
                Comparte tu código y gana <strong className="color-acento-verde">100 puntos</strong> por cada amigo registrado
              </p>
              <div className="input-group mb-2">
                <input 
                  type="text" 
                  className="form-control text-center fw-bold" 
                  value={perfil.codigoReferido}
                  readOnly
                />
                <button 
                  className="btn btn-outline-secondary" 
                  type="button"
                  onClick={copiarCodigoReferido}
                >
                  📋 Copiar
                </button>
              </div>
              <small className="text-muted">
                Tus amigos también reciben 50 puntos de bienvenida
              </small>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Profile;