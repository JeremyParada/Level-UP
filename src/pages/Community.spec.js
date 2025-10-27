import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Community from './Community';
import { NotificationProvider } from '../context/NotificationContext';

describe('Community Page', () => {
  it('debe renderizar el título de comunidad', () => {
    render(
      <BrowserRouter>
        <NotificationProvider>
          <Community />
        </NotificationProvider>
      </BrowserRouter>
    );
    expect(screen.getByText(/Comunidad Gamer/i)).toBeTruthy();
  });
});