import React, { useContext } from 'react';
import { render, act } from '@testing-library/react';
import { AuthContext, AuthProvider } from '../context/AuthContext';

describe('AuthContext', () => {
  const TestComponent = () => {
    const { usuario, login, logout, setUsuario } = useContext(AuthContext);
    return (
      <div>
        <span data-testid="usuario">{usuario ? usuario.email : 'null'}</span>
        <button data-testid="login" onClick={() => login({ email: 'test@correo.com' })}>Login</button>
        <button data-testid="logout" onClick={logout}>Logout</button>
        <button data-testid="setUsuario" onClick={() => setUsuario({ email: 'otro@correo.com' })}>Set Usuario</button>
      </div>
    );
  };

  beforeEach(() => {
    localStorage.clear();
  });

  it('inicializa usuario desde localStorage', () => {
    localStorage.setItem('usuario', JSON.stringify({ email: 'guardado@correo.com' }));

    const { getByTestId } = render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    expect(getByTestId('usuario').textContent).toBe('guardado@correo.com');
  });

  it('login actualiza estado y localStorage', () => {
    const { getByTestId } = render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    act(() => {
      getByTestId('login').click();
    });

    expect(getByTestId('usuario').textContent).toBe('test@correo.com');
    expect(JSON.parse(localStorage.getItem('usuario')).email).toBe('test@correo.com');
  });

  it('logout borra estado y localStorage', () => {
    localStorage.setItem('usuario', JSON.stringify({ email: 'existente@correo.com' }));

    const { getByTestId } = render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    act(() => {
      getByTestId('logout').click();
    });

    expect(getByTestId('usuario').textContent).toBe('null');
    expect(localStorage.getItem('usuario')).toBeNull();
  });

  it('setUsuario actualiza estado sin tocar localStorage', () => {
    const { getByTestId } = render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    act(() => {
      getByTestId('setUsuario').click();
    });

    expect(getByTestId('usuario').textContent).toBe('otro@correo.com');
    expect(localStorage.getItem('usuario')).toBeNull();
  });

  it('sincroniza cambios de localStorage desde otro tab', () => {
    const { getByTestId } = render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    // Simular evento storage
    act(() => {
      window.dispatchEvent(new StorageEvent('storage', { key: 'usuario', newValue: JSON.stringify({ email: 'externo@correo.com' }) }));
    });

    expect(getByTestId('usuario').textContent).toBe('externo@correo.com');
  });
});
