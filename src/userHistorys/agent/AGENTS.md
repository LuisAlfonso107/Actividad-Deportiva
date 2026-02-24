# AGENTS.md - Guía para Agentes de IA (Actividad Deportiva)

## Información del Proyecto

- **Tipo**: Aplicación web frontend con Vue 3 y Vite
- **Stack**: Vue 3 (Composition API), TypeScript, Pinia, Vue Router, CSS Vanilla
- **Build Tool**: Vite
- **Testing**: Vitest + Vue Test Utils

## Comandos de Build/Lint/Test

### Desarrollo

```bash
# Servidor de desarrollo (en carpeta /deportes)
npm run dev

# Verificación de tipos TypeScript
npm run type-check
```

### Build y Deploy

```bash
# Crear build de producción
npm run build

# Preview del build localmente
npm run preview
```

### Testing

```bash
# Ejecutar tests unitarios (Vitest)
npm run test:unit
```

## Estructura del Proyecto (Carpeta /deportes)

```
deportes/
├── src/
│   ├── assets/          # Estilos CSS, imágenes y fuentes
│   ├── components/      # Componentes Vue reutilizables (*.vue)
│   ├── router/          # Configuración de rutas (index.ts)
│   ├── services/        # Lógica de comunicación con el backend
│   ├── stores/          # Gestión de estado global (Pinia)
│   ├── views/           # Vistas principales de la aplicación
│   │   └── OjeadoresView.vue # Nueva página para ojeadores
│   ├── App.vue          # Componente principal
│   └── main.ts          # Inicialización de la app
├── public/              # Archivos estáticos
├── index.html           # Punto de entrada HTML
├── package.json         # Scripts y dependencias
├── tsconfig.json        # Configuración de TypeScript
└── vite.config.ts       # Configuración de Vite
```

## Convenciones de Código

### Nomenclatura

- **Componentes**: `PascalCase` (`PlayerCard.vue`, `ScoutHeader.vue`)
- **Variables/Funciones**: `camelCase` (`getPlayers`, `isFavorite`)
- **Stores**: `use[Name]Store` (`usePlayerStore`)
- **Archivos/Carpetas**: `kebab-case` o `PascalCase` para componentes.

### Vue 3 (Composition API)

- Usar siempre `<script setup lang="ts">`.
- Priorizar el uso de `ref` y `reactive` para la reactividad.
- Definir `props` y `emits` de forma explícita.

### Idioma

- **Código**: Inglés (variables, funciones, lógica).
- **UI/Textos**: Español (mensajes, etiquetas, contenido).

## Funcionalidad de Ojeadores (Requerimiento Actual)

Se debe implementar una sección dedicada a **Ojeadores Deportivos** con las siguientes características:

1.  **Página de Visualización**: Un catálogo de jugadores disponibles para contratación.
2.  **Sistema de Favoritos**:
    - Los ojeadores pueden marcar jugadores como favoritos.
    - Se debe usar un Store de Pinia (`scoutStore.ts`) para gestionar esta lista.
    - Persistencia en `localStorage` para mantener los favoritos tras recargar.
3.  **Contacto**:
    - Botón de "Contactar" en cada jugador o desde la lista de favoritos.
    - Formulario simple para enviar una propuesta de contratación.

## API y Datos (Simulación)

### Jugadores

```typescript
interface Player {
  id: number;
  name: string;
  position: string;
  age: number;
  team: string;
  image: string;
}
```

## Flujo de Trabajo para Agentes

1.  **Exploración**: Revisar `src/views/` para entender las rutas actuales.
2.  **Componentes**: Crear componentes pequeños y reutilizables en `src/components/`.
3.  **Estado**: Usar Pinia para cualquier dato compartido (como los favoritos).
4.  **Estilos**: Seguir la estética premium del proyecto usando CSS Vanilla moderno.

---

**Nota**: Este proyecto está en transición hacia Vue 3. Consulta el directorio `static/` para referencias del diseño original en HTML/CSS si es necesario.
