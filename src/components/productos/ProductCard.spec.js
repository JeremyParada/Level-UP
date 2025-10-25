import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import ProductCard from './ProductCard';
import { CartContext } from '../../context/CartContext';
import { NotificationContext } from '../../context/NotificationContext';

describe('ProductCard Component', () => {
  const mockProducto = {
    codigo: 'MOUSE001',
    nombre: 'Mouse Gamer RGB',
    descripcion: 'Mouse gaming de alta precisión con iluminación RGB personalizable',
    precio: 25990,
    categoria: 'Periféricos',
    imagen: '/assets/img/mouse-gamer.jpg'
  };

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
    mockCartContext.agregarAlCarrito.calls.reset();
    mockNotificationContext.exito.calls.reset();
  });

  const renderComponent = () => {
    return render(
      <BrowserRouter>
        <CartContext.Provider value={mockCartContext}>
          <NotificationContext.Provider value={mockNotificationContext}>
            <ProductCard producto={mockProducto} />
          </NotificationContext.Provider>
        </CartContext.Provider>
      </BrowserRouter>
    );
  };

  it('debe renderizar la información del producto correctamente', () => {
    renderComponent();
    
    expect(screen.getByText('Mouse Gamer RGB')).toBeTruthy();
    expect(screen.getByText(/Periféricos/)).toBeTruthy();
    expect(screen.getByText(/Código: MOUSE001/)).toBeTruthy();
  });

  it('debe formatear el precio correctamente', () => {
    renderComponent();
    
    const precioElements = screen.getAllByText(/25\.990/);
    expect(precioElements.length).toBeGreaterThan(0);
  });

  it('debe tener un enlace al detalle del producto', () => {
    renderComponent();
    
    const link = screen.getByRole('link', { name: /Ver detalles/i });
    expect(link.getAttribute('href')).toBe('/producto-detalle/MOUSE001');
  });

  it('debe agregar producto al carrito al hacer clic', () => {
    renderComponent();
    
    const btnAgregar = screen.getByRole('button', { name: /Agregar al carrito/i });
    fireEvent.click(btnAgregar);
    
    expect(mockCartContext.agregarAlCarrito).toHaveBeenCalled();
    expect(mockNotificationContext.exito).toHaveBeenCalled();
  });

  it('debe mostrar la imagen del producto', () => {
    renderComponent();
    
    const imagen = screen.getByAltText('Mouse Gamer RGB');
    expect(imagen).toBeTruthy();
    expect(imagen.getAttribute('src')).toBe('/assets/img/mouse-gamer.jpg');
  });

  it('debe mostrar la descripción del producto', () => {
    renderComponent();
    
    const descripcion = screen.getByText(/Mouse gaming de alta precisión/);
    expect(descripcion).toBeTruthy();
  });

  it('debe mostrar la categoría del producto', () => {
    renderComponent();
    
    const categoria = screen.getByText(/Periféricos/);
    expect(categoria).toBeTruthy();
  });

  it('debe truncar descripción larga si es necesaria', () => {
    const productoDescLarga = {
      ...mockProducto,
      descripcion: 'Esta es una descripción muy larga que podría necesitar ser truncada para mantener un diseño limpio y consistente en todas las tarjetas de productos del catálogo de la tienda'
    };
    
    render(
      <BrowserRouter>
        <CartContext.Provider value={mockCartContext}>
          <NotificationContext.Provider value={mockNotificationContext}>
            <ProductCard producto={productoDescLarga} />
          </NotificationContext.Provider>
        </CartContext.Provider>
      </BrowserRouter>
    );
    
    const descripcion = screen.getByText(/Esta es una descripción muy larga/);
    expect(descripcion).toBeTruthy();
  });

  it('debe tener estilos de tarjeta de producto', () => {
    renderComponent();
    
    const card = screen.getByText('Mouse Gamer RGB').closest('.card');
    expect(card).toBeTruthy();
  });

  it('debe mostrar el código del producto', () => {
    renderComponent();
    
    const codigo = screen.getByText(/MOUSE001/);
    expect(codigo).toBeTruthy();
  });
});