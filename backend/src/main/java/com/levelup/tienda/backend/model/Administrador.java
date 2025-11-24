package com.levelup.tienda.backend.model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "administradores")
@Data
public class Administrador {

    @Id
    @Column(name = "ID")
    private Long id;

    @Column(name = "NIVEL_ACCESO")
    private Integer nivelAcceso;

    // Relación con Usuario (opcional, si quieres acceder al usuario base)
    @OneToOne
    @JoinColumn(name = "ID", referencedColumnName = "ID_USUARIO")
    private Usuario usuario;
}
