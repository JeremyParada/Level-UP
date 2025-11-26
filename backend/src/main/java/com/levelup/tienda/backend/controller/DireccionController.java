package com.levelup.tienda.backend.controller;

import com.levelup.tienda.backend.model.Direccion;
import com.levelup.tienda.backend.repository.DireccionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/direcciones")
public class DireccionController {

    @Autowired
    private DireccionRepository direccionRepository;

    // Obtener todas las direcciones de un usuario
    @GetMapping("/usuario/{idUsuario}")
    public ResponseEntity<List<Direccion>> getDireccionesByUsuario(@PathVariable Long idUsuario) {
        List<Direccion> direcciones = direccionRepository.findByUsuarioIdUsuario(idUsuario);
        return ResponseEntity.ok(direcciones);
    }

    // Crear una nueva dirección
    @PostMapping
    public ResponseEntity<Direccion> createDireccion(@RequestBody Direccion direccion) {
        Direccion nueva = direccionRepository.save(direccion);
        return ResponseEntity.ok(nueva);
    }

    // Actualizar una dirección existente
    @PutMapping("/{id}")
    public ResponseEntity<Direccion> updateDireccion(@PathVariable Long id, @RequestBody Direccion direccionDetails) {
        return direccionRepository.findById(id)
                .map(direccion -> {
                    direccion.setCalle(direccionDetails.getCalle());
                    direccion.setNumero(direccionDetails.getNumero());
                    direccion.setComuna(direccionDetails.getComuna());
                    direccion.setCiudad(direccionDetails.getCiudad());
                    direccion.setRegion(direccionDetails.getRegion());
                    direccion.setCodigoPostal(direccionDetails.getCodigoPostal());
                    Direccion updated = direccionRepository.save(direccion);
                    return ResponseEntity.ok(updated);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    // Eliminar una dirección
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteDireccion(@PathVariable Long id) {
        return direccionRepository.findById(id)
                .map(direccion -> {
                    direccionRepository.delete(direccion);
                    return ResponseEntity.ok().<Void>build();
                })
                .orElse(ResponseEntity.notFound().build());
    }
}