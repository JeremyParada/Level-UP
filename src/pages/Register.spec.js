import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Register from './Register';
import { NotificationProvider } from '../context/NotificationContext';
import { AuthProvider } from '../context/AuthContext'; // Importa el AuthProvider

describe('Register Page', () => {
  it('debe renderizar el formulario de registro', () => {
    render(
      <MemoryRouter>
        <NotificationProvider>
          <AuthProvider> {/* Agrega el AuthProvider */}
            <Register />
          </AuthProvider>
        </NotificationProvider>
      </MemoryRouter>
    );
    expect(screen.getByText(/Registrarse/i)).toBeTruthy();
  });
});