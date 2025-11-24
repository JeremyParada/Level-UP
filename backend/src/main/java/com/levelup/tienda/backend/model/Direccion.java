package com.levelup.tienda.backend.model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "direcciones")
@Data
public class Direccion {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ID_DIRECCION")
    private Long idDireccion;

    @ManyToOne
    @JoinColumn(name = "ID_USUARIO")
    private Usuario usuario;

    @Column(name = "TIPO_DIRECCION")
    private String tipoDireccion;

    @Column(name = "CALLE")
    private String calle;

    @Column(name = "NUMERO")
    private String numero;

    @Column(name = "COMUNA")
    private String comuna;

    @Column(name = "CIUDAD")
    private String ciudad;

    @Column(name = "REGION")
    private String region;

    @Column(name = "CODIGO_POSTAL")
    private String codigoPostal;

    @Column(name = "ES_PRINCIPAL")
    private Integer esPrincipal;
}
