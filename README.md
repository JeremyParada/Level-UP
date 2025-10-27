# Level-UP Gamer Store

## Descripción del Proyecto

Level-UP Gamer Store es una tienda de comercio electrónico especializada en productos gaming desarrollada como proyecto académico. La aplicación web ofrece una experiencia completa de compra online con funcionalidades avanzadas de carrito, gestión de productos, sistema de reseñas y comunidad gamer, integrada con una base de datos Oracle Cloud.

---

## Características Principales

### Funcionalidades Core
- **Catálogo de Productos**: Navegación y búsqueda de productos gaming desde Oracle Cloud.
- **Carrito de Compras**: Sistema completo con gestión de cantidades y totales.
- **Sistema de Reseñas**: Los usuarios pueden calificar y comentar productos.
- **Gestión de Perfil**: Información personal y sistema de puntos LevelUp.
- **Comunidad Gamer**: Eventos, torneos y blog gaming.
- **Pedidos**: Gestión completa de pedidos con historial.

### Características Técnicas
- **Backend Node.js + Express**: API RESTful conectada a Oracle Cloud.
- **Oracle Cloud Database**: Base de datos en la nube con procedimientos PL/SQL.
- **Diseño Responsivo**: Compatible con dispositivos móviles y desktop.
- **Notificaciones Elegantes**: Sistema de toast notifications sin popups.
- **Contador Dinámico**: Badge del carrito que se actualiza en tiempo real.
- **Persistencia Cloud**: Datos almacenados en Oracle Cloud Database.
- **Validaciones**: Formularios con validación client-side y server-side.

### Experiencia de Usuario
- **Tema Gaming**: Colores azul neón (#1E90FF) y verde neón (#39FF14).
- **Tipografías**: Orbitron para títulos, Roboto para texto.
- **Animaciones**: Transiciones suaves y efectos hover.
- **Feedback Visual**: Confirmaciones y notificaciones informativas.

---

## Estructura del Proyecto

```plaintext
Level-UP/
├── [README.md](http://_vscodecontentref_/1)                     # Documentación del proyecto
├── [package.json](http://_vscodecontentref_/2)                  # Dependencias React
├── .gitignore
├── backend/
│   ├── .env                      # Variables de entorno (Oracle Cloud)
│   ├── [package.json](http://_vscodecontentref_/3)              # Dependencias backend
│   ├── server.js                 # Servidor Express principal
│   ├── test-connection.js        # Prueba de conexión Oracle
│   ├── config/
│   │   └── database.js           # Configuración Oracle Cloud
│   ├── controllers/
│   │   ├── productosController.js    # Lógica de productos
│   │   ├── usuariosController.js     # Lógica de usuarios
│   │   ├── pedidosController.js      # Lógica de pedidos
│   │   ├── resenasController.js      # Lógica de reseñas
│   │   └── carritoController.js      # Lógica del carrito
│   └── routes/
│       ├── productos.js          # Rutas de productos
│       ├── usuarios.js           # Rutas de usuarios
│       ├── pedidos.js            # Rutas de pedidos
│       ├── [resenas.js](http://_vscodecontentref_/4)            # Rutas de reseñas
│       └── carrito.js            # Rutas del carrito
├── wallet/                       # Oracle Cloud Wallet
│   ├── cwallet.sso
│   ├── ewallet.p12
│   ├── sqlnet.ora
│   └── tnsnames.ora
├── public/
│   ├── [index.html](http://_vscodecontentref_/5)
│   ├── manifest.json
│   └── assets/
│       ├── css/
│       ├── js/
│       ├── data/
│       └── img/
└── src/
    ├── App.js
    ├── [index.js](http://_vscodecontentref_/6)
    ├── components/
    │   ├── layout/
    │   │   ├── Header.jsx
    │   │   ├── Navbar.jsx
    │   │   └── [Footer.jsx](http://_vscodecontentref_/7)
    │   └── productos/
    │       └── ProductCard.jsx
    ├── context/
    │   ├── CartContext.jsx
    │   └── NotificationContext.jsx
    ├── hooks/
    │   ├── useCart.js
    │   └── useNotification.js
    ├── pages/
    │   ├── [Home.jsx](http://_vscodecontentref_/8)
    │   ├── Products.jsx
    │   ├── [ProductDetailPage.jsx](http://_vscodecontentref_/9)
    │   ├── [Cart.jsx](http://_vscodecontentref_/10)
    │   ├── [Register.jsx](http://_vscodecontentref_/11)
    │   ├── [Profile.jsx](http://_vscodecontentref_/12)
    │   ├── [Reviews.jsx](http://_vscodecontentref_/13)
    │   └── [Community.jsx](http://_vscodecontentref_/14)
    └── utils/
```

## Tecnologías Utilizadas

### Frontend
- **React 19.2.0**: Biblioteca de interfaces de usuario
- **React Router DOM**: Navegación entre páginas
- **Bootstrap 5.3.8**: Framework CSS para componentes
- **Axios**: Cliente HTTP para consumir API
- **JavaScript ES6+**: Funcionalidades modernas

### Backend
- **Node.js**: Entorno de ejecución JavaScript
- **Express 4.x**: Framework web minimalista
- **OracleDB**: Driver oficial de Oracle para Node.js
- **CORS**: Manejo de peticiones cross-origin
- **dotenv**: Gestión de variables de entorno

### Base de Datos
- **Oracle Cloud Database**: Base de datos en la nube
- **PL/SQL**: Procedimientos almacenados y funciones
- **Oracle Wallet**: Autenticación segura

### Herramientas de Desarrollo
- **Git**: Control de versiones
- **GitHub**: Repositorio remoto
- **VS Code**: Editor de código
- **Postman**: Pruebas de API
- **Karma + Jasmine**: Testing framework

## API Backend - Endpoints

### 🔧 Base URL
```
http://localhost:3001/api
```

### 📦 **Productos** (5 endpoints)

#### Listar todos los productos
```http
GET /api/productos
```
**Respuesta:**
```json
[
  {
    "ID_PRODUCTO": 1,
    "CODIGO_PRODUCTO": "JM001",
    "NOMBRE_PRODUCTO": "Catan",
    "PRECIO": 29990,
    "DESCRIPCION": "Un clásico juego de estrategia...",
    "STOCK": 15,
    "ESTADO_PRODUCTO": "ACTIVO",
    "NOMBRE_CATEGORIA": "Juegos de Mesa"
  }
]
```

#### Obtener producto por código
```http
GET /api/productos/:codigo
```
**Ejemplo:** `GET /api/productos/JM001`

#### Listar categorías
```http
GET /api/productos/categorias
```
**Respuesta:**
```json
[
  {
    "ID_CATEGORIA": 1,
    "NOMBRE_CATEGORIA": "Juegos de Mesa",
    "DESCRIPCION": "Juegos de estrategia y diversión",
    "TOTAL_PRODUCTOS": 5
  }
]
```

#### Obtener productos por categoría
```http
GET /api/productos/categoria/:idCategoria
```
**Ejemplo:** `GET /api/productos/categoria/1`

---

### 👤 **Usuarios** (5 endpoints)

#### Registrar usuario
```http
POST /api/usuarios/registro
```
**Body:**
```json
{
  "nombre": "Juan",
  "apellido": "Pérez",
  "email": "juan.perez@duocuc.cl",
  "password": "password123",
  "fechaNacimiento": "2000-01-15",
  "telefono": "+56912345678"
}
```
**Respuesta:**
```json
{
  "message": "Usuario registrado exitosamente",
  "id_usuario": 1
}
```

#### Login
```http
POST /api/usuarios/login
```
**Body:**
```json
{
  "email": "juan.perez@duocuc.cl",
  "password": "password123"
}
```
**Respuesta:**
```json
{
  "message": "Login exitoso",
  "usuario": {
    "ID_USUARIO": 1,
    "NOMBRE": "Juan",
    "APELLIDO": "Pérez",
    "EMAIL": "juan.perez@duocuc.cl",
    "PUNTOS_LEVELUP": 100,
    "DESCUENTO_DUOC": 20
  }
}
```

#### Obtener perfil
```http
GET /api/usuarios/:idUsuario
```
**Ejemplo:** `GET /api/usuarios/1`

#### Actualizar perfil
```http
PUT /api/usuarios/:idUsuario
```
**Body:**
```json
{
  "nombre": "Juan Carlos",
  "apellido": "Pérez",
  "telefono": "+56987654321"
}
```

#### Actualizar puntos
```http
POST /api/usuarios/:idUsuario/puntos
```
**Body:**
```json
{
  "puntos": 50,
  "tipo": "COMPRA"
}
```

---

### 🛒 **Carrito** (5 endpoints)

#### Obtener carrito del usuario
```http
GET /api/carrito/usuario/:idUsuario
```
**Ejemplo:** `GET /api/carrito/usuario/1`
**Respuesta:**
```json
[
  {
    "ID_CARRITO": 1,
    "ID_DETALLE_CARRITO": 1,
    "ID_PRODUCTO": 1,
    "CODIGO_PRODUCTO": "JM001",
    "NOMBRE_PRODUCTO": "Catan",
    "PRECIO": 29990,
    "CANTIDAD": 2,
    "SUBTOTAL": 59980
  }
]
```

#### Agregar producto al carrito
```http
POST /api/carrito
```
**Body:**
```json
{
  "idUsuario": 1,
  "idProducto": 1,
  "cantidad": 2
}
```

#### Actualizar cantidad en carrito
```http
PUT /api/carrito/item/:idDetalleCarrito
```
**Body:**
```json
{
  "cantidad": 3
}
```

#### Eliminar producto del carrito
```http
DELETE /api/carrito/item/:idDetalleCarrito
```

#### Vaciar carrito completo
```http
DELETE /api/carrito/usuario/:idUsuario
```

---

### 📋 **Pedidos** (5 endpoints)

#### Crear pedido
```http
POST /api/pedidos
```
**Body:**
```json
{
  "idUsuario": 1,
  "productos": [
    {
      "id_producto": 1,
      "precio": 29990,
      "cantidad": 2
    }
  ],
  "metodoPago": "WEBPAY",
  "idDireccion": 1
}
```
**Respuesta:**
```json
{
  "message": "Pedido creado exitosamente",
  "id_pedido": 1,
  "total_bruto": 59980,
  "descuento_aplicado": 11996,
  "total_neto": 47984
}
```

#### Obtener historial de pedidos
```http
GET /api/pedidos/usuario/:idUsuario
```
**Ejemplo:** `GET /api/pedidos/usuario/1`

#### Obtener detalle de un pedido
```http
GET /api/pedidos/:idPedido
```
**Respuesta:**
```json
{
  "pedido": {
    "ID_PEDIDO": 1,
    "FECHA_PEDIDO": "2025-01-15",
    "TOTAL_BRUTO": 59980,
    "DESCUENTO_APLICADO": 11996,
    "TOTAL_NETO": 47984,
    "ESTADO_PEDIDO": "PENDIENTE",
    "METODO_PAGO": "WEBPAY",
    "NOMBRE_USUARIO": "Juan Pérez",
    "EMAIL": "juan.perez@duocuc.cl"
  },
  "productos": [
    {
      "CODIGO_PRODUCTO": "JM001",
      "NOMBRE_PRODUCTO": "Catan",
      "CANTIDAD": 2,
      "PRECIO_UNITARIO": 29990,
      "SUBTOTAL": 59980
    }
  ]
}
```

#### Actualizar estado del pedido
```http
PUT /api/pedidos/:idPedido/estado
```
**Body:**
```json
{
  "estado": "ENVIADO"
}
```
**Estados válidos:** `PENDIENTE`, `CONFIRMADO`, `PREPARANDO`, `ENVIADO`, `ENTREGADO`, `CANCELADO`

#### Cancelar pedido
```http
PUT /api/pedidos/:idPedido/cancelar
```

---

### ⭐ **Reseñas** (6 endpoints)

#### Crear reseña
```http
POST /api/resenas
```
**Body:**
```json
{
  "idUsuario": 1,
  "idProducto": 1,
  "calificacion": 5,
  "comentario": "Excelente producto, muy recomendado"
}
```

#### Obtener todas las reseñas
```http
GET /api/resenas
```
**Respuesta:**
```json
{
  "resenas": [
    {
      "ID_RESENA": 1,
      "CALIFICACION": 5,
      "COMENTARIO": "Excelente producto",
      "FECHA_RESENA": "2025-01-15",
      "NOMBRE_USUARIO": "Juan Pérez",
      "NOMBRE_PRODUCTO": "Catan",
      "CODIGO_PRODUCTO": "JM001",
      "NOMBRE_CATEGORIA": "Juegos de Mesa"
    }
  ],
  "estadisticas": {
    "TOTAL_RESENAS": 10,
    "PROMEDIO_GLOBAL": 4.5,
    "MAX_CALIFICACION": 5,
    "MIN_CALIFICACION": 3
  }
}
```

#### Obtener reseñas por producto
```http
GET /api/resenas/producto/:idProducto
```
**Respuesta:**
```json
{
  "resenas": [...],
  "estadisticas": {
    "PROMEDIO_CALIFICACION": 4.8,
    "TOTAL_RESENAS": 5
  }
}
```

#### Obtener reseñas por usuario
```http
GET /api/resenas/usuario/:idUsuario
```

#### Actualizar reseña
```http
PUT /api/resenas/:idResena
```
**Body:**
```json
{
  "calificacion": 4,
  "comentario": "Buen producto, actualizo mi reseña"
}
```

#### Eliminar reseña
```http
DELETE /api/resenas/:idResena
```

---

### 🏥 **Health Check**

#### Verificar estado de la API
```http
GET /api/health
```
**Respuesta:**
```json
{
  "status": "OK",
  "message": "API Level-UP funcionando correctamente"
}
```

---

## 📊 Resumen de Endpoints

| Módulo | Endpoints | Descripción |
|--------|-----------|-------------|
| **Productos** | 4 | Catálogo, búsqueda, categorías |
| **Usuarios** | 5 | Registro, login, perfil, puntos |
| **Carrito** | 5 | Gestión completa del carrito |
| **Pedidos** | 5 | Crear, consultar, actualizar, cancelar |
| **Reseñas** | 6 | CRUD completo de reseñas |
| **Total** | **25** | Endpoints RESTful completos |

---

## Base de Datos Oracle Cloud

### Cambios Recientes
- **Columna `descripcion` en la tabla `productos`:**
  - Tipo de dato cambiado de `CLOB` a `VARCHAR2(500)` para simplificar el manejo de datos en el backend.

### Tablas Principales
1. **USUARIOS**: Información de usuarios y puntos LevelUp.
2. **PRODUCTOS**: Catálogo de productos gaming.
   - `descripcion`: Ahora es `VARCHAR2(500)`.
3. **CATEGORIAS**: Clasificación de productos.
4. **CARRITO**: Carritos de compra activos.
5. **DETALLE_CARRITO**: Productos en cada carrito.
6. **PEDIDOS**: Órdenes de compra.
7. **DETALLE_PEDIDO**: Productos de cada pedido.
8. **RESENAS**: Calificaciones y comentarios.
9. **DIRECCIONES**: Direcciones de envío.
10. **REFERIDOS**: Sistema de referidos.

---

### Endpoints Actualizados

#### **Obtener Todos los Productos**
```http
GET /api/productos
```

---

## Instalación y Configuración

### Requisitos Previos
- **Node.js** v18 o superior
- **npm** v8 o superior
- **Oracle Cloud Account** (para la base de datos)
- **Oracle Wallet** configurado

### Instalación del Proyecto

1. **Clonar el repositorio**
```bash
git clone https://github.com/JeremyParada/Level-UP.git
cd Level-UP
```

2. **Instalar dependencias del frontend**
```bash
npm install
```

3. **Instalar dependencias del backend**
```bash
cd backend
npm install
```

4. **Configurar variables de entorno**

Crear archivo `backend/.env`:
```env
# Oracle Cloud Database
DB_USER=ADMIN
DB_PASSWORD={contraseña}
DB_CONNECT_STRING=tallerbasedatos2_high

# Wallet Path
TNS_ADMIN={DirectorioDondeSeDescargóProyecto}/Level-UP/wallet

# Server
PORT=3001
```

5. **Verificar conexión a Oracle Cloud**
```bash
cd backend
node test-connection.js
```

Deberías ver:
```
✅ Conexión exitosa a Oracle Cloud Database
📊 Fecha del servidor: 2025-01-15
```

6. **Iniciar el backend**
```bash
cd backend
npm run dev
```

Deberías ver:
```
🔧 Configurando Oracle Cloud Database...
✅ Pool de conexiones Oracle Cloud creado exitosamente
🚀 Servidor corriendo en http://localhost:3001
📊 API disponible en http://localhost:3001/api
```

7. **Iniciar el frontend React**
```bash
# En otra terminal, desde la raíz del proyecto
npm start
```

El navegador se abrirá automáticamente en `http://localhost:3000`

---

## Pruebas de la API

### Usando cURL (PowerShell)

```powershell
# Health check
curl http://localhost:3001/api/health

# Obtener productos
curl http://localhost:3001/api/productos

# Obtener categorías
curl http://localhost:3001/api/productos/categorias

# Obtener producto específico
curl http://localhost:3001/api/productos/JM001

# Crear usuario
$body = @{
  nombre = "Juan"
  apellido = "Pérez"
  email = "juan.perez@duocuc.cl"
  password = "password123"
  fechaNacimiento = "2000-01-15"
  telefono = "+56912345678"
} | ConvertTo-Json

Invoke-WebRequest -Uri "http://localhost:3001/api/usuarios/registro" `
  -Method POST `
  -Body $body `
  -ContentType "application/json"

# Login
$body = @{
  email = "juan.perez@duocuc.cl"
  password = "password123"
} | ConvertTo-Json

Invoke-WebRequest -Uri "http://localhost:3001/api/usuarios/login" `
  -Method POST `
  -Body $body `
  -ContentType "application/json"
```

### Usando Postman

1. Importar colección de endpoints
2. Configurar environment variable: `base_url = http://localhost:3001/api`
3. Ejecutar requests en el orden: Productos → Usuarios → Carrito → Pedidos

---

## Deployment

### Preparación para Producción

#### Backend (Node.js + Express)
- **Opción 1**: AWS EC2
- **Opción 2**: AWS Elastic Beanstalk
- **Opción 3**: Heroku
- **Opción 4**: DigitalOcean

#### Frontend (React)
- **Opción 1**: AWS S3 + CloudFront
- **Opción 2**: Vercel
- **Opción 3**: Netlify
- **Opción 4**: GitHub Pages

#### Base de Datos
- **Oracle Cloud Database** (ya implementado)
- Conexión segura mediante Oracle Wallet

### Variables de Entorno en Producción

```env
# Frontend (.env)
REACT_APP_API_URL=http://localhost:3001/api

# Backend (.env)
NODE_ENV=production
DB_USER=ADMIN
DB_PASSWORD={contraseña}
DB_CONNECT_STRING=tallerbasedatos2_high
TNS_ADMIN={DirectorioDondeSeDescargóProyecto}/Level-UP/wallet
PORT=3001
```

---

## Testing

### Frontend (Karma + Jasmine)

```bash
# Ejecutar todos los tests
npm test

# Ejecutar tests una vez
npm run test:once

# Ejecutar tests en modo watch
npm run test:watch
```

### Backend

```bash
cd backend

# Test de conexión
node test-connection.js

# Test de diagnóstico
node diagnose-wallet.js
```

### Casos de Prueba Implementados

- ✅ Agregar productos al carrito
- ✅ Modificar cantidades en el carrito
- ✅ Aplicar códigos de descuento
- ✅ Validar formularios de registro
- ✅ Publicar reseñas de productos
- ✅ Navegación entre páginas
- ✅ Conexión a Oracle Cloud
- ✅ CRUD de productos
- ✅ Sistema de puntos
- ✅ Procesamiento de pedidos

---

## Funcionalidades Avanzadas

### Sistema de Puntos LevelUp
- **100 puntos iniciales** al registrarse
- **10 puntos por cada $1.000** en compras
- **100 puntos** por referir un amigo
- **25 puntos** por publicar reseña
- **Niveles desbloqueables** cada 200 puntos

### Descuentos Automáticos
- **20% DuocUC**: Para emails @duoc.cl y @duocuc.cl (permanente)
- **15% Gamer Veterano**: Nivel 5 o superior
- **25% Pro Gamer**: Nivel 10 o superior
- **Envío gratis**: Compras sobre $50.000

### Paquete PL/SQL
```sql
-- Calcular descuento automático
SELECT pkg_levelup_gamer.func_calcular_descuento(1, 50000) FROM DUAL;

-- Calcular puntos por compra
SELECT pkg_levelup_gamer.func_calcular_puntos(50000) FROM DUAL;

-- Actualizar puntos del usuario
BEGIN
  pkg_levelup_gamer.proc_actualizar_puntos(1, 100, 'COMPRA');
END;
```

---

## Contribución

### Desarrolladores
- **Jeremy Parada**: Backend, Base de Datos, PL/SQL
- **Felipe Duarte**: Frontend React, UX/UI

### Cómo Contribuir
1. Fork del repositorio
2. Crear rama: `git checkout -b feature/nueva-funcionalidad`
3. Commit: `git commit -m 'Agregar nueva funcionalidad'`
4. Push: `git push origin feature/nueva-funcionalidad`
5. Crear Pull Request

---

## Licencia

Este proyecto es desarrollado con fines académicos para **DuocUC 2025**. Todos los derechos reservados.

---

## Contacto y Soporte

- **Proyecto Académico**: DuocUC - Taller de Base de Datos 2
- **Repositorio**: [GitHub - Level-UP](https://github.com/JeremyParada/Level-UP)
- **Desarrolladores**:
  - Jeremy Parada: jer.parada@duocuc.cl
  - Felipe Duarte: fe.duarte@duocuc.cl

---

## Changelog

### Versión 2.0.0 (Octubre 2025)
- ✅ Integración completa con Oracle Cloud Database
- ✅ API RESTful con Node.js + Express
- ✅ 25 endpoints funcionales
- ✅ Paquete PL/SQL con funciones y procedimientos
- ✅ Sistema de puntos en base de datos
- ✅ Gestión de pedidos completa
- ✅ Sistema de reseñas persistente

### Versión 1.0.0 (Septiembre 2025)
- ✅ Implementación completa del ecommerce
- ✅ Sistema de notificaciones sin popups
- ✅ Contador dinámico del carrito
- ✅ Diseño responsivo y tema gaming

---

## Stack Tecnológico Completo

```
Frontend:
  ├── React 19.2.0
  ├── React Router DOM 7.9.3
  ├── Bootstrap 5.3.8
  ├── Axios (HTTP Client)
  └── Testing: Karma + Jasmine

Backend:
  ├── Node.js v18+
  ├── Express 4.x
  ├── OracleDB Driver
  ├── CORS
  └── dotenv

Database:
  ├── Oracle Cloud Database
  ├── PL/SQL Packages
  ├── Stored Procedures
  └── Functions

DevOps:
  ├── Git & GitHub
  ├── npm
  └── Oracle Wallet

Future:
  ├── AWS Deployment
  ├── CI/CD Pipeline
  └── Docker Containerization
```

---

**🎮 Level-UP Gamer - Sube de nivel en cada compra 🚀**
