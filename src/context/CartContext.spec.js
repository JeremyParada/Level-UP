import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { CartProvider, CartContext } from './CartContext';

// Componente de prueba
const TestComponent = () => {
  const cart = React.useContext(CartContext);

  return (
    <div>
      <span data-testid="carrito-length">{cart.carrito.length}</span>
      <span data-testid="total-items">{cart.totalItems}</span>
      <span data-testid="total-precio">{cart.totalPrecio}</span>
      
      <button 
        data-testid="btn-agregar"
        onClick={() => cart.agregarAlCarrito({ 
          codigo: 'PROD001', 
          nombre: 'Teclado Gamer',
          precio: 45990 
        }, 1)}
      >
        Agregar
      </button>
      
      <button 
        data-testid="btn-eliminar"
        onClick={() => cart.eliminarDelCarrito('PROD001')}
      >
        Eliminar
      </button>
      
      <button 
        data-testid="btn-actualizar"
        onClick={() => cart.actualizarCantidad('PROD001', 5)}
      >
        Actualizar
      </button>
      
      <button 
        data-testid="btn-vaciar"
        onClick={() => cart.vaciarCarrito()}
      >
        Vaciar
      </button>
    </div>
  );
};

describe('CartContext', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  const renderWithProvider = () => {
    return render(
      <CartProvider>
        <TestComponent />
      </CartProvider>
    );
  };

  it('debe inicializar con carrito vacío', () => {
    renderWithProvider();
    
    expect(screen.getByTestId('carrito-length').textContent).toBe('0');
    expect(screen.getByTestId('total-items').textContent).toBe('0');
    expect(screen.getByTestId('total-precio').textContent).toBe('0');
  });

  it('debe agregar un producto al carrito', async () => {
    renderWithProvider();
    
    const btnAgregar = screen.getByTestId('btn-agregar');
    fireEvent.click(btnAgregar);

    await waitFor(() => {
      expect(screen.getByTestId('carrito-length').textContent).toBe('1');
      expect(screen.getByTestId('total-items').textContent).toBe('1');
    });
  });

  it('debe incrementar cantidad si el producto ya existe', async () => {
    renderWithProvider();
    
    const btnAgregar = screen.getByTestId('btn-agregar');
    fireEvent.click(btnAgregar);
    
    await waitFor(() => {
      expect(screen.getByTestId('total-items').textContent).toBe('1');
    });

    fireEvent.click(btnAgregar);

    await waitFor(() => {
      expect(screen.getByTestId('carrito-length').textContent).toBe('1');
      expect(screen.getByTestId('total-items').textContent).toBe('2');
    });
  });

  it('debe eliminar un producto del carrito', async () => {
    renderWithProvider();
    
    const btnAgregar = screen.getByTestId('btn-agregar');
    const btnEliminar = screen.getByTestId('btn-eliminar');
    
    fireEvent.click(btnAgregar);
    
    await waitFor(() => {
      expect(screen.getByTestId('carrito-length').textContent).toBe('1');
    });

    fireEvent.click(btnEliminar);

    await waitFor(() => {
      expect(screen.getByTestId('carrito-length').textContent).toBe('0');
      expect(screen.getByTestId('total-items').textContent).toBe('0');
    });
  });

  it('debe actualizar la cantidad de un producto', async () => {
    renderWithProvider();
    
    const btnAgregar = screen.getByTestId('btn-agregar');
    const btnActualizar = screen.getByTestId('btn-actualizar');
    
    fireEvent.click(btnAgregar);
    
    await waitFor(() => {
      expect(screen.getByTestId('total-items').textContent).toBe('1');
    });

    fireEvent.click(btnActualizar);

    await waitFor(() => {
      expect(screen.getByTestId('total-items').textContent).toBe('5');
    });
  });

  it('debe vaciar el carrito', async () => {
    renderWithProvider();
    
    const btnAgregar = screen.getByTestId('btn-agregar');
    const btnVaciar = screen.getByTestId('btn-vaciar');
    
    fireEvent.click(btnAgregar);
    fireEvent.click(btnAgregar);
    
    await waitFor(() => {
      expect(screen.getByTestId('total-items').textContent).toBe('2');
    });

    fireEvent.click(btnVaciar);

    await waitFor(() => {
      expect(screen.getByTestId('carrito-length').textContent).toBe('0');
      expect(screen.getByTestId('total-items').textContent).toBe('0');
      expect(screen.getByTestId('total-precio').textContent).toBe('0');
    });
  });

  it('debe calcular el precio total correctamente', async () => {
    renderWithProvider();
    
    const btnAgregar = screen.getByTestId('btn-agregar');
    
    fireEvent.click(btnAgregar);
    fireEvent.click(btnAgregar);

    await waitFor(() => {
      expect(screen.getByTestId('total-precio').textContent).toBe('91980');
    });
  });

  it('debe persistir el carrito en localStorage', async () => {
    renderWithProvider();
    
    const btnAgregar = screen.getByTestId('btn-agregar');
    fireEvent.click(btnAgregar);

    await waitFor(() => {
      const carritoGuardado = JSON.parse(localStorage.getItem('carrito'));
      expect(carritoGuardado).toBeDefined();
      expect(carritoGuardado.length).toBe(1);
      expect(carritoGuardado[0].codigo).toBe('PROD001');
    });
  });
});