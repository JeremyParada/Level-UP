import * as formatters from './formatters';

describe('Formatters Utils', () => {
  describe('formatearPrecio', () => {
    it('debe formatear precios correctamente', () => {
      expect(formatters.formatearPrecio(25990)).toContain('25.990');
      expect(formatters.formatearPrecio(1000000)).toContain('1.000.000');
    });

    it('debe manejar precios con decimales', () => {
      const resultado = formatters.formatearPrecio(25990.50);
      // Debe contener 25.990 o 25.991 (dependiendo del redondeo)
      const tieneFormato = resultado.includes('25.990') || resultado.includes('25.991');
      expect(tieneFormato).toBe(true);
    });

    it('debe manejar cero', () => {
      expect(formatters.formatearPrecio(0)).toContain('0');
    });
  });

  describe('normalizarTexto', () => {
    it('debe convertir a minúsculas', () => {
      expect(formatters.normalizarTexto('HOLA')).toBe('hola');
    });

    it('debe remover tildes', () => {
      expect(formatters.normalizarTexto('áéíóú')).toBe('aeiou');
    });

    it('debe normalizar texto completo', () => {
      expect(formatters.normalizarTexto('Ratón Gaming')).toBe('raton gaming');
    });
  });

  describe('validarEmail', () => {
    it('debe validar emails correctos', () => {
      expect(formatters.validarEmail('test@ejemplo.com')).toBe(true);
      expect(formatters.validarEmail('usuario@duocuc.cl')).toBe(true);
    });

    it('debe rechazar emails inválidos', () => {
      expect(formatters.validarEmail('invalido')).toBe(false);
      expect(formatters.validarEmail('@ejemplo.com')).toBe(false);
      expect(formatters.validarEmail('test@')).toBe(false);
    });
  });

  describe('calcularEdad', () => {
    it('debe calcular edad correctamente', () => {
      const hace20Anos = new Date();
      hace20Anos.setFullYear(hace20Anos.getFullYear() - 20);
      const fecha = hace20Anos.toISOString().split('T')[0];
      
      const edad = formatters.calcularEdad(fecha);
      expect(edad).toBeGreaterThanOrEqual(19);
      expect(edad).toBeLessThanOrEqual(20);
    });

    it('debe considerar mes y día de cumpleaños', () => {
      // Crear una fecha de hace 18 años + 2 días
      const hoy = new Date();
      const fechaNacimiento = new Date(hoy);
      fechaNacimiento.setFullYear(fechaNacimiento.getFullYear() - 18);
      fechaNacimiento.setDate(fechaNacimiento.getDate() + 2);
      
      const fecha = fechaNacimiento.toISOString().split('T')[0];
      const edad = formatters.calcularEdad(fecha);
      
      // Si el cumpleaños es dentro de 2 días, aún tiene 17
      expect(edad).toBe(17);
    });
  });
});