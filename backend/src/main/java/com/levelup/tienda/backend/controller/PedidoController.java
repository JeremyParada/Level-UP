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

    @PostMapping
    public ResponseEntity<?> crearPedido(@RequestBody com.levelup.tienda.backend.dto.PedidoRequest request) {
        try {
            Pedido nuevoPedido = pedidoService.crearPedido(request);

            // Puntos ya calculados en el servicio
            int puntosGanados = (int) (nuevoPedido.getTotalNeto() / 1000);

            return ResponseEntity.ok(java.util.Map.of(
                    "mensaje", "Pedido creado exitosamente",
                    "idPedido", nuevoPedido.getIdPedido(),
                    "puntos", puntosGanados));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(java.util.Map.of("error", e.getMessage()));
        }
    }
}