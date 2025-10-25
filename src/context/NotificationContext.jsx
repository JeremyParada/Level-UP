import React, { createContext, useState, useCallback } from 'react';

export const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [notificaciones, setNotificaciones] = useState([]);

  const mostrarNotificacion = useCallback((mensaje, tipo = 'exito', duracion = 3000) => {
    const id = Date.now();
    const nuevaNotificacion = { id, mensaje, tipo };
    
    setNotificaciones(prev => [...prev, nuevaNotificacion]);
    
    setTimeout(() => {
      setNotificaciones(prev => prev.filter(n => n.id !== id));
    }, duracion);
  }, []);

  const exito = useCallback((mensaje) => {
    mostrarNotificacion(mensaje, 'exito');
  }, [mostrarNotificacion]);

  const error = useCallback((mensaje) => {
    mostrarNotificacion(mensaje, 'error');
  }, [mostrarNotificacion]);

  const info = useCallback((mensaje) => {
    mostrarNotificacion(mensaje, 'info');
  }, [mostrarNotificacion]);

  const advertencia = useCallback((mensaje) => {
    mostrarNotificacion(mensaje, 'advertencia');
  }, [mostrarNotificacion]);

  return (
    <NotificationContext.Provider value={{ 
      notificaciones, 
      exito, 
      error, 
      info, 
      advertencia 
    }}>
      {children}
      <div className="notificaciones-container">
        {notificaciones.map(notif => (
          <div key={notif.id} className={`notificacion notificacion-${notif.tipo} mostrar`}>
            <div dangerouslySetInnerHTML={{ __html: notif.mensaje }} />
          </div>
        ))}
      </div>
    </NotificationContext.Provider>
  );
};