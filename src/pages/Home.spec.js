import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Home from './Home';
import { CartContext } from '../context/CartContext';
import { NotificationContext } from '../context/NotificationContext';

describe('Home Page', () => {
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
            precio: 25990,
            imagen: '/assets/img/mouse-gamer.jpg',
            categoria: 'Periféricos'
          }
        ])
      })
    );
  });

  afterEach(() => {
    delete global.fetch;
  });

  const renderComponent = () => {
    return render(
      <BrowserRouter>
        <CartContext.Provider value={mockCartContext}>
          <NotificationContext.Provider value={mockNotificationContext}>
            <Home />
          </NotificationContext.Provider>
        </CartContext.Provider>
      </BrowserRouter>
    );
  };

  it('debe renderizar el título principal', () => {
    renderComponent();
    expect(screen.getByText(/Tu tienda de tecnología gamer/i)).toBeTruthy();
  });

  it('debe cargar productos destacados', async () => {
    renderComponent();

    await waitFor(() => {
      expect(screen.getByText('🔥 Productos Destacados')).toBeTruthy();
    });
  });

  it('debe mostrar beneficios de registro', () => {
    renderComponent();
    expect(screen.getByText(/¿Por qué registrarte/i)).toBeTruthy();
    expect(screen.getByText(/20% descuento/i)).toBeTruthy();
  });

  it('debe mostrar trailer de GTA VI', () => {
    renderComponent();
    expect(screen.getByText(/Tráiler Oficial GTA VI/i)).toBeTruthy();
  });

  it('debe mostrar noticias gaming', () => {
    renderComponent();
    expect(screen.getByText('📰 Noticias Gaming')).toBeTruthy();
  });

  it('debe tener botón para ver todos los productos', async () => {
    renderComponent();

    await waitFor(() => {
      expect(screen.getByText('Ver Todos los Productos')).toBeTruthy();
    });
  });

  it('debe tener enlaces a secciones principales', () => {
    renderComponent();
    expect(screen.getByText('Productos')).toBeTruthy();
    expect(screen.getByText('Comunidad')).toBeTruthy();
    expect(screen.getByText('Reseñas')).toBeTruthy();
  });

  it('debe mostrar llamada a la acción final', () => {
    renderComponent();
    expect(screen.getByText(/¿Listo para subir de nivel?/i)).toBeTruthy();
  });
});