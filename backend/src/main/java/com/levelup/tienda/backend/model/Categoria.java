package com.levelup.tienda.backend.model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "categorias")
@Data
public class Categoria {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ID_CATEGORIA")
    private Long id;

    @Column(name = "NOMBRE_CATEGORIA")
    private String nombre;

    @Column(name = "DESCRIPCION")
    private String descripcion;
}
