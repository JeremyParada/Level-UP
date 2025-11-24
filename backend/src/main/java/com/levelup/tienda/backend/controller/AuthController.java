package com.levelup.tienda.backend.controller;

import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.levelup.tienda.backend.dto.JwtResponseDTO;
import com.levelup.tienda.backend.dto.LoginDTO;
import com.levelup.tienda.backend.dto.RegistroDTO;
import com.levelup.tienda.backend.model.Usuario;
import com.levelup.tienda.backend.security.jwt.JwtTokenProvider;
import com.levelup.tienda.backend.service.UsuarioService;

@RestController
@RequestMapping("/api/v1/auth")
public class AuthController {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private UsuarioService usuarioService;

    @Autowired
    private JwtTokenProvider tokenProvider;

    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(@RequestBody LoginDTO loginRequest) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(loginRequest.getEmail(), loginRequest.getPassword()));

            SecurityContextHolder.getContext().setAuthentication(authentication);
            String jwt = tokenProvider.generateToken(authentication);

            UserDetails userDetails = (UserDetails) authentication.getPrincipal();
            Optional<Usuario> usuarioOpt = usuarioService.findByEmail(userDetails.getUsername());
            if (usuarioOpt.isEmpty()) {
                // Usuario no existe, responde 401
                return ResponseEntity.status(401).body(Map.of("error", "Credenciales inválidas"));
            }
            Usuario usuario = usuarioOpt.get();

            return ResponseEntity.ok(new JwtResponseDTO(
                jwt,
                usuario.getIdUsuario(),
                usuario.getNombre(),
                usuario.getEmail()
            ));
        } catch (Exception e) {
            // Cualquier excepción de autenticación responde 401
            return ResponseEntity.status(401).body(Map.of("error", "Credenciales inválidas"));
        }
    }

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody RegistroDTO registroDTO) {
        try {
            usuarioService.registrarUsuario(registroDTO);
            return ResponseEntity.ok(Map.of("message", "Usuario registrado exitosamente!"));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}
