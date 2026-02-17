# Página de Ojeadores Deportivos (Instrucciones Técnicas)

## Funcionalidad Principal

Permitir que ojeadores deportivos profesionales gestionen su cartera de talento de forma eficiente.

## Requisitos Específicos

1. **Catálogo de Jugadores**:
   - Visualización dinámica desde la API (`GET /players`).
   - Filtros por posición, edad y equipo.
2. **Gestión de Favoritos (CRUD)**:
   - Los ojeadores pueden añadir/eliminar jugadores de sus favoritos.
   - Usar `localStorage` para persistencia local inmediata.
   - Sincronizar con el store de Pinia `useScoutStore`.
3. **Contacto y Contratación**:
   - Botón de "Contactar" que abre un modal con formulario.
   - Validación de campos obligatorios.
   - Envío simulado (POST a `/proposals` o log en consola).

## Componentes Vue Sugeridos

- `PlayerCard.vue`: Tarjeta individual con acciones de favoritos y contacto.
- `ScoutFilter.vue`: Controles de filtrado y búsqueda.
- `FavoritesList.vue`: Vista simplificada de los jugadores guardados.
- `ContactModal.vue`: Formulario de interacción con el jugador.

## Composable Requerido

- `usePlayers.ts`: Lógica para fetching de datos y filtrado.
- `useFavorites.ts`: Lógica para gestionar la lista de favoritos en store y storage.
