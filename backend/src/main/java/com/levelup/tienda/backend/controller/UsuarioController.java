package com.levelup.tienda.backend.controller;

import com.levelup.tienda.backend.model.Usuario;
import com.levelup.tienda.backend.service.UsuarioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/usuarios")
public class UsuarioController {

    @Autowired
    private UsuarioService usuarioService;

    @GetMapping("/me/{id}")
    public ResponseEntity<?> getPerfil(@PathVariable Long id, Authentication authentication) {
        // Validar que el usuario autenticado coincida con el id solicitado
        Usuario usuario = usuarioService.findByEmail(authentication.getName()).orElse(null);
        if (usuario == null || !usuario.getIdUsuario().equals(id)) {
            return ResponseEntity.status(403).body("No autorizado");
        }
        return ResponseEntity.ok(usuario);
    }
}