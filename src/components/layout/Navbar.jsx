// src/components/layout/Navbar.jsx
import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CartContext } from '../../context/CartContext';
import { AuthContext } from '../../context/AuthContext';

const Navbar = () => {
  const { totalItems } = useContext(CartContext);
  const { usuario, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="navbar navbar-expand-lg bg-body-tertiary bg-dark border-bottom border-body" data-bs-theme="dark">
      <div className="container-fluid">
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavAltMarkup">
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
          <div className="navbar-nav me-auto">
            <Link className="nav-link color-acento-verde" to="/">Inicio</Link>
            <Link className="nav-link color-acento-verde" to="/productos">Productos</Link>
            <Link className="nav-link color-acento-verde" to="/resenas">Reseñas</Link>
            <Link className="nav-link color-acento-verde" to="/comunidad">Comunidad</Link>
          </div>

          <div className="navbar-nav ms-auto">
            {!usuario && <Link className="nav-link color-acento-verde" to="/login">Login</Link>}
            {!usuario && <Link className="nav-link color-acento-verde" to="/registro">Registrarse</Link>}
            {usuario && (
              <>
                <Link className="nav-link color-acento-verde" to="/perfil">Mi Perfil</Link>
                <button className="nav-link btn btn-link color-acento-verde" onClick={handleLogout}>
                  Cerrar sesión
                </button>
              </>
            )}
            <Link className="nav-link color-acento-verde position-relative" to="/carrito">
              Carrito
              {totalItems > 0 && (
                <span id="carritoContador" className="carrito-contador" style={{ display: 'flex' }}>
                  {totalItems > 99 ? '99+' : totalItems}
                </span>
              )}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
