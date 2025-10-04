import React, { createContext, useState, useEffect } from 'react';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [carrito, setCarrito] = useState([]);

  // Cargar carrito desde localStorage
  useEffect(() => {
    const carritoGuardado = localStorage.getItem('carrito');
    if (carritoGuardado) {
      setCarrito(JSON.parse(carritoGuardado));
    }
  }, []);

  // Guardar carrito en localStorage cuando cambia
  useEffect(() => {
    localStorage.setItem('carrito', JSON.stringify(carrito));
  }, [carrito]);

  const agregarAlCarrito = (producto, cantidad = 1) => {
    setCarrito(prevCarrito => {
      const existente = prevCarrito.find(item => item.codigo === producto.codigo);
      
      if (existente) {
        return prevCarrito.map(item =>
          item.codigo === producto.codigo
            ? { ...item, cantidad: item.cantidad + cantidad }
            : item
        );
      }
      
      return [...prevCarrito, { ...producto, cantidad }];
    });
  };

  const eliminarDelCarrito = (codigo) => {
    setCarrito(prevCarrito => prevCarrito.filter(item => item.codigo !== codigo));
  };

  const actualizarCantidad = (codigo, cantidad) => {
    setCarrito(prevCarrito =>
      prevCarrito.map(item =>
        item.codigo === codigo ? { ...item, cantidad } : item
      )
    );
  };

  const vaciarCarrito = () => {
    setCarrito([]);
  };

  const totalItems = carrito.reduce((total, item) => total + item.cantidad, 0);
  
  const totalPrecio = carrito.reduce(
    (total, item) => total + (item.precio * item.cantidad), 
    0
  );

  return (
    <CartContext.Provider value={{
      carrito,
      agregarAlCarrito,
      eliminarDelCarrito,
      actualizarCantidad,
      vaciarCarrito,
      totalItems,
      totalPrecio
    }}>
      {children}
    </CartContext.Provider>
  );
};