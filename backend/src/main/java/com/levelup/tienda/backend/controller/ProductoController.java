package com.levelup.tienda.backend.controller;

import com.levelup.tienda.backend.model.Categoria;
import com.levelup.tienda.backend.model.Producto;
import com.levelup.tienda.backend.service.ProductoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/productos")
public class ProductoController {

    @Autowired
    private ProductoService productoService;

    @GetMapping
    public List<Producto> getAllProductos() {
        return productoService.findAllProductos();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Producto> getProductoById(@PathVariable Long id) {
        return productoService.findProductoById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/categoria/{categoriaId}")
    public List<Producto> getProductosByCategoria(@PathVariable Long categoriaId) {
        return productoService.findProductosByCategoria(categoriaId);
    }

    @GetMapping("/categorias")
    public List<Categoria> getAllCategorias() {
        return productoService.findAllCategorias();
    }

    // Endpoints de administración (se asegurarán en el Paso 5)
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public Producto createProducto(@RequestBody Producto producto) {
        return productoService.saveProducto(producto);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Producto> updateProducto(@PathVariable Long id, @RequestBody Producto productoDetails) {
        return productoService.findProductoById(id)
                .map(producto -> {
                    producto.setNombreProducto(productoDetails.getNombreProducto());
                    producto.setDescripcion(productoDetails.getDescripcion());
                    producto.setPrecio(productoDetails.getPrecio());
                    producto.setStock(productoDetails.getStock());
                    producto.setCategoria(productoDetails.getCategoria());
                    Producto updatedProducto = productoService.saveProducto(producto);
                    return ResponseEntity.ok(updatedProducto);
                }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteProducto(@PathVariable Long id) {
        return productoService.findProductoById(id)
                .map(producto -> {
                    productoService.deleteProducto(id);
                    return ResponseEntity.ok().<Void>build();
                }).orElse(ResponseEntity.notFound().build());
    }
}
