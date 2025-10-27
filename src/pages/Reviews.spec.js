import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Reviews from './Reviews';
import { NotificationProvider } from '../context/NotificationContext';

describe('Reviews Page', () => {
  it('debe renderizar el título de reseñas', () => {
    render(
      <BrowserRouter>
        <NotificationProvider>
          <Reviews />
        </NotificationProvider>
      </BrowserRouter>
    );
    expect(screen.getByText(/Reseñas de Productos/i)).toBeTruthy();
  });
});