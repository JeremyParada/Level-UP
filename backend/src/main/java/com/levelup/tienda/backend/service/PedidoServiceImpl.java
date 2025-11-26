package com.levelup.tienda.backend.service;

import java.util.List;
import java.util.Optional;
import java.util.ArrayList;
import java.util.Date;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.levelup.tienda.backend.model.Pedido;
import com.levelup.tienda.backend.model.DetallePedido;
import com.levelup.tienda.backend.model.Producto;
import com.levelup.tienda.backend.model.Usuario;
import com.levelup.tienda.backend.model.Direccion;
import com.levelup.tienda.backend.repository.PedidoRepository;
import com.levelup.tienda.backend.repository.ProductoRepository;
import com.levelup.tienda.backend.repository.UsuarioRepository;
import com.levelup.tienda.backend.repository.DireccionRepository;
import com.levelup.tienda.backend.dto.PedidoRequest;
import com.levelup.tienda.backend.dto.ProductoPedidoRequest;

@Service
public class PedidoServiceImpl implements PedidoService {

    @Autowired
    private PedidoRepository pedidoRepository;

    @Autowired
    private ProductoRepository productoRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private DireccionRepository direccionRepository;

    @Override
    @Transactional
    public Pedido crearPedido(@NonNull PedidoRequest request) {
        Usuario usuario = usuarioRepository.findById(request.getIdUsuario())
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        Direccion direccion = direccionRepository.findById(request.getIdDireccionEnvio())
                .orElseThrow(() -> new RuntimeException("Dirección no encontrada"));

        Pedido pedido = new Pedido();
        pedido.setUsuario(usuario);
        pedido.setDireccionEnvio(direccion);
        pedido.setFechaPedido(new Date());
        pedido.setEstadoPedido("PENDIENTE");
        pedido.setMetodoPago(request.getMetodoPago());

        List<DetallePedido> detalles = new ArrayList<>();
        double total = 0;

        for (ProductoPedidoRequest item : request.getProductos()) {
            Producto producto = productoRepository.findByCodigoProducto(item.getCodigo())
                    .orElseThrow(() -> new RuntimeException("Producto no encontrado: " + item.getCodigo()));

            DetallePedido detalle = new DetallePedido();
            detalle.setPedido(pedido);
            detalle.setProducto(producto);
            detalle.setCantidad(item.getCantidad());
            detalle.setPrecioUnitario(producto.getPrecio());

            detalles.add(detalle);
            total += producto.getPrecio() * item.getCantidad();
        }

        pedido.setDetalles(detalles);
        pedido.setTotalBruto(total);
        pedido.setTotalNeto(total); // Simplificado sin impuestos por ahora
        pedido.setDescuentoAplicado(0.0);

        // Actualizar puntos del usuario
        int puntosGanados = (int) (total / 1000);
        if (usuario.getPuntosLevelup() == null) {
            usuario.setPuntosLevelup(0);
        }
        usuario.setPuntosLevelup(usuario.getPuntosLevelup() + puntosGanados);
        usuarioRepository.save(usuario);

        return pedidoRepository.save(pedido);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<Pedido> getPedidoById(@NonNull Long id) {
        return pedidoRepository.findById(id);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Pedido> getPedidosByUsuarioId(Long usuarioId) {
        return pedidoRepository.findByUsuarioIdUsuario(usuarioId);
    }
}