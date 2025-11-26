package com.levelup.tienda.backend.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.levelup.tienda.backend.model.Producto;

@Repository
public interface ProductoRepository extends JpaRepository<Producto, Long> {

    @EntityGraph(attributePaths = { "categoria" })
    List<Producto> findAll();

    @EntityGraph(attributePaths = { "categoria" })
    List<Producto> findByCategoriaId(Long categoriaId);

    Optional<Producto> findByCodigoProducto(String codigoProducto);
}
