import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Profile from './Profile';
import { NotificationContext } from '../context/NotificationContext';

describe('Profile Page', () => {
  let mockNotificationContext;

  beforeEach(() => {
    mockNotificationContext = {
      exito: jasmine.createSpy('exito'),
      error: jasmine.createSpy('error'),
      info: jasmine.createSpy('info'),
      advertencia: jasmine.createSpy('advertencia'),
      notificaciones: []
    };

    const mockUsuario = {
      nombre: 'Juan',
      apellido: 'Pérez',
      email: 'juan.perez@duocuc.cl',
      gamerTag: 'JuanGamer',
      fechaNacimiento: '2000-01-01',
      telefono: '+56912345678',
      juegoFavorito: 'Valorant',
      puntos: 500,
      nivel: 3,
      codigoReferido: 'GAMER123',
      fechaRegistro: '2024-01-01'
    };

    localStorage.setItem('usuario', JSON.stringify(mockUsuario));
    localStorage.setItem('historialCompras', JSON.stringify([]));

    // Mock del clipboard API
    Object.defineProperty(navigator, 'clipboard', {
      value: {
        writeText: jasmine.createSpy('writeText').and.returnValue(Promise.resolve())
      },
      writable: true,
      configurable: true
    });
  });

  afterEach(() => {
    localStorage.clear();
    delete navigator.clipboard;
  });

  const renderComponent = () => {
    return render(
      <BrowserRouter>
        <NotificationContext.Provider value={mockNotificationContext}>
          <Profile />
        </NotificationContext.Provider>
      </BrowserRouter>
    );
  };

  it('debe renderizar el título del perfil', () => {
    renderComponent();
    expect(screen.getByText('Mi Perfil Gamer')).toBeTruthy();
  });

  it('debe cargar los datos del usuario', () => {
    renderComponent();
    
    expect(screen.getByDisplayValue('Juan')).toBeTruthy();
    expect(screen.getByDisplayValue('Pérez')).toBeTruthy();
    expect(screen.getByDisplayValue('juan.perez@duocuc.cl')).toBeTruthy();
  });

  it('debe mostrar puntos LevelUp', () => {
    renderComponent();
    expect(screen.getByText('500')).toBeTruthy();
    expect(screen.getByText(/puntos totales/i)).toBeTruthy();
  });

  it('debe mostrar barra de progreso de nivel', () => {
    renderComponent();
    const progressBar = document.querySelector('.progress-bar');
    expect(progressBar).toBeTruthy();
  });

  it('debe actualizar el perfil correctamente', () => {
    renderComponent();

    const inputNombre = screen.getByDisplayValue('Juan');
    fireEvent.change(inputNombre, { target: { value: 'Pedro' } });

    const btnActualizar = screen.getByText('Actualizar Perfil');
    fireEvent.click(btnActualizar);

    expect(mockNotificationContext.exito).toHaveBeenCalled();
  });

  it('debe mostrar descuento DuocUC para emails @duocuc.cl', () => {
    renderComponent();
    expect(screen.getByText(/Descuento DuocUC/i)).toBeTruthy();
  });

  it('debe copiar código de referido', async () => {
    renderComponent();

    const btnCopiar = screen.getByText('📋 Copiar');
    
    // Hacer click y esperar de inmediato
    fireEvent.click(btnCopiar);

    // Esperar un poco más para el Promise
    await waitFor(() => {
      expect(navigator.clipboard.writeText).toHaveBeenCalledWith('GAMER123');
      expect(mockNotificationContext.exito).toHaveBeenCalled();
    }, { timeout: 5000 });
  });

  it('debe mostrar mensaje cuando no hay compras', () => {
    renderComponent();
    expect(screen.getByText(/Aún no has realizado compras/i)).toBeTruthy();
  });

  it('debe calcular nivel correctamente', () => {
    renderComponent();
    expect(screen.getByText(/Nivel 3/i)).toBeTruthy();
  });

  it('debe mostrar puntos para siguiente nivel', () => {
    renderComponent();
    expect(screen.getByText(/puntos para nivel/i)).toBeTruthy();
  });
});