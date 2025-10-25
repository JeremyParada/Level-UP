import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Cart from './Cart';
import { CartContext } from '../context/CartContext';
import { NotificationContext } from '../context/NotificationContext';

describe('Cart Page', () => {
  const mockCarrito = [
    { codigo: 'MOUSE001', cantidad: 2 },
    { codigo: 'TECLADO001', cantidad: 1 }
  ];

  let mockCartContext;
  let mockNotificationContext;

  beforeEach(() => {
    mockCartContext = {
      carrito: mockCarrito,
      totalItems: 3,
      totalPrecio: 97970,
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
          },
          {
            codigo: 'TECLADO001',
            nombre: 'Teclado Mecánico',
            precio: 45990,
            imagen: '/assets/img/teclado-mecanico.jpg',
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
            <Cart />
          </NotificationContext.Provider>
        </CartContext.Provider>
      </BrowserRouter>
    );
  };

  it('debe renderizar el título del carrito', async () => {
    renderComponent();
    
    await waitFor(() => {
      expect(screen.getByText(/Carrito de Compras/i)).toBeTruthy();
    }, { timeout: 3000 });
  });

  it('debe mostrar los productos del carrito', async () => {
    renderComponent();

    await waitFor(() => {
      expect(screen.getByText('Mouse Gamer RGB')).toBeTruthy();
      expect(screen.getByText('Teclado Mecánico')).toBeTruthy();
    });
  });

  it('debe mostrar el total de items', async () => {
    renderComponent();

    await waitFor(() => {
      expect(screen.getByText(/Tus Productos \(3\)/i)).toBeTruthy();
    });
  });

  it('debe actualizar cantidad de producto', async () => {
    renderComponent();

    await waitFor(() => {
      const botonesIncrementar = screen.getAllByText('+');
      fireEvent.click(botonesIncrementar[0]);
    });

    expect(mockCartContext.actualizarCantidad).toHaveBeenCalled();
  });

  it('debe eliminar producto del carrito', async () => {
    renderComponent();

    await waitFor(() => {
      const botonesEliminar = screen.getAllByText('Eliminar');
      fireEvent.click(botonesEliminar[0]);
    });

    expect(mockCartContext.eliminarDelCarrito).toHaveBeenCalled();
    expect(mockNotificationContext.info).toHaveBeenCalled();
  });

  it('debe aplicar código de descuento DUOC20', async () => {
    renderComponent();

    await waitFor(() => {
      const inputCodigo = screen.getByPlaceholderText('Ej: DUOC20');
      const btnAplicar = screen.getByText('Aplicar');

      fireEvent.change(inputCodigo, { target: { value: 'DUOC20' } });
      fireEvent.click(btnAplicar);
    });

    await waitFor(() => {
      expect(mockNotificationContext.exito).toHaveBeenCalled();
    });
  });

  it('debe rechazar código de descuento inválido', async () => {
    renderComponent();

    await waitFor(() => {
      const inputCodigo = screen.getByPlaceholderText('Ej: DUOC20');
      const btnAplicar = screen.getByText('Aplicar');

      fireEvent.change(inputCodigo, { target: { value: 'INVALIDO' } });
      fireEvent.click(btnAplicar);
    });

    await waitFor(() => {
      expect(mockNotificationContext.advertencia).toHaveBeenCalled();
    });
  });

  it('debe mostrar información de envío gratis', async () => {
    renderComponent();

    await waitFor(() => {
      expect(screen.getByText(/Envío gratis/i)).toBeTruthy();
    });
  });

  it('debe vaciar el carrito', async () => {
    window.confirm = jasmine.createSpy('confirm').and.returnValue(true);

    renderComponent();

    await waitFor(() => {
      const btnVaciar = screen.getByText(/Vaciar Carrito/i);
      fireEvent.click(btnVaciar);
    });

    expect(mockCartContext.vaciarCarrito).toHaveBeenCalled();
  });

  it('debe mostrar mensaje cuando el carrito está vacío', async () => {
    mockCartContext.carrito = [];
    mockCartContext.totalItems = 0;

    renderComponent();

    await waitFor(() => {
      expect(screen.getByText(/Tu carrito está vacío/i)).toBeTruthy();
    }, { timeout: 3000 });
  });

  it('debe finalizar compra correctamente', async () => {
    renderComponent();

    await waitFor(() => {
      const btnFinalizar = screen.getByText(/Finalizar Compra/i);
      fireEvent.click(btnFinalizar);
    });

    expect(mockNotificationContext.info).toHaveBeenCalled();
  });
});