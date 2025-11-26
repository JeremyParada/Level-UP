package com.levelup.tienda.backend.dto;

import java.util.List;
import lombok.Data;

@Data
public class PedidoRequest {
    private Long idUsuario;
    private Long idDireccion;
    private String metodoPago;
    private List<ProductoPedidoRequest> productos;
}
