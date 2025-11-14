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
    codigoReferido: '',
    telefono: '',
    calle: '',
    numero: '',
    comuna: '',
    ciudad: '',
    region: '',
    codigoPostal: ''
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

    if (!form.checkValidity()) {
      setValidated(true);
      return;
    }

    // Validar dirección
    if (!formData.calle || !formData.numero || !formData.comuna || !formData.ciudad || !formData.region) {
      error('Todos los campos de dirección son obligatorios.');
      return;
    }

    // Validar teléfono
    const regexTelefono = /^\+56 9 \d{4} \d{4}$/;
    if (!regexTelefono.test(formData.telefono)) {
      error('El teléfono debe tener el formato +56 9 XXXX XXXX.');
      return;
    }

    // Validar código postal
    if (formData.codigoPostal && isNaN(formData.codigoPostal)) {
      error('El código postal debe ser un número.');
      return;
    }

    // Continuar con el registro
    registrarUsuario();
  };

  const registrarUsuario = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/v1/usuarios/registro`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        exito('¡Registro exitoso! 🎉');
        navigate('/perfil');
      } else {
        error(data.error || 'Error al registrar usuario.');
      }
    } catch (err) {
      console.error('Error al registrar usuario:', err);
      error('Error al registrar usuario.');
    }
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

                  <Form.Group className="mb-3" controlId="telefono">
                    <Form.Label>Teléfono</Form.Label>
                    <Form.Control
                      required
                      type="text"
                      placeholder="+56 9 XXXX XXXX"
                      value={formData.telefono}
                      onChange={handleChange}
                    />
                    <Form.Control.Feedback type="invalid">
                      El teléfono debe tener el formato +56 9 XXXX XXXX
                    </Form.Control.Feedback>
                  </Form.Group>

                  <Form.Group className="mb-3" controlId="calle">
                    <Form.Label>Calle</Form.Label>
                    <Form.Control
                      required
                      type="text"
                      placeholder="Ej: Av. Siempre Viva"
                      value={formData.calle}
                      onChange={handleChange}
                    />
                    <Form.Control.Feedback type="invalid">
                      Debes ingresar una calle.
                    </Form.Control.Feedback>
                  </Form.Group>

                  <Form.Group className="mb-3" controlId="numero">
                    <Form.Label>Número</Form.Label>
                    <Form.Control
                      required
                      type="text"
                      placeholder="Ej: 742"
                      value={formData.numero}
                      onChange={handleChange}
                    />
                    <Form.Control.Feedback type="invalid">
                      Debes ingresar un número.
                    </Form.Control.Feedback>
                  </Form.Group>

                  <Form.Group className="mb-3" controlId="comuna">
                    <Form.Label>Comuna</Form.Label>
                    <Form.Control
                      required
                      type="text"
                      placeholder="Ej: Springfield"
                      value={formData.comuna}
                      onChange={handleChange}
                    />
                    <Form.Control.Feedback type="invalid">
                      Debes ingresar una comuna.
                    </Form.Control.Feedback>
                  </Form.Group>

                  <Form.Group className="mb-3" controlId="ciudad">
                    <Form.Label>Ciudad</Form.Label>
                    <Form.Control
                      required
                      type="text"
                      placeholder="Ej: Springfield"
                      value={formData.ciudad}
                      onChange={handleChange}
                    />
                    <Form.Control.Feedback type="invalid">
                      Debes ingresar una ciudad.
                    </Form.Control.Feedback>
                  </Form.Group>

                  <Form.Group className="mb-3" controlId="region">
                    <Form.Label>Región</Form.Label>
                    <Form.Control
                      required
                      type="text"
                      placeholder="Ej: Región Metropolitana"
                      value={formData.region}
                      onChange={handleChange}
                    />
                    <Form.Control.Feedback type="invalid">
                      Debes ingresar una región.
                    </Form.Control.Feedback>
                  </Form.Group>

                  <Form.Group className="mb-3" controlId="codigoPostal">
                    <Form.Label>Código Postal</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Ej: 1234567"
                      value={formData.codigoPostal}
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
