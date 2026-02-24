# US-002 - Iniciar sesión (Login)

**Como** usuario registrado  
**Quiero** poder iniciar sesión con mis credenciales  
**Para** acceder a mi área personal de configuración

## Criterios de Aceptación

### Escenario 1: Login exitoso

```gherkin
Dado que el usuario ingresa email y contraseña correctos
Cuando presiona el botón "Iniciar sesión"
Entonces se autentica correctamente
Y se redirige a la página de configuración (/config)
Y se guarda la información del usuario en el store
```

### Escenario 2: Credenciales incorrectas

```gherkin
Dado que el email o la contraseña son incorrectos
Cuando el usuario envía el formulario
Entonces se muestra el mensaje "Email o contraseña incorrectos"
Y no se redirige
```

### Escenario 3: Persistencia de sesión básica

```gherkin
Dado que el usuario se logueó correctamente
Cuando cierra y vuelve a abrir la pestaña
Entonces permanece logueado (usando localStorage o pinia-persistedstate)
```

## Notas

- Endpoint recomendado: `GET /users?email=xxx` (comparar contraseña en frontend).
- Importante: en producción **NUNCA** comparar contraseñas en frontend ni guardar en plano.
- Usar Pinia para estado de autenticación.
- Proteger rutas privadas con Navigation Guards.

## Tareas

| Código | Nombre de la tarea |
|---|---|
| TK-002-01 | Crear componente `Login.vue` con formulario (email + password). |
| TK-002-02 | Crear ruta `/login` en `router/index.js`. |
| TK-002-03 | Crear `AuthStore` en Pinia (`user`, `isAuthenticated`, acciones `login/logout`). |
| TK-002-04 | Implementar login con fetch `GET /users?email=...` y validación. |
| TK-002-05 | Guardar usuario en Pinia + `localStorage` al loguear exitosamente. |
| TK-002-06 | Implementar Navigation Guard: redirigir a login si no autenticado. |
| TK-002-07 | Mostrar mensaje de error claro en caso de credenciales inválidas. |
| TK-002-08 | (Opcional) Agregar botón "¿Olvidaste tu contraseña?" (placeholder). |

## Ejecución de Tareas

Se han completado todas las tareas de la línea 45 a la 54:

### TK-002-01: Crear componente Login.vue
- **Archivo creado:** `src/views/LoginView.vue`
- **Funcionalidades implementadas:**
  - Formulario con campos de email y contraseña
  - Validación de campos requeridos antes del envío
  - Integración con AuthStore para el proceso de login
  - Indicador de carga (spinner) durante la autenticación
  - Mensaje de error cuando las credenciales son inválidas
  - Redirección a `/settings` tras login exitoso
  - Enlace a la página de registro
  - Botón "¿Olvidaste tu contraseña?" como placeholder (TK-002-08)

### TK-002-02: Crear ruta /login en router
- **Archivo modificado:** `src/router/index.ts`
- **Cambios realizados:**
  - Agregada nueva ruta con path `/login`, name `login`
  - Carga perezosa del componente `LoginView.vue`

### TK-002-03: Crear AuthStore en Pinia
- **Archivo creado:** `src/stores/auth.ts`
- **Estado gestionado:**
  - `user`: objeto del usuario autenticado (id, email, password)
  - `loading`: indicador de estado de carga
  - `error`: mensaje de error si falla el login
  - `isAuthenticated`: computed que indica si hay sesión activa
- **Acciones implementadas:**
  - `login(email, password)`: autentica al usuario contra json-server
  - `logout()`: cierra sesión y limpia localStorage
  - `init()`: restaura la sesión desde localStorage al cargar la app

### TK-002-04: Implementar login con fetch GET
- Implementado en `src/stores/auth.ts` dentro de la función `login()`
- Endpoint utilizado: `GET /users?email=xxx`
- Compara la contraseña en el frontend (nota: inseguro para producción, pero válido para este proyecto educativo según las notas)

### TK-002-05: Guardar usuario en Pinia + localStorage
- Al iniciar sesión exitosamente, el objeto usuario se guarda en:
  - Pinia store (`user`)
  - `localStorage` con clave `'user'`
- Al cargar la aplicación, `init()` restaura el usuario desde localStorage
- Función `logout()` limpia tanto Pinia como localStorage

### TK-002-06: Navigation Guard para rutas privadas
- **Archivo modificado:** `src/router/index.ts`
- Implementado `router.beforeEach` que verifica:
  - Si la ruta tiene `meta: { requiresAuth: true }`
  - Si el usuario NO está autenticado
  - Si ambas condiciones se cumplen, redirige a `/login` con query param `redirect`
- Rutas protegidas: `/favorites`, `/profile`, `/settings`

### TK-002-07: Mensaje de error en credenciales inválidas
- Mostrado en el componente LoginView.vue
- El AuthStore retorna error "Email o contraseña incorrectos" cuando:
  - No existe usuario con el email proporcionado
  - La contraseña no coincide
- El error se muestra en un banner rojo con estilo visual consistente

### TK-002-08: Botón "¿Olvidaste tu contraseña?" (opcional)
- Agregado en `src/views/LoginView.vue`
- Estilizado como texto secundario con hover en color primary
- Por ahora es un placeholder sin funcionalidad

### Resumen de archivos creados y modificados

| Archivo | Acción |
|---------|--------|
| `src/views/LoginView.vue` | Creado - Componente de login |
| `src/stores/auth.ts` | Creado - Store de autenticación Pinia |
| `src/router/index.ts` | Modificado - Ruta /login + Navigation Guard |
| `src/historia/tarea2.md` | Modificado - Añadida esta documentación |

### Cómo probar la funcionalidad

1. Iniciar json-server: `npm run server`
2. Iniciar la aplicación Vue: `npm run dev`
3. Acceder a `http://localhost:5173/register` para registrar un usuario
4. Luego acceder a `http://localhost:5173/login` para iniciar sesión
5. Tras login exitoso, se redirige a `/settings` (ruta protegida)
6. Cerrar la pestaña y volver a abrir - la sesión persistirá gracias a localStorage
