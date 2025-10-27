import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Cart from './Cart';
import { CartProvider } from '../context/CartContext';
import { NotificationProvider } from '../context/NotificationContext';

describe('Cart Page', () => {
  const renderWithProviders = () => {
    render(
      <BrowserRouter>
        <NotificationProvider>
          <CartProvider>
            <Cart />
          </CartProvider>
        </NotificationProvider>
      </BrowserRouter>
    );
  };

  beforeEach(() => {
    // Configurar un estado inicial para el carrito y el usuario
    localStorage.setItem(
      'carrito',
      JSON.stringify([
        { codigo: 'PROD001', nombre: 'Producto 1', cantidad: 1, precio: 10000 },
      ])
    );
    localStorage.setItem('usuario', JSON.stringify({ nombre: 'Usuario Test' }));
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('debe mostrar un mensaje cuando el carrito está vacío', () => {
    localStorage.setItem('carrito', JSON.stringify([])); // Carrito vacío
    renderWithProviders();
    expect(screen.getByText(/tu carrito está vacío/i)).toBeInTheDocument();
  });

  it('debe manejar el cambio de cantidad de un producto', () => {
    renderWithProviders();
    const btnIncrementar = screen.getAllByRole('button', { name: '-' })[0];
    fireEvent.click(btnIncrementar);
    // Agregar expectativas específicas según el comportamiento esperado
  });

  it('debe eliminar un producto del carrito', () => {
    renderWithProviders();
    const btnEliminar = screen.getAllByRole('button', { name: /eliminar/i })[0];
    fireEvent.click(btnEliminar);
    expect(screen.queryByText(/producto 1/i)).not.toBeInTheDocument();
  });

  it('debe vaciar el carrito', () => {
    renderWithProviders();
    const btnVaciar = screen.getByRole('button', { name: /vaciar carrito/i });
    fireEvent.click(btnVaciar);
    expect(screen.getByText(/tu carrito está vacío/i)).toBeInTheDocument();
  });

  it('debe aplicar un descuento válido', () => {
    renderWithProviders();
    const inputCodigo = screen.getByPlaceholderText(/ej: duoc20/i);
    const btnAplicar = screen.getByRole('button', { name: /aplicar/i });

    fireEvent.change(inputCodigo, { target: { value: 'DUOC20' } });
    fireEvent.click(btnAplicar);

    expect(screen.getByText(/¡descuento duocuc aplicado!/i)).toBeInTheDocument();
  });

  it('debe manejar el intento de finalizar la compra con un carrito vacío', () => {
    localStorage.setItem('carrito', JSON.stringify([])); // Carrito vacío
    renderWithProviders();
    const btnFinalizar = screen.getByRole('button', { name: /finalizar compra/i });
    fireEvent.click(btnFinalizar);

    expect(
      screen.getByText(/tu carrito está vacío. agrega productos antes de finalizar la compra./i)
    ).toBeInTheDocument();
  });

  it('debe redirigir al registro si el usuario no está autenticado', () => {
    localStorage.removeItem('usuario'); // Usuario no autenticado
    renderWithProviders();
    const btnFinalizar = screen.getByRole('button', { name: /finalizar compra/i });
    fireEvent.click(btnFinalizar);

    // Simular confirmación del usuario
    window.confirm = jest.fn(() => true);

    expect(window.location.pathname).toBe('/registro');
  });
});