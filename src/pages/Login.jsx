import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Login = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const usuariosRegistrados = JSON.parse(localStorage.getItem('usuarios')) || [];
    const usuarioEncontrado = usuariosRegistrados.find(
      (u) => u.email === formData.email && u.password === formData.password
    );

    if (usuarioEncontrado) {
      login(usuarioEncontrado);
      navigate('/perfil');
    } else {
      setError('Correo o contraseña incorrectos');
    }
  };

  return (
    <main className="container my-5">
      <div className="row justify-content-center">
        <div className="col-lg-6">
          <div className="card card-formulario p-4 rounded-4">
            <h2 className="texto-principal mb-4 text-center">Iniciar Sesión</h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label htmlFor="email" className="form-label">Correo electrónico</label>
                <input
                  type="email"
                  className="form-control"
                  id="email"
                  placeholder="correo@ejemplo.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="mb-3">
                <label htmlFor="password" className="form-label">Contraseña</label>
                <input
                  type="password"
                  className="form-control"
                  id="password"
                  placeholder="********"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>

              {error && <p className="text-danger text-center">{error}</p>}

              <button type="submit" className="btn btn-registrarse w-100">
                Iniciar Sesión
              </button>
            </form>

            <p className="text-center mt-3">
              ¿No tienes cuenta?{' '}
              <Link to="/registro" className="text-decoration-none">
                Regístrate aquí
              </Link>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Login;
