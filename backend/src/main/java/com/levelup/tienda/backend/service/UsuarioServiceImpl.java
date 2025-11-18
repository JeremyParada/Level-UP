package com.levelup.tienda.backend.service;

import com.levelup.tienda.backend.dto.RegistroDTO;
import com.levelup.tienda.backend.model.Administrador; // Asegúrate que esta importación exista
import com.levelup.tienda.backend.model.Cliente;
import com.levelup.tienda.backend.model.ERole;
import com.levelup.tienda.backend.model.Role;
import com.levelup.tienda.backend.model.Usuario;
import com.levelup.tienda.backend.repository.DireccionRepository;
import com.levelup.tienda.backend.repository.RoleRepository;
import com.levelup.tienda.backend.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.Optional;
import java.util.Set;

@Service
public class UsuarioServiceImpl implements UsuarioService {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private DireccionRepository direccionRepository;

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    @Transactional
    public Usuario registrarUsuario(RegistroDTO registroDTO) {
        if (usuarioRepository.existsByEmail(registroDTO.getEmail())) {
            throw new RuntimeException("Error: El email ya está en uso!");
        }

        // Crear siempre un nuevo Cliente
        Cliente usuario = new Cliente();
        usuario.setEmail(registroDTO.getEmail());
        usuario.setPassword(passwordEncoder.encode(registroDTO.getPassword()));

        // Guardar el nuevo cliente
        return usuarioRepository.save(usuario);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<Usuario> findByEmail(String email) {
        return usuarioRepository.findByEmail(email);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<Usuario> findById(Long id) {
        return usuarioRepository.findById(id);
    }
}
