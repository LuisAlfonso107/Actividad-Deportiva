# Historias de Usuario - Alerta de Registro y Estado de Perfil

## US-ANU-001 - Alerta global de registro cada 10 segundos

**Como** visitante no autenticado  
**Quiero** ver una alerta periódica en toda la aplicación  
**Para** que se me solicite registrarme e iniciar sesión

### Criterios de Aceptación

#### Escenario 1: Mostrar alerta cada 10 segundos en usuarios no logeados

```gherkin
Dado que el usuario navega por cualquier página de la aplicación
Y no tiene sesión iniciada
Cuando transcurren 10 segundos
Entonces se muestra una alerta de registro en toda la pantalla que sea un modal,
Y la alerta vuelve a mostrarse cada 10 segundos mientras no inicie sesión
```

#### Escenario 2: Mensaje y acción de la alerta

```gherkin
Dado que el usuario no está autenticado
Cuando aparece la alerta
Entonces se muestra un mensaje claro para registrarse o iniciar sesión
Y se ofrece una acción para ir a la pantalla de registro o login
```

#### Escenario 3: Detener alerta cuando el usuario inicia sesión

```gherkin
Dado que el usuario tenía alertas activas por no estar logeado
Cuando inicia sesión correctamente
Entonces se detiene el temporizador de alertas
Y no vuelven a mostrarse alertas cada 10 segundos
```

## US-ANU-002 - Texto dinámico en el ícono "Mi perfil"

**Como** usuario de la aplicación  
**Quiero** que el ícono de perfil muestre un texto según mi estado de sesión  
**Para** identificar rápidamente si debo iniciar sesión o si ya estoy autenticado

### Criterios de Aceptación

#### Escenario 1: Usuario no autenticado

```gherkin
Dado que el usuario no tiene sesión iniciada
Cuando visualiza el ícono o sección "Mi perfil"
Entonces debe mostrarse el texto "Iniciar sesión"
```

#### Escenario 2: Usuario autenticado

```gherkin
Dado que el usuario inició sesión correctamente
Cuando visualiza el ícono o sección "Mi perfil"
Entonces debe mostrarse el texto "HOLA, {nombreDelUsuario}"
```

#### Escenario 3: Cambio en tiempo real de estado

```gherkin
Dado que cambia el estado de autenticación del usuario
Cuando pasa de no autenticado a autenticado (o viceversa)
Entonces el texto de "Mi perfil" se actualiza inmediatamente
Y refleja el estado actual sin recargar la página
```

## Notas

- Mostrar la alerta solo para usuarios no autenticados.
- El temporizador se recomienda centralizarlo en un componente global (por ejemplo `App.vue`) o en un store/composable.
- Limpiar el `setInterval` al desmontar el componente para evitar fugas de memoria.
- Usar codigo limpio y sencillo y con comnetarios de explicacion.
- Tomar el nombre del usuario desde el store de autenticación (`auth`).
- Texto en perfil:
  - Sin login: `Iniciar sesión`
  - Con login: `HOLA, <nombre>`

## Tareas

| Código | Nombre de la tarea |
|---|---|
| TK-ANU-001 | Revisar el store de autenticación para exponer `isAuthenticated` y `user.name`. |
| TK-ANU-002 | Crear lógica global con `setInterval` de 10 segundos para mostrar alerta solo si no hay sesión. |
| TK-ANU-003 | Implementar función para detener/limpiar el intervalo cuando el usuario inicia sesión o al desmontar. |
| TK-ANU-004 | Integrar la alerta con acción de navegación a `/register` o `/login`. |
| TK-ANU-005 | Actualizar el componente de cabecera/perfil para mostrar `Iniciar sesión` cuando no hay sesión. |
| TK-ANU-006 | Actualizar el componente de cabecera/perfil para mostrar `HOLA, {nombre}` cuando hay sesión. |
| TK-ANU-007 | Validar actualización reactiva del texto de perfil al cambiar el estado de login/logout. |
| TK-ANU-008 | Probar manualmente el flujo completo en distintas vistas para confirmar que la alerta aparece en toda la página. |

## Estado

- Documento de historia de usuario y tareas definido.
- Implementación en código: pendiente.

---

## Implementación Realizada

### Archivos modificados:

1. **`src/stores/auth.ts`** (línea 4-8)
   - Se añadió el campo `name` a la interfaz `User` para almacenar el nombre del usuario

2. **`src/App.vue`** (líneas 1-77, 97-99, 159-178, 186-206)
   - **TK-ANU-001**: Actualizada la interfaz User para incluir campo `name`
   - **TK-ANU-002**: Creada lógica global con `setInterval` de 10 segundos para mostrar alerta
   - **TK-ANU-003**: Implementada función `stopAlertTimer()` para detener el intervalo al iniciar sesión
   - **TK-ANU-004**: Integrada alerta con acciones de navegación a `/register` y `/login`
   - **TK-ANU-005 y TK-ANU-006**: Actualizado el texto dinámico del perfil:
     - Sin sesión: "Iniciar sesión"
     - Con sesión: "HOLA, {nombre}"
   - **TK-ANU-007**: Validada actualización reactiva usando `watch` en `isAuthenticated` y `user`

### Detalles de implementación:

- El modal de alerta se muestra cada 10 segundos usando `setInterval`
- Se limpia el intervalo con `onUnmounted` para evitar fugas de memoria
- El texto del perfil se actualiza dinámicamente usando un `watch` reactivo
- Cuando el usuario inicia sesión, el intervalo se detiene automáticamente
- El modal incluye botones para ir a registro o login, y opción de cerrar

### Carpetas creadas/modificadas:
- `src/stores/auth.ts` - Modificado
- `src/App.vue` - Modificado
