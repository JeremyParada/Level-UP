# Integración de Gestión de Direcciones en el Perfil

## Componente Creado

Se creó el componente `DireccionesManager.jsx` con funcionalidad completa de CRUD para direcciones:

- ✅ **Listar** direcciones del usuario
- ✅ **Crear** nueva dirección (modal con formulario)
- ✅ **Editar** dirección existente (modal con formulario prellenado)
- ✅ **Eliminar** dirección (con confirmación)

## Cómo Integrar en Profile.jsx

### Paso 1: Agregar el import

En la parte superior de `src/pages/Profile.jsx`, después de los otros imports, agrega:

```javascript
import DireccionesManager from '../components/DireccionesManager';
```

### Paso 2: Agregar el componente en el JSX

Dentro del `<div className="col-lg-8">`, después del formulario de perfil (después de la línea 346 que cierra el div del formulario), y ANTES del comentario `{/* Historial de compras */}`, agrega:

```jsx
{/* Gestión de Direcciones */}
<DireccionesManager idUsuario={getUserId()} />
```

### Ubicación exacta en Profile.jsx

```jsx
            </div>  {/* Cierre del card del formulario de perfil */}

            {/* Gestión de Direcciones */}
            <DireccionesManager idUsuario={getUserId()} />

            {/* Historial de compras */}
            <div className="card card-formulario rounded-4 p-4">
```

## Resultado

Una vez integrado, en la página de perfil aparecerá una nueva sección llamada "📍 Mis Direcciones" que permite:

1. Ver todas las direcciones guardadas en tarjetas
2. Botón "+ Agregar Dirección" para crear nuevas
3. Botones "✏️ Editar" y "🗑️ Eliminar" en cada dirección
4. Modal para agregar/editar con todos los campos del formulario
5. Confirmación antes de eliminar

## Endpoints Utilizados

El componente usa los nuevos endpoints del backend:

- `GET /api/v1/direcciones/usuario/{idUsuario}` - Listar
- `POST /api/v1/direcciones` - Crear
- `PUT /api/v1/direcciones/{id}` - Actualizar
- `DELETE /api/v1/direcciones/{id}` - Eliminar

Todos requieren autenticación JWT (excepto GET que está configurado como autenticado).
