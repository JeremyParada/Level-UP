package com.levelup.tienda.backend.service;

import java.util.Optional;

import com.levelup.tienda.backend.dto.RegistroDTO;
import com.levelup.tienda.backend.model.Usuario;

public interface UsuarioService {
    Usuario registrarUsuario(RegistroDTO registroDTO);
    Optional<Usuario> findByEmail(String email);
    Optional<Usuario> findById(Long id);
}
