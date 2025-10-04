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
      // Crear fecha 18 años atrás pero un día en el futuro
      const hoy = new Date();
      const hace18Anos = new Date(hoy);
      hace18Anos.setFullYear(hace18Anos.getFullYear() - 18);
      
      // Sumar un día para que el cumpleaños sea mañana
      hace18Anos.setDate(hace18Anos.getDate() + 1);
      
      const fecha = hace18Anos.toISOString().split('T')[0];
      const edad = formatters.calcularEdad(fecha);
      
      // Debería ser 17 porque el cumpleaños aún no ha llegado
      expect(edad).toBe(17);
    });
  });
});