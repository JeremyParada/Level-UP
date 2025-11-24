package com.levelup.tienda.backend.service;

import java.util.List;
import java.util.Optional;

import com.levelup.tienda.backend.model.Pedido;

public interface PedidoService {
    Pedido crearPedido(Pedido pedido);
    Optional<Pedido> getPedidoById(Long id);
    List<Pedido> getPedidosByUsuarioId(Long usuarioId);
};