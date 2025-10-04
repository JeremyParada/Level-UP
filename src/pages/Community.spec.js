import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Community from './Community';
import { NotificationContext } from '../context/NotificationContext';

describe('Community Page', () => {
  let mockNotificationContext;

  beforeEach(() => {
    mockNotificationContext = {
      exito: jasmine.createSpy('exito'),
      error: jasmine.createSpy('error'),
      info: jasmine.createSpy('info'),
      advertencia: jasmine.createSpy('advertencia'),
      notificaciones: []
    };
  });

  const renderComponent = () => {
    return render(
      <BrowserRouter>
        <NotificationContext.Provider value={mockNotificationContext}>
          <Community />
        </NotificationContext.Provider>
      </BrowserRouter>
    );
  };

  it('debe renderizar el título de comunidad', () => {
    renderComponent();
    expect(screen.getByText('Comunidad Gamer')).toBeTruthy();
  });

  it('debe mostrar eventos y torneos', () => {
    renderComponent();
    expect(screen.getByText('Eventos y Torneos')).toBeTruthy();
    expect(screen.getByText(/Torneo League of Legends/i)).toBeTruthy();
  });

  it('debe permitir inscribirse a eventos', () => {
    renderComponent();

    const botonesInscribir = screen.getAllByText('Inscribirme');
    fireEvent.click(botonesInscribir[0]);

    expect(mockNotificationContext.exito).toHaveBeenCalled();
  });

  it('debe mostrar mapa de eventos', () => {
    renderComponent();
    expect(screen.getByText('Mapa de Eventos en Chile')).toBeTruthy();
    expect(screen.getByTitle('Mapa de eventos')).toBeTruthy();
  });

  it('debe mostrar blog y guías', () => {
    renderComponent();
    expect(screen.getByText('Blog y Guías Gaming')).toBeTruthy();
    expect(screen.getByText(/Optimiza tu PC/i)).toBeTruthy();
  });

  it('debe mostrar información de soporte técnico', () => {
    renderComponent();
    expect(screen.getByText('Soporte Técnico')).toBeTruthy();
    expect(screen.getByText(/Chat WhatsApp/i)).toBeTruthy();
  });

  it('debe mostrar ranking de gamers', () => {
    renderComponent();
    expect(screen.getByText(/Top Gamers del Mes/i)).toBeTruthy();
    expect(screen.getByText('ProGamer_CL')).toBeTruthy();
  });

  it('debe mostrar desafíos de la comunidad', () => {
    renderComponent();
    expect(screen.getByText(/Desafíos de la Comunidad/i)).toBeTruthy();
    expect(screen.getByText(/Compra tu primer producto/i)).toBeTruthy();
  });

  it('debe mostrar puntos en eventos', () => {
    renderComponent();
    expect(screen.getByText(/\+200 puntos/i)).toBeTruthy();
  });

  it('debe tener enlaces funcionales a artículos', () => {
    renderComponent();

    const botonesLeerMas = screen.getAllByText(/Leer más/i);
    fireEvent.click(botonesLeerMas[0]);

    expect(mockNotificationContext.info).toHaveBeenCalled();
  });

  it('debe mostrar próximos eventos', () => {
    renderComponent();
    expect(screen.getByText('Próximos Eventos')).toBeTruthy();
  });
});