import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Register from './Register';
import { NotificationProvider } from '../context/NotificationContext';
import { AuthProvider } from '../context/AuthContext';

describe('Register Page', () => {
  const renderWithProviders = () => {
    render(
      <MemoryRouter>
        <NotificationProvider>
          <AuthProvider>
            <Register />
          </AuthProvider>
        </NotificationProvider>
      </MemoryRouter>
    );
  };

  it('debe renderizar el formulario de registro', () => {
    renderWithProviders();
    expect(screen.getByText(/Crear cuenta/i)).toBeTruthy();
  });

  it('debe mostrar un error si los campos de dirección están incompletos', () => {
    renderWithProviders();
    const submitButton = screen.getByRole('button', { name: /Registrarse/i });
    fireEvent.click(submitButton);
    expect(screen.getByText(/Todos los campos de dirección son obligatorios./i)).toBeTruthy();
  });

  it('debe mostrar un error si el teléfono tiene un formato incorrecto', () => {
    renderWithProviders();
    fireEvent.change(screen.getByLabelText(/Teléfono/i), { target: { value: '12345678' } });
    const submitButton = screen.getByRole('button', { name: /Registrarse/i });
    fireEvent.click(submitButton);
    expect(screen.getByText(/El teléfono debe tener el formato \+56 9 XXXX XXXX./i)).toBeTruthy();
  });

  it('debe mostrar un error si el código postal no es un número', () => {
    renderWithProviders();
    fireEvent.change(screen.getByLabelText(/Código Postal/i), { target: { value: 'ABC123' } });
    const submitButton = screen.getByRole('button', { name: /Registrarse/i });
    fireEvent.click(submitButton);
    expect(screen.getByText(/El código postal debe ser un número./i)).toBeTruthy();
  });

  it('debe mostrar un error si las contraseñas no coinciden', () => {
    renderWithProviders();
    fireEvent.change(screen.getByLabelText(/Contraseña/i), { target: { value: 'password123' } });
    fireEvent.change(screen.getByLabelText(/Confirmar contraseña/i), { target: { value: 'password456' } });
    const submitButton = screen.getByRole('button', { name: /Registrarse/i });
    fireEvent.click(submitButton);
    expect(screen.getByText(/Las contraseñas no coinciden/i)).toBeTruthy();
  });

  it('debe mostrar un error si el usuario es menor de 18 años', () => {
    renderWithProviders();
    fireEvent.change(screen.getByLabelText(/Fecha de nacimiento/i), { target: { value: '2010-01-01' } });
    const submitButton = screen.getByRole('button', { name: /Registrarse/i });
    fireEvent.click(submitButton);
    expect(screen.getByText(/Debes ser mayor de 18 años/i)).toBeTruthy();
  });

  it('debe manejar errores del servidor al registrar un usuario', async () => {
    spyOn(window, 'fetch').and.returnValue(
      Promise.resolve({
        ok: false,
        json: () => Promise.resolve({ error: 'Error del servidor' }),
      })
    );

    renderWithProviders();
    fireEvent.change(screen.getByLabelText(/Correo electrónico/i), { target: { value: 'test@correo.com' } });
    fireEvent.change(screen.getByLabelText(/Contraseña/i), { target: { value: 'password123' } });
    fireEvent.change(screen.getByLabelText(/Confirmar contraseña/i), { target: { value: 'password123' } });
    fireEvent.change(screen.getByLabelText(/Nombre/i), { target: { value: 'Juan' } });
    fireEvent.change(screen.getByLabelText(/Apellido/i), { target: { value: 'Pérez' } });
    fireEvent.change(screen.getByLabelText(/Fecha de nacimiento/i), { target: { value: '2000-01-01' } });
    fireEvent.change(screen.getByLabelText(/Teléfono/i), { target: { value: '+56 9 1234 5678' } });
    fireEvent.change(screen.getByLabelText(/Calle/i), { target: { value: 'Av. Siempre Viva' } });
    fireEvent.change(screen.getByLabelText(/Número/i), { target: { value: '742' } });
    fireEvent.change(screen.getByLabelText(/Comuna/i), { target: { value: 'Springfield' } });
    fireEvent.change(screen.getByLabelText(/Ciudad/i), { target: { value: 'Springfield' } });
    fireEvent.change(screen.getByLabelText(/Región/i), { target: { value: 'Región Metropolitana' } });

    const submitButton = screen.getByRole('button', { name: /Registrarse/i });
    fireEvent.click(submitButton);

    expect(await screen.findByText(/Error del servidor/i)).toBeTruthy();
  });

  it('debe mostrar un mensaje de éxito si el registro es exitoso', async () => {
    spyOn(window, 'fetch').and.returnValue(
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({}),
      })
    );

    renderWithProviders();
    fireEvent.change(screen.getByLabelText(/Correo electrónico/i), { target: { value: 'test@correo.com' } });
    fireEvent.change(screen.getByLabelText(/Contraseña/i), { target: { value: 'password123' } });
    fireEvent.change(screen.getByLabelText(/Confirmar contraseña/i), { target: { value: 'password123' } });
    fireEvent.change(screen.getByLabelText(/Nombre/i), { target: { value: 'Juan' } });
    fireEvent.change(screen.getByLabelText(/Apellido/i), { target: { value: 'Pérez' } });
    fireEvent.change(screen.getByLabelText(/Fecha de nacimiento/i), { target: { value: '2000-01-01' } });
    fireEvent.change(screen.getByLabelText(/Teléfono/i), { target: { value: '+56 9 1234 5678' } });
    fireEvent.change(screen.getByLabelText(/Calle/i), { target: { value: 'Av. Siempre Viva' } });
    fireEvent.change(screen.getByLabelText(/Número/i), { target: { value: '742' } });
    fireEvent.change(screen.getByLabelText(/Comuna/i), { target: { value: 'Springfield' } });
    fireEvent.change(screen.getByLabelText(/Ciudad/i), { target: { value: 'Springfield' } });
    fireEvent.change(screen.getByLabelText(/Región/i), { target: { value: 'Región Metropolitana' } });

    const submitButton = screen.getByRole('button', { name: /Registrarse/i });
    fireEvent.click(submitButton);

    expect(await screen.findByText(/¡Registro exitoso!/i)).toBeTruthy();
  });
});