import React from 'react';
import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Cart from './Cart';
import { CartProvider } from '../context/CartContext';
import { NotificationProvider } from '../context/NotificationContext';

describe('Cart Page', () => {
  it('debe renderizar el componente Cart', () => {
    render(
      <BrowserRouter>
        <NotificationProvider>
          <CartProvider>
            <Cart />
          </CartProvider>
        </NotificationProvider>
      </BrowserRouter>
    );
    // No se realizan expectativas, la prueba siempre pasará.
  });
});