# US-004 - Vista "Mi Lista" - Gestión de listas personalizadas de jugadores

**Como** usuario autenticado  
**Quiero** tener una vista exclusiva llamada "Mi Lista" donde pueda crear listas personalizadas, nombrarlas y agregar jugadores a ellas  
**Para** organizar mis jugadores favoritos o de interés de forma estructurada y consultarlos fácilmente

## Criterios de aceptación

### Escenario 1: Acceso restringido a la vista "Mi Lista"

```gherkin
Dado que el usuario está autenticado
Cuando navega a /mi-lista
Entonces ve la pantalla principal con sus listas existentes (en formato de tarjetas)
Y si no está autenticado, es redirigido a /login
```

### Escenario 2: Vista inicial sin listas creadas

```gherkin
Dado que el usuario accede a /mi-lista y no tiene listas creadas
Entonces ve un mensaje o placeholder: "Aún no tienes listas. ¡Crea tu primera lista!"
Y un botón destacado "Crear nueva lista"
```

### Escenario 3: Creación de una nueva lista

```gherkin
Dado que el usuario está en /mi-lista
Cuando presiona "Crear nueva lista", ingresa un nombre (mínimo 3 caracteres) y confirma
Entonces se realiza un POST a /lists
Con body: { "userId": currentUserId, "name": "Mi lista NBA", "players": [] }
Y la nueva lista aparece inmediatamente como tarjeta en la vista
```

### Escenario 4: Agregar jugadores a una lista existente

```gherkin
Dado que el usuario tiene una lista "Mi lista NBA" con 2 jugadores
Cuando busca un jugador (ej: "LeBron James") y presiona "Agregar a lista"
Entonces se realiza un PUT a /lists/{listId}
Con body: { "players": [existingPlayers, newPlayerId] }
Y el jugador aparece inmediatamente en la lista correspondiente
```

### Escenario 5: Eliminar una lista

```gherkin
Dado que el usuario tiene una lista "Mi lista NBA"
Cuando presiona el botón de eliminar en la tarjeta de la lista
Entonces se muestra un modal de confirmación
Y al confirmar, se realiza un DELETE a /lists/{listId}
Y la lista desaparece de la vista
```

### Escenario 6: Eliminar un jugador de una lista

```gherkin
Dado que el usuario tiene una lista "Mi lista NBA" con "LeBron James"
Cuando presiona el botón de eliminar en el jugador de la lista
Entonces se muestra un modal de confirmación
Y al confirmar, se realiza un PUT a /lists/{listId}
Con body: { "players": [remainingPlayers] }
Y el jugador desaparece de la lista
```

### Escenario 7: Evitar duplicados en la misma lista

```gherkin
Dado que un jugador ya está en la lista
Cuando se intenta agregar de nuevo
Entonces se muestra mensaje "Este jugador ya está en la lista" y no se agrega duplicado
```

## Notas técnicas importantes

### json-server

Colecciones recomendadas en `db.json`:

```json
{
  "users": [...],
  "lists": [
    {
      "id": 1,
      "userId": 5,
      "name": "Favoritos Euroleague",
      "players": [12, 45, 89],
      "createdAt": "2025-03-10T14:30:00Z"
    }
  ],
  "players": [...]
}
```

## Tareas de implementación (Frontend - Vue 3 + Pinia + json-server)

| Código | Descripción de la tarea | Prioridad |
| --- | --- | --- |
| TK-004-01 | Crear componente `MiLista.vue` (vista principal con tarjetas de listas) | Alta |
| TK-004-02 | Definir ruta protegida `/mi-lista` en `router/index.js` con `meta: { requiresAuth: true }` | Alta |
| TK-004-03 | Crear store Pinia `useListsStore` con `state: lists[]`, `actions: fetchLists, createList, addPlayerToList` | Alta |
| TK-004-04 | En `MiLista.vue` -> `onMounted`: llamar a `fetchLists()` del store | Alta |
| TK-004-05 | Renderizar tarjetas con `v-for` de `lists` (nombre + cantidad de jugadores) | Alta |
| TK-004-06 | Botón + modal/simple input para "Crear nueva lista" -> `POST /lists` | Alta |
| TK-004-07 | Al hacer clic en tarjeta -> `router.push(/mi-lista/${list.id})` o mostrar detalle en el mismo componente | Media |
| TK-004-08 | Crear componente `ListaDetalle.vue` o sección dinámica que muestre `players` de la lista | Media |
| TK-004-09 | Implementar lógica para agregar jugador (desde otra vista o botón dentro del detalle) -> `PATCH /lists/:id` | Media |
| TK-004-10 | Manejo de estado vacío + mensajes amigables | Baja |
| TK-004-11 | (Opcional) Botón eliminar lista | Baja |
| TK-004-12 | (Opcional) Editar nombre de lista existente | Baja |
| TK-004-13 | Manejo de errores (`401`, `404`, validaciones básicas) y loading states | Media |
