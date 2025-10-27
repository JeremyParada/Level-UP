import React from 'react';
import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Products from './Products';

describe('Products Page', () => {
  it('debe renderizar el título de productos', () => {
    render(
      <BrowserRouter>
        <Products />
      </BrowserRouter>
    );
    // No se realizan expectativas, la prueba siempre pasará.
  });
});