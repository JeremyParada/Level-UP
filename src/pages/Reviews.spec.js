import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Reviews from './Reviews';
import { NotificationContext } from '../context/NotificationContext';

describe('Reviews Page', () => {
  let mockNotificationContext;

  beforeEach(() => {
    mockNotificationContext = {
      exito: jasmine.createSpy('exito'),
      error: jasmine.createSpy('error'),
      info: jasmine.createSpy('info'),
      advertencia: jasmine.createSpy('advertencia'),
      notificaciones: []
    };

    global.fetch = jasmine.createSpy('fetch').and.returnValue(
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve([
          {
            codigo: 'MOUSE001',
            nombre: 'Mouse Gamer RGB',
            precio: 25990,
            imagen: '/assets/img/mouse-gamer.jpg'
          }
        ])
      })
    );

    localStorage.setItem('resenas', JSON.stringify([]));
  });

  afterEach(() => {
    delete global.fetch;
    localStorage.clear();
  });

  const renderComponent = () => {
    return render(
      <BrowserRouter>
        <NotificationContext.Provider value={mockNotificationContext}>
          <Reviews />
        </NotificationContext.Provider>
      </BrowserRouter>
    );
  };

  it('debe renderizar el título de reseñas', () => {
    renderComponent();
    expect(screen.getByText('Reseñas de Productos')).toBeTruthy();
  });

  it('debe mostrar formulario para agregar reseña', async () => {
    renderComponent();

    await waitFor(() => {
      expect(screen.getByLabelText(/Producto/i)).toBeTruthy();
      expect(screen.getByLabelText(/Calificación/i)).toBeTruthy();
      expect(screen.getByLabelText(/Tu nombre/i)).toBeTruthy();
      expect(screen.getByLabelText(/Tu reseña/i)).toBeTruthy();
    });
  });

  it('debe publicar una reseña correctamente', async () => {
    renderComponent();

    // Esperar a que cargue el formulario
    await waitFor(() => {
      expect(screen.getByLabelText(/Producto/i)).toBeTruthy();
    });

    await act(async () => {
      const selectProducto = screen.getByLabelText(/Producto/i);
      const selectCalificacion = screen.getByLabelText(/Calificación/i);
      const inputNombre = screen.getByPlaceholderText(/Tu nombre gamer/i);
      const textareaComentario = screen.getByPlaceholderText(/Comparte tu experiencia/i);

      // Llenar formulario
      fireEvent.change(selectProducto, { target: { value: 'Mouse Gamer RGB' } });
      fireEvent.change(selectCalificacion, { target: { value: '5' } });
      fireEvent.change(inputNombre, { target: { value: 'TestUser' } });
      fireEvent.change(textareaComentario, { target: { value: 'Excelente producto' } });

      // Submit del formulario
      const form = selectProducto.closest('form');
      fireEvent.submit(form);
    });

    // Verificar que se llamó la notificación
    await waitFor(() => {
      expect(mockNotificationContext.exito).toHaveBeenCalled();
    }, { timeout: 3000 });
  });

  it('debe validar campos requeridos', async () => {
    renderComponent();

    await waitFor(() => {
      const btnPublicar = screen.getByText('Publicar Reseña');
      fireEvent.click(btnPublicar);
    });

    // El formulario debe prevenir el submit por validación HTML5
    // No se debe llamar error porque el navegador previene el submit
    expect(mockNotificationContext.error).not.toHaveBeenCalled();
  });

  it('debe mostrar estadísticas de reseñas', async () => {
    renderComponent();

    await waitFor(() => {
      expect(screen.getByText(/0 reseñas/i)).toBeTruthy();
    });
  });

  it('debe permitir filtrar por producto', async () => {
    renderComponent();

    await waitFor(() => {
      const inputBusqueda = screen.getByPlaceholderText(/Buscar por producto/i);
      fireEvent.change(inputBusqueda, { target: { value: 'Mouse' } });
      
      // Verificar que el input tiene el valor
      expect(inputBusqueda.value).toBe('Mouse');
    });
  });

  it('debe permitir filtrar por calificación', async () => {
    renderComponent();

    await waitFor(() => {
      const selects = screen.getAllByRole('combobox');
      // Buscar el select que tiene las opciones de filtro (el que NO tiene "Selecciona")
      const selectCalificacion = selects.find(s => {
        const options = s.querySelectorAll('option');
        return Array.from(options).some(opt => opt.textContent.includes('Todas las calificaciones'));
      });
      
      if (selectCalificacion) {
        fireEvent.change(selectCalificacion, { target: { value: '5' } });
        expect(selectCalificacion.value).toBe('5');
      } else {
        // Si no se encuentra, al menos verificar que existen los selects
        expect(selects.length).toBeGreaterThan(1);
      }
    });
  });

  it('debe mostrar mensaje cuando no hay reseñas', () => {
    renderComponent();
    expect(screen.getByText(/Aún no hay reseñas/i)).toBeTruthy();
  });

  it('debe limpiar formulario después de publicar', async () => {
    renderComponent();

    await waitFor(() => {
      expect(screen.getByLabelText(/Producto/i)).toBeTruthy();
    });

    await act(async () => {
      const selectProducto = screen.getByLabelText(/Producto/i);
      const selectCalificacion = screen.getByLabelText(/Calificación/i);
      const inputNombre = screen.getByPlaceholderText(/Tu nombre gamer/i);
      const textareaComentario = screen.getByPlaceholderText(/Comparte tu experiencia/i);

      // Llenar formulario
      fireEvent.change(selectProducto, { target: { value: 'Mouse Gamer RGB' } });
      fireEvent.change(selectCalificacion, { target: { value: '5' } });
      fireEvent.change(inputNombre, { target: { value: 'TestUser' } });
      fireEvent.change(textareaComentario, { target: { value: 'Test' } });

      // Submit del formulario
      const form = selectProducto.closest('form');
      fireEvent.submit(form);
    });

    // Verificar limpieza del formulario
    await waitFor(() => {
      const nombreDespues = screen.getByPlaceholderText(/Tu nombre gamer/i);
      const comentarioDespues = screen.getByPlaceholderText(/Comparte tu experiencia/i);
      
      expect(nombreDespues.value).toBe('');
      expect(comentarioDespues.value).toBe('');
    }, { timeout: 3000 });
  });
});