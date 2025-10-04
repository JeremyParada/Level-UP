import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Products from './Products';
import { CartContext } from '../context/CartContext';
import { NotificationContext } from '../context/NotificationContext';

describe('Products Page', () => {
  const mockProductos = [
    {
      codigo: 'MOUSE001',
      nombre: 'Mouse Gamer RGB',
      descripcion: 'Mouse gaming de alta precisión',
      precio: 25990,
      categoria: 'Periféricos',
      imagen: '/assets/img/mouse-gamer.jpg'
    },
    {
      codigo: 'TECLADO001',
      nombre: 'Teclado Mecánico',
      descripcion: 'Teclado mecánico RGB',
      precio: 45990,
      categoria: 'Periféricos',
      imagen: '/assets/img/teclado-mecanico.jpg'
    },
    {
      codigo: 'MONITOR001',
      nombre: 'Monitor Gaming 144Hz',
      descripcion: 'Monitor para gaming profesional',
      precio: 189990,
      categoria: 'Monitores',
      imagen: '/assets/img/monitor-gaming.jpg'
    }
  ];

  const mockCartContext = {
    agregarAlCarrito: jasmine.createSpy('agregarAlCarrito'),
    carrito: [],
    totalItems: 0,
    totalPrecio: 0,
    eliminarDelCarrito: jasmine.createSpy('eliminarDelCarrito'),
    actualizarCantidad: jasmine.createSpy('actualizarCantidad'),
    vaciarCarrito: jasmine.createSpy('vaciarCarrito')
  };

  const mockNotificationContext = {
    exito: jasmine.createSpy('exito'),
    error: jasmine.createSpy('error'),
    info: jasmine.createSpy('info'),
    advertencia: jasmine.createSpy('advertencia'),
    notificaciones: []
  };

  beforeEach(() => {
    global.fetch = jasmine.createSpy('fetch').and.returnValue(
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockProductos)
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
            <Products />
          </NotificationContext.Provider>
        </CartContext.Provider>
      </BrowserRouter>
    );
  };

  it('debe cargar y mostrar los productos', async () => {
    renderComponent();
    
    await waitFor(() => {
      expect(screen.getByText('Mouse Gamer RGB')).toBeTruthy();
      expect(screen.getByText('Teclado Mecánico')).toBeTruthy();
      expect(screen.getByText('Monitor Gaming 144Hz')).toBeTruthy();
    });
  });

  it('debe mostrar el título de la página', () => {
    renderComponent();
    expect(screen.getByText('Catálogo de productos')).toBeTruthy();
  });

  it('debe filtrar productos por categoría', async () => {
    renderComponent();
    
    await waitFor(() => {
      expect(screen.getByText('Mouse Gamer RGB')).toBeTruthy();
    });

    const selectCategoria = screen.getByRole('combobox');
    fireEvent.change(selectCategoria, { target: { value: 'Monitores' } });

    await waitFor(() => {
      expect(screen.queryByText('Mouse Gamer RGB')).toBeFalsy();
      expect(screen.getByText('Monitor Gaming 144Hz')).toBeTruthy();
    });
  });

  it('debe buscar productos por nombre', async () => {
    renderComponent();
    
    await waitFor(() => {
      expect(screen.getByText('Mouse Gamer RGB')).toBeTruthy();
    });

    const inputBusqueda = screen.getByPlaceholderText('¿Qué producto quieres?');
    fireEvent.change(inputBusqueda, { target: { value: 'Teclado' } });
    
    const btnBuscar = screen.getByRole('button', { name: /Buscar producto/i });
    fireEvent.click(btnBuscar);

    await waitFor(() => {
      expect(screen.queryByText('Mouse Gamer RGB')).toBeFalsy();
      expect(screen.getByText('Teclado Mecánico')).toBeTruthy();
    }, { timeout: 3000 });
  });

  it('debe mostrar mensaje cuando no hay productos', async () => {
    global.fetch = jasmine.createSpy('fetch').and.returnValue(
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve([])
      })
    );

    renderComponent();
    
    await waitFor(() => {
      expect(screen.getByText('No se encontraron productos')).toBeTruthy();
    });
  });

  it('debe cargar las categorías disponibles', async () => {
    renderComponent();
    
    await waitFor(() => {
      const selectCategoria = screen.getByRole('combobox');
      const options = selectCategoria.querySelectorAll('option');
      
      // Debería tener al menos la opción "Todas las categorías"
      expect(options.length).toBeGreaterThan(0);
    });
  });

  it('debe manejar errores al cargar productos', async () => {
    // Espiar console.error antes de hacer el mock del fetch
    const consoleErrorSpy = spyOn(console, 'error').and.callThrough();
    
    global.fetch = jasmine.createSpy('fetch').and.returnValue(
      Promise.reject(new Error('Network error'))
    );

    renderComponent();
    
    // Esperar un poco más para que el error se procese
    await new Promise(resolve => setTimeout(resolve, 100));
    
    // Verificar que se llamó console.error
    expect(consoleErrorSpy).toHaveBeenCalled();
  });

  it('debe mostrar el formulario de búsqueda', () => {
    renderComponent();
    
    const inputBusqueda = screen.getByPlaceholderText('¿Qué producto quieres?');
    const btnBuscar = screen.getByRole('button', { name: /Buscar producto/i });
    
    expect(inputBusqueda).toBeTruthy();
    expect(btnBuscar).toBeTruthy();
  });

  it('debe mostrar el select de categorías', () => {
    renderComponent();
    
    const selectCategoria = screen.getByRole('combobox');
    expect(selectCategoria).toBeTruthy();
  });

  it('debe limpiar la búsqueda cuando se borra el texto', async () => {
    renderComponent();
    
    await waitFor(() => {
      expect(screen.getByText('Mouse Gamer RGB')).toBeTruthy();
    });

    const inputBusqueda = screen.getByPlaceholderText('¿Qué producto quieres?');
    
    // Buscar
    fireEvent.change(inputBusqueda, { target: { value: 'Monitor' } });
    fireEvent.submit(inputBusqueda.closest('form'));
    
    // Esperar que el filtro se aplique
    await waitFor(() => {
      expect(screen.queryByText('Mouse Gamer RGB')).toBeFalsy();
    }, { timeout: 1000 });

    // Limpiar
    fireEvent.change(inputBusqueda, { target: { value: '' } });
    
    await waitFor(() => {
      expect(screen.getByText('Mouse Gamer RGB')).toBeTruthy();
      expect(screen.getByText('Teclado Mecánico')).toBeTruthy();
    }, { timeout: 1000 });
  });
});