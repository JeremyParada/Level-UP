-- =====================================================
-- SCRIPT COMPLETO - BASE DE DATOS LEVEL-UP GAMER
-- ORACLE SQL DEVELOPER - EVALUACIÓN PL/SQL
-- =====================================================

-- =====================================================
-- LIMPIEZA COMPLETA DEL ESQUEMA
-- =====================================================
BEGIN
    -- Deshabilitar constraints para evitar errores de dependencias
    FOR c IN (SELECT constraint_name, table_name FROM user_constraints 
              WHERE constraint_type = 'R') LOOP
        BEGIN
            EXECUTE IMMEDIATE 'ALTER TABLE ' || c.table_name || ' DROP CONSTRAINT ' || c.constraint_name;
        EXCEPTION
            WHEN OTHERS THEN NULL;
        END;
    END LOOP;
    
    -- Eliminar todos los tipos de objeto definidos por el usuario
    FOR t IN (SELECT type_name FROM user_types) LOOP
        BEGIN
            EXECUTE IMMEDIATE 'DROP TYPE ' || t.type_name || ' FORCE';
        EXCEPTION
            WHEN OTHERS THEN NULL;
        END;
    END LOOP;
    
    -- Eliminar todos los packages
    FOR p IN (SELECT object_name FROM user_objects WHERE object_type = 'PACKAGE') LOOP
        BEGIN
            EXECUTE IMMEDIATE 'DROP PACKAGE ' || p.object_name;
        EXCEPTION
            WHEN OTHERS THEN NULL;
        END;
    END LOOP;
    
    -- Eliminar todas las funciones independientes
    FOR f IN (SELECT object_name FROM user_objects WHERE object_type = 'FUNCTION') LOOP
        BEGIN
            EXECUTE IMMEDIATE 'DROP FUNCTION ' || f.object_name;
        EXCEPTION
            WHEN OTHERS THEN NULL;
        END;
    END LOOP;
    
    -- Eliminar todos los procedimientos independientes
    FOR pr IN (SELECT object_name FROM user_objects WHERE object_type = 'PROCEDURE') LOOP
        BEGIN
            EXECUTE IMMEDIATE 'DROP PROCEDURE ' || pr.object_name;
        EXCEPTION
            WHEN OTHERS THEN NULL;
        END;
    END LOOP;
    
    -- Eliminar todas las vistas
    FOR v IN (SELECT view_name FROM user_views) LOOP
        BEGIN
            EXECUTE IMMEDIATE 'DROP VIEW ' || v.view_name;
        EXCEPTION
            WHEN OTHERS THEN NULL;
        END;
    END LOOP;
    
    -- Eliminar todos los triggers
    FOR t IN (SELECT trigger_name FROM user_triggers) LOOP
        BEGIN
            EXECUTE IMMEDIATE 'DROP TRIGGER ' || t.trigger_name;
        EXCEPTION
            WHEN OTHERS THEN NULL;
        END;
    END LOOP;
    
    -- Eliminar todas las tablas
    FOR c IN (SELECT table_name FROM user_tables) LOOP
        BEGIN
            EXECUTE IMMEDIATE 'DROP TABLE ' || c.table_name || ' CASCADE CONSTRAINTS PURGE';
        EXCEPTION
            WHEN OTHERS THEN NULL;
        END;
    END LOOP;
    
    -- Eliminar todas las secuencias
    FOR s IN (SELECT sequence_name FROM user_sequences) LOOP
        BEGIN
            EXECUTE IMMEDIATE 'DROP SEQUENCE ' || s.sequence_name;
        EXCEPTION
            WHEN OTHERS THEN NULL;
        END;
    END LOOP;
    
    -- Eliminar todos los índices personalizados
    FOR i IN (SELECT index_name FROM user_indexes 
              WHERE index_name NOT LIKE 'SYS_%' 
              AND index_name NOT LIKE 'BIN$%'
              AND generated = 'N') LOOP
        BEGIN
            EXECUTE IMMEDIATE 'DROP INDEX ' || i.index_name;
        EXCEPTION
            WHEN OTHERS THEN NULL;
        END;
    END LOOP;
    
    -- Limpiar papelera de reciclaje
    BEGIN
        EXECUTE IMMEDIATE 'PURGE RECYCLEBIN';
    EXCEPTION
        WHEN OTHERS THEN NULL;
    END;
    
    DBMS_OUTPUT.PUT_LINE('✅ Limpieza completa realizada exitosamente');
    DBMS_OUTPUT.PUT_LINE('📋 Esquema preparado para nueva instalación');
END;
/

-- =====================================================
-- CREAR SECUENCIAS PARA CLAVES PRIMARIAS
-- =====================================================
CREATE SEQUENCE seq_usuarios START WITH 1 INCREMENT BY 1;
CREATE SEQUENCE seq_direcciones START WITH 1 INCREMENT BY 1;
CREATE SEQUENCE seq_categorias START WITH 1 INCREMENT BY 1;
CREATE SEQUENCE seq_productos START WITH 1 INCREMENT BY 1;
CREATE SEQUENCE seq_carrito START WITH 1 INCREMENT BY 1;
CREATE SEQUENCE seq_detalle_carrito START WITH 1 INCREMENT BY 1;
CREATE SEQUENCE seq_pedidos START WITH 1 INCREMENT BY 1;
CREATE SEQUENCE seq_detalle_pedido START WITH 1 INCREMENT BY 1;
CREATE SEQUENCE seq_resenas START WITH 1 INCREMENT BY 1;
CREATE SEQUENCE seq_referidos START WITH 1 INCREMENT BY 1;
CREATE SEQUENCE seq_transacciones_puntos START WITH 1 INCREMENT BY 1;
CREATE SEQUENCE seq_auditoria_productos START WITH 1 INCREMENT BY 1;

-- =====================================================
-- 1. TABLA USUARIOS (PRIMERO - SIN DEPENDENCIAS)
-- =====================================================
CREATE TABLE usuarios (
    id_usuario NUMBER PRIMARY KEY,
    nombre VARCHAR2(100) NOT NULL,
    apellido VARCHAR2(100) NOT NULL,
    email VARCHAR2(255) NOT NULL UNIQUE,
    password VARCHAR2(255) NOT NULL,
    fecha_nacimiento DATE NOT NULL,
    telefono VARCHAR2(20),
    fecha_registro DATE DEFAULT SYSDATE NOT NULL,
    descuento_duoc NUMBER(1) DEFAULT 0 CHECK (descuento_duoc IN (0,1)),
    puntos_levelup NUMBER(10) DEFAULT 0,
    estado_usuario VARCHAR2(20) DEFAULT 'ACTIVO' CHECK (estado_usuario IN ('ACTIVO', 'INACTIVO', 'SUSPENDIDO'))
);

-- =====================================================
-- 2. TABLA DIRECCIONES (DEPENDE DE USUARIOS)
-- =====================================================
CREATE TABLE direcciones (
    id_direccion NUMBER PRIMARY KEY,
    id_usuario NUMBER NOT NULL,
    tipo_direccion VARCHAR2(20) DEFAULT 'ENVIO' CHECK (tipo_direccion IN ('ENVIO', 'FACTURACION', 'AMBAS')),
    calle VARCHAR2(200) NOT NULL,
    numero VARCHAR2(20) NOT NULL,
    comuna VARCHAR2(100) NOT NULL,
    ciudad VARCHAR2(100) NOT NULL,
    region VARCHAR2(100) NOT NULL,
    codigo_postal VARCHAR2(10),
    es_principal NUMBER(1) DEFAULT 0 CHECK (es_principal IN (0,1)),
    CONSTRAINT fk_direcciones_usuario FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario)
);

-- =====================================================
-- 3. TABLA CATEGORIAS (SIN DEPENDENCIAS)
-- =====================================================
CREATE TABLE categorias (
    id_categoria NUMBER PRIMARY KEY,
    nombre_categoria VARCHAR2(100) NOT NULL UNIQUE,
    descripcion VARCHAR2(500)
);

-- =====================================================
-- 4. TABLA PRODUCTOS (DEPENDE DE CATEGORIAS)
-- =====================================================
CREATE TABLE productos (
    id_producto NUMBER PRIMARY KEY,
    id_categoria NUMBER NOT NULL,
    codigo_producto VARCHAR2(50) NOT NULL UNIQUE,
    nombre_producto VARCHAR2(200) NOT NULL,
    precio NUMBER(10,2) NOT NULL CHECK (precio > 0),
    descripcion CLOB,
    stock NUMBER(10) DEFAULT 0 CHECK (stock >= 0),
    estado_producto VARCHAR2(20) DEFAULT 'ACTIVO' CHECK (estado_producto IN ('ACTIVO', 'INACTIVO', 'DESCONTINUADO')),
    fecha_creacion DATE DEFAULT SYSDATE,
    CONSTRAINT fk_productos_categoria FOREIGN KEY (id_categoria) REFERENCES categorias(id_categoria)
);

-- =====================================================
-- 5. TABLA CARRITO (DEPENDE DE USUARIOS)
-- =====================================================
CREATE TABLE carrito (
    id_carrito NUMBER PRIMARY KEY,
    id_usuario NUMBER NOT NULL UNIQUE,
    fecha_creacion DATE DEFAULT SYSDATE,
    estado_carrito VARCHAR2(20) DEFAULT 'ACTIVO' CHECK (estado_carrito IN ('ACTIVO', 'PROCESANDO', 'COMPLETADO', 'ABANDONADO')),
    CONSTRAINT fk_carrito_usuario FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario)
);

-- =====================================================
-- 6. TABLA DETALLE_CARRITO (DEPENDE DE CARRITO Y PRODUCTOS)
-- =====================================================
CREATE TABLE detalle_carrito (
    id_detalle_carrito NUMBER PRIMARY KEY,
    id_carrito NUMBER NOT NULL,
    id_producto NUMBER NOT NULL,
    cantidad NUMBER(10) NOT NULL CHECK (cantidad > 0),
    precio_unitario NUMBER(10,2) NOT NULL CHECK (precio_unitario > 0),
    fecha_agregado DATE DEFAULT SYSDATE,
    CONSTRAINT fk_detalle_carrito FOREIGN KEY (id_carrito) REFERENCES carrito(id_carrito),
    CONSTRAINT fk_detalle_producto FOREIGN KEY (id_producto) REFERENCES productos(id_producto),
    CONSTRAINT uk_carrito_producto UNIQUE (id_carrito, id_producto)
);

-- =====================================================
-- 7. TABLA PEDIDOS (DEPENDE DE USUARIOS Y DIRECCIONES)
-- =====================================================
CREATE TABLE pedidos (
    id_pedido NUMBER PRIMARY KEY,
    id_usuario NUMBER NOT NULL,
    id_direccion_envio NUMBER NOT NULL,
    fecha_pedido DATE DEFAULT SYSDATE,
    total_bruto NUMBER(12,2) NOT NULL CHECK (total_bruto >= 0),
    descuento_aplicado NUMBER(12,2) DEFAULT 0 CHECK (descuento_aplicado >= 0),
    total_neto NUMBER(12,2) NOT NULL CHECK (total_neto >= 0),
    estado_pedido VARCHAR2(30) DEFAULT 'PENDIENTE' CHECK (estado_pedido IN ('PENDIENTE', 'CONFIRMADO', 'PREPARANDO', 'ENVIADO', 'ENTREGADO', 'CANCELADO')),
    metodo_pago VARCHAR2(50),
    CONSTRAINT fk_pedidos_usuario FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario),
    CONSTRAINT fk_pedidos_direccion FOREIGN KEY (id_direccion_envio) REFERENCES direcciones(id_direccion)
);

-- =====================================================
-- 8. TABLA DETALLE_PEDIDO (DEPENDE DE PEDIDOS Y PRODUCTOS)
-- =====================================================
CREATE TABLE detalle_pedido (
    id_detalle_pedido NUMBER PRIMARY KEY,
    id_pedido NUMBER NOT NULL,
    id_producto NUMBER NOT NULL,
    cantidad NUMBER(10) NOT NULL CHECK (cantidad > 0),
    precio_unitario NUMBER(10,2) NOT NULL CHECK (precio_unitario > 0),
    subtotal NUMBER(12,2) NOT NULL CHECK (subtotal >= 0),
    CONSTRAINT fk_detalle_pedido FOREIGN KEY (id_pedido) REFERENCES pedidos(id_pedido),
    CONSTRAINT fk_detalle_pedido_producto FOREIGN KEY (id_producto) REFERENCES productos(id_producto)
);

-- =====================================================
-- 9. TABLA RESEÑAS (DEPENDE DE USUARIOS Y PRODUCTOS)
-- =====================================================
CREATE TABLE resenas (
    id_resena NUMBER PRIMARY KEY,
    id_usuario NUMBER NOT NULL,
    id_producto NUMBER NOT NULL,
    calificacion NUMBER(1) NOT NULL CHECK (calificacion BETWEEN 1 AND 5),
    comentario VARCHAR2(1000),
    fecha_resena DATE DEFAULT SYSDATE,
    estado_resena VARCHAR2(20) DEFAULT 'ACTIVO' CHECK (estado_resena IN ('ACTIVO', 'INACTIVO', 'REPORTADO')),
    CONSTRAINT fk_resenas_usuario FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario),
    CONSTRAINT fk_resenas_producto FOREIGN KEY (id_producto) REFERENCES productos(id_producto),
    CONSTRAINT uk_usuario_producto_resena UNIQUE (id_usuario, id_producto)
);

-- =====================================================
-- 10. TABLA REFERIDOS (DEPENDE DE USUARIOS - AUTOREFERENCIA)
-- =====================================================
CREATE TABLE referidos (
    id_referido NUMBER PRIMARY KEY,
    id_usuario_referidor NUMBER NOT NULL,
    id_usuario_referido NUMBER,
    codigo_referido VARCHAR2(20) NOT NULL UNIQUE,
    fecha_referido DATE,
    puntos_otorgados NUMBER(10) DEFAULT 0,
    estado_referido VARCHAR2(20) DEFAULT 'PENDIENTE' CHECK (estado_referido IN ('PENDIENTE', 'COMPLETADO', 'EXPIRADO')),
    CONSTRAINT fk_referidos_referidor FOREIGN KEY (id_usuario_referidor) REFERENCES usuarios(id_usuario),
    CONSTRAINT fk_referidos_referido FOREIGN KEY (id_usuario_referido) REFERENCES usuarios(id_usuario),
    CONSTRAINT chk_referidos_diferentes CHECK (id_usuario_referidor != id_usuario_referido)
);

-- =====================================================
-- 11. TABLA TRANSACCIONES_PUNTOS (DEPENDE DE USUARIOS)
-- =====================================================
CREATE TABLE transacciones_puntos (
    id_transaccion NUMBER PRIMARY KEY,
    id_usuario NUMBER NOT NULL,
    tipo_transaccion VARCHAR2(30) NOT NULL CHECK (tipo_transaccion IN ('GANANCIA_COMPRA', 'GANANCIA_REFERIDO', 'CANJE_DESCUENTO', 'CANJE_PRODUCTO', 'AJUSTE_MANUAL')),
    puntos NUMBER(10) NOT NULL,
    descripcion VARCHAR2(255),
    fecha_transaccion DATE DEFAULT SYSDATE,
    id_referencia NUMBER,
    CONSTRAINT fk_transacciones_usuario FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario)
);

-- =====================================================
-- 12. TABLA AUDITORIA_PRODUCTOS (PARA TRIGGERS)
-- =====================================================
CREATE TABLE auditoria_productos (
    id_auditoria NUMBER PRIMARY KEY,
    id_producto NUMBER,
    accion VARCHAR2(10),
    usuario_bd VARCHAR2(100),
    fecha_cambio DATE,
    precio_anterior NUMBER(10,2),
    precio_nuevo NUMBER(10,2),
    stock_anterior NUMBER(10),
    stock_nuevo NUMBER(10)
);

-- =====================================================
-- TRIGGERS PARA CLAVES PRIMARIAS (AUTO-INCREMENT)
-- =====================================================

CREATE OR REPLACE TRIGGER trg_usuarios_pk
    BEFORE INSERT ON usuarios
    FOR EACH ROW
BEGIN
    IF :NEW.id_usuario IS NULL THEN
        :NEW.id_usuario := seq_usuarios.NEXTVAL;
    END IF;
END;
/

CREATE OR REPLACE TRIGGER trg_direcciones_pk
    BEFORE INSERT ON direcciones
    FOR EACH ROW
BEGIN
    IF :NEW.id_direccion IS NULL THEN
        :NEW.id_direccion := seq_direcciones.NEXTVAL;
    END IF;
END;
/

CREATE OR REPLACE TRIGGER trg_categorias_pk
    BEFORE INSERT ON categorias
    FOR EACH ROW
BEGIN
    IF :NEW.id_categoria IS NULL THEN
        :NEW.id_categoria := seq_categorias.NEXTVAL;
    END IF;
END;
/

CREATE OR REPLACE TRIGGER trg_productos_pk
    BEFORE INSERT ON productos
    FOR EACH ROW
BEGIN
    IF :NEW.id_producto IS NULL THEN
        :NEW.id_producto := seq_productos.NEXTVAL;
    END IF;
END;
/

CREATE OR REPLACE TRIGGER trg_carrito_pk
    BEFORE INSERT ON carrito
    FOR EACH ROW
BEGIN
    IF :NEW.id_carrito IS NULL THEN
        :NEW.id_carrito := seq_carrito.NEXTVAL;
    END IF;
END;
/

CREATE OR REPLACE TRIGGER trg_detalle_carrito_pk
    BEFORE INSERT ON detalle_carrito
    FOR EACH ROW
BEGIN
    IF :NEW.id_detalle_carrito IS NULL THEN
        :NEW.id_detalle_carrito := seq_detalle_carrito.NEXTVAL;
    END IF;
END;
/

CREATE OR REPLACE TRIGGER trg_pedidos_pk
    BEFORE INSERT ON pedidos
    FOR EACH ROW
BEGIN
    IF :NEW.id_pedido IS NULL THEN
        :NEW.id_pedido := seq_pedidos.NEXTVAL;
    END IF;
END;
/

CREATE OR REPLACE TRIGGER trg_detalle_pedido_pk
    BEFORE INSERT ON detalle_pedido
    FOR EACH ROW
BEGIN
    IF :NEW.id_detalle_pedido IS NULL THEN
        :NEW.id_detalle_pedido := seq_detalle_pedido.NEXTVAL;
    END IF;
END;
/

CREATE OR REPLACE TRIGGER trg_resenas_pk
    BEFORE INSERT ON resenas
    FOR EACH ROW
BEGIN
    IF :NEW.id_resena IS NULL THEN
        :NEW.id_resena := seq_resenas.NEXTVAL;
    END IF;
END;
/

CREATE OR REPLACE TRIGGER trg_referidos_pk
    BEFORE INSERT ON referidos
    FOR EACH ROW
BEGIN
    IF :NEW.id_referido IS NULL THEN
        :NEW.id_referido := seq_referidos.NEXTVAL;
    END IF;
END;
/

CREATE OR REPLACE TRIGGER trg_transacciones_puntos_pk
    BEFORE INSERT ON transacciones_puntos
    FOR EACH ROW
BEGIN
    IF :NEW.id_transaccion IS NULL THEN
        :NEW.id_transaccion := seq_transacciones_puntos.NEXTVAL;
    END IF;
END;
/

-- =====================================================
-- TRIGGERS DE LÓGICA DE NEGOCIO
-- =====================================================

-- Trigger para verificar email Duoc y asignar descuento automáticamente
CREATE OR REPLACE TRIGGER trg_descuento_duoc
    BEFORE INSERT OR UPDATE ON usuarios
    FOR EACH ROW
BEGIN
    IF LOWER(:NEW.email) LIKE '%@duoc.cl' THEN
        :NEW.descuento_duoc := 1;
    ELSE
        :NEW.descuento_duoc := 0;
    END IF;
END;
/

-- Trigger para validar edad mínima (18 años)
CREATE OR REPLACE TRIGGER trg_validar_edad
    BEFORE INSERT OR UPDATE ON usuarios
    FOR EACH ROW
BEGIN
    IF MONTHS_BETWEEN(SYSDATE, :NEW.fecha_nacimiento) < 216 THEN -- 18 años * 12 meses
        RAISE_APPLICATION_ERROR(-20001, 'El usuario debe ser mayor de 18 años para registrarse');
    END IF;
END;
/

-- Trigger para generar código de referido único
CREATE OR REPLACE TRIGGER trg_generar_codigo_referido
    BEFORE INSERT ON referidos
    FOR EACH ROW
BEGIN
    IF :NEW.codigo_referido IS NULL THEN
        :NEW.codigo_referido := 'REF' || TO_CHAR(SYSDATE, 'YYYYMMDD') || LPAD(seq_referidos.CURRVAL, 4, '0');
    END IF;
END;
/

-- Trigger para calcular subtotal automáticamente
CREATE OR REPLACE TRIGGER trg_calcular_subtotal
    BEFORE INSERT OR UPDATE ON detalle_pedido
    FOR EACH ROW
BEGIN
    :NEW.subtotal := :NEW.cantidad * :NEW.precio_unitario;
END;
/

-- Trigger para auditoría de productos
CREATE OR REPLACE TRIGGER trg_auditoria_productos
    AFTER INSERT OR UPDATE OR DELETE ON productos
    FOR EACH ROW
DECLARE
    v_accion VARCHAR2(10);
BEGIN
    IF INSERTING THEN
        v_accion := 'INSERT';
        INSERT INTO auditoria_productos (
            id_auditoria, id_producto, accion, usuario_bd, fecha_cambio,
            precio_anterior, precio_nuevo, stock_anterior, stock_nuevo
        ) VALUES (
            seq_auditoria_productos.NEXTVAL, :NEW.id_producto, v_accion, USER, SYSDATE,
            NULL, :NEW.precio, NULL, :NEW.stock
        );
    ELSIF UPDATING THEN
        v_accion := 'UPDATE';
        INSERT INTO auditoria_productos (
            id_auditoria, id_producto, accion, usuario_bd, fecha_cambio,
            precio_anterior, precio_nuevo, stock_anterior, stock_nuevo
        ) VALUES (
            seq_auditoria_productos.NEXTVAL, :NEW.id_producto, v_accion, USER, SYSDATE,
            :OLD.precio, :NEW.precio, :OLD.stock, :NEW.stock
        );
    ELSIF DELETING THEN
        v_accion := 'DELETE';
        INSERT INTO auditoria_productos (
            id_auditoria, id_producto, accion, usuario_bd, fecha_cambio,
            precio_anterior, precio_nuevo, stock_anterior, stock_nuevo
        ) VALUES (
            seq_auditoria_productos.NEXTVAL, :OLD.id_producto, v_accion, USER, SYSDATE,
            :OLD.precio, NULL, :OLD.stock, NULL
        );
    END IF;
END;
/

-- TRIGGER: Auditoría global de inserción de pedidos (nivel sentencia)
CREATE OR REPLACE TRIGGER trg_auditoria_pedidos_global
AFTER INSERT ON pedidos
BEGIN
    INSERT INTO auditoria_productos (
        id_auditoria,
        id_producto,
        accion,
        usuario_bd,
        fecha_cambio
    )
    SELECT seq_auditoria_productos.NEXTVAL, id_producto, 'INSERT_PEDIDO', USER, SYSDATE
    FROM detalle_pedido
    WHERE id_pedido IN (SELECT MAX(id_pedido) FROM pedidos);
END;
/


-- =====================================================
-- ÍNDICES PARA MEJORAR RENDIMIENTO
-- =====================================================

-- Índices en usuarios
CREATE INDEX idx_usuarios_estado ON usuarios(estado_usuario);
CREATE INDEX idx_usuarios_fecha_registro ON usuarios(fecha_registro);

-- Índices en productos
CREATE INDEX idx_productos_categoria ON productos(id_categoria);
CREATE INDEX idx_productos_estado ON productos(estado_producto);
CREATE INDEX idx_productos_nombre ON productos(nombre_producto);

-- Índices en pedidos
CREATE INDEX idx_pedidos_usuario ON pedidos(id_usuario);
CREATE INDEX idx_pedidos_fecha ON pedidos(fecha_pedido);
CREATE INDEX idx_pedidos_estado ON pedidos(estado_pedido);

-- Índices en reseñas
CREATE INDEX idx_resenas_producto ON resenas(id_producto);
CREATE INDEX idx_resenas_usuario ON resenas(id_usuario);
CREATE INDEX idx_resenas_calificacion ON resenas(calificacion);

-- Índices en transacciones de puntos
CREATE INDEX idx_transacciones_usuario ON transacciones_puntos(id_usuario);
CREATE INDEX idx_transacciones_fecha ON transacciones_puntos(fecha_transaccion);
CREATE INDEX idx_transacciones_tipo ON transacciones_puntos(tipo_transaccion);

-- Índices en direcciones
CREATE INDEX idx_direcciones_usuario ON direcciones(id_usuario);
CREATE INDEX idx_direcciones_principal ON direcciones(es_principal);

-- =====================================================
-- INSERCIÓN DE DATOS INICIALES - CATEGORÍAS
-- =====================================================

INSERT INTO categorias (nombre_categoria, descripcion) VALUES 
('Juegos de Mesa', 'Juegos de mesa para todas las edades y niveles');

INSERT INTO categorias (nombre_categoria, descripcion) VALUES 
('Accesorios', 'Accesorios gaming y complementos tecnológicos');

INSERT INTO categorias (nombre_categoria, descripcion) VALUES 
('Consolas', 'Consolas de videojuegos y accesorios oficiales');

INSERT INTO categorias (nombre_categoria, descripcion) VALUES 
('Computadores Gamers', 'Computadores especializados para gaming de alto rendimiento');

INSERT INTO categorias (nombre_categoria, descripcion) VALUES 
('Sillas Gamers', 'Sillas ergonómicas diseñadas especialmente para gamers');

INSERT INTO categorias (nombre_categoria, descripcion) VALUES 
('Mouse', 'Mouse gaming de alta precisión y velocidad');

INSERT INTO categorias (nombre_categoria, descripcion) VALUES 
('Mousepad', 'Alfombrillas para mouse gaming de diferentes tamaños');

INSERT INTO categorias (nombre_categoria, descripcion) VALUES 
('Poleras Personalizadas', 'Poleras con diseños gaming personalizados y únicos');

INSERT INTO categorias (nombre_categoria, descripcion) VALUES 
('Polerones Gamers Personalizados', 'Polerones con diseños gaming personalizados');

INSERT INTO categorias (nombre_categoria, descripcion) VALUES 
('Servicio Técnico', 'Servicios de reparación, mantención y optimización');

-- Confirmar cambios
COMMIT;

-- =====================================================
-- VERIFICACIÓN DE CREACIÓN EXITOSA
-- =====================================================

SELECT 'TABLAS CREADAS: ' || COUNT(*) AS resultado
FROM user_tables
WHERE table_name IN ('USUARIOS', 'DIRECCIONES', 'CATEGORIAS', 'PRODUCTOS', 'CARRITO', 
                     'DETALLE_CARRITO', 'PEDIDOS', 'DETALLE_PEDIDO', 'RESEnAS', 
                     'REFERIDOS', 'TRANSACCIONES_PUNTOS');

SELECT 'SECUENCIAS CREADAS: ' || COUNT(*) AS resultado
FROM user_sequences
WHERE sequence_name LIKE 'SEQ_%';

-- =====================================================
-- FIN DEL SCRIPT CORREGIDO
-- =====================================================

-- =====================================================
-- POBLAR DATOS DE EJEMPLO
-- =====================================================

-- Insertar usuarios de ejemplo
INSERT INTO usuarios (nombre, apellido, email, password, fecha_nacimiento, telefono, descuento_duoc, puntos_levelup) VALUES 
('Juan', 'Pérez', 'juan.perez@duoc.cl', 'password123', DATE '1995-06-15', '+56912345678', 1, 500);

INSERT INTO usuarios (nombre, apellido, email, password, fecha_nacimiento, telefono, descuento_duoc, puntos_levelup) VALUES 
('María', 'González', 'maria.gonzalez@gmail.com', 'password456', DATE '1992-03-22', '+56987654321', 0, 1200);

INSERT INTO usuarios (nombre, apellido, email, password, fecha_nacimiento, telefono, descuento_duoc, puntos_levelup) VALUES 
('Carlos', 'Rodríguez', 'carlos.rodriguez@duoc.cl', 'password789', DATE '1988-11-10', '+56911111111', 1, 800);

INSERT INTO usuarios (nombre, apellido, email, password, fecha_nacimiento, telefono, descuento_duoc, puntos_levelup) VALUES 
('Ana', 'Silva', 'ana.silva@outlook.com', 'password012', DATE '1996-08-05', '+56922222222', 0, 300);

INSERT INTO usuarios (nombre, apellido, email, password, fecha_nacimiento, telefono, descuento_duoc, puntos_levelup) VALUES 
('Pedro', 'Morales', 'pedro.morales@duoc.cl', 'password345', DATE '1993-12-18', '+56933333333', 1, 1500);

-- Insertar direcciones
INSERT INTO direcciones (id_usuario, tipo_direccion, calle, numero, comuna, ciudad, region, codigo_postal, es_principal) VALUES 
(1, 'ENVIO', 'Av. Libertador Bernardo O''Higgins', '1234', 'Santiago Centro', 'Santiago', 'Metropolitana', '8320000', 1);

INSERT INTO direcciones (id_usuario, tipo_direccion, calle, numero, comuna, ciudad, region, codigo_postal, es_principal) VALUES 
(2, 'ENVIO', 'Av. Providencia', '5678', 'Providencia', 'Santiago', 'Metropolitana', '7500000', 1);

INSERT INTO direcciones (id_usuario, tipo_direccion, calle, numero, comuna, ciudad, region, codigo_postal, es_principal) VALUES 
(3, 'ENVIO', 'Av. Las Condes', '9012', 'Las Condes', 'Santiago', 'Metropolitana', '7550000', 1);

-- Insertar productos
INSERT INTO productos (id_categoria, codigo_producto, nombre_producto, precio, descripcion, stock) VALUES 
(1, 'JM001', 'Catan - Juego de Mesa', 35990, 'Juego de estrategia para 3-4 jugadores', 25);

INSERT INTO productos (id_categoria, codigo_producto, nombre_producto, precio, descripcion, stock) VALUES 
(2, 'AC001', 'Teclado Mecánico RGB', 89990, 'Teclado gaming con switches mecánicos', 15);

INSERT INTO productos (id_categoria, codigo_producto, nombre_producto, precio, descripcion, stock) VALUES 
(3, 'CON001', 'PlayStation 5', 599990, 'Consola de última generación', 5);

INSERT INTO productos (id_categoria, codigo_producto, nombre_producto, precio, descripcion, stock) VALUES 
(6, 'MOU001', 'Mouse Gaming Pro', 45990, 'Mouse con sensor óptico de alta precisión', 30);

INSERT INTO productos (id_categoria, codigo_producto, nombre_producto, precio, descripcion, stock) VALUES 
(5, 'SIL001', 'Silla Gamer Elite', 199990, 'Silla ergonómica con soporte lumbar', 10);

-- Insertar algunos pedidos
INSERT INTO pedidos (id_usuario, id_direccion_envio, total_bruto, descuento_aplicado, total_neto, estado_pedido, metodo_pago) VALUES 
(1, 1, 35990, 3599, 32391, 'ENTREGADO', 'TARJETA_CREDITO');

INSERT INTO pedidos (id_usuario, id_direccion_envio, total_bruto, descuento_aplicado, total_neto, estado_pedido, metodo_pago) VALUES 
(2, 2, 135980, 0, 135980, 'ENVIADO', 'TRANSFERENCIA');

COMMIT;

-- =====================================================
-- TIPOS DE DATOS COMPUESTOS (RECORD Y VARRAY)
-- =====================================================

-- Definir un RECORD para manejar información de usuario completa
CREATE OR REPLACE TYPE t_usuario_completo AS OBJECT (
    id_usuario NUMBER,
    nombre_completo VARCHAR2(200),
    email VARCHAR2(255),
    puntos_levelup NUMBER(10),
    descuento_duoc NUMBER(1),
    total_compras NUMBER(12,2),
    direccion_principal VARCHAR2(500)
);
/

-- Definir un VARRAY para manejar múltiples productos
CREATE OR REPLACE TYPE t_producto_info AS OBJECT (
    id_producto NUMBER,
    nombre_producto VARCHAR2(200),
    precio NUMBER(10,2),
    stock NUMBER(10),
    categoria VARCHAR2(100)
);
/

CREATE OR REPLACE TYPE t_productos_array AS VARRAY(100) OF t_producto_info;
/

-- Definir RECORD para reporte de ventas
CREATE OR REPLACE TYPE t_reporte_ventas AS OBJECT (
    periodo VARCHAR2(20),
    total_ventas NUMBER(12,2),
    cantidad_pedidos NUMBER(10),
    producto_mas_vendido VARCHAR2(200),
    categoria_top VARCHAR2(100)
);
/

-- =====================================================
-- PAQUETE PRINCIPAL DEL SISTEMA
-- =====================================================

CREATE OR REPLACE PACKAGE pkg_levelup_gamer AS
    -- Excepciones personalizadas
    ex_usuario_no_encontrado EXCEPTION;
    ex_stock_insuficiente EXCEPTION;
    ex_producto_inactivo EXCEPTION;
    ex_puntos_insuficientes EXCEPTION;
    
    -- Cursores públicos
    CURSOR cur_usuarios_activos IS
        SELECT u.id_usuario, u.nombre, u.apellido, u.email, u.puntos_levelup
        FROM usuarios u
        WHERE u.estado_usuario = 'ACTIVO';
    
    -- Procedimientos
    PROCEDURE proc_procesar_pedido(p_id_usuario IN NUMBER, p_productos IN t_productos_array);
    PROCEDURE proc_actualizar_puntos(p_id_usuario IN NUMBER, p_puntos IN NUMBER, p_tipo IN VARCHAR2);
    PROCEDURE proc_generar_reporte_mensual(p_anio IN NUMBER, p_mes IN NUMBER);
    PROCEDURE proc_recalcular_puntos_todos;   -- publica
    
    -- Funciones
    FUNCTION func_calcular_descuento(p_id_usuario IN NUMBER, p_total IN NUMBER) RETURN NUMBER;
    FUNCTION func_obtener_usuario_completo(p_id_usuario IN NUMBER) RETURN t_usuario_completo;
    FUNCTION func_productos_categoria(p_id_categoria IN NUMBER) RETURN t_productos_array;
    FUNCTION func_total_ventas RETURN NUMBER; -- pública

END pkg_levelup_gamer;
/

CREATE OR REPLACE PACKAGE BODY pkg_levelup_gamer AS
    -- Variable privada solo para uso interno
    v_total_ventas NUMBER(12,2); -- privada, no expuesta en la spec

    -- Procedimiento privado (ejemplo)
    PROCEDURE proc_actualizar_estado_pedidos_privado IS
    BEGIN
        UPDATE pedidos
        SET estado_pedido = 'REVISAR'
        WHERE estado_pedido = 'PENDIENTE';
    END proc_actualizar_estado_pedidos_privado;

    -- =====================================================
    -- FUNCIÓN: Calcular descuento basado en puntos y tipo de usuario
    -- =====================================================
    FUNCTION func_calcular_descuento(p_id_usuario IN NUMBER, p_total IN NUMBER) RETURN NUMBER IS
        v_descuento NUMBER(12,2) := 0;
        v_puntos NUMBER(10);
        v_descuento_duoc NUMBER(1);
        v_usuario_existe NUMBER;
    BEGIN
        -- Verificar si el usuario existe
        SELECT COUNT(*)
        INTO v_usuario_existe
        FROM usuarios
        WHERE id_usuario = p_id_usuario;
        
        IF v_usuario_existe = 0 THEN
            RAISE ex_usuario_no_encontrado;
        END IF;
        
        -- Obtener información del usuario
        SELECT puntos_levelup, descuento_duoc
        INTO v_puntos, v_descuento_duoc
        FROM usuarios
        WHERE id_usuario = p_id_usuario;
        
        -- Calcular descuento por puntos (1 punto = $1 de descuento)
        IF v_puntos >= 100 THEN
            v_descuento := LEAST(v_puntos, p_total * 0.5); -- Máximo 50% del total
        END IF;
        
        -- Descuento adicional para estudiantes DUOC (10%)
        IF v_descuento_duoc = 1 THEN
            v_descuento := v_descuento + (p_total * 0.1);
        END IF;
        
        RETURN LEAST(v_descuento, p_total); -- No puede ser mayor al total
        
    EXCEPTION
        WHEN ex_usuario_no_encontrado THEN
            RAISE_APPLICATION_ERROR(-20001, 'Usuario no encontrado para calcular descuento');
        WHEN OTHERS THEN
            RAISE_APPLICATION_ERROR(-20002, 'Error al calcular descuento: ' || SQLERRM);
    END func_calcular_descuento;

    -- =====================================================
    -- FUNCIÓN: Obtener información completa del usuario
    -- =====================================================
    FUNCTION func_obtener_usuario_completo(p_id_usuario IN NUMBER) RETURN t_usuario_completo IS
        v_usuario t_usuario_completo;
        v_total_compras NUMBER(12,2) := 0;
        v_direccion VARCHAR2(500);
    BEGIN
        -- Cursor con parámetros para obtener información del usuario
        FOR rec_usuario IN (
            SELECT u.id_usuario, u.nombre || ' ' || u.apellido AS nombre_completo,
                   u.email, u.puntos_levelup, u.descuento_duoc
            FROM usuarios u
            WHERE u.id_usuario = p_id_usuario
        ) LOOP
            -- Calcular total de compras
            SELECT NVL(SUM(total_neto), 0)
            INTO v_total_compras
            FROM pedidos
            WHERE id_usuario = p_id_usuario
            AND estado_pedido = 'ENTREGADO';
            
            -- Obtener dirección principal
            SELECT d.calle || ' ' || d.numero || ', ' || d.comuna
            INTO v_direccion
            FROM direcciones d
            WHERE d.id_usuario = p_id_usuario
            AND d.es_principal = 1
            AND ROWNUM = 1;
            
            v_usuario := t_usuario_completo(
                rec_usuario.id_usuario,
                rec_usuario.nombre_completo,
                rec_usuario.email,
                rec_usuario.puntos_levelup,
                rec_usuario.descuento_duoc,
                v_total_compras,
                v_direccion
            );
        END LOOP;
        
        RETURN v_usuario;
        
    EXCEPTION
        WHEN NO_DATA_FOUND THEN
            RAISE ex_usuario_no_encontrado;
        WHEN OTHERS THEN
            RAISE_APPLICATION_ERROR(-20003, 'Error al obtener usuario completo: ' || SQLERRM);
    END func_obtener_usuario_completo;

    -- =====================================================
    -- FUNCIÓN: Obtener productos por categoría usando VARRAY
    -- =====================================================
    FUNCTION func_productos_categoria(p_id_categoria IN NUMBER) RETURN t_productos_array IS
        v_productos t_productos_array := t_productos_array();
        v_contador NUMBER := 0;
    BEGIN
        -- Cursor explícito con parámetros
        FOR rec_producto IN (
            SELECT p.id_producto, p.nombre_producto, p.precio, p.stock, c.nombre_categoria
            FROM productos p
            JOIN categorias c ON p.id_categoria = c.id_categoria
            WHERE p.id_categoria = p_id_categoria
            AND p.estado_producto = 'ACTIVO'
            ORDER BY p.nombre_producto
        ) LOOP
            v_contador := v_contador + 1;
            v_productos.EXTEND;
            v_productos(v_contador) := t_producto_info(
                rec_producto.id_producto,
                rec_producto.nombre_producto,
                rec_producto.precio,
                rec_producto.stock,
                rec_producto.nombre_categoria
            );
        END LOOP;
        
        RETURN v_productos;
        
    EXCEPTION
        WHEN OTHERS THEN
            RAISE_APPLICATION_ERROR(-20004, 'Error al obtener productos: ' || SQLERRM);
    END func_productos_categoria;

    -- =====================================================
    -- FUNCION: Total neto de ventas
    -- =====================================================
    FUNCTION func_total_ventas RETURN NUMBER IS
        v_total NUMBER(12,2);
    BEGIN
        SELECT NVL(SUM(total_neto),0) INTO v_total
        FROM pedidos
        WHERE estado_pedido = 'ENTREGADO';
        
        RETURN v_total;
    EXCEPTION
        WHEN OTHERS THEN
            RAISE_APPLICATION_ERROR(-20014, 'Error al obtener total de ventas: ' || SQLERRM);
    END func_total_ventas;

    -- =====================================================
    -- PROCEDIMIENTO: Procesar pedido con validaciones
    -- =====================================================
    PROCEDURE proc_procesar_pedido(p_id_usuario IN NUMBER, p_productos IN t_productos_array) IS
        v_id_pedido NUMBER;
        v_total_bruto NUMBER(12,2) := 0;
        v_descuento NUMBER(12,2) := 0;
        v_total_neto NUMBER(12,2) := 0;
        v_stock_actual NUMBER;
        v_estado_producto VARCHAR2(20);
        v_id_direccion NUMBER;
        v_puntos_ganados NUMBER(10);
    BEGIN
        -- Validar que existan productos
        IF p_productos IS NULL OR p_productos.COUNT = 0 THEN
            RAISE_APPLICATION_ERROR(-20005, 'No hay productos en el pedido');
        END IF;
        
        -- Obtener dirección principal del usuario
        SELECT id_direccion
        INTO v_id_direccion
        FROM direcciones
        WHERE id_usuario = p_id_usuario
        AND es_principal = 1
        AND ROWNUM = 1;
        
        -- Validar stock y estado de productos usando loops anidados
        FOR i IN 1..p_productos.COUNT LOOP
            -- Cursor anidado para validar cada producto
            FOR rec_validacion IN (
                SELECT stock, estado_producto, precio
                FROM productos
                WHERE id_producto = p_productos(i).id_producto
            ) LOOP
                IF rec_validacion.estado_producto != 'ACTIVO' THEN
                    RAISE ex_producto_inactivo;
                END IF;
                
                IF rec_validacion.stock < 1 THEN
                    RAISE ex_stock_insuficiente;
                END IF;
                
                v_total_bruto := v_total_bruto + rec_validacion.precio;
            END LOOP;
        END LOOP;
        
        -- Calcular descuento
        v_descuento := func_calcular_descuento(p_id_usuario, v_total_bruto);
        v_total_neto := v_total_bruto - v_descuento;
        
        -- Crear pedido
        INSERT INTO pedidos (id_usuario, id_direccion_envio, total_bruto, descuento_aplicado, total_neto, estado_pedido, metodo_pago)
        VALUES (p_id_usuario, v_id_direccion, v_total_bruto, v_descuento, v_total_neto, 'PENDIENTE', 'PENDIENTE')
        RETURNING id_pedido INTO v_id_pedido;
        
        -- Insertar detalles del pedido y actualizar stock
        FOR i IN 1..p_productos.COUNT LOOP
            INSERT INTO detalle_pedido (id_pedido, id_producto, cantidad, precio_unitario)
            VALUES (v_id_pedido, p_productos(i).id_producto, 1, p_productos(i).precio);
            
            -- Actualizar stock
            UPDATE productos
            SET stock = stock - 1
            WHERE id_producto = p_productos(i).id_producto;
        END LOOP;
        
        -- Calcular y otorgar puntos (1% del total neto)
        v_puntos_ganados := FLOOR(v_total_neto * 0.01);
        proc_actualizar_puntos(p_id_usuario, v_puntos_ganados, 'GANANCIA_COMPRA');
        
        COMMIT;
        
        DBMS_OUTPUT.PUT_LINE('Pedido procesado exitosamente. ID: ' || v_id_pedido);
        
    EXCEPTION
        WHEN ex_stock_insuficiente THEN
            ROLLBACK;
            RAISE_APPLICATION_ERROR(-20006, 'Stock insuficiente para uno o más productos');
        WHEN ex_producto_inactivo THEN
            ROLLBACK;
            RAISE_APPLICATION_ERROR(-20007, 'Uno o más productos están inactivos');
        WHEN NO_DATA_FOUND THEN
            ROLLBACK;
            RAISE_APPLICATION_ERROR(-20008, 'Usuario no tiene dirección registrada');
        WHEN OTHERS THEN
            ROLLBACK;
            RAISE_APPLICATION_ERROR(-20009, 'Error al procesar pedido: ' || SQLERRM);
    END proc_procesar_pedido;

    -- =====================================================
    -- PROCEDIMIENTO: Actualizar puntos del usuario
    -- =====================================================
    PROCEDURE proc_actualizar_puntos(p_id_usuario IN NUMBER, p_puntos IN NUMBER, p_tipo IN VARCHAR2) IS
        v_usuario_existe NUMBER;
    BEGIN
        -- Validar que el usuario existe
        SELECT COUNT(*)
        INTO v_usuario_existe
        FROM usuarios
        WHERE id_usuario = p_id_usuario;
        
        IF v_usuario_existe = 0 THEN
            RAISE ex_usuario_no_encontrado;
        END IF;
        
        -- Actualizar puntos
        UPDATE usuarios
        SET puntos_levelup = puntos_levelup + p_puntos
        WHERE id_usuario = p_id_usuario;
        
        -- Registrar transacción
        INSERT INTO transacciones_puntos (id_usuario, tipo_transaccion, puntos, descripcion)
        VALUES (p_id_usuario, p_tipo, p_puntos, 'Actualización automática de puntos');
        
        COMMIT;
        
    EXCEPTION
        WHEN ex_usuario_no_encontrado THEN
            RAISE_APPLICATION_ERROR(-20010, 'Usuario no encontrado para actualizar puntos');
        WHEN OTHERS THEN
            RAISE_APPLICATION_ERROR(-20011, 'Error al actualizar puntos: ' || SQLERRM);
    END proc_actualizar_puntos;

    -- =====================================================
    -- PROCEDIMIENTO: Recalcular puntos para todos los usuarios (sin parámetros)
    -- =====================================================
    PROCEDURE proc_recalcular_puntos_todos IS
        CURSOR cur_usuarios IS
            SELECT u.id_usuario, NVL(SUM(p.total_neto),0) AS total_compras
            FROM usuarios u
            LEFT JOIN pedidos p ON u.id_usuario = p.id_usuario
            GROUP BY u.id_usuario;

        v_puntos_ganados NUMBER(10);
    BEGIN
        FOR rec_usuario IN cur_usuarios LOOP
            -- Calcular 1% del total de compras como puntos
            v_puntos_ganados := FLOOR(rec_usuario.total_compras * 0.01);
            proc_actualizar_puntos(rec_usuario.id_usuario, v_puntos_ganados, 'RECALCULO_MASIVO');
        END LOOP;
        COMMIT;
        DBMS_OUTPUT.PUT_LINE('Puntos recalculados para todos los usuarios.');
    EXCEPTION
        WHEN OTHERS THEN
            ROLLBACK;
            RAISE_APPLICATION_ERROR(-20013, 'Error al recalcular puntos masivamente: ' || SQLERRM);
    END proc_recalcular_puntos_todos;


    -- =====================================================
    -- PROCEDIMIENTO: Generar reporte mensual con cursores complejos
    -- =====================================================
    PROCEDURE proc_generar_reporte_mensual(p_anio IN NUMBER, p_mes IN NUMBER) IS
        -- Cursor parametrizado para ventas del mes
        CURSOR cur_ventas_mes(p_anio NUMBER, p_mes NUMBER) IS
            SELECT p.fecha_pedido, p.total_neto, p.estado_pedido,
                   u.nombre || ' ' || u.apellido AS cliente
            FROM pedidos p
            JOIN usuarios u ON p.id_usuario = u.id_usuario
            WHERE EXTRACT(YEAR FROM p.fecha_pedido) = p_anio
            AND EXTRACT(MONTH FROM p.fecha_pedido) = p_mes
            ORDER BY p.fecha_pedido;
        
        -- Cursor para productos más vendidos
        CURSOR cur_productos_vendidos(p_anio NUMBER, p_mes NUMBER) IS
            SELECT pr.nombre_producto, SUM(dp.cantidad) as total_vendido,
                   SUM(dp.subtotal) as ingresos_producto
            FROM detalle_pedido dp
            JOIN productos pr ON dp.id_producto = pr.id_producto
            JOIN pedidos p ON dp.id_pedido = p.id_pedido
            WHERE EXTRACT(YEAR FROM p.fecha_pedido) = p_anio
            AND EXTRACT(MONTH FROM p.fecha_pedido) = p_mes
            AND p.estado_pedido = 'ENTREGADO'
            GROUP BY pr.nombre_producto
            ORDER BY total_vendido DESC;
        
        v_total_ventas NUMBER(12,2) := 0;
        v_cantidad_pedidos NUMBER := 0;
        v_contador NUMBER := 0;
        
    BEGIN
        DBMS_OUTPUT.PUT_LINE('=== REPORTE MENSUAL - ' || p_mes || '/' || p_anio || ' ===');
        DBMS_OUTPUT.PUT_LINE('');
        
        -- Procesar ventas del mes usando cursor con parámetros
        FOR rec_venta IN cur_ventas_mes(p_anio, p_mes) LOOP
            v_contador := v_contador + 1;
            
            IF rec_venta.estado_pedido = 'ENTREGADO' THEN
                v_total_ventas := v_total_ventas + rec_venta.total_neto;
                v_cantidad_pedidos := v_cantidad_pedidos + 1;
            END IF;
            
            -- Mostrar primeros 10 pedidos como ejemplo
            IF v_contador <= 10 THEN
                DBMS_OUTPUT.PUT_LINE('Pedido: ' || rec_venta.fecha_pedido || 
                                   ' - Cliente: ' || rec_venta.cliente || 
                                   ' - Total: $' || rec_venta.total_neto ||
                                   ' - Estado: ' || rec_venta.estado_pedido);
            END IF;
        END LOOP;
        
        DBMS_OUTPUT.PUT_LINE('');
        DBMS_OUTPUT.PUT_LINE('RESUMEN:');
        DBMS_OUTPUT.PUT_LINE('Total de ventas: $' || v_total_ventas);
        DBMS_OUTPUT.PUT_LINE('Cantidad de pedidos entregados: ' || v_cantidad_pedidos);
        DBMS_OUTPUT.PUT_LINE('');
        
        -- Mostrar productos más vendidos usando loops anidados
        DBMS_OUTPUT.PUT_LINE('PRODUCTOS MÁS VENDIDOS:');
        v_contador := 0;
        FOR rec_producto IN cur_productos_vendidos(p_anio, p_mes) LOOP
            v_contador := v_contador + 1;
            EXIT WHEN v_contador > 5; -- Top 5 productos
            
            DBMS_OUTPUT.PUT_LINE(v_contador || '. ' || rec_producto.nombre_producto || 
                               ' - Vendidos: ' || rec_producto.total_vendido ||
                               ' - Ingresos: $' || rec_producto.ingresos_producto);
        END LOOP;
        
    EXCEPTION
        WHEN OTHERS THEN
            RAISE_APPLICATION_ERROR(-20012, 'Error al generar reporte: ' || SQLERRM);
    END proc_generar_reporte_mensual;

END pkg_levelup_gamer;
/

-- =====================================================
-- EJEMPLOS DE USO Y PRUEBAS
-- =====================================================

-- Ejemplo 1: Obtener información completa de un usuario
DECLARE
    v_usuario t_usuario_completo;
BEGIN
    v_usuario := pkg_levelup_gamer.func_obtener_usuario_completo(1);
    DBMS_OUTPUT.PUT_LINE('Usuario: ' || v_usuario.nombre_completo);
    DBMS_OUTPUT.PUT_LINE('Email: ' || v_usuario.email);
    DBMS_OUTPUT.PUT_LINE('Puntos: ' || v_usuario.puntos_levelup);
    DBMS_OUTPUT.PUT_LINE('Total compras: $' || v_usuario.total_compras);
EXCEPTION
    WHEN OTHERS THEN
        DBMS_OUTPUT.PUT_LINE('Error: ' || SQLERRM);
END;
/

-- Ejemplo 2: Obtener productos de una categoría
DECLARE
    v_productos t_productos_array;
BEGIN
    v_productos := pkg_levelup_gamer.func_productos_categoria(1);
    DBMS_OUTPUT.PUT_LINE('Productos encontrados: ' || v_productos.COUNT);
    
    FOR i IN 1..v_productos.COUNT LOOP
        DBMS_OUTPUT.PUT_LINE(i || '. ' || v_productos(i).nombre_producto || 
                           ' - $' || v_productos(i).precio ||
                           ' (Stock: ' || v_productos(i).stock || ')');
    END LOOP;
EXCEPTION
    WHEN OTHERS THEN
        DBMS_OUTPUT.PUT_LINE('Error: ' || SQLERRM);
END;
/

-- Ejemplo 3: Generar reporte mensual
BEGIN
    pkg_levelup_gamer.proc_generar_reporte_mensual(2024, 12);
EXCEPTION
    WHEN OTHERS THEN
        DBMS_OUTPUT.PUT_LINE('Error: ' || SQLERRM);
END;
/

-- Ejemplo 4: Procesar un pedido
DECLARE
    v_productos t_productos_array;
BEGIN
    v_productos := t_productos_array();
    v_productos.EXTEND;
    v_productos(1) := t_producto_info(1, 'Catan - Juego de Mesa', 35990, 25, 'Juegos de Mesa');
    
    pkg_levelup_gamer.proc_procesar_pedido(1, v_productos);
EXCEPTION
    WHEN OTHERS THEN
        DBMS_OUTPUT.PUT_LINE('Error: ' || SQLERRM);
END;
/

COMMIT;

-- =====================================================
-- VERIFICACIÓN FINAL
-- =====================================================
SELECT 'SCRIPT COMPLETADO EXITOSAMENTE' AS resultado FROM DUAL;