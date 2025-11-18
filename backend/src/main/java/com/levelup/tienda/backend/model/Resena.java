package com.levelup.tienda.backend.model;

import jakarta.persistence.*;
import lombok.Data;
import java.util.Date;

@Entity
@Table(name = "resenas")
@Data
public class Resena {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ID_RESENA")
    private Long idResena;

    @ManyToOne
    @JoinColumn(name = "ID_USUARIO")
    private Usuario usuario;

    @ManyToOne
    @JoinColumn(name = "ID_PRODUCTO")
    private Producto producto;

    @Column(name = "CALIFICACION")
    private Integer calificacion;

    @Column(name = "COMENTARIO")
    private String comentario;

    @Column(name = "FECHA_RESENA")
    @Temporal(TemporalType.TIMESTAMP)
    private Date fechaResena;

    @Column(name = "ESTADO_RESENA")
    private String estadoResena;
}
