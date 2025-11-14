import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Form, Button, Card, Container, Row, Col } from 'react-bootstrap';

const Login = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/usuarios/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        login(data.usuario);
        navigate('/perfil');
      } else {
        setError(data.error || 'Error al iniciar sesión');
      }
    } catch (err) {
      console.error('Error en login:', err);
      setError('Error al iniciar sesión');
    }
  };

  return (
    // Contenedor principal de la página
    <main className="py-5">
      <Container>
        <Row className="justify-content-center py-5">
          <Col md={8} lg={6}>
            {/* Card oscura para formulario */}
            <Card className="shadow rounded-4 border-0 bg-dark">
              <Card.Body className="p-4">
                {/* Título centrado */}
                <h2 className="texto-principal text-center mb-4 text-primary fw-bold">
                  Iniciar Sesión
                </h2>

                {/* Formulario de login */}
                <Form onSubmit={handleSubmit}>
                  {/* Campo de email */}
                  <Form.Group className="mb-3" controlId="email">
                    <Form.Label>Correo electrónico</Form.Label>
                    <Form.Control
                      required
                      type="email"
                      placeholder="correo@ejemplo.com"
                      value={formData.email}
                      onChange={handleChange}
                    />
                  </Form.Group>

                  {/* Campo de contraseña */}
                  <Form.Group className="mb-3" controlId="password">
                    <Form.Label>Contraseña</Form.Label>
                    <Form.Control
                      required
                      type="password"
                      placeholder="********"
                      value={formData.password}
                      onChange={handleChange}
                    />
                  </Form.Group>

                  {/* Mensaje de error */}
                  {error && <p className="text-danger text-center">{error}</p>}

                  {/* Botón de login */}
                  <Button variant="primary" type="submit" className="w-100 mt-3">
                    Iniciar Sesión
                  </Button>
                </Form>

                {/* Enlace para registro */}
                <p className="text-center mt-3 text-white">
                  ¿No tienes cuenta?{' '}
                  <Link to="/registro" className="text-decoration-none text-primary fw-semibold">
                    Regístrate aquí
                  </Link>
                </p>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </main>
  );
};

export default Login;
