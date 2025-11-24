package com.levelup.tienda.backend.service;

import com.levelup.tienda.backend.model.Direccion;
import java.util.List;

public interface DireccionService {
    List<Direccion> findByUsuarioId(Long idUsuario);
    Direccion save(Direccion direccion);
}