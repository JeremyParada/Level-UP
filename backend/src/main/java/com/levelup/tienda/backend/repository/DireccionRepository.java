package com.levelup.tienda.backend.repository;

import com.levelup.tienda.backend.model.Direccion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DireccionRepository extends JpaRepository<Direccion, Long> {
    List<Direccion> findByUsuarioIdUsuario(Long idUsuario);
}
