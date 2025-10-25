import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { NotificationContext } from '../context/NotificationContext';

const Register = () => {
  const navigate = useNavigate();
  const { exito, error } = useContext(NotificationContext);
  
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

    // Validaciones personalizadas
    let esValido = true;
    let mensajesError = [];

    // Validar email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      esValido = false;
      mensajesError.push('Email inválido');
    }

    // Validar contraseñas
    if (formData.password.length < 6) {
      esValido = false;
      mensajesError.push('La contraseña debe tener al menos 6 caracteres');
    }

    if (formData.password !== formData.password2) {
      esValido = false;
      mensajesError.push('Las contraseñas no coinciden');
    }

    // Validar edad
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

    // Guardar usuario en localStorage
    const usuario = {
      email: formData.email,
      nombre: formData.nombre,
      apellido: formData.apellido,
      fechaNacimiento: formData.fechaNacimiento,
      codigoReferido: formData.codigoReferido,
      puntos: 100,
      nivel: 1,
      fechaRegistro: new Date().toISOString()
    };

    localStorage.setItem('usuario', JSON.stringify(usuario));

    // Aplicar descuento DuocUC si corresponde
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
    <main>
      <section className="text-center fondo-catalogo">
        <div className="row justify-content-center py-5 fondo-texto-catalogo">
          <div className="col-lg-6 col-md-8">
            <div className="card card-formulario rounded-4 p-4">
              <h2 className="texto-principal mb-4 color-acento-azul">Crear cuenta</h2>

              <form 
                id="formRegistro" 
                className={`needs-validation ${validated ? 'was-validated' : ''}`} 
                noValidate
                onSubmit={handleSubmit}
              >
                {/* Correo */}
                <div className="mb-3 position-relative text-start">
                  <label htmlFor="email" className="form-label">Correo electrónico</label>
                  <input 
                    type="email" 
                    className="form-control" 
                    id="email" 
                    placeholder="nombre@correo.com"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                  <div className="invalid-feedback">
                    Debes ingresar un correo válido
                  </div>
                </div>

                {/* Contraseña */}
                <div className="mb-3 position-relative text-start">
                  <label htmlFor="password" className="form-label">Contraseña</label>
                  <input 
                    type="password" 
                    className="form-control" 
                    id="password" 
                    placeholder="Contraseña"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                  <div className="invalid-feedback">
                    Debes ingresar una contraseña
                  </div>
                </div>

                {/* Confirmar contraseña */}
                <div className="mb-3 position-relative text-start">
                  <label htmlFor="password2" className="form-label">Confirmar contraseña</label>
                  <input 
                    type="password" 
                    className="form-control" 
                    id="password2"
                    placeholder="Repite tu contraseña"
                    value={formData.password2}
                    onChange={handleChange}
                    required
                  />
                  <div className="invalid-feedback">
                    Las contraseñas no coinciden
                  </div>
                </div>

                {/* Nombre */}
                <div className="mb-3 position-relative text-start">
                  <label htmlFor="nombre" className="form-label">Nombre</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    id="nombre" 
                    placeholder="Tu nombre"
                    value={formData.nombre}
                    onChange={handleChange}
                    required
                  />
                  <div className="invalid-feedback">
                    Debes ingresar tu nombre
                  </div>
                </div>

                {/* Apellido */}
                <div className="mb-3 position-relative text-start">
                  <label htmlFor="apellido" className="form-label">Apellido</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    id="apellido" 
                    placeholder="Tu apellido"
                    value={formData.apellido}
                    onChange={handleChange}
                    required
                  />
                  <div className="invalid-feedback">
                    Debes ingresar tu apellido
                  </div>
                </div>

                {/* Fecha nacimiento */}
                <div className="mb-3 position-relative text-start">
                  <label htmlFor="fechaNacimiento" className="form-label">Fecha de nacimiento</label>
                  <input 
                    type="date" 
                    className="form-control" 
                    id="fechaNacimiento"
                    value={formData.fechaNacimiento}
                    onChange={handleChange}
                    required
                  />
                  <div className="invalid-feedback">
                    Debes ser mayor de 18 años
                  </div>
                </div>

                {/* Codigo de referido */}
                <div className="mb-3 position-relative text-start">
                  <label htmlFor="codigoReferido" className="form-label">
                    Código de referido (opcional)
                  </label>
                  <input 
                    type="text" 
                    className="form-control" 
                    id="codigoReferido" 
                    placeholder="Si tienes uno"
                    value={formData.codigoReferido}
                    onChange={handleChange}
                  />
                </div>

                <button type="submit" className="btn btn-registrarse w-100 mt-3">
                  Registrarse
                </button>
              </form>

              <p className="mt-3 text-center">
                ¿Ya tienes cuenta? <a href="#" className="color-acento-azul">Inicia sesión</a>
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Register;