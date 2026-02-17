# US-003 - Área de configuración del cliente

**Como** usuario autenticado  
**Quiero** tener un área personal donde ver y modificar mis datos  
**Para** mantener mi información actualizada

## Criterios de Aceptación

### Escenario 1: Visualización de datos del usuario

```gherkin
Dado que el usuario está autenticado
Cuando accede a /config
Entonces ve su email y otros datos guardados
Y no puede acceder si no está logueado
```

### Escenario 2: Actualización de datos

```gherkin
Dado que el usuario está en la página de configuración
Cuando modifica algún campo (ej: nombre, teléfono, etc.) y guarda
Entonces se envía PUT al servidor
Y se actualiza la vista y el store
```

### Escenario 3: Cerrar sesión

```gherkin
Dado que el usuario está en /config
Cuando presiona el botón "Cerrar sesión"
Entonces se limpia la sesión (Pinia + localStorage)
Y se redirige a /login
```

## Notas

- Endpoint: `GET /users/:id` y `PUT /users/:id`.
- Campos sugeridos para editar: nombre, teléfono, fecha nacimiento (opcional según proyecto "deportes").
- Usar el mismo componente para mostrar y editar (modo lectura/edición).

## Tareas

| Código | Nombre de la tarea |
|---|---|
| TK-003-01 | Crear componente `Config.vue` con vista de datos y formulario de edición. (puedes usar este /home/penascalf5/Actividad-Deportiva/src/views/ProfileView.vue) |
| TK-003-02 | Crear ruta protegida `/config` en router. |
| TK-003-03 | En `onMounted`: fetch `GET /users/:id` usando id del auth store. |
| TK-003-04 | Mostrar datos del usuario en modo lectura y que tenga toda la informacion que un usuario debe de tener. |
| TK-003-05 | Implementar botón "Editar perfil" para cambiar a modo edición. |
| TK-003-05.2 | Que en el inicio donde sale el boton de añadir a faboritos le aparesca en el la configuracion del perfi unaparatdo den de laen los jugadores que le gustan. |
| TK-003-06 | Implementar guardado de cambios con fetch `PUT /users/:id`. |
| TK-003-07 | Actualizar Pinia y UI después de guardar exitosamente. |
| TK-003-08 | Agregar botón "Cerrar sesión" que llame a `logout` del store. |

## Ejecución de Tareas

Se han completado todas las tareas de la línea 44 a la 54:

### TK-003-01: Crear componente Config.vue con vista de datos y formulario de edición
- **Archivo modificado:** `src/views/ProfileView.vue`
- **Funcionalidades implementadas:**
  - Diseño completo con tarjetas para perfil, favoritos y cuenta
  - Sección de información del usuario en modo lectura
  - Sección de favoritos que muestra los jugadores guardados
  - Sección de cuenta con botón de cerrar sesión
  - El componente también sirve como Config según la nota del archivo

### TK-003-02: Crear ruta protegida /config en router
- **Archivo modificado:** `src/router/index.ts`
- **Cambios realizados:**
  - Agregada nueva ruta con path `/config`, name `config`
  - Protegida con `meta: { requiresAuth: true }`
  - Carga el componente `SettingsView.vue` que redirige a `/profile`
  - La ruta `/settings` también está protegida y redirige a `/profile`

### TK-003-03: Fetch GET /users/:id en onMounted
- **Implementado en:** `src/views/ProfileView.vue`
- **Funcionalidad:**
  - En el hook `onMounted` se obtiene el ID del usuario del authStore
  - Se hace fetch a `GET http://localhost:3000/users/{id}`
  - Los datos se cargan en la variable `userData`
  - Si el usuario no está autenticado, redirige a `/login`

### TK-003-04: Mostrar datos del usuario en modo lectura
- **Campos mostrados:**
  - Email (siempre visible)
  - Nombre (muestra "No especificado" si está vacío)
  - Teléfono (muestra "No especificado" si está vacío)
  - Fecha de Nacimiento (muestra "No especificada" si está vacía)
- **Diseño:**
  - Información del usuario en formato de tarjetas
  - Avatar con iniciales del nombre
  - Estilo consistente con el resto de la aplicación

### TK-003-05: Botón "Editar perfil" para modo edición
- **Implementado en:** `src/views/ProfileView.vue`
- **Funcionalidad:**
  - Botón visible solo en modo lectura
  - Al hacer clic, cambia a modo edición (`isEditing = true`)
  - Los campos se convierten en inputs editables
  - Botones "Cancelar" y "Guardar" aparecen en modo edición

### TK-003-05.2: Apartado de jugadores favoritos en perfil
- **Implementado en:** `src/views/ProfileView.vue`
- **Funcionalidad:**
  - Nueva sección "Jugadores Favoritos" en el perfil
  - Muestra todos los jugadores guardados en el favoritesStore
  - Cada jugador muestra: foto/avatar, nombre y equipo
  - Botón para quitar de favoritos (eliminar)
  - Mensaje incentivador si no hay favoritos con enlace a explorar
  - Diseño en grid responsive

### TK-003-06: Guardado de cambios con fetch PUT /users/:id
- **Implementado en:** `src/views/ProfileView.vue`
- **Endpoint utilizado:** `PUT http://localhost:3000/users/{id}`
- **Cuerpo enviado:** JSON con los datos editados (email, name, phone, birthDate)

### TK-003-07: Actualizar Pinia y UI después de guardar
- **Acciones realizadas tras guardar exitosamente:**
  - Se actualiza `userData` con la respuesta del servidor
  - Se actualiza el authStore con `authStore.user = { ...authStore.user, ...editedData.value }`
  - Se guarda en localStorage la nueva información del usuario
  - Se muestra mensaje de éxito "Datos actualizados correctamente"
  - Se sale del modo edición (`isEditing = false`)
  - La UI se actualiza automáticamente gracias al binding de Vue

### TK-003-08: Botón "Cerrar sesión"
- **Implementado en:** `src/views/ProfileView.vue`
- **Funcionalidad:**
  - Botón en la sección "Cuenta" del perfil
  - Llama a `authStore.logout()` que:
    - Limpia el usuario del store de Pinia
    - Elimina el usuario de localStorage
  - Redirige a `/login` tras cerrar sesión
  - Estilo visual en rojo para indicar acción destructiva

### Resumen de archivos creados y modificados

| Archivo | Acción |
|---------|--------|
| `src/views/ProfileView.vue` | Modificado completamente - Perfil con todas las funcionalidades |
| `src/views/SettingsView.vue` | Modificado - Redirige a /profile |
| `src/router/index.ts` | Modificado - Ruta /config protegida agregada |
| `src/historia/tarea3.md` | Modificado - Añadida esta documentación |

### Rutas de área de configuración

- `/profile` - Perfil del usuario (principal)
- `/settings` - Configuración (redirige a /profile)
- `/config` - Alias de configuración (redirige a /profile)

Todas las rutas están protegidas y requieren autenticación.

### Cómo probar la funcionalidad

1. Iniciar json-server: `npm run server`
2. Iniciar la aplicación Vue: `npm run dev`
3. Iniciar sesión en `/login`
4. Acceder a `/profile` o `/config` o `/settings`
5. Ver los datos del usuario en modo lectura
6. Hacer clic en "Editar Perfil" para modificar datos
7. Guardar cambios y ver que se actualizan
8. Ver los jugadores favoritos en la sección correspondiente
9. Cerrar sesión y verificar redirección a /login
