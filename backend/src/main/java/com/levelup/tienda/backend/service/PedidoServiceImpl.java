package com.levelup.tienda.backend.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.levelup.tienda.backend.model.Pedido;
import com.levelup.tienda.backend.repository.PedidoRepository;

@Service
public class PedidoServiceImpl implements PedidoService {

    @Autowired
    private PedidoRepository pedidoRepository;

    @Override
    @Transactional
    public Pedido crearPedido(Pedido pedido) {
        // Lógica para calcular el total y validar stock se puede agregar aquí
        return pedidoRepository.save(pedido);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<Pedido> getPedidoById(Long id) {
        return pedidoRepository.findById(id);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Pedido> getPedidosByUsuarioId(Long usuarioId) {
        return pedidoRepository.findByUsuarioIdUsuario(usuarioId);
    }
}