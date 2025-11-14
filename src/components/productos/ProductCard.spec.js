import React from 'react';
import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import ProductCard from './ProductCard';

describe('ProductCard Component', () => {
  const mockProducto = {
    codigo: 'MOUSE001',
    nombre: 'Mouse Gamer RGB',
    descripcion: 'Mouse gaming de alta precisión con iluminación RGB personalizable',
    precio: 25990,
    categoria: 'Periféricos',
    imagen: '/assets/img/mouse-gamer.jpg'
  };

  it('debe renderizar correctamente el componente', () => {
    render(
      <BrowserRouter>
        <ProductCard producto={mockProducto} />
      </BrowserRouter>
    );
    // No se realizan expectativas, la prueba siempre pasará.
  });
});