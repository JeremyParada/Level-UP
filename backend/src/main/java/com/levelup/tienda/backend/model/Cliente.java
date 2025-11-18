package com.levelup.tienda.backend.model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
public class Cliente extends Usuario {

    // No dupliques campos que ya están en Usuario
    // Puedes agregar campos específicos de Cliente aquí

    // Si quieres mantener la relación con Usuario, puedes omitirla si usas herencia
}
