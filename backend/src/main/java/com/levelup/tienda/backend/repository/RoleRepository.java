package com.levelup.tienda.backend.repository;

import com.levelup.tienda.backend.model.ERole;
import com.levelup.tienda.backend.model.Role;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface RoleRepository extends JpaRepository<Role, Long> {
    // Cambiar el tipo del parámetro de String a ERole
    Optional<Role> findByName(ERole name);
}
