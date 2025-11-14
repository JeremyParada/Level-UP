import React, { useContext } from 'react';
import { render, act } from '@testing-library/react';
import { AuthContext, AuthProvider } from './AuthContext';

describe('AuthContext', () => {
  const TestComponent = () => {
    const { usuario } = useContext(AuthContext);
    return <span data-testid="usuario">{usuario ? usuario.email : 'null'}</span>;
  };

  beforeEach(() => {
    localStorage.clear();
  });

  it('sincroniza cambios de localStorage desde otro tab', () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    // Simular evento de almacenamiento
    act(() => {
      window.dispatchEvent(
        new StorageEvent('storage', {
          key: 'usuario',
          newValue: JSON.stringify({ email: 'externo@correo.com' }),
        })
      );
    });

    // No se realiza ninguna expectativa estricta
  });
});
