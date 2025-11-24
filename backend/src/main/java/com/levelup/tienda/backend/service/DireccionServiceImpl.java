package com.levelup.tienda.backend.service;

import com.levelup.tienda.backend.model.Direccion;
import com.levelup.tienda.backend.repository.DireccionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class DireccionServiceImpl implements DireccionService {

    @Autowired
    private DireccionRepository direccionRepository;

    @Override
    public List<Direccion> findByUsuarioId(Long idUsuario) {
        return direccionRepository.findByUsuarioIdUsuario(idUsuario);
    }

    @Override
    public Direccion save(Direccion direccion) {
        return direccionRepository.save(direccion);
    }
}