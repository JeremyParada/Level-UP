package com.levelup.tienda.backend.dto;

import lombok.Data;

@Data
public class RegistroDTO {
    private String username;
    private String email;
    private String password;
    private String calle;
    private String ciudad;
    private String estado;
    private String codigoPostal;
    private String pais;
}
