package com.levelup.tienda.backend.dto;

import lombok.Data;

@Data
public class RegistroDTO {
    private String nombre;
    private String apellido;
    private String email;
    private String password;
    private String telefono;
    private String fechaNacimiento;
    private String calle;
    private String ciudad;
    private String comuna;
    private String region;
    private String numero;
    private String codigoPostal;
    private String pais;
    private String codigoReferido;
}
