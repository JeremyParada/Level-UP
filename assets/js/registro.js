'use strict'

const form = document.getElementById('formRegistro');

form.addEventListener('submit', (event) => {
    event.preventDefault(); // evita que el formulario se envie automaticamente
    event.stopPropagation(); // evita que el evento se propague a otros elementos

    const email = document.getElementById('email'); // input de email
    const password = document.getElementById('password'); // input de password
    const password2 = document.getElementById('password2'); // input de confirmacion de password
    const fechaNacimiento = document.getElementById('fechaNacimiento'); // input de fecha de nacimiento

    email.setCustomValidity(''); // limpia cualquier error personalizado previo
    password2.setCustomValidity(''); // ademas cuando es vacio el programa entiende que es un campo valido
    fechaNacimiento.setCustomValidity('');

    // validar formato de correo
    const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // expresion regular para validar email basico
    if (!regexEmail.test(email.value.trim())) { // si el email no coincide con el patron
        email.setCustomValidity('correo invalido'); // como tiene un texto, entonces es invalido y se muestra tooltip
    }

    // validar que las contraseñas coincidan
    if (password.value !== password2.value) { // si password y password2 no son iguales
        password2.setCustomValidity('las contrasenas no coinciden');
    }

    // validar que el usuario sea mayor de 18 anos
    const fecha = new Date(fechaNacimiento.value); // convierte el valor de fecha en objeto date
    const hoy = new Date(); // obtiene la fecha actual
    let edad = hoy.getFullYear() - fecha.getFullYear(); // calcula la diferencia de años
    const mes = hoy.getMonth() - fecha.getMonth(); // calcula la diferencia de meses
    if (mes < 0 || (mes === 0 && hoy.getDate() < fecha.getDate()))
        edad = edad - 1;; // ajusta la edad si aun no cumplio este año
    if (edad < 18) {
        fechaNacimiento.setCustomValidity('debes ser mayor de 18 anos'); // marca fechaNacimiento como invalido
    }

    // comprobar si el formulario es valido
    if (!form.checkValidity()) { // si algun campo es invalido
        form.classList.add('was-validated'); // esta clase cambia la apariencia de los campos según si son validos o invalidos
        return; // detiene la ejecucion
    }

    // obtener correo
    const correo = email.value.trim().toLowerCase();
    
    // si todos los campos son validos
    form.reset(); // limpia los campos del formulario
    form.classList.remove('was-validated'); // quita la clase para resetear el estilo de validacion

    // mensaje de registro exitoso
    if (correo.endsWith('@duoc.cl') || correo.endsWith('@duocuc.cl')) {
        NotificacionManager.exito(
            '🎉 <strong>¡Registro exitoso!</strong><br>🎓 Como estudiante DuocUC tienes <strong>20% de descuento de por vida</strong>',
            6000
        );
    } else {
        NotificacionManager.exito(
            '✅ <strong>¡Registro completado!</strong><br>Bienvenido a Level-UP Gamer'
        );
    }
});
