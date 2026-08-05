# Level-UP Gamer Store

E-commerce de productos gaming construido de punta a punta: SPA en **React 19**,
API REST en **Spring Boot 3.5** con autenticación JWT, y persistencia en
**Oracle Autonomous Database** con lógica de negocio en PL/SQL.

Proyecto académico de Duoc UC (2025), desplegado en un servidor Ubuntu con
despliegue automático por webhook de GitHub.

---

## Stack

| Capa | Tecnologías |
|---|---|
| Frontend | React 19.2, React Router 7.9, Bootstrap 5.3 / react-bootstrap, Context API, Axios |
| Backend | Spring Boot 3.5.7 (Java 17), Spring Web, Spring Data JPA / Hibernate, Spring Security, JJWT 0.11.5, Lombok, springdoc-openapi |
| Base de datos | Oracle Autonomous Database, conexión mTLS por wallet (ojdbc11 + oraclepki), H2 en memoria para tests |
| Testing | Karma + Jasmine (frontend), Spring Boot Test (backend) |
| Despliegue | Ubuntu, Maven Wrapper, PM2, webhook HMAC-SHA256 |

> **Nota histórica:** el backend original fue Node.js + Express y fue migrado
> por completo a Spring Boot. La API vigente es la que se documenta aquí
> (`/api/v1/...`).

---

## Arquitectura

```
Level-UP/
├── src/                          # Frontend React
│   ├── pages/                    # Home, Products, ProductDetail, Cart,
│   │                             # Checkout, Login, Register, Profile,
│   │                             # Reviews, Community
│   ├── components/               # layout/, productos/, DireccionesManager
│   ├── context/                  # AuthContext, CartContext, NotificationContext
│   ├── hooks/                    # useCart, useNotification
│   └── utils/api.js              # fetchWithAuth: inyecta el Bearer token y
│                                 # cierra sesión ante 401/403
├── backend/                      # API Spring Boot
│   └── src/main/java/com/levelup/tienda/backend/
│       ├── controller/           # Auth, Producto, Pedido, Direccion, Usuario
│       ├── service/              # Interfaz + Impl por dominio
│       ├── repository/           # Spring Data JPA
│       ├── model/                # Entidades JPA + Role / ERole
│       ├── dto/                  # LoginDTO, RegistroDTO, JwtResponseDTO,
│       │                         # PedidoRequest, ProductoPedidoRequest
│       ├── security/jwt/         # JwtTokenProvider, JwtAuthTokenFilter,
│       │                         # JwtAuthEntryPoint, UserDetailsServiceImpl
│       └── config/               # SecurityConfig, WebConfig, OpenApiConfig
├── script base de datos 2.sql    # Esquema Oracle completo (1.216 líneas)
├── deploy.sh                     # Build y reinicio de backend + frontend
└── webhook-server.js             # Recibe el webhook de GitHub y dispara deploy.sh
```

El backend sigue una separación en capas estricta: el controlador no toca el
repositorio, y cada servicio se expone como interfaz con su implementación
aparte.

---

## Seguridad

- Autenticación **stateless con JWT**: `JwtTokenProvider` firma y valida,
  `JwtAuthTokenFilter` intercepta cada request, `JwtAuthEntryPoint` responde
  los 401.
- Autorización por rol con `@PreAuthorize("hasRole('ADMIN')")` sobre las
  operaciones de escritura del catálogo (crear, editar y eliminar productos).
- Contraseñas hasheadas por el `PasswordEncoder` de Spring Security.
- La contraseña de base de datos y el secreto JWT se leen desde variables de
  entorno (`${DB_PASSWORD}`, `${JWT_SECRET}`). **No hay credenciales en el
  repositorio**, y el wallet de Oracle está excluido por `.gitignore`.

---

## API REST

Base: `/api/v1`. Documentación interactiva en `/swagger-ui.html`.

### Autenticación — `/auth`
| Método | Ruta | Descripción |
|---|---|---|
| POST | `/login` | Devuelve el JWT y los datos del usuario |
| POST | `/register` | Registro de usuario nuevo |

### Productos — `/productos`
| Método | Ruta | Acceso |
|---|---|---|
| GET | `/` | Público |
| GET | `/{id}` | Público |
| GET | `/codigo/{codigoProducto}` | Público |
| GET | `/categoria/{categoriaId}` | Público |
| GET | `/categorias` | Público |
| POST | `/` | ADMIN |
| PUT | `/{id}` | ADMIN |
| DELETE | `/{id}` | ADMIN |

### Pedidos — `/pedidos`
| Método | Ruta | Descripción |
|---|---|---|
| GET | `/usuario/{id}` | Historial de pedidos del usuario |
| POST | `/` | Crea el pedido y su detalle |

### Direcciones — `/direcciones`
| Método | Ruta | Descripción |
|---|---|---|
| GET | `/usuario/{idUsuario}` | Direcciones del usuario |
| POST | `/` | Crear |
| PUT | `/{id}` | Actualizar |
| DELETE | `/{id}` | Eliminar |

### Usuarios — `/usuarios`
| Método | Ruta | Descripción |
|---|---|---|
| GET | `/me/{id}` | Perfil del usuario autenticado |

---

## Base de datos

Esquema Oracle definido en `script base de datos 2.sql`:

- **15 tablas** — `usuarios`, `roles`, `usuario_roles`, `administradores`,
  `productos`, `categorias`, `carrito`, `detalle_carrito`, `pedidos`,
  `detalle_pedido`, `resenas`, `referidos`, `direcciones`,
  `transacciones_puntos`, `auditoria_productos`
- **12 secuencias** con sus triggers de clave primaria
- **16 triggers**, incluida la validación de edad mínima en el registro
  (`trg_validar_edad`) y la auditoría de cambios sobre productos
- **17 índices** sobre las columnas de filtrado frecuente
- **Paquete `pkg_levelup_gamer`** (spec + body) con la lógica de negocio del
  programa de fidelización

### Reglas de negocio en PL/SQL

```sql
-- Descuento aplicable a un usuario sobre un monto
SELECT pkg_levelup_gamer.func_calcular_descuento(1, 50000) FROM DUAL;

-- Puntos que otorga una compra
SELECT pkg_levelup_gamer.func_calcular_puntos(50000) FROM DUAL;

-- Acreditar puntos
BEGIN
  pkg_levelup_gamer.proc_actualizar_puntos(1, 100, 'COMPRA');
END;
```

Sistema de puntos LevelUp: 100 puntos de bienvenida, acumulación por compra,
bonificación por reseña y por referido, y descuento permanente del 20 % para
correos `@duoc.cl` / `@duocuc.cl`.

### Rendimiento

`ProductoRepository` usa `@EntityGraph(attributePaths = {"categoria"})` en las
consultas de catálogo para resolver el problema N+1 que generaba la carga
perezosa de la categoría en cada producto del listado.

---

## Puesta en marcha local

### Requisitos
- Node.js 18+
- JDK 17
- Cuenta de Oracle Cloud con Autonomous Database
- Wallet descargado desde la consola de Oracle Cloud

### 1. Wallet y credenciales

El wallet **no está en el repositorio**. Descárgalo desde la consola de Oracle
Cloud y déjalo en una carpeta local (por ejemplo `wallet/`, que está en el
`.gitignore`).

Copia `backend/.env.example` a `backend/.env` y complétalo:

```env
DB_USER=ADMIN
DB_PASSWORD=<tu contraseña>
DB_CONNECT_STRING=tallerbasedatos2_high
JWT_SECRET=<cadena larga y aleatoria>
TNS_ADMIN=/ruta/local/a/wallet
```

### 2. Base de datos

Ejecuta `script base de datos 2.sql` sobre la instancia. Crea el esquema
completo: tablas, secuencias, triggers, índices y el paquete PL/SQL.

### 3. Backend

```bash
cd backend
./mvnw spring-boot:run
```

API en `http://localhost:8080/api/v1` · Swagger en
`http://localhost:8080/swagger-ui.html`

### 4. Frontend

```bash
npm install
npm start
```

Aplicación en `http://localhost:3000`.

---

## Tests

```bash
npm run test:once      # Frontend: Karma + Jasmine, una pasada
npm run test:watch     # Frontend: modo watch
npm run open:coverage  # Reporte de cobertura
```

Hay suites por página (`Home`, `Products`, `ProductDetailPage`, `Cart`,
`Login`, `Register`, `Profile`, `Reviews`, `Community`), por contexto
(`AuthContext`, `CartContext`, `NotificationContext`), por hook (`useCart`) y
por componente (`ProductCard`).

```bash
cd backend && ./mvnw test   # Backend, sobre H2 en memoria
```

---

## Despliegue

Despliegue automático sobre Ubuntu:

1. `webhook-server.js` escucha en el puerto 4000 y valida la firma
   `X-Hub-Signature-256` del webhook de GitHub con HMAC-SHA256.
2. Si la firma es válida, dispara `deploy.sh`.
3. `deploy.sh` hace `git pull`, compila el backend con
   `./mvnw clean package`, construye el frontend, y reinicia ambos procesos
   con **PM2**.

El secreto del webhook se lee de la variable de entorno `WEBHOOK_SECRET`:

```bash
export WEBHOOK_SECRET='<el mismo secreto configurado en GitHub>'
node webhook-server.js
```

---

## Autores

Proyecto de Taller de Base de Datos 2 — Duoc UC, 2025.

- **Jeremy Parada** — backend Spring Boot, seguridad JWT, modelo de datos,
  PL/SQL y despliegue · jer.parada@duocuc.cl
- **Felipe Duarte** — frontend React, UX/UI · fe.duarte@duocuc.cl

---

## Licencia

Desarrollado con fines académicos para Duoc UC, 2025.
