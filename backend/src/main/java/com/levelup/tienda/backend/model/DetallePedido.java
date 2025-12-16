package com.levelup.tienda.backend.model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "detalle_pedido")
@Data
public class DetallePedido {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ID_DETALLE_PEDIDO")
    private Long idDetallePedido;

    @ManyToOne
    @JoinColumn(name = "ID_PEDIDO")
    private Pedido pedido;

    @ManyToOne
    @JoinColumn(name = "ID_PRODUCTO")
    private Producto producto;

    @Column(name = "CANTIDAD")
    private Integer cantidad;

    @Column(name = "PRECIO_UNITARIO")
    private Double precioUnitario;

    @Column(name = "SUBTOTAL")
    private Double subtotal;
}
