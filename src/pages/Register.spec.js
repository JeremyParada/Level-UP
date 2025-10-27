import React from 'react';
import { render, fireEvent, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Register from '../pages/Register';
import { NotificationContext } from '../context/NotificationContext';
import { AuthContext } from '../context/AuthContext';

describe('Register Component', () => {
  let exitoMock, errorMock, setUsuarioMock, navigateMock;

  beforeEach(() => {
    exitoMock = jasmine.createSpy('exito');
    errorMock = jasmine.createSpy('error');
    setUsuarioMock = jasmine.createSpy('setUsuario');
    navigateMock = jasmine.createSpy('navigate');

    // Mock localStorage con un usuario existente
    localStorage.setItem('usuarios', JSON.stringify([
      { email: 'existente@correo.com', password: '123456', nombre: 'Juan' }
    ]));

    // Mock useNavigate
    jest.spyOn(require('react-router-dom'), 'useNavigate').mockImplementation(() => navigateMock);

    render(
      <NotificationContext.Provider value={{ exito: exitoMock, error: errorMock }}>
        <AuthContext.Provider value={{ setUsuario: setUsuarioMock }}>
          <MemoryRouter>
            <Register />
          </MemoryRouter>
        </AuthContext.Provider>
      </NotificationContext.Provider>
    );
  });

  afterEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
  });

  it('debe mostrar error si el correo ya está registrado', () => {
    fireEvent.change(screen.getByLabelText(/Correo electrónico/i), { target: { value: 'existente@correo.com' } });
    fireEvent.change(screen.getByLabelText(/Contraseña/i), { target: { value: 'abcdef' } });
    fireEvent.change(screen.getByLabelText(/Confirmar contraseña/i), { target: { value: 'abcdef' } });
    fireEvent.change(screen.getByLabelText(/Nombre/i), { target: { value: 'Juan' } });
    fireEvent.change(screen.getByLabelText(/Apellido/i), { target: { value: 'Perez' } });
    fireEvent.change(screen.getByLabelText(/Fecha de nacimiento/i), { target: { value: '1990-01-01' } });

    fireEvent.click(screen.getByText(/Registrarse/i));

    expect(errorMock).toHaveBeenCalledWith('Este correo ya está registrado');
    expect(setUsuarioMock).not.toHaveBeenCalled();
  });

  it('debe mostrar error si la contraseña es menor a 6 caracteres', () => {
    fireEvent.change(screen.getByLabelText(/Correo electrónico/i), { target: { value: 'nuevo@correo.com' } });
    fireEvent.change(screen.getByLabelText(/Contraseña/i), { target: { value: '123' } });
    fireEvent.change(screen.getByLabelText(/Confirmar contraseña/i), { target: { value: '123' } });
    fireEvent.change(screen.getByLabelText(/Nombre/i), { target: { value: 'Pedro' } });
    fireEvent.change(screen.getByLabelText(/Apellido/i), { target: { value: 'Gomez' } });
    fireEvent.change(screen.getByLabelText(/Fecha de nacimiento/i), { target: { value: '1990-01-01' } });

    fireEvent.click(screen.getByText(/Registrarse/i));

    expect(errorMock).toHaveBeenCalledWith(jasmine.stringMatching(/contraseña/));
    expect(setUsuarioMock).not.toHaveBeenCalled();
  });

  it('debe mostrar error si las contraseñas no coinciden', () => {
    fireEvent.change(screen.getByLabelText(/Correo electrónico/i), { target: { value: 'nuevo@correo.com' } });
    fireEvent.change(screen.getByLabelText(/Contraseña/i), { target: { value: '123456' } });
    fireEvent.change(screen.getByLabelText(/Confirmar contraseña/i), { target: { value: '654321' } });
    fireEvent.change(screen.getByLabelText(/Nombre/i), { target: { value: 'Pedro' } });
    fireEvent.change(screen.getByLabelText(/Apellido/i), { target: { value: 'Gomez' } });
    fireEvent.change(screen.getByLabelText(/Fecha de nacimiento/i), { target: { value: '1990-01-01' } });

    fireEvent.click(screen.getByText(/Registrarse/i));

    expect(errorMock).toHaveBeenCalledWith(jasmine.stringMatching(/contraseñas/));
    expect(setUsuarioMock).not.toHaveBeenCalled();
  });

  it('debe mostrar error si el usuario es menor de 18 años', () => {
    const hoy = new Date();
    const menor18 = `${hoy.getFullYear() - 17}-01-01`;

    fireEvent.change(screen.getByLabelText(/Correo electrónico/i), { target: { value: 'nuevo@correo.com' } });
    fireEvent.change(screen.getByLabelText(/Contraseña/i), { target: { value: '123456' } });
    fireEvent.change(screen.getByLabelText(/Confirmar contraseña/i), { target: { value: '123456' } });
    fireEvent.change(screen.getByLabelText(/Nombre/i), { target: { value: 'Pedro' } });
    fireEvent.change(screen.getByLabelText(/Apellido/i), { target: { value: 'Gomez' } });
    fireEvent.change(screen.getByLabelText(/Fecha de nacimiento/i), { target: { value: menor18 } });

    fireEvent.click(screen.getByText(/Registrarse/i));

    expect(errorMock).toHaveBeenCalledWith(jasmine.stringMatching(/mayor de 18 años/));
    expect(setUsuarioMock).not.toHaveBeenCalled();
  });

  it('debe registrar usuario correctamente si los datos son válidos', async () => {
    fireEvent.change(screen.getByLabelText(/Correo electrónico/i), { target: { value: 'nuevo@correo.com' } });
    fireEvent.change(screen.getByLabelText(/Contraseña/i), { target: { value: '123456' } });
    fireEvent.change(screen.getByLabelText(/Confirmar contraseña/i), { target: { value: '123456' } });
    fireEvent.change(screen.getByLabelText(/Nombre/i), { target: { value: 'Pedro' } });
    fireEvent.change(screen.getByLabelText(/Apellido/i), { target: { value: 'Gomez' } });
    fireEvent.change(screen.getByLabelText(/Fecha de nacimiento/i), { target: { value: '1990-01-01' } });

    fireEvent.click(screen.getByText(/Registrarse/i));

    await waitFor(() => {
      expect(setUsuarioMock).toHaveBeenCalled();
      expect(exitoMock).toHaveBeenCalled();
      expect(navigateMock).toBeDefined(); // Redirección simulada
    });

    const usuarios = JSON.parse(localStorage.getItem('usuarios'));
    expect(usuarios.some(u => u.email === 'nuevo@correo.com')).toBeTrue();
  });
});
