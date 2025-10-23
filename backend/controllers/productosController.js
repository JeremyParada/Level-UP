const db = require('../config/database');

// Obtener todos los productos con su categoría
exports.getProductos = async (req, res) => {
  try {
    const sql = `
      SELECT 
        p.id_producto,
        p.codigo_producto,
        p.nombre_producto,
        p.precio,
        p.descripcion,
        p.stock,
        p.estado_producto,
        c.nombre_categoria
      FROM productos p
      JOIN categorias c ON p.id_categoria = c.id_categoria
      WHERE p.estado_producto = 'ACTIVO'
      ORDER BY p.nombre_producto
    `;
    
    const result = await db.execute(sql);
    res.json(result.rows);
  } catch (err) {
    console.error('Error al obtener productos:', err);
    res.status(500).json({ 
      error: 'Error al obtener productos',
      details: err.message 
    });
  }
};

// Obtener producto por código
exports.getProductoPorCodigo = async (req, res) => {
  try {
    const { codigo } = req.params;
    
    const sql = `
      SELECT 
        p.id_producto,
        p.codigo_producto,
        p.nombre_producto,
        p.precio,
        p.descripcion,
        p.stock,
        p.estado_producto,
        c.id_categoria,
        c.nombre_categoria
      FROM productos p
      JOIN categorias c ON p.id_categoria = c.id_categoria
      WHERE p.codigo_producto = :codigo
        AND p.estado_producto = 'ACTIVO'
    `;
    
    const result = await db.execute(sql, { codigo });
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }
    
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error al obtener producto:', err);
    res.status(500).json({ 
      error: 'Error al obtener producto',
      details: err.message 
    });
  }
};

// Obtener todas las categorías con conteo de productos
exports.getCategorias = async (req, res) => {
  try {
    const sql = `
      SELECT 
        c.id_categoria,
        c.nombre_categoria,
        c.descripcion,
        COUNT(p.id_producto) AS total_productos
      FROM categorias c
      LEFT JOIN productos p ON c.id_categoria = p.id_categoria 
        AND p.estado_producto = 'ACTIVO'
      GROUP BY c.id_categoria, c.nombre_categoria, c.descripcion
      ORDER BY c.nombre_categoria
    `;
    
    const result = await db.execute(sql);
    res.json(result.rows);
  } catch (err) {
    console.error('Error al obtener categorías:', err);
    res.status(500).json({ 
      error: 'Error al obtener categorías',
      details: err.message 
    });
  }
};

// Obtener productos por categoría
exports.getProductosPorCategoria = async (req, res) => {
  try {
    const { idCategoria } = req.params;
    
    const sql = `
      SELECT 
        p.id_producto,
        p.codigo_producto,
        p.nombre_producto,
        p.precio,
        p.descripcion,
        p.stock,
        c.nombre_categoria
      FROM productos p
      JOIN categorias c ON p.id_categoria = c.id_categoria
      WHERE p.id_categoria = :id_categoria
        AND p.estado_producto = 'ACTIVO'
      ORDER BY p.nombre_producto
    `;
    
    const result = await db.execute(sql, { id_categoria: idCategoria });
    res.json(result.rows);
  } catch (err) {
    console.error('Error al obtener productos por categoría:', err);
    res.status(500).json({ 
      error: 'Error al obtener productos',
      details: err.message 
    });
  }
};