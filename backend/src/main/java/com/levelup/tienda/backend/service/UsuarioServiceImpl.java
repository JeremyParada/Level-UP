package com.levelup.tienda.backend.service;

import java.text.SimpleDateFormat;
import java.util.Optional;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired; // Asegúrate que esta importación exista
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.levelup.tienda.backend.dto.RegistroDTO;
import com.levelup.tienda.backend.model.ERole;
import com.levelup.tienda.backend.model.Usuario;
import com.levelup.tienda.backend.repository.DireccionRepository;
import com.levelup.tienda.backend.repository.RoleRepository;
import com.levelup.tienda.backend.repository.UsuarioRepository;

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

        Usuario usuario = new Usuario();
        usuario.setEmail(registroDTO.getEmail());
        usuario.setPassword(passwordEncoder.encode(registroDTO.getPassword()));
        usuario.setNombre(registroDTO.getNombre());
        usuario.setApellido(registroDTO.getApellido());
        usuario.setTelefono(registroDTO.getTelefono());
        usuario.setEstadoUsuario("ACTIVO");
        usuario.setFechaRegistro(new java.util.Date());
        usuario.setDescuentoDuoc(0);
        usuario.setPuntosLevelup(0);

        // Parsear fechaNacimiento
        if (registroDTO.getFechaNacimiento() != null && !registroDTO.getFechaNacimiento().isEmpty()) {
            try {
                SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
                usuario.setFechaNacimiento(sdf.parse(registroDTO.getFechaNacimiento()));
            } catch (Exception e) {
                throw new RuntimeException("Formato de fecha de nacimiento inválido. Use yyyy-MM-dd");
            }
        } else {
            throw new RuntimeException("La fecha de nacimiento es obligatoria");
        }

        // ASIGNAR ROL AUTOMÁTICAMENTE
        var rolUser = roleRepository.findByName(ERole.ROLE_USER)
                .orElseThrow(() -> new RuntimeException("Error: Rol USER no existe en la base de datos"));
        usuario.setRoles(Set.of(rolUser));

        // Guardar usuario primero
        Usuario usuarioGuardado = usuarioRepository.save(usuario);

        // Crear y guardar dirección si se proporcionaron datos
        if (registroDTO.getCalle() != null && !registroDTO.getCalle().isEmpty()) {
            com.levelup.tienda.backend.model.Direccion direccion = new com.levelup.tienda.backend.model.Direccion();
            direccion.setUsuario(usuarioGuardado);
            direccion.setCalle(registroDTO.getCalle());
            direccion.setNumero(registroDTO.getNumero());
            direccion.setComuna(registroDTO.getComuna());
            direccion.setCiudad(registroDTO.getCiudad());
            direccion.setRegion(registroDTO.getRegion());
            direccion.setCodigoPostal(registroDTO.getCodigoPostal());
            direccion.setTipoDireccion("ENVIO");
            direccion.setEsPrincipal(1); // Marcar como dirección principal

            direccionRepository.save(direccion);
        }

        return usuarioGuardado;
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
