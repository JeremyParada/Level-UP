import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Home from './Home';

describe('Home Page', () => {
  const mockProductos = [
    { codigo: 'PROD001', nombre: 'Producto 1', precio: 10000, imagen: 'imagen1.jpg' },
    { codigo: 'PROD002', nombre: 'Producto 2', precio: 20000, imagen: 'imagen2.jpg' },
    { codigo: 'PROD003', nombre: 'Producto 3', precio: 30000, imagen: 'imagen3.jpg' },
  ];

  beforeEach(() => {
    spyOn(window, 'fetch').and.returnValue(
      Promise.resolve({
        json: () => Promise.resolve(mockProductos),
        ok: true
      })
    );
    spyOn(console, 'error');
  });

  it('debe renderizar el título principal', () => {
    render(
      <BrowserRouter>
        <Home />
      </BrowserRouter>
    );
    expect(screen.getByText(/Tu tienda online de confianza para productos gaming/i)).toBeTruthy();
  });

  it('debe cargar y mostrar productos destacados', async () => {
    render(
      <BrowserRouter>
        <Home />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/🔥 Productos Destacados/i)).toBeTruthy();
      expect(screen.getByText(/Producto 1/i)).toBeTruthy();
      expect(screen.getByText(/Producto 2/i)).toBeTruthy();
      expect(screen.getByText(/Producto 3/i)).toBeTruthy();
    });
  });

  it('debe manejar errores al cargar productos', async () => {
    window.fetch.and.returnValue(Promise.reject('Error cargando productos'));

    render(
      <BrowserRouter>
        <Home />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(console.error).toHaveBeenCalled();
    });
  });
});