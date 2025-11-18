package com.levelup.tienda.backend.model;

import jakarta.persistence.*;
import lombok.Data;
import java.util.Date;

@Entity
@Table(name = "referidos")
@Data
public class Referido {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ID_REFERIDO")
    private Long idReferido;

    @ManyToOne
    @JoinColumn(name = "ID_USUARIO_REFERIDOR")
    private Usuario usuarioReferidor;

    @ManyToOne
    @JoinColumn(name = "ID_USUARIO_REFERIDO")
    private Usuario usuarioReferido;

    @Column(name = "CODIGO_REFERIDO")
    private String codigoReferido;

    @Column(name = "FECHA_REFERIDO")
    @Temporal(TemporalType.TIMESTAMP)
    private Date fechaReferido;

    @Column(name = "PUNTOS_OTORGADOS")
    private Integer puntosOtorgados;

    @Column(name = "ESTADO_REFERIDO")
    private String estadoReferido;
}
