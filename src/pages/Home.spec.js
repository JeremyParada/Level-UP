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
    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve(mockProductos),
      })
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('debe renderizar el título principal', () => {
    render(
      <BrowserRouter>
        <Home />
      </BrowserRouter>
    );
    expect(screen.getByText(/Tu tienda online de confianza para productos gaming/i)).toBeInTheDocument();
  });

  it('debe cargar y mostrar productos destacados', async () => {
    render(
      <BrowserRouter>
        <Home />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/🔥 Productos Destacados/i)).toBeInTheDocument();
      expect(screen.getByText(/Producto 1/i)).toBeInTheDocument();
      expect(screen.getByText(/Producto 2/i)).toBeInTheDocument();
      expect(screen.getByText(/Producto 3/i)).toBeInTheDocument();
    });
  });

  it('debe manejar errores al cargar productos', async () => {
    global.fetch = jest.fn(() => Promise.reject('Error cargando productos'));

    render(
      <BrowserRouter>
        <Home />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(global.console.error).toHaveBeenCalledWith('Error cargando productos:', 'Error cargando productos');
    });
  });
});