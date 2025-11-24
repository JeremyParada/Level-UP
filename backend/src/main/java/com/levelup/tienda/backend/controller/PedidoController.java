package com.levelup.tienda.backend.controller;

import com.levelup.tienda.backend.model.Pedido;
import com.levelup.tienda.backend.service.PedidoService;
import com.levelup.tienda.backend.model.Usuario;
import com.levelup.tienda.backend.service.UsuarioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/pedidos")
public class PedidoController {

    @Autowired
    private PedidoService pedidoService;

    @Autowired
    private UsuarioService usuarioService;

    @GetMapping("/usuario/{id}")
    public ResponseEntity<?> getPedidosPorUsuario(@PathVariable Long id, Authentication authentication) {
        Usuario usuario = usuarioService.findByEmail(authentication.getName()).orElse(null);
        if (usuario == null || !usuario.getIdUsuario().equals(id)) {
            return ResponseEntity.status(403).body("No autorizado");
        }
        List<Pedido> pedidos = pedidoService.getPedidosByUsuarioId(id);
        return ResponseEntity.ok(pedidos);
    }
}