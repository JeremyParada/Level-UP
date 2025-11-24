package com.levelup.tienda.backend.service;

import java.util.List;
import java.util.Optional;

import com.levelup.tienda.backend.model.Categoria;
import com.levelup.tienda.backend.model.Producto;

public interface ProductoService {
    List<Producto> findAllProductos();
    Optional<Producto> findProductoById(Long id);
    Optional<Producto> findProductoByCodigo(String codigoProducto);
    List<Producto> findProductosByCategoria(Long categoriaId);
    Producto saveProducto(Producto producto);
    void deleteProducto(Long id);

    List<Categoria> findAllCategorias();
}
