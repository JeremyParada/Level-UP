import { useContext } from 'react';
import { CartContext } from '../context/CartContext';
import { NotificationContext } from '../context/NotificationContext';

export const useCart = () => {
  const cart = useContext(CartContext);
  const { exito } = useContext(NotificationContext);

  const agregarProductoConNotificacion = (producto, cantidad = 1) => {
    cart.agregarAlCarrito(producto, cantidad);
    exito(`<strong>${producto.nombre}</strong> agregado al carrito<br>Cantidad: ${cantidad}`);
  };

  return {
    ...cart,
    agregarProductoConNotificacion
  };
};