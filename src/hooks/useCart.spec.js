import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { CartContext } from '../context/CartContext';
import { NotificationContext } from '../context/NotificationContext';
import { useCart } from './useCart';

// Componente de prueba que usa el hook
const TestComponent = ({ producto, onResult }) => {
  const cartHook = useCart();
  
  React.useEffect(() => {
    if (onResult) {
      onResult(cartHook);
    }
  }, [cartHook, onResult]);

  return (
    <div>
      <span data-testid="total-items">{cartHook.totalItems}</span>
      <span data-testid="total-precio">{cartHook.totalPrecio}</span>
      <button 
        data-testid="btn-agregar" 
        onClick={() => cartHook.agregarProductoConNotificacion(producto, 1)}
      >
        Agregar
      </button>
    </div>
  );
};

describe('useCart Hook', () => {
  let mockCartContext;
  let mockNotificationContext;

  const mockProducto = {
    codigo: 'PROD001',
    nombre: 'Mouse Gamer',
    precio: 25990
  };

  beforeEach(() => {
    mockCartContext = {
      carrito: [],
      agregarAlCarrito: jasmine.createSpy('agregarAlCarrito'),
      eliminarDelCarrito: jasmine.createSpy('eliminarDelCarrito'),
      actualizarCantidad: jasmine.createSpy('actualizarCantidad'),
      vaciarCarrito: jasmine.createSpy('vaciarCarrito'),
      totalItems: 0,
      totalPrecio: 0
    };

    mockNotificationContext = {
      exito: jasmine.createSpy('exito'),
      error: jasmine.createSpy('error'),
      info: jasmine.createSpy('info'),
      advertencia: jasmine.createSpy('advertencia'),
      notificaciones: []
    };
  });

  const renderWithContext = (producto = mockProducto, onResult = null) => {
    return render(
      <CartContext.Provider value={mockCartContext}>
        <NotificationContext.Provider value={mockNotificationContext}>
          <TestComponent producto={producto} onResult={onResult} />
        </NotificationContext.Provider>
      </CartContext.Provider>
    );
  };

  it('debe retornar todas las funciones del carrito', (done) => {
    renderWithContext(mockProducto, (result) => {
      expect(result).toBeDefined();
      expect(result.carrito).toBeDefined();
      expect(result.agregarAlCarrito).toBeDefined();
      expect(result.agregarProductoConNotificacion).toBeDefined();
      expect(result.totalItems).toBeDefined();
      expect(result.totalPrecio).toBeDefined();
      done();
    });
  });

  it('debe agregar producto con notificación', () => {
    renderWithContext();
    
    const btnAgregar = screen.getByTestId('btn-agregar');
    fireEvent.click(btnAgregar);

    expect(mockCartContext.agregarAlCarrito).toHaveBeenCalledWith(mockProducto, 1);
    expect(mockNotificationContext.exito).toHaveBeenCalled();
  });

  it('debe mostrar notificación con información del producto', () => {
    renderWithContext();
    
    const btnAgregar = screen.getByTestId('btn-agregar');
    fireEvent.click(btnAgregar);

    const notificacionLlamada = mockNotificationContext.exito.calls.mostRecent().args[0];
    expect(notificacionLlamada).toContain('Mouse Gamer');
    expect(notificacionLlamada).toContain('1');
  });

  it('debe mostrar los valores del contexto', () => {
    mockCartContext.totalItems = 5;
    mockCartContext.totalPrecio = 129950;

    renderWithContext();

    expect(screen.getByTestId('total-items').textContent).toBe('5');
    expect(screen.getByTestId('total-precio').textContent).toBe('129950');
  });
});