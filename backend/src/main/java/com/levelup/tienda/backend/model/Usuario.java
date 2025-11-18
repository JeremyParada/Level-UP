package com.levelup.tienda.backend.model;

import jakarta.persistence.*;
import lombok.Data;
import java.util.Date;
import java.util.Set;

@Entity
@Table(name = "usuarios")
@Inheritance(strategy = InheritanceType.SINGLE_TABLE)
@DiscriminatorColumn(name = "TIPO_USUARIO")
@Data
public class Usuario {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ID_USUARIO")
    private Long idUsuario;

    @Column(name = "NOMBRE")
    private String nombre;

    @Column(name = "APELLIDO")
    private String apellido;

    @Column(name = "EMAIL", unique = true)
    private String email;

    @Column(name = "PASSWORD")
    private String password;

    @Column(name = "FECHA_NACIMIENTO")
    @Temporal(TemporalType.DATE)
    private Date fechaNacimiento;

    @Column(name = "TELEFONO")
    private String telefono;

    @Column(name = "FECHA_REGISTRO")
    @Temporal(TemporalType.TIMESTAMP)
    private Date fechaRegistro;

    @Column(name = "DESCUENTO_DUOC")
    private Integer descuentoDuoc;

    @Column(name = "PUNTOS_LEVELUP")
    private Integer puntosLevelup;

    @Column(name = "ESTADO_USUARIO")
    private String estadoUsuario;

    // Relación con roles (muchos a muchos)
    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
        name = "usuario_roles",
        joinColumns = @JoinColumn(name = "USUARIO_ID", referencedColumnName = "ID_USUARIO"),
        inverseJoinColumns = @JoinColumn(name = "ROLE_ID", referencedColumnName = "ID")
    )
    private Set<Role> roles;
}
