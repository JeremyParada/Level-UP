import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Login from '../pages/Login';
import { AuthContext } from '../context/AuthContext';

describe('Login Component', () => {
  let loginMock;
  let navigateMock;

  beforeEach(() => {
    loginMock = jasmine.createSpy('login');
    navigateMock = jasmine.createSpy('navigate');

    // Mock localStorage
    localStorage.setItem('usuarios', JSON.stringify([
      { email: 'test@correo.com', password: '123456' }
    ]));

    // Mock useNavigate
    jest.spyOn(require('react-router-dom'), 'useNavigate').mockImplementation(() => navigateMock);

    render(
      <AuthContext.Provider value={{ login: loginMock }}>
        <MemoryRouter>
          <Login />
        </MemoryRouter>
      </AuthContext.Provider>
    );
  });

  afterEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
  });

  it('debe renderizar los campos de email y password', () => {
    expect(screen.getByLabelText(/Correo electrónico/i)).toBeTruthy();
    expect(screen.getByLabelText(/Contraseña/i)).toBeTruthy();
  });

  it('debe actualizar formData al escribir en los inputs', () => {
    const emailInput = screen.getByLabelText(/Correo electrónico/i);
    const passwordInput = screen.getByLabelText(/Contraseña/i);

    fireEvent.change(emailInput, { target: { value: 'nuevo@correo.com' } });
    fireEvent.change(passwordInput, { target: { value: 'abcdef' } });

    expect(emailInput.value).toBe('nuevo@correo.com');
    expect(passwordInput.value).toBe('abcdef');
  });

  it('debe iniciar sesión correctamente con credenciales válidas', () => {
    fireEvent.change(screen.getByLabelText(/Correo electrónico/i), { target: { value: 'test@correo.com' } });
    fireEvent.change(screen.getByLabelText(/Contraseña/i), { target: { value: '123456' } });

    fireEvent.click(screen.getByText(/Iniciar Sesión/i));

    expect(loginMock).toHaveBeenCalledWith({ email: 'test@correo.com', password: '123456' });
    expect(navigateMock).toHaveBeenCalledWith('/perfil');
  });

  it('debe mostrar error con credenciales inválidas', () => {
    fireEvent.change(screen.getByLabelText(/Correo electrónico/i), { target: { value: 'test@correo.com' } });
    fireEvent.change(screen.getByLabelText(/Contraseña/i), { target: { value: 'wrongpass' } });

    fireEvent.click(screen.getByText(/Iniciar Sesión/i));

    expect(screen.getByText(/Correo o contraseña incorrectos/i)).toBeTruthy();
    expect(loginMock).not.toHaveBeenCalled();
  });
});
