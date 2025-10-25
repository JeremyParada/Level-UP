const db = require('../config/database');
const oracledb = require('oracledb');

// Crear pedido
exports.crearPedido = async (req, res) => {
  try {
    const { idUsuario, productos, metodoPago, idDireccion } = req.body;
    
    if (!idUsuario || !productos || productos.length === 0) {
      return res.status(400).json({ error: 'Datos de pedido incompletos' });
    }
    
    // Calcular totales
    let totalBruto = 0;
    for (const prod of productos) {
      totalBruto += prod.precio * prod.cantidad;
    }
    
    // Calcular descuento usando la función del paquete
    let descuentoAplicado = 0;
    try {
      const sqlDescuento = `
        SELECT pkg_levelup_gamer.func_calcular_descuento(:id_usuario, :total) AS descuento
        FROM DUAL
      `;
      const resultDescuento = await db.execute(sqlDescuento, {
        id_usuario: idUsuario,
        total: totalBruto
      });
      descuentoAplicado = resultDescuento.rows[0].DESCUENTO || 0;
    } catch (err) {
      console.log('No se pudo calcular descuento, continuando sin descuento:', err.message);
    }
    
    const totalNeto = totalBruto - descuentoAplicado;
    
    // Insertar pedido
    const sqlPedido = `
      INSERT INTO pedidos (
        id_usuario, id_direccion_envio, total_bruto, descuento_aplicado, total_neto, metodo_pago
      ) VALUES (
        :id_usuario, :id_direccion, :total_bruto, :descuento, :total_neto, :metodo_pago
      ) RETURNING id_pedido INTO :id_pedido
    `;
    
    const resultPedido = await db.execute(sqlPedido, {
      id_usuario: idUsuario,
      id_direccion: idDireccion || null,
      total_bruto: totalBruto,
      descuento: descuentoAplicado,
      total_neto: totalNeto,
      metodo_pago: metodoPago || 'WEBPAY',
      id_pedido: { type: oracledb.NUMBER, dir: oracledb.BIND_OUT }
    });
    
    const idPedido = resultPedido.outBinds.id_pedido[0];
    
    // Insertar detalle de pedido
    for (const prod of productos) {
      const sqlDetalle = `
        INSERT INTO detalle_pedido (
          id_pedido, id_producto, cantidad, precio_unitario
        ) VALUES (
          :id_pedido, :id_producto, :cantidad, :precio_unitario
        )
      `;
      
      await db.execute(sqlDetalle, {
        id_pedido: idPedido,
        id_producto: prod.id_producto,
        cantidad: prod.cantidad,
        precio_unitario: prod.precio
      });
      
      // Actualizar stock
      const sqlStock = `
        UPDATE productos 
        SET stock = stock - :cantidad
        WHERE id_producto = :id_producto
      `;
      
      await db.execute(sqlStock, {
        cantidad: prod.cantidad,
        id_producto: prod.id_producto
      });
    }
    
    res.status(201).json({ 
      message: 'Pedido creado exitosamente',
      id_pedido: idPedido,
      total_bruto: totalBruto,
      descuento_aplicado: descuentoAplicado,
      total_neto: totalNeto
    });
  } catch (err) {
    console.error('Error al crear pedido:', err);
    res.status(500).json({ 
      error: 'Error al crear pedido',
      details: err.message 
    });
  }
};

// Obtener historial de pedidos
exports.getHistorialPedidos = async (req, res) => {
  try {
    const { idUsuario } = req.params;
    
    const sql = `
      SELECT 
        p.id_pedido,
        p.fecha_pedido,
        p.total_bruto,
        p.descuento_aplicado,
        p.total_neto,
        p.estado_pedido,
        p.metodo_pago,
        COUNT(dp.id_detalle_pedido) AS cantidad_productos
      FROM pedidos p
      LEFT JOIN detalle_pedido dp ON p.id_pedido = dp.id_pedido
      WHERE p.id_usuario = :id_usuario
      GROUP BY p.id_pedido, p.fecha_pedido, p.total_bruto, p.descuento_aplicado, 
               p.total_neto, p.estado_pedido, p.metodo_pago
      ORDER BY p.fecha_pedido DESC
    `;
    
    const result = await db.execute(sql, { id_usuario: idUsuario });
    res.json(result.rows);
  } catch (err) {
    console.error('Error al obtener pedidos:', err);
    res.status(500).json({ 
      error: 'Error al obtener historial de pedidos',
      details: err.message 
    });
  }
};

// Obtener detalle de un pedido
exports.getDetallePedido = async (req, res) => {
  try {
    const { idPedido } = req.params;
    
    // Información del pedido
    const sqlPedido = `
      SELECT 
        p.id_pedido,
        p.fecha_pedido,
        p.total_bruto,
        p.descuento_aplicado,
        p.total_neto,
        p.estado_pedido,
        p.metodo_pago,
        u.nombre || ' ' || u.apellido AS nombre_usuario,
        u.email
      FROM pedidos p
      JOIN usuarios u ON p.id_usuario = u.id_usuario
      WHERE p.id_pedido = :id_pedido
    `;
    
    const resultPedido = await db.execute(sqlPedido, { id_pedido: idPedido });
    
    if (resultPedido.rows.length === 0) {
      return res.status(404).json({ error: 'Pedido no encontrado' });
    }
    
    // Detalle de productos
    const sqlDetalle = `
      SELECT 
        dp.id_detalle_pedido,
        pr.codigo_producto,
        pr.nombre_producto,
        dp.cantidad,
        dp.precio_unitario,
        dp.subtotal
      FROM detalle_pedido dp
      JOIN productos pr ON dp.id_producto = pr.id_producto
      WHERE dp.id_pedido = :id_pedido
    `;
    
    const resultDetalle = await db.execute(sqlDetalle, { id_pedido: idPedido });
    
    res.json({
      pedido: resultPedido.rows[0],
      productos: resultDetalle.rows
    });
  } catch (err) {
    console.error('Error al obtener detalle de pedido:', err);
    res.status(500).json({ 
      error: 'Error al obtener detalle de pedido',
      details: err.message 
    });
  }
};

// Actualizar estado del pedido
exports.actualizarEstadoPedido = async (req, res) => {
  try {
    const { idPedido } = req.params;
    const { estado } = req.body;
    
    const estadosValidos = ['PENDIENTE', 'CONFIRMADO', 'PREPARANDO', 'ENVIADO', 'ENTREGADO', 'CANCELADO'];
    
    if (!estadosValidos.includes(estado)) {
      return res.status(400).json({ error: 'Estado inválido' });
    }
    
    const sql = `
      UPDATE pedidos
      SET estado_pedido = :estado
      WHERE id_pedido = :id_pedido
    `;
    
    await db.execute(sql, {
      estado,
      id_pedido: idPedido
    });
    
    res.json({ message: 'Estado del pedido actualizado correctamente' });
  } catch (err) {
    console.error('Error al actualizar estado:', err);
    res.status(500).json({ 
      error: 'Error al actualizar estado del pedido',
      details: err.message 
    });
  }
};

// Cancelar pedido
exports.cancelarPedido = async (req, res) => {
  try {
    const { idPedido } = req.params;
    
    // Verificar estado actual
    const sqlVerificar = `
      SELECT estado_pedido
      FROM pedidos
      WHERE id_pedido = :id_pedido
    `;
    
    const resultVerificar = await db.execute(sqlVerificar, { id_pedido: idPedido });
    
    if (resultVerificar.rows.length === 0) {
      return res.status(404).json({ error: 'Pedido no encontrado' });
    }
    
    const estadoActual = resultVerificar.rows[0].ESTADO_PEDIDO;
    
    if (estadoActual === 'ENVIADO' || estadoActual === 'ENTREGADO') {
      return res.status(400).json({ 
        error: 'No se puede cancelar un pedido que ya fue enviado o entregado' 
      });
    }
    
    // Cancelar pedido
    const sqlCancelar = `
      UPDATE pedidos
      SET estado_pedido = 'CANCELADO'
      WHERE id_pedido = :id_pedido
    `;
    
    await db.execute(sqlCancelar, { id_pedido: idPedido });
    
    // Restaurar stock
    const sqlProductos = `
      SELECT id_producto, cantidad
      FROM detalle_pedido
      WHERE id_pedido = :id_pedido
    `;
    
    const resultProductos = await db.execute(sqlProductos, { id_pedido: idPedido });
    
    for (const producto of resultProductos.rows) {
      const sqlStock = `
        UPDATE productos
        SET stock = stock + :cantidad
        WHERE id_producto = :id_producto
      `;
      
      await db.execute(sqlStock, {
        cantidad: producto.CANTIDAD,
        id_producto: producto.ID_PRODUCTO
      });
    }
    
    res.json({ message: 'Pedido cancelado exitosamente' });
  } catch (err) {
    console.error('Error al cancelar pedido:', err);
    res.status(500).json({ 
      error: 'Error al cancelar pedido',
      details: err.message 
    });
  }
};