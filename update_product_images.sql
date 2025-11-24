-- =====================================================
-- SCRIPT: Actualizar imágenes de productos existentes
-- =====================================================

-- Actualizar productos existentes con rutas de imágenes
UPDATE productos SET imagen = '/assets/img/jm001.jpg' WHERE codigo_producto = 'JM001';
UPDATE productos SET imagen = '/assets/img/ac001.jpg' WHERE codigo_producto = 'AC001';
UPDATE productos SET imagen = '/assets/img/con001.jpeg' WHERE codigo_producto = 'CON001';
UPDATE productos SET imagen = '/assets/img/mou001.jpg' WHERE codigo_producto = 'MOU001';
UPDATE productos SET imagen = '/assets/img/sil001.jpg' WHERE codigo_producto = 'SIL001';

-- Confirmar cambios
COMMIT;

-- Verificar que las imágenes se actualizaron correctamente
SELECT codigo_producto, nombre_producto, imagen 
FROM productos 
WHERE imagen IS NOT NULL;

-- Para productos sin imagen, establecer imagen por defecto
UPDATE productos 
SET imagen = '/assets/img/default.jpg' 
WHERE imagen IS NULL;

COMMIT;

-- =====================================================
-- Verificación final
-- =====================================================
SELECT 
    COUNT(*) as total_productos,
    COUNT(imagen) as productos_con_imagen,
    COUNT(*) - COUNT(imagen) as productos_sin_imagen
FROM productos;
