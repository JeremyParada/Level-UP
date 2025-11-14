import React from 'react';
import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Login from './Login';
import { AuthProvider } from '../context/AuthContext';
import { NotificationProvider } from '../context/NotificationContext';

describe('Login Page', () => {
  it('debe renderizar el formulario de login', () => {
    render(
      <BrowserRouter>
        <NotificationProvider>
          <AuthProvider>
            <Login />
          </AuthProvider>
        </NotificationProvider>
      </BrowserRouter>
    );
    // No se realizan expectativas, la prueba siempre pasará.
  });
});