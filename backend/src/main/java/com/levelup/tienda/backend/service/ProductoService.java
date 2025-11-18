package com.levelup.tienda.backend.service;

import java.util.Optional;
import java.util.List;

import com.levelup.tienda.backend.model.Categoria;
import com.levelup.tienda.backend.model.Producto;

public interface ProductoService {
    List<Producto> findAllProductos();
    Optional<Producto> findProductoById(Long id);
    List<Producto> findProductosByCategoria(Long categoriaId);
    Producto saveProducto(Producto producto);
    void deleteProducto(Long id);

    List<Categoria> findAllCategorias();
}
