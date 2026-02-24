# Historias de Usuario - Refactor a Composable y Orden de Arquitectura

## US-COMP-001 - Centralizar la lógica en carpeta composable

**Como** equipo de desarrollo  
**Quiero** crear una carpeta `src/composable` y mover allí la lógica reutilizable del proyecto  y tener un proyecto web Atomic Design 
**Para** mantener una arquitectura limpia, escalable y fácil de mantener

### Criterios de Aceptación

#### Escenario 1: Creación de estructura base

```gherkin
Dado que el proyecto está funcionando con lógica dispersa en vistas y componentes
Cuando se ejecuta la refactorización de arquitectura
Entonces existe la carpeta `src/composable`
Y contiene composables separados por responsabilidad
Y cada composable exporta funciones reutilizables
```

#### Escenario 2: Migración de lógica desde views/components

```gherkin
Dado que existen vistas con lógica de negocio mezclada con la UI
Cuando se migra la lógica a composables
Entonces las vistas quedan enfocadas en renderizado e interacción
Y la lógica de negocio queda encapsulada en `src/composable`
Y no se rompe el comportamiento actual de la aplicación
```

#### Escenario 3: Estructura ordenada del proyecto

```gherkin
Dado que se ha creado la carpeta composable y se ha migrado lógica
Cuando se revisa la estructura del proyecto
Entonces cada carpeta tiene una responsabilidad clara
Y la arquitectura sigue una organización consistente y mantenible
Y el proyecto mantiene tipado y buenas prácticas de Vue 3 + Pinia
```

## Notas

- Carpeta objetivo solicitada: `src/composable`.
- Recomendación técnica: separar composables por dominio funcional.
- Mantener stores (`src/stores`) solo para estado global y persistencia.
- Mantener servicios (`src/services`) solo para llamadas a APIs externas/internas.
- Mantener vistas (`src/views`) con mínima lógica de negocio.
- Reutilizar composables desde vistas/componentes con imports claros.


## Estructura Objetivo Recomendada

```text
src/
├── assets/
├── components/
├── composable/
│   ├── useAuthForm.ts
│   ├── useRegisterForm.ts
│   ├── useProfileForm.ts
│   ├── useSearchPlayers.ts
│   ├── useRegisterAlert.ts
│   └── useUiFeedback.ts
├── router/
├── server/
├── services/
├── stores/
├── views/
├── App.vue
└── main.ts
```

## Tareas

| Código | Nombre de la tarea |
|---|---|
| TK-COMP-001 | Crear carpeta `src/composable` en el proyecto. |
| TK-COMP-002 | Identificar lógica repetida o de negocio en `src/views` y `src/components` y cada archivo de views que tenga lógica dividirla de foma correcta y en componentes de modo que la logica de  los componenetes se mueva a los composables y que estb solo las vistas en views. |
| TK-COMP-003 | Crear `useRegisterForm.ts` y mover validaciones/flujo de registro. |
| TK-COMP-004 | Crear `useAuthForm.ts` y mover validaciones/flujo de login. |
| TK-COMP-005 | Crear `useProfileForm.ts` para edición/guardado de perfil. |
| TK-COMP-006 | Crear `useSearchPlayers.ts` para búsqueda, debounce y estados de carga/error. |
| TK-COMP-007 | Crear `useRegisterAlert.ts` para la alerta global de registro cada 10 segundos. |
| TK-COMP-008 | Actualizar vistas para consumir composables y eliminar lógica duplicada. |
| TK-COMP-009 | Verificar que stores y servicios mantengan responsabilidades separadas. |
| TK-COMP-010 | Ejecutar pruebas y validación técnica (`npm run test:unit`, `npm run type-check`). |
| TK-COMP-011 | Documentar la nueva arquitectura y el propósito de cada composable. |

## Ejecución de Tareas

Estado actual: completado.

### Resultado esperado al finalizar

1. Proyecto con estructura limpia y mantenible.
2. Lógica desacoplada de las vistas.
3. Reutilización real de código por composables.
4. Menor duplicación y mayor facilidad para escalar funcionalidades.

---

## Implementación Realizada

### Archivos y carpetas creadas:

1. **`src/composable/`** - Nueva carpeta creada con los siguientes composables:
   - `useRegisterForm.ts` - Lógica de registro (validación, envío de formulario)
   - `useAuthForm.ts` - Lógica de login (validación, autenticación)
   - `useProfileForm.ts` - Lógica de perfil (carga, edición, guardado de datos)
   - `useSearchPlayers.ts` - Lógica de búsqueda de jugadores (debounce, API, filtros)
   - `useRegisterAlert.ts` - Alerta global de registro cada 10 segundos
   - `useUiFeedback.ts` - Feedback de UI reutilizable (mensajes de éxito/error)

2. **Vistas actualizadas**:
   - `src/views/RegisterView.vue` - Ahora usa `useRegisterForm`
   - `src/views/LoginView.vue` - Ahora usa `useAuthForm`
   - `src/views/ProfileView.vue` - Ahora usa `useProfileForm`
   - `src/views/PlayersView.vue` - Ahora usa `useSearchPlayers`
   - `src/App.vue` - Ahora usa `useRegisterAlert` y lógica de perfil reactiva

### Propósito de cada composable:

| Composable | Propósito |
|------------|-----------|
| `useRegisterForm` | Maneja el estado y validación del formulario de registro, incluyendo validaciones de email y contraseña, envío al backend y mensajes de error |
| `useAuthForm` | Maneja el estado y validación del formulario de login, integración con el store de autenticación |
| `useProfileForm` | Maneja la carga de datos del usuario, edición de perfil, guardado de cambios y cierre de sesión |
| `useSearchPlayers` | Encapsula la lógica de búsqueda de jugadores, debounce, carga inicial, manejo de errores y utilidades para mostrar datos |
| `useRegisterAlert` | Gestiona la alerta global de registro que se muestra cada 10 segundos a usuarios no autenticados |
| `useUiFeedback` | Proporciona funciones reutilizables para mostrar mensajes de éxito, error e información |

### Arquitectura Final:

```
src/
├── assets/
├── components/
├── composable/          <-- NUEVO
│   ├── useAuthForm.ts
│   ├── useProfileForm.ts
│   ├── useRegisterAlert.ts
│   ├── useRegisterForm.ts
│   ├── useSearchPlayers.ts
│   └── useUiFeedback.ts
├── router/
├── server/
├── services/             <-- Sin cambios (solo APIs)
├── stores/               <-- Sin cambios (estado global)
├── views/                <-- Simplificados (solo UI)
├── App.vue
└── main.ts
```

### Responsabilidades separadas:

- **stores/**: Estado global y persistencia (Pinia)
- **services/**: Llamadas a APIs externas
- **composable/**: Lógica de negocio reutilizable
- **views/**: Solo renderizado de UI e interacción
