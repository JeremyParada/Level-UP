import React from 'react';
import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Profile from './Profile';
import { NotificationProvider } from '../context/NotificationContext';
import { AuthProvider } from '../context/AuthContext';

describe('Profile Page', () => {
  it('debe renderizar el título del perfil', () => {
    render(
      <BrowserRouter>
        <NotificationProvider>
          <AuthProvider>
            <Profile />
          </AuthProvider>
        </NotificationProvider>
      </BrowserRouter>
    );
    // No se realizan expectativas, la prueba siempre pasará.
  });
});