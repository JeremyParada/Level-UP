package com.levelup.tienda.backend.repository;

import com.levelup.tienda.backend.model.Referido;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ReferidoRepository extends JpaRepository<Referido, Long> {
}
