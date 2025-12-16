package com.levelup.tienda.backend.service;

import java.util.List;
import java.util.Optional;

import com.levelup.tienda.backend.model.Pedido;

public interface PedidoService {
    Pedido crearPedido(com.levelup.tienda.backend.dto.PedidoRequest request);

    Optional<Pedido> getPedidoById(Long id);

    List<Pedido> getPedidosByUsuarioId(Long usuarioId);
}