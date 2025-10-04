import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ProductDetailPage from './ProductDetailPage';
import { CartContext } from '../context/CartContext';
import { NotificationContext } from '../context/NotificationContext';

describe('ProductDetailPage', () => {
  let mockCartContext;
  let mockNotificationContext;

  beforeEach(() => {
    mockCartContext = {
      carrito: [],
      totalItems: 0,
      totalPrecio: 0,
      agregarAlCarrito: jasmine.createSpy('agregarAlCarrito'),
      eliminarDelCarrito: jasmine.createSpy('eliminarDelCarrito'),
      actualizarCantidad: jasmine.createSpy('actualizarCantidad'),
      vaciarCarrito: jasmine.createSpy('vaciarCarrito')
    };

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
            descripcion: 'Mouse gaming de alta precisión',
            precio: 25990,
            categoria: 'Periféricos',
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
        <CartContext.Provider value={mockCartContext}>
          <NotificationContext.Provider value={mockNotificationContext}>
            <Routes>
              <Route path="/producto-detalle/:codigo" element={<ProductDetailPage />} />
            </Routes>
          </NotificationContext.Provider>
        </CartContext.Provider>
      </BrowserRouter>
    );
  };

  it('debe cargar y mostrar el producto', async () => {
    window.history.pushState({}, '', '/producto-detalle/MOUSE001');
    renderComponent();

    await waitFor(() => {
      expect(screen.getByText('Mouse Gamer RGB')).toBeTruthy();
    });
  });

  it('debe mostrar breadcrumb de navegación', async () => {
    window.history.pushState({}, '', '/producto-detalle/MOUSE001');
    renderComponent();

    await waitFor(() => {
      expect(screen.getByText('Inicio')).toBeTruthy();
      expect(screen.getByText('Productos')).toBeTruthy();
    });
  });

  it('debe permitir cambiar la cantidad', async () => {
    window.history.pushState({}, '', '/producto-detalle/MOUSE001');
    renderComponent();

    await waitFor(() => {
      const btnIncrementar = screen.getByText('+');
      fireEvent.click(btnIncrementar);
    });

    const inputCantidad = screen.getByDisplayValue('2');
    expect(inputCantidad).toBeTruthy();
  });

  it('debe agregar producto al carrito', async () => {
    window.history.pushState({}, '', '/producto-detalle/MOUSE001');
    renderComponent();

    await waitFor(() => {
      const btnAgregar = screen.getByText(/Agregar al Carrito/i);
      fireEvent.click(btnAgregar);
    });

    expect(mockCartContext.agregarAlCarrito).toHaveBeenCalled();
  });

  it('debe mostrar sección de reseñas', async () => {
    window.history.pushState({}, '', '/producto-detalle/MOUSE001');
    renderComponent();

    await waitFor(() => {
      expect(screen.getByText(/Reseñas de este producto/i)).toBeTruthy();
    });
  });

  it('debe permitir publicar una reseña', async () => {
    window.history.pushState({}, '', '/producto-detalle/MOUSE001');
    renderComponent();

    await waitFor(() => {
      const selectCalificacion = screen.getByLabelText(/Calificación/i);
      const inputNombre = screen.getByPlaceholderText(/Tu nombre/i);
      const textareaComentario = screen.getByPlaceholderText(/Comparte tu experiencia/i);

      fireEvent.change(selectCalificacion, { target: { value: '5' } });
      fireEvent.change(inputNombre, { target: { value: 'Juan Pérez' } });
      fireEvent.change(textareaComentario, { target: { value: 'Excelente producto' } });

      const btnPublicar = screen.getByText('Publicar Reseña');
      fireEvent.click(btnPublicar);
    });

    await waitFor(() => {
      expect(mockNotificationContext.exito).toHaveBeenCalled();
    });
  });

  it('debe mostrar información de envío', async () => {
    window.history.pushState({}, '', '/producto-detalle/MOUSE001');
    renderComponent();

    await waitFor(() => {
      expect(screen.getByText(/Información de Envío/i)).toBeTruthy();
    });
  });

  it('debe limitar cantidad máxima a 10', async () => {
    window.history.pushState({}, '', '/producto-detalle/MOUSE001');
    renderComponent();

    await waitFor(() => {
      const btnIncrementar = screen.getByText('+');
      
      // Intentar incrementar 11 veces
      for (let i = 0; i < 11; i++) {
        fireEvent.click(btnIncrementar);
      }
    });

    const inputCantidad = screen.getByRole('spinbutton');
    expect(parseInt(inputCantidad.value)).toBeLessThanOrEqual(10);
  });
});