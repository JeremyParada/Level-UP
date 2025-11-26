package com.levelup.tienda.backend.dto;

import lombok.Data;

@Data
public class ProductoPedidoRequest {
    private String codigo;
    private Integer cantidad;
}
