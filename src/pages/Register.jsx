import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { NotificationContext } from '../context/NotificationContext';
import { AuthContext } from '../context/AuthContext';
import { Form, Button, Card, Container, Row, Col } from 'react-bootstrap';

const Register = () => {
  const navigate = useNavigate();
  const { exito, error } = useContext(NotificationContext);
  const { setUsuario } = useContext(AuthContext);

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    password2: '',
    nombre: '',
    apellido: '',
    fechaNacimiento: '',
    codigoReferido: ''
  });

  const [validated, setValidated] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value
    });
  };

  const validarEdad = (fecha) => {
    const hoy = new Date();
    const fechaNac = new Date(fecha);
    const edad = hoy.getFullYear() - fechaNac.getFullYear();
    const mes = hoy.getMonth() - fechaNac.getMonth();
    
    if (mes < 0 || (mes === 0 && hoy.getDate() < fechaNac.getDate())) {
      return edad - 1;
    }
    return edad;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const form = e.currentTarget;

    let usuariosExistentes = JSON.parse(localStorage.getItem('usuarios')) || [];

    // Validación: email ya registrado
    if (usuariosExistentes.some(u => u.email === formData.email)) {
      error('Este correo ya está registrado');
      return;
    }

    // Validaciones personalizadas
    let esValido = true;
    let mensajesError = [];

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      esValido = false;
      mensajesError.push('Email inválido');
    }

    if (formData.password.length < 6) {
      esValido = false;
      mensajesError.push('La contraseña debe tener al menos 6 caracteres');
    }

    if (formData.password !== formData.password2) {
      esValido = false;
      mensajesError.push('Las contraseñas no coinciden');
    }

    if (formData.fechaNacimiento) {
      const edad = validarEdad(formData.fechaNacimiento);
      if (edad < 18) {
        esValido = false;
        mensajesError.push('Debes ser mayor de 18 años');
      }
    }

    if (!esValido || form.checkValidity() === false) {
      e.stopPropagation();
      setValidated(true);
      if (mensajesError.length > 0) {
        error(mensajesError.join('<br>'));
      }
      return;
    }

    // Crear usuario
    const usuario = {
      email: formData.email,
      password: formData.password,
      nombre: formData.nombre,
      apellido: formData.apellido,
      fechaNacimiento: formData.fechaNacimiento,
      codigoReferido: formData.codigoReferido,
      puntos: 100,
      nivel: 1,
      fechaRegistro: new Date().toISOString()
    };

    // Guardar lista completa de usuarios
    let usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
    usuarios.push(usuario);
    localStorage.setItem('usuarios', JSON.stringify(usuarios));

    // Guardar sesión actual
    localStorage.setItem('usuario', JSON.stringify(usuario));
    setUsuario(usuario); // <-- actualiza el contexto global inmediatamente

    // Mensaje de bienvenida
    if (formData.email.includes('@duoc.cl') || formData.email.includes('@duocuc.cl')) {
      localStorage.setItem('descuentoDuoc', 'true');
      exito(`¡Bienvenido ${formData.nombre}!<br>¡Tienes 20% de descuento DuocUC activado! 🎓`);
    } else {
      exito(`¡Bienvenido ${formData.nombre}!<br>Tu cuenta ha sido creada exitosamente 🎮`);
    }

    // Redirigir al perfil
    setTimeout(() => {
      navigate('/perfil');
    }, 2000);
  };

  return (
    // Contenedor principal del contenido de la pagina, con padding vertical (py-5 = padding en eje Y)
    <main className="py-5">
      {/* Container de Bootstrap para centrar y aplicar margenes horizontales automáticos */}
      <Container>
        {/* Row crea una fila y "justify-content-center" centra el contenido horizontalmente */}
        <Row className="justify-content-center">
          {/* Col define una columna responsiva: ocupa 8 columnas en pantallas medianas y 6 en grandes */}
          <Col md={8} lg={6}>
            {/* Card es el contenedor visual principal del formulario */}
            {/* rounded-4: bordes redondeados / border-0: sin borde / bg-dark: fondo oscuro */}
            <Card className="rounded-4 bg-dark">
              {/* Card.Body contiene el contenido principal de la tarjeta */}
              {/* p-4 = padding interno de 1.5rem en todos los lados */}
              <Card.Body className="p-4">
                {/* Título centrado con clases de Bootstrap */}
                {/* texto-principal: clase personalizada / text-primary: color azul / fw-bold: texto en negrita */}
                <h2 className="texto-principal text-center mb-4 text-primary fw-bold">
                  Crear cuenta
                </h2>

                {/* Componente Form de Bootstrap */}
                {/* noValidate: desactiva validación HTML nativa (para usar la validación personalizada) */}
                {/* validated: controla visualmente la validación con estado React */}
                {/* onSubmit: llama a handleSubmit al enviar el formulario */}
                <Form noValidate validated={validated} onSubmit={handleSubmit}>

                  {/* Grupo de formulario para el campo de correo */}
                  {/* mb-3: margen inferior */}
                  {/* controlId asigna un id único al input para relacionar Label y Control */}
                  <Form.Group className="mb-3" controlId="email">
                    {/* Etiqueta del campo */}
                    <Form.Label>Correo electrónico</Form.Label>

                    {/* Input controlado */}
                    {/* required: campo obligatorio */}
                    {/* type="email": valida formato de correo */}
                    {/* placeholder: texto de ayuda dentro del campo */}
                    {/* value: valor actual del estado formData.email */}
                    {/* onChange: actualiza el estado cuando el usuario escribe */}
                    <Form.Control
                      required
                      type="email"
                      placeholder="nombre@correo.com"
                      value={formData.email}
                      onChange={handleChange}
                    />

                    {/* Mensaje que se muestra si la validación falla */}
                    <Form.Control.Feedback type="invalid">
                      Debes ingresar un correo válido
                    </Form.Control.Feedback>
                  </Form.Group>


                  <Form.Group className="mb-3" controlId="password">
                    <Form.Label>Contraseña</Form.Label>
                    <Form.Control
                      required
                      type="password"
                      placeholder="Contraseña"
                      value={formData.password}
                      onChange={handleChange}
                    />
                    <Form.Control.Feedback type="invalid">
                      Debes ingresar una contraseña
                    </Form.Control.Feedback>
                  </Form.Group>

                  <Form.Group className="mb-3" controlId="password2">
                    <Form.Label>Confirmar contraseña</Form.Label>
                    <Form.Control
                      required
                      type="password"
                      placeholder="Repite tu contraseña"
                      value={formData.password2}
                      onChange={handleChange}
                    />
                    <Form.Control.Feedback type="invalid">
                      Las contraseñas no coinciden
                    </Form.Control.Feedback>
                  </Form.Group>

                  <Form.Group className="mb-3" controlId="nombre">
                    <Form.Label>Nombre</Form.Label>
                    <Form.Control
                      required
                      type="text"
                      placeholder="Tu nombre"
                      value={formData.nombre}
                      onChange={handleChange}
                    />
                  </Form.Group>

                  <Form.Group className="mb-3" controlId="apellido">
                    <Form.Label>Apellido</Form.Label>
                    <Form.Control
                      required
                      type="text"
                      placeholder="Tu apellido"
                      value={formData.apellido}
                      onChange={handleChange}
                    />
                  </Form.Group>

                  <Form.Group className="mb-3" controlId="fechaNacimiento">
                    <Form.Label>Fecha de nacimiento</Form.Label>
                    <Form.Control
                      required
                      type="date"
                      value={formData.fechaNacimiento}
                      onChange={handleChange}
                    />
                    <Form.Control.Feedback type="invalid">
                      Debes ser mayor de 18 años
                    </Form.Control.Feedback>
                  </Form.Group>

                  <Form.Group className="mb-3" controlId="codigoReferido">
                    <Form.Label>Código de referido (opcional)</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Si tienes uno"
                      value={formData.codigoReferido}
                      onChange={handleChange}
                    />
                  </Form.Group>

                  <Button variant="primary" type="submit" className="w-100 mt-3">
                    Registrarse
                  </Button>
                </Form>
                <p className="mt-3 text-center text-white">
                  ¿Ya tienes cuenta?{' '}
                  <Link to="/login" className="text-decoration-none text-primary fw-semibold">
                    Iniciar sesión
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

export default Register;
