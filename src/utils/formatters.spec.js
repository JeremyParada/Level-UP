import * as formatters from './formatters';

describe('Formatters Utils', () => {
  describe('formatearPrecio', () => {
    it('debe formatear precios enteros correctamente', () => {
      expect(formatters.formatearPrecio(25990)).toContain('25.990');
      expect(formatters.formatearPrecio(100000)).toContain('100.000');
    });

    it('debe formatear cero correctamente', () => {
      const resultado = formatters.formatearPrecio(0);
      expect(resultado).toContain('0');
    });

    it('debe formatear precios grandes correctamente', () => {
      expect(formatters.formatearPrecio(1500000)).toContain('1.500.000');
    });

    it('debe manejar números negativos', () => {
      const resultado = formatters.formatearPrecio(-1000);
      expect(resultado).toContain('-');
      expect(resultado).toContain('1.000');
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
      
      expect(formatters.calcularEdad(fecha)).toBe(20);
    });

    it('debe considerar mes y día de cumpleaños', () => {
      const hoy = new Date();
      const manana = new Date(hoy);
      manana.setDate(manana.getDate() + 1);
      manana.setFullYear(manana.getFullYear() - 18);
      
      const fecha = manana.toISOString().split('T')[0];
      expect(formatters.calcularEdad(fecha)).toBe(17);
    });
  });
});