package com.levelup.tienda.backend.model;

import jakarta.persistence.*;
import lombok.Data;
import java.util.Date;

@Entity
@Table(name = "pedidos")
@Data
public class Pedido {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ID_PEDIDO")
    private Long idPedido;

    @ManyToOne
    @JoinColumn(name = "ID_USUARIO")
    private Usuario usuario;

    @ManyToOne
    @JoinColumn(name = "ID_DIRECCION_ENVIO")
    private Direccion direccionEnvio;

    @Column(name = "FECHA_PEDIDO")
    @Temporal(TemporalType.TIMESTAMP)
    private Date fechaPedido;

    @Column(name = "TOTAL_BRUTO")
    private Double totalBruto;

    @Column(name = "DESCUENTO_APLICADO")
    private Double descuentoAplicado;

    @Column(name = "TOTAL_NETO")
    private Double totalNeto;

    @Column(name = "ESTADO_PEDIDO")
    private String estadoPedido;

    @Column(name = "METODO_PAGO")
    private String metodoPago;

    @OneToMany(mappedBy = "pedido", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private java.util.List<DetallePedido> detalles;
}
