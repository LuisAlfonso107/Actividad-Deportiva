# Diferencia entre `composable` y `stores`

En este proyecto (Vue 3 + Pinia), ambas carpetas ayudan a organizar lógica, pero tienen objetivos distintos:

## `src/composable/`
- Aquí van funciones reutilizables de Vue (normalmente con prefijo `use...`) para lógica de interfaz o flujos concretos.
- Suelen manejar:
  - validaciones de formularios,
  - estados locales de una vista,
  - acciones específicas de una pantalla.
- Se pueden crear nuevas instancias cada vez que se usan.
- Ejemplos en tu proyecto:
  - `useAuthForm.ts`: lógica del formulario de login (campos, validación, submit).
  - `useRegisterForm.ts`: lógica del formulario de registro.
  - `useProfileForm.ts`: edición y guardado del perfil.
  - `useSearchPlayers.ts`: lógica de búsqueda de jugadores.

## `src/stores/`
- Aquí va el estado global compartido de la app usando Pinia.
- Sirve para datos que varias vistas/componentes necesitan al mismo tiempo.
- Normalmente centraliza:
  - estado global (`loading`, `error`, usuario, listas, favoritos),
  - acciones de negocio y sincronización con APIs,
  - persistencia o coordinación entre páginas.
- Ejemplos en tu proyecto:
  - `auth.ts`: sesión de usuario y autenticación.
  - `favorites.ts`: jugadores favoritos globales.
  - `lists.ts`: listas personalizadas de jugadores.
  - `toast.ts`: notificaciones globales.
  - `apiError.ts`: control de errores de API.

## Regla práctica para decidir
- Usa **composable** cuando la lógica pertenece a una funcionalidad concreta de UI o formulario.
- Usa **store** cuando el dato/estado debe vivir globalmente y compartirse entre varias pantallas.

## Resumen corto
- `composable` = lógica reutilizable local/funcional.
- `store` = estado global compartido + acciones centrales de la app.

---

# Cómo se conecta todo: `router` -> `views` -> `composables` -> `stores` -> `App.vue`

## 1) `src/router/index.ts` decide qué vista renderizar
- El router define rutas como `/`, `/favorites`, `/laliga2`, etc.
- Cada ruta apunta a un componente de `src/views/` (por ejemplo `HomeView.vue`, `FavoritesView.vue`).
- Cuando cambias de URL, Vue Router carga la vista correspondiente.

## 2) `App.vue` es el contenedor principal
- `App.vue` contiene `<RouterView />`, que es el “hueco” donde aparece la vista activa.
- También contiene layout global (header, navegación, footer, modales globales).
- Por eso:
  - `router` decide la vista.
  - `App.vue` la muestra dentro de `<RouterView />`.

## 3) La `view` usa `composables` para lógica reutilizable de pantalla
- Una vista puede importar composables para no mezclar toda la lógica en el `.vue`.
- Ejemplo:
  - `LoginView` puede usar `useAuthForm.ts`.
  - `ProfileView` puede usar `useProfileForm.ts`.
  - Componentes globales pueden usar `useRegisterAlert.ts`.
- El composable maneja estado local de esa funcionalidad (inputs, validaciones, acciones de UI).

## 4) El composable y/o la view usan `stores` para estado global
- Dentro del composable (o directamente en la vista), se llama al store con Pinia:
  - `useAuthStore()`
  - `useFavoritesStore()`
  - `useListsStore()`
- El store conserva estado compartido entre pantallas y centraliza acciones de negocio.
- Resultado: cambias algo en un store y lo ven todas las vistas que dependen de ese store.

## 5) El store habla con `services` (APIs)
- Los stores suelen llamar a archivos de `src/services/` para fetch a APIs o json-server.
- Flujo típico:
  1. View dispara acción (botón/carga).
  2. Composable procesa lógica de UI.
  3. Store ejecuta acción global.
  4. Service llama API.
  5. Store actualiza estado reactivo.
  6. View se re-renderiza automáticamente.

## Relación concreta en el proyecto
- `App.vue`:
  - usa `useRegisterAlert` (composable),
  - usa stores globales (`auth`, `favorites`, `toast`, `apiError`),
  - renderiza la vista activa con `<RouterView />`.
- `views/*`:
  - son pantallas por ruta.
  - consumen composables y/o stores según la necesidad.
- `composable/*`:
  - encapsulan lógica de formulario, alertas, búsqueda, etc.
- `stores/*`:
  - guardan estado global y acciones compartidas.
- `router/index.ts`:
  - conecta URL <-> vista y, por tanto, activa todo el flujo.

## Mapa mental rápido
- URL cambia -> `router/index.ts`
- `App.vue` muestra vista en `<RouterView />`
- Vista usa composable
- Composable usa store
- Store usa service/API
- Estado cambia -> UI se actualiza en vista y también en cualquier componente global de `App.vue`
