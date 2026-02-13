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
| TK-003-01 | Crear componente `Config.vue` con vista de datos y formulario de edición. |
| TK-003-02 | Crear ruta protegida `/config` en router. |
| TK-003-03 | En `onMounted`: fetch `GET /users/:id` usando id del auth store. |
| TK-003-04 | Mostrar datos del usuario en modo lectura. |
| TK-003-05 | Implementar botón "Editar perfil" para cambiar a modo edición. |
| TK-003-06 | Implementar guardado de cambios con fetch `PUT /users/:id`. |
| TK-003-07 | Actualizar Pinia y UI después de guardar exitosamente. |
| TK-003-08 | Agregar botón "Cerrar sesión" que llame a `logout` del store. |
