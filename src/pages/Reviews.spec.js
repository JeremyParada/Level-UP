import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Reviews from './Reviews';
import { NotificationProvider } from '../context/NotificationContext';

describe('Reviews Page', () => {
  const renderWithProviders = () => {
    render(
      <BrowserRouter>
        <NotificationProvider>
          <Reviews />
        </NotificationProvider>
      </BrowserRouter>
    );
  };

  beforeEach(() => {
    // Simular datos en localStorage
    localStorage.setItem(
      'resenas',
      JSON.stringify([
        {
          id: 1,
          codigoProducto: 'PROD001',
          nombreProducto: 'Producto 1',
          calificacion: 5,
          nombreUsuario: 'Usuario Test',
          comentario: 'Excelente producto',
          fecha: '27/10/2025',
        },
      ])
    );
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('debe renderizar el título de la página', () => {
    renderWithProviders();
    expect(screen.getByText(/Reseñas de Productos/i)).toBeInTheDocument();
  });

  it('debe cargar y mostrar las reseñas guardadas', () => {
    renderWithProviders();
    expect(screen.getByText(/Producto 1/i)).toBeInTheDocument();
    expect(screen.getByText(/Excelente producto/i)).toBeInTheDocument();
  });

  it('debe mostrar un mensaje si no hay reseñas', () => {
    localStorage.setItem('resenas', JSON.stringify([])); // Sin reseñas
    renderWithProviders();
    expect(screen.getByText(/Aún no hay reseñas/i)).toBeInTheDocument();
  });

  it('debe filtrar reseñas por producto', () => {
    renderWithProviders();
    const inputFiltroProducto = screen.getByPlaceholderText(/Buscar por producto/i);
    fireEvent.change(inputFiltroProducto, { target: { value: 'Producto 1' } });
    expect(screen.getByText(/Producto 1/i)).toBeInTheDocument();
  });

  it('debe filtrar reseñas por calificación', () => {
    renderWithProviders();
    const selectFiltroCalificacion = screen.getByDisplayValue(/Todas las calificaciones/i);
    fireEvent.change(selectFiltroCalificacion, { target: { value: '5' } });
    expect(screen.getByText(/Producto 1/i)).toBeInTheDocument();
  });

  it('debe mostrar un mensaje si no hay reseñas que coincidan con los filtros', () => {
    renderWithProviders();
    const inputFiltroProducto = screen.getByPlaceholderText(/Buscar por producto/i);
    fireEvent.change(inputFiltroProducto, { target: { value: 'Producto Inexistente' } });
    expect(screen.getByText(/No se encontraron reseñas con esos filtros/i)).toBeInTheDocument();
  });

  it('debe manejar el envío de una reseña válida', async () => {
    renderWithProviders();

    fireEvent.change(screen.getByLabelText(/Producto/i), { target: { value: 'Producto 1' } });
    fireEvent.change(screen.getByLabelText(/Calificación/i), { target: { value: '5' } });
    fireEvent.change(screen.getByLabelText(/Tu nombre/i), { target: { value: 'Nuevo Usuario' } });
    fireEvent.change(screen.getByLabelText(/Tu reseña/i), { target: { value: 'Muy buen producto' } });

    const btnPublicarResena = screen.getByRole('button', { name: /Publicar Reseña/i });
    fireEvent.click(btnPublicarResena);

    await waitFor(() => {
      expect(screen.getByText(/¡Reseña publicada exitosamente!/i)).toBeInTheDocument();
    });
  });

  it('debe mostrar un error si la reseña está incompleta', async () => {
    renderWithProviders();

    const btnPublicarResena = screen.getByRole('button', { name: /Publicar Reseña/i });
    fireEvent.click(btnPublicarResena);

    await waitFor(() => {
      expect(screen.getByText(/Por favor completa todos los campos/i)).toBeInTheDocument();
    });
  });
});