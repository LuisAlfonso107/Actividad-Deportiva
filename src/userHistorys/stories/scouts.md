# Historias de Usuario: Ojeadores Deportivos

## Buyer Persona: El Ojeador (The Scout)

Profesional encargado de descubrir talento joven para clubes de élite. Busca rapidez, organización y filtros precisos.

## User Stories

1. **Catálogo de Talento**:
   - _Como ojeador, quiero ver una lista de jugadores disponibles para poder analizar sus perfiles rápidamente._
2. **Favoritos**:
   - _Como ojeador, quiero guardar jugadores interesantes en mis favoritos para no perderlos de vista y contactarlos más tarde._

3. **Contacto Directo**:
   - _Como ojeador, quiero contactar con los representantes del jugador directamente desde la plataforma para iniciar negociaciones de contrato._

## Estado Actual (Revisión 2026-02-13)

- [ ] **Catálogo de Talento**: No implementado.
- [ ] **Favoritos**: No implementado.
- [ ] **Contacto Directo**: No implementado.

## Tareas Técnicas Relacionadas

- [ ] Crear `OjeadoresView.vue` y su ruta.
- [ ] Implementar `useScoutStore.ts` con `localStorage`.
- [ ] Crear composables `usePlayers.ts` y `useFavorites.ts`.
- [ ] Construir componentes `PlayerCard.vue`, `ScoutFilter.vue`, `FavoritesList.vue`, `ContactModal.vue`.
- [ ] Simular `POST /proposals` desde el modal de contacto.
- [ ] Añadir tests unitarios mínimos (5).

## Instrucciones Realizadas (Log)

| Fecha      | Tarea                  | Resultado                                                |
| ---------- | ---------------------- | -------------------------------------------------------- |
| 2026-02-13 | Estructura de Proyecto | Creado directorio `/project` con instrucciones y kanban. |
| 2026-02-13 | AGENTS.md              | Actualizado guía de agentes para Vue 3 y Ojeadores.      |
| 2026-02-13 | Revisión de estado     | Marcadas historias y tareas pendientes.                  |
