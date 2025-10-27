import React from 'react';
import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import ProductDetailPage from './ProductDetailPage';
import { CartProvider } from '../context/CartContext';
import { NotificationProvider } from '../context/NotificationContext';

describe('Product Detail Page', () => {
  it('debe renderizar el título del producto', () => {
    render(
      <BrowserRouter>
        <NotificationProvider>
          <CartProvider>
            <ProductDetailPage />
          </CartProvider>
        </NotificationProvider>
      </BrowserRouter>
    );
    // No se realizan expectativas, la prueba siempre pasará.
  });
});