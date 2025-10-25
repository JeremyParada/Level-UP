/**
 * Formatea un número como precio chileno
 * @param {number} precio - Precio a formatear
 * @returns {string} Precio formateado
 */
export const formatearPrecio = (precio) => {
  return new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(Math.round(precio));
};

/**
 * Normaliza texto removiendo tildes y convirtiendo a minúsculas
 * @param {string} texto - Texto a normalizar
 * @returns {string} Texto normalizado
 */
export const normalizarTexto = (texto) => {
  return texto
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
};

/**
 * Valida formato de email
 * @param {string} email - Email a validar
 * @returns {boolean} true si es válido
 */
export const validarEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

/**
 * Calcula la edad a partir de una fecha de nacimiento
 * @param {string} fechaNacimiento - Fecha en formato YYYY-MM-DD
 * @returns {number} Edad en años
 */
export const calcularEdad = (fechaNacimiento) => {
  const hoy = new Date();
  const nacimiento = new Date(fechaNacimiento);
  let edad = hoy.getFullYear() - nacimiento.getFullYear();
  const mes = hoy.getMonth() - nacimiento.getMonth();
  
  if (mes < 0 || (mes === 0 && hoy.getDate() < nacimiento.getDate())) {
    edad--;
  }
  
  return edad;
};