import React, { createContext, useState, useEffect } from 'react';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [carrito, setCarrito] = useState(() => {
    try {
      const guardado = localStorage.getItem('carrito');
      if (!guardado) return [];
      const parsed = JSON.parse(guardado);
      // Si el parseo falla o no es array, retorna []
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      // Si hay error de parseo, limpia el localStorage y retorna []
      localStorage.setItem('carrito', JSON.stringify([]));
      return [];
    }
  });

  // Guardar carrito en localStorage cuando cambia
  useEffect(() => {
    localStorage.setItem('carrito', JSON.stringify(carrito));
  }, [carrito]);

  const agregarAlCarrito = (producto, cantidad = 1) => {
    setCarrito(prevCarrito => {
      // Si prevCarrito es undefined, usa []
      const seguro = Array.isArray(prevCarrito) ? prevCarrito : [];
      const existente = seguro.find(item => item.codigo === producto.codigo);
      if (existente) {
        return seguro.map(item =>
          item.codigo === producto.codigo
            ? { ...item, cantidad: item.cantidad + cantidad }
            : item
        );
      }
      return [...seguro, { codigo: producto.codigo, cantidad }];
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
    localStorage.setItem('carrito', JSON.stringify([]));
  };

  const totalItems = Array.isArray(carrito) ? carrito.reduce((total, item) => total + item.cantidad, 0) : 0;
  const totalPrecio = 0; // El cálculo real se hace en Cart.jsx

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