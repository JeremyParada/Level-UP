package com.levelup.tienda.backend.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.levelup.tienda.backend.model.Categoria;
import com.levelup.tienda.backend.model.Producto;
import com.levelup.tienda.backend.repository.CategoriaRepository;
import com.levelup.tienda.backend.repository.ProductoRepository;

@Service
public class ProductoServiceImpl implements ProductoService {

    @Autowired
    private ProductoRepository productoRepository;

    @Autowired
    private CategoriaRepository categoriaRepository;

    @Override
    @Transactional(readOnly = true)
    public List<Producto> findAllProductos() {
        return productoRepository.findAll();
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<Producto> findProductoById(Long id) {
        return productoRepository.findById(id);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Producto> findProductosByCategoria(Long categoriaId) {
        return productoRepository.findByCategoriaId(categoriaId);
    }

    @Override
    @Transactional
    public Producto saveProducto(Producto producto) {
        return productoRepository.save(producto);
    }

    @Override
    @Transactional
    public void deleteProducto(Long id) {
        productoRepository.deleteById(id);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Categoria> findAllCategorias() {
        return categoriaRepository.findAll();
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<Producto> findProductoByCodigo(String codigoProducto) {
        return productoRepository.findByCodigoProducto(codigoProducto);
    }
}
