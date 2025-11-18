package com.levelup.tienda.backend.repository;

import com.levelup.tienda.backend.model.Resena;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ResenaRepository extends JpaRepository<Resena, Long> {
    List<Resena> findByProductoIdProducto(Long idProducto);
    List<Resena> findByUsuarioIdUsuario(Long idUsuario);
}
