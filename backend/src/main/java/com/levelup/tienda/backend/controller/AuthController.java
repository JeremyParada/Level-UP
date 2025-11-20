package com.levelup.tienda.backend.controller;

import java.util.Map;

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

        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getEmail(), loginRequest.getPassword()));

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = tokenProvider.generateToken(authentication);
        
        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        Usuario usuario = usuarioService.findByEmail(userDetails.getUsername()).get();

        // Cambia getId() por getIdUsuario() y getUsername() por getNombre()
        return ResponseEntity.ok(new JwtResponseDTO(
            jwt,
            usuario.getIdUsuario(),
            usuario.getNombre(),
            usuario.getEmail()
        ));
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
