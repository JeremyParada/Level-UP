import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useNotification } from '../hooks/useNotification';
import { AuthContext } from '../context/AuthContext';
import fetchWithAuth from '../utils/api';

const Profile = () => {
  const { exito } = useNotification();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext) || {};

  const [perfil, setPerfil] = useState({
    nombre: '',
    apellido: '',
    email: '',
    gamerTag: '',
    fechaNacimiento: '',
    telefono: '',
    juegoFavorito: '',
    puntos: 0,
    nivel: 1,
    codigoReferido: '',
    fechaRegistro: ''
  });

  const [historialCompras, setHistorialCompras] = useState([]);
  const [descuentosActivos, setDescuentosActivos] = useState([]);
  const [cargando, setCargando] = useState(true);

  const getUserId = () => {
    if (user && user.idUsuario) return user.idUsuario;
    const stored = localStorage.getItem('usuario');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        return parsed.idUsuario || parsed.id_usuario || parsed.id;
      } catch (_) {
        return null;
      }
    }
    return null;
  };

  useEffect(() => {
    const idUsuario = getUserId();
    if (!idUsuario) {
      alert('Debes registrarte o iniciar sesión para acceder a tu perfil.');
      navigate('/registro');
      return;
    }

    const cargarTodo = async () => {
      try {
        await cargarDatosPerfil(idUsuario);
        await cargarHistorialCompras(idUsuario);
        calcularDescuentos();
      } finally {
        setCargando(false);
      }
    };

    cargarTodo();
  }, [navigate]);

  const cargarDatosPerfil = async (idUsuario) => {
    try {
      const response = await fetchWithAuth(`/v1/usuarios/me/${idUsuario}`);
      if (!response.ok) {
        throw new Error('No se pudo obtener el perfil');
      }
      const data = await response.json();

      setPerfil((prev) => ({
        ...prev,
        nombre: data.nombre,
        apellido: data.apellido,
        email: data.email,
        fechaNacimiento: data.fechaNacimiento,
        telefono: data.telefono || '',
        puntos: data.puntos,
        nivel: data.nivel,
        fechaRegistro: data.fechaRegistro,
        gamerTag:
          prev.gamerTag ||
          `${data.nombre || 'GAMER'}_${Math.random().toString(36).substr(2, 4)}`.toUpperCase(),
        codigoReferido:
          prev.codigoReferido ||
          'GAMER' + Math.random().toString(36).substr(2, 6).toUpperCase()
      }));
    } catch (err) {
      console.error('Error al cargar perfil:', err);
    }
  };

  const cargarHistorialCompras = async (idUsuario) => {
    try {
      const response = await fetchWithAuth(`/v1/pedidos/usuario/${idUsuario}`);
      if (!response.ok) {
        throw new Error('No se pudo obtener el historial de compras');
      }
      const data = await response.json();
      setHistorialCompras(data || []);
    } catch (err) {
      console.error('Error al cargar historial de compras:', err);
      setHistorialCompras([]);
    }
  };

  const calcularDescuentos = () => {
    const descuentos = [];

    if (perfil?.email?.endsWith('@duoc.cl') || perfil?.email?.endsWith('@duocuc.cl')) {
      descuentos.push({
        titulo: 'Descuento DuocUC 🎓',
        descripcion: '20% de descuento de por vida',
        codigo: 'DUOC20',
        tipo: 'permanente'
      });
    }

    const nivel = Math.floor((perfil.puntos || 0) / 200);

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
    return Math.floor((perfil.puntos || 0) / 200) + 1;
  };

  const puntosParaSiguienteNivel = () => {
    const nivelActual = calcularNivel();
    const puntosNecesarios = nivelActual * 200;
    return puntosNecesarios - (perfil.puntos || 0);
  };

  const porcentajeProgreso = () => {
    const nivelActual = calcularNivel();
    const puntosBase = (nivelActual - 1) * 200;
    const puntosEnNivel = (perfil.puntos || 0) - puntosBase;
    return (puntosEnNivel / 200) * 100;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const idUsuario = getUserId();
    if (!idUsuario) return;

    try {
      const payload = {
        nombre: perfil.nombre,
        apellido: perfil.apellido,
        telefono: perfil.telefono,
        fechaNacimiento: perfil.fechaNacimiento
      };

      const response = await fetchWithAuth(`/v1/usuarios/me/${idUsuario}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error('No se pudo actualizar el perfil');
      }

      exito('✅ ¡Perfil actualizado exitosamente!');
    } catch (err) {
      console.error('Error al actualizar perfil:', err);
    }
  };

  const handleChange = (e) => {
    setPerfil({
      ...perfil,
      [e.target.id]: e.target.value
    });
  };

  const copiarCodigoReferido = () => {
    if (!perfil.codigoReferido) return;
    navigator.clipboard
      .writeText(perfil.codigoReferido)
      .then(() => {
        exito('Código de referido copiado al portapapeles');
      })
      .catch((error) => {
        console.error('Error al copiar código de referido:', error);
      });
  };

  const formatearPrecio = (precio) => {
    if (precio == null) return '$0';
    return precio.toLocaleString('es-CL', {
      style: 'currency',
      currency: 'CLP'
    });
  };

  const { logout } = useContext(AuthContext) || {};
  const handleLogout = () => {
    if (logout) logout();
    navigate('/');
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
            <button className="btn btn-outline-danger mt-3" onClick={handleLogout}>
              Cerrar sesión
            </button>
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

            {/* Gestión de Direcciones */}
            <DireccionesManager idUsuario={getUserId()} />

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
                  <strong>¿Cómo ganar puntos?</strong><br />
                  • Compras: 10 puntos por cada $1.000<br />
                  • Referidos: 100 puntos<br />
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
              <h4 className="texto-principal color-acento-azul mb-3">Mi Código de Referido</h4>
              <div className="text-center">
                <div className="badge bg-secondary fs-5 mb-2" id="codigoReferido">
                  {perfil.codigoReferido}
                </div>
                <p className="small">Comparte este código y gana 50 puntos por cada nuevo usuario</p>
                <button
                  className="btn btn-outline-secondary btn-sm"
                  onClick={copiarCodigoReferido}
                  type="button"
                >
                  📋 Copiar
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Profile;