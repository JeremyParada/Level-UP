import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <div className="navbar bg-body-tertiary bg-dark border-bottom border-body" data-bs-theme="dark">
      <div className="container-fluid justify-content-center">
        <Link className="navbar-brand d-flex align-items-center" to="/">
          <span className="texto-principal me-2">Level-Up</span>
          <img src="/assets/img/logo.png" alt="Logo" height="50" className="d-inline-block align-text-top mx-2" />
          <span className="texto-principal ms-2">Gamer Store</span>
        </Link>
      </div>
    </div>
  );
};

export default Header;