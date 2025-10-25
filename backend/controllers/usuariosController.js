const db = require('../config/database');
const oracledb = require('oracledb');

// Registrar usuario
exports.registrarUsuario = async (req, res) => {
  try {
    const { nombre, apellido, email, password, fechaNacimiento, telefono } = req.body;
    
    // Validación básica
    if (!nombre || !apellido || !email || !password || !fechaNacimiento) {
      return res.status(400).json({ error: 'Todos los campos son obligatorios' });
    }
    
    const sql = `
      INSERT INTO usuarios (
        nombre, apellido, email, password, fecha_nacimiento, telefono
      ) VALUES (
        :nombre, :apellido, :email, :password, TO_DATE(:fecha_nacimiento, 'YYYY-MM-DD'), :telefono
      ) RETURNING id_usuario INTO :id_usuario
    `;
    
    const result = await db.execute(sql, {
      nombre,
      apellido,
      email,
      password, // ⚠️ En producción, usar bcrypt
      fecha_nacimiento: fechaNacimiento,
      telefono: telefono || null,
      id_usuario: { type: oracledb.NUMBER, dir: oracledb.BIND_OUT }
    });
    
    res.status(201).json({
      message: 'Usuario registrado exitosamente',
      id_usuario: result.outBinds.id_usuario[0]
    });
  } catch (err) {
    console.error('Error al registrar usuario:', err);
    
    // Verificar si es error de email duplicado
    if (err.errorNum === 1) {
      return res.status(409).json({ error: 'El email ya está registrado' });
    }
    
    res.status(500).json({ 
      error: 'Error al registrar usuario',
      details: err.message 
    });
  }
};

// Obtener perfil de usuario
exports.getPerfil = async (req, res) => {
  try {
    const { idUsuario } = req.params;
    
    const sql = `
      SELECT 
        u.id_usuario,
        u.nombre,
        u.apellido,
        u.email,
        u.telefono,
        u.fecha_nacimiento,
        u.puntos_levelup,
        u.descuento_duoc,
        u.fecha_registro
      FROM usuarios u
      WHERE u.id_usuario = :id_usuario
        AND u.estado_usuario = 'ACTIVO'
    `;
    
    const result = await db.execute(sql, { id_usuario: idUsuario });
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error al obtener usuario:', err);
    res.status(500).json({ 
      error: 'Error al obtener usuario',
      details: err.message 
    });
  }
};

// Actualizar perfil
exports.actualizarPerfil = async (req, res) => {
  try {
    const { idUsuario } = req.params;
    const { nombre, apellido, telefono } = req.body;
    
    const sql = `
      UPDATE usuarios 
      SET nombre = :nombre, 
          apellido = :apellido, 
          telefono = :telefono
      WHERE id_usuario = :id_usuario
    `;
    
    await db.execute(sql, {
      nombre,
      apellido,
      telefono,
      id_usuario: idUsuario
    });
    
    res.json({ message: 'Perfil actualizado correctamente' });
  } catch (err) {
    console.error('Error al actualizar perfil:', err);
    res.status(500).json({ 
      error: 'Error al actualizar perfil',
      details: err.message 
    });
  }
};

// Actualizar puntos usando el procedimiento del paquete
exports.actualizarPuntos = async (req, res) => {
  try {
    const { idUsuario } = req.params;
    const { puntos, tipo } = req.body;
    
    const sql = `
      BEGIN
        pkg_levelup_gamer.proc_actualizar_puntos(:id_usuario, :puntos, :tipo);
      END;
    `;
    
    await db.execute(sql, {
      id_usuario: idUsuario,
      puntos,
      tipo: tipo || 'AJUSTE_MANUAL'
    });
    
    res.json({ message: 'Puntos actualizados correctamente' });
  } catch (err) {
    console.error('Error al actualizar puntos:', err);
    res.status(500).json({ 
      error: 'Error al actualizar puntos',
      details: err.message 
    });
  }
};

// Login básico
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ error: 'Email y contraseña son requeridos' });
    }
    
    const sql = `
      SELECT 
        id_usuario,
        nombre,
        apellido,
        email,
        puntos_levelup,
        descuento_duoc
      FROM usuarios
      WHERE email = :email
        AND password = :password
        AND estado_usuario = 'ACTIVO'
    `;
    
    const result = await db.execute(sql, { email, password });
    
    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }
    
    res.json({
      message: 'Login exitoso',
      usuario: result.rows[0]
    });
  } catch (err) {
    console.error('Error en login:', err);
    res.status(500).json({ 
      error: 'Error en login',
      details: err.message 
    });
  }
};