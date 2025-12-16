import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import ProductDetailPage from './ProductDetailPage';
import { CartProvider } from '../context/CartContext';
import { NotificationProvider } from '../context/NotificationContext';

describe('Product Detail Page', () => {
  const renderWithProviders = () => {
    render(
      <MemoryRouter initialEntries={['/productos/PROD001']}>
        <NotificationProvider>
          <CartProvider>
            <ProductDetailPage />
          </CartProvider>
        </NotificationProvider>
      </MemoryRouter>
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

  it('debe mostrar un mensaje de carga mientras se obtiene el producto', () => {
    renderWithProviders();
    expect(screen.getByText(/Cargando.../i)).toBeTruthy();
  });

  it('debe mostrar un mensaje si el producto no se encuentra', async () => {
    spyOn(window, 'fetch').and.returnValue(
      Promise.resolve({
        ok: false,
        json: () => Promise.resolve({ error: 'Producto no encontrado' }),
      })
    );

    renderWithProviders();

    await waitFor(() => {
      expect(screen.getByText(/Producto no encontrado/i)).toBeTruthy();
    });
  });

  it('debe cargar y mostrar el producto correctamente', async () => {
    spyOn(window, 'fetch').and.returnValue(
      Promise.resolve({
        ok: true,
        json: () =>
          Promise.resolve({
            codigo: 'PROD001',
            nombre: 'Producto 1',
            descripcion: 'Descripción del producto',
            precio: 10000,
            categoria: 'Categoría',
            imagen: 'imagen.jpg',
          }),
      })
    );

    renderWithProviders();

    await waitFor(() => {
      expect(screen.getByText(/Producto 1/i)).toBeTruthy();
      expect(screen.getByText(/Descripción del producto/i)).toBeTruthy();
    });
  });

  it('debe manejar el cambio de cantidad', async () => {
    renderWithProviders();

    const btnIncrementar = screen.getByRole('button', { name: '+' });
    const btnDecrementar = screen.getByRole('button', { name: '-' });

    fireEvent.click(btnIncrementar);
    expect(screen.getByDisplayValue('2')).toBeTruthy();

    fireEvent.click(btnDecrementar);
    expect(screen.getByDisplayValue('1')).toBeTruthy();
  });

  it('debe agregar el producto al carrito', async () => {
    renderWithProviders();

    const btnAgregarCarrito = screen.getByRole('button', { name: /Agregar al Carrito/i });
    fireEvent.click(btnAgregarCarrito);

    await waitFor(() => {
      expect(screen.getByText(/¡Producto agregado al carrito!/i)).toBeTruthy();
    });
  });

  it('debe manejar el envío de una reseña válida', async () => {
    renderWithProviders();

    fireEvent.change(screen.getByLabelText(/Calificación/i), { target: { value: '5' } });
    fireEvent.change(screen.getByLabelText(/Tu nombre/i), { target: { value: 'Nuevo Usuario' } });
    fireEvent.change(screen.getByLabelText(/Comentario/i), { target: { value: 'Muy buen producto' } });

    const btnPublicarResena = screen.getByRole('button', { name: /Publicar Reseña/i });
    fireEvent.click(btnPublicarResena);

    await waitFor(() => {
      expect(screen.getByText(/¡Reseña publicada exitosamente!/i)).toBeTruthy();
    });
  });

  it('debe mostrar un error si la reseña está incompleta', async () => {
    renderWithProviders();

    const btnPublicarResena = screen.getByRole('button', { name: /Publicar Reseña/i });
    fireEvent.click(btnPublicarResena);

    await waitFor(() => {
      expect(screen.getByText(/Por favor completa todos los campos de la reseña/i)).toBeTruthy();
    });
  });

  it('debe manejar errores al cargar el producto', async () => {
    spyOn(window, 'fetch').and.returnValue(Promise.reject('Error al cargar el producto'));

    renderWithProviders();

    await waitFor(() => {
      expect(screen.getByText(/Error al cargar el producto/i)).toBeTruthy();
    });
  });

  it('debe deshabilitar el botón de incrementar cantidad al alcanzar el límite máximo', async () => {
    renderWithProviders();

    const btnIncrementar = screen.getByRole('button', { name: '+' });

    // Incrementar hasta el límite
    for (let i = 0; i < 10; i++) {
      fireEvent.click(btnIncrementar);
    }

    expect(screen.getByDisplayValue('10')).toBeTruthy();
    expect(btnIncrementar.disabled).toBe(true);
  });

  it('debe deshabilitar el botón de decrementar cantidad al alcanzar el límite mínimo', async () => {
    renderWithProviders();

    const btnDecrementar = screen.getByRole('button', { name: '-' });

    // Intentar decrementar por debajo del límite
    fireEvent.click(btnDecrementar);

    expect(screen.getByDisplayValue('1')).toBeTruthy();
    expect(btnDecrementar.disabled).toBe(true);
  });

  it('debe mostrar un error si falta la calificación en la reseña', async () => {
    renderWithProviders();

    fireEvent.change(screen.getByLabelText(/Tu nombre/i), { target: { value: 'Nuevo Usuario' } });
    fireEvent.change(screen.getByLabelText(/Comentario/i), { target: { value: 'Muy buen producto' } });

    const btnPublicarResena = screen.getByRole('button', { name: /Publicar Reseña/i });
    fireEvent.click(btnPublicarResena);

    await waitFor(() => {
      expect(screen.getByText(/Por favor completa todos los campos de la reseña/i)).toBeTruthy();
    });
  });

  it('debe mostrar un error si falta el nombre en la reseña', async () => {
    renderWithProviders();

    fireEvent.change(screen.getByLabelText(/Calificación/i), { target: { value: '5' } });
    fireEvent.change(screen.getByLabelText(/Comentario/i), { target: { value: 'Muy buen producto' } });

    const btnPublicarResena = screen.getByRole('button', { name: /Publicar Reseña/i });
    fireEvent.click(btnPublicarResena);

    await waitFor(() => {
      expect(screen.getByText(/Por favor completa todos los campos de la reseña/i)).toBeTruthy();
    });
  });
});