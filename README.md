# Level-UP Gamer Store

## Descripción del Proyecto

Level-UP Gamer Store es una tienda de comercio electrónico especializada en productos gaming desarrollada como proyecto académico. La aplicación web ofrece una experiencia completa de compra online con funcionalidades avanzadas de carrito, gestión de productos, sistema de reseñas y comunidad gamer.

## Características Principales

### Funcionalidades Core
- **Catálogo de Productos**: Navegación y búsqueda de productos gaming
- **Carrito de Compras**: Sistema completo con gestión de cantidades y totales
- **Sistema de Reseñas**: Los usuarios pueden calificar y comentar productos
- **Gestión de Perfil**: Información personal y sistema de puntos LevelUp
- **Comunidad Gamer**: Eventos, torneos y blog gaming

### Características Técnicas
- **Diseño Responsivo**: Compatible con dispositivos móviles y desktop
- **Notificaciones Elegantes**: Sistema de toast notifications sin popups
- **Contador Dinámico**: Badge del carrito que se actualiza en tiempo real
- **Persistencia Local**: Datos guardados en localStorage del navegador
- **Validaciones**: Formularios con validación client-side

### Experiencia de Usuario
- **Tema Gaming**: Colores azul neón (#1E90FF) y verde neón (#39FF14)
- **Tipografías**: Orbitron para títulos, Roboto para texto
- **Animaciones**: Transiciones suaves y efectos hover
- **Feedback Visual**: Confirmaciones y notificaciones informativas

## Estructura del Proyecto

```
Level-UP/
├── index.html                 # Página principal
├── productos.html            # Catálogo de productos
├── producto-detalle.html     # Detalle individual de producto
├── carrito.html              # Carrito de compras
├── registro.html             # Formulario de registro
├── perfil.html               # Gestión de perfil de usuario
├── resenas.html              # Sistema de reseñas
├── comunidad.html            # Comunidad y eventos
├── README.md                 # Documentación del proyecto
├── assets/
│   ├── css/
│   │   └── style.css         # Estilos personalizados
│   ├── js/
│   │   ├── main.js           # Carga de partials y configuración global
│   │   ├── utils.js          # Sistema de notificaciones y utilidades
│   │   ├── index.js          # Lógica de la página principal
│   │   ├── productos.js      # Catálogo y búsqueda de productos
│   │   ├── producto-detalle.js # Detalle de producto y reseñas
│   │   ├── carrito.js        # Funcionalidad del carrito
│   │   ├── registro.js       # Validaciones de registro
│   │   ├── perfil.js         # Gestión de perfil
│   │   ├── resenas.js        # Sistema de reseñas
│   │   └── comunidad.js      # Eventos y comunidad
│   ├── data/
│   │   └── productos.json    # Base de datos de productos
│   ├── fonts/
│   │   ├── Orbitron-VariableFont_wght.ttf
│   │   ├── Roboto-VariableFont_wdth,wght.ttf
│   │   └── Roboto-Italic-VariableFont_wdth,wght.ttf
│   └── img/                  # Imágenes de productos y recursos
└── partials/
    ├── header.html           # Encabezado común
    ├── navbar.html           # Navegación principal
    └── footer.html           # Pie de página
```

## Tecnologías Utilizadas

### Frontend
- **HTML5**: Estructura semántica y accesible
- **CSS3**: Estilos personalizados con variables CSS y flexbox/grid
- **JavaScript ES6+**: Funcionalidades interactivas y manipulación del DOM
- **Bootstrap 5.3.8**: Framework CSS para componentes y responsividad

### Almacenamiento
- **localStorage**: Persistencia de carrito, perfil y reseñas
- **JSON**: Estructura de datos para productos

### Herramientas de Desarrollo
- **Git**: Control de versiones
- **GitHub**: Repositorio remoto
- **VS Code**: Editor de código recomendado

## Instalación y Configuración

### Requisitos Previos
- Navegador web moderno (Chrome, Firefox, Safari, Edge)
- Servidor web local (opcional, para desarrollo)

### Instalación

1. **Clonar el repositorio**
```bash
git clone https://github.com/tu-usuario/level-up-gamer.git
cd level-up-gamer
```

2. **Abrir en navegador**
```bash
# Opción 1: Abrir directamente
open index.html

# Opción 2: Servidor local simple
python -m http.server 8000
# Luego abrir http://localhost:8000

# Opción 3: Live Server (VS Code)
# Instalar extensión Live Server y hacer clic derecho > "Open with Live Server"
```

## Uso de la Aplicación

### Para Usuarios

1. **Navegación**: Usar el menú principal para acceder a diferentes secciones
2. **Productos**: Buscar por categoría o nombre, ver detalles y agregar al carrito
3. **Carrito**: Gestionar cantidades, aplicar descuentos y finalizar compras
4. **Registro**: Crear cuenta con validaciones automáticas
5. **Perfil**: Completar información personal y ver estadísticas
6. **Reseñas**: Calificar productos y leer opiniones de otros usuarios

### Funcionalidades Especiales

#### Descuentos
- **DuocUC**: 20% de descuento permanente para emails @duoc.cl y @duocuc.cl
- **Envío Gratis**: En compras sobre $50.000
- **Código**: DUOC20 para aplicar descuento del 20%

#### Sistema de Puntos
- **Registro**: 100 puntos iniciales
- **Compras**: Puntos por cada transacción
- **Niveles**: Desbloqueables cada 100 puntos
- **Referidos**: 50 puntos por invitación exitosa

## Estructura de Datos

### Producto (productos.json)
```json
{
  "codigo": "JM001",
  "categoria": "Juegos de Mesa",
  "nombre": "Catan",
  "precio": 29990,
  "descripcion": "Un clásico juego de estrategia...",
  "imagen": "assets/img/catan.jpg"
}
```

### Carrito (localStorage)
```json
[
  {
    "codigo": "JM001",
    "cantidad": 2
  }
]
```

### Reseña (localStorage)
```json
{
  "id": 1704067200000,
  "codigoProducto": "JM001",
  "nombreProducto": "Catan",
  "imagenProducto": "assets/img/catan.jpg",
  "calificacion": 5,
  "nombreUsuario": "GamerPro",
  "comentario": "Excelente juego para la familia",
  "fecha": "01/01/2025"
}
```

## Desarrollo

### Arquitectura
- **Modular**: Cada página tiene su propio archivo JavaScript
- **Reutilizable**: Componentes comunes en partials
- **Escalable**: Fácil agregar nuevas funcionalidades
- **Mantenible**: Código documentado y estructurado

### Patrones Implementados
- **Separación de Responsabilidades**: HTML/CSS/JS separados
- **Programación Funcional**: Funciones puras para cálculos
- **Event-Driven**: Listeners para interacciones del usuario
- **Local Storage Pattern**: Persistencia de estado

### Mejores Prácticas
- **Validación Client-Side**: Formularios con validación inmediata
- **UX/UI Coherente**: Diseño consistente en todas las páginas
- **Accesibilidad**: Etiquetas semánticas y navegación por teclado
- **Performance**: Carga optimizada de recursos

## Funcionalidades Avanzadas

### Sistema de Notificaciones
```javascript
// Notificaciones elegantes sin popups
NotificacionManager.exito('Producto agregado exitosamente');
NotificacionManager.error('Error en la operación');
NotificacionManager.info('Información importante');
NotificacionManager.advertencia('Atención requerida');
```

### Contador Dinámico del Carrito
```javascript
// Actualización automática en tiempo real
CarritoContador.actualizar();
```

### Confirmaciones Personalizadas
```javascript
// Modales elegantes en lugar de confirm()
ConfirmacionManager.confirmar(mensaje, callback, opciones);
```

## Pruebas y Validación

### Casos de Prueba
- ✅ Agregar productos al carrito
- ✅ Modificar cantidades en el carrito
- ✅ Aplicar códigos de descuento
- ✅ Validar formularios de registro
- ✅ Publicar reseñas de productos
- ✅ Navegación entre páginas
- ✅ Persistencia de datos
- ✅ Responsividad en diferentes dispositivos

### Validaciones
- **Email**: Formato válido y dominio DuocUC para descuentos
- **Edad**: Mayor de 18 años para registro
- **Contraseñas**: Coincidencia en confirmación
- **Formularios**: Campos requeridos y formatos correctos

## Contribución

### Desarrolladores
- **Felipe Duarte**: Desarrollo Frontend y UX/UI
- **Jeremy Parada**: Desarrollo JavaScript y Funcionalidades

### Cómo Contribuir
1. Fork del repositorio
2. Crear rama para nueva feature: `git checkout -b feature/nueva-funcionalidad`
3. Commit de cambios: `git commit -m 'Agregar nueva funcionalidad'`
4. Push a la rama: `git push origin feature/nueva-funcionalidad`
5. Crear Pull Request

## Licencia

Este proyecto es desarrollado con fines académicos para DuocUC. Todos los derechos reservados.

## Contacto y Soporte

- **Proyecto Académico**: DuocUC 2025
- **Repositorio**: [GitHub Repository](https://github.com/tu-usuario/level-up-gamer)
- **Documentación**: Ver archivos en `/docs` para detalles técnicos adicionales

## Changelog

### Versión 1.0.0 (Enero 2025)
- Implementación completa del ecommerce
- Sistema de notificaciones sin popups
- Contador dinámico del carrito
- Todas las funcionalidades core completadas
- Diseño responsivo y tema gaming aplicado