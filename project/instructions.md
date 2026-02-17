# Instrucciones Generales del Proyecto

## Stack Tecnológico

- **Framework**: Vue 3 (Composition API)
- **Lenguaje**: JavaScript o TypeScript (TypeScript recomendado)
- **Estado**: Pinia opcional (usar si aporta valor al alcance)
- **Build Tool**: Vite
- **Estilos**: Vanilla CSS (BEM recomendado)
- **Testing**: Jest o Vitest + Vue Test Utils

## Convenciones de Código

- **Idioma del Código**: Todo el código técnico (variables, funciones, comentarios, commits) debe estar en **INGLÉS**.
- **Idioma de la UI**: Toda la interfaz de usuario y mensajes para el usuario deben estar en **ESPAÑOL**.
- **Naming**:
  - Componentes: `PascalCase.vue`
  - Funciones/Variables: `camelCase`
  - CSS: Metodología BEM (ej. `player-card__button--active`)

## Requisitos de Diseño

- **Responsividad**: El sitio debe tener al menos 3 breakpoints (Mobile, Tablet, Desktop).
- **Estética**: Diseño premium, moderno y dinámico (WOW factor).
- **Bocetado**: Prototipos mobile/tablet/desktop exportables a PDF.

## Requisitos Técnicos

- **Ámbito**: Definir el ámbito temático (finanzas, clima, deportes o manga-anime).
- **APIs**: Seleccionar API(s) públicas y verificar uso (registro, API key, límites).
- **Testing**: Mínimo 5 tests unitarios que cubran diferentes contextos.
- **Composables**: Uso obligatorio de al menos un Composable personalizado.
- **Ciclo de Vida**: Uso de hooks de ciclo de vida de Vue (`onMounted`, etc.) y Suspense.
- **API**: Integración con JSON Server (CRUD completo: GET, POST, PUT, DELETE).
- **Router**: Configurar router y crear views principales.
- **Componentes**: Modularización con componentes reutilizables (Atomic Web Design).
- **Naming**: Naming en inglés y convenciones (BEM recomendado para CSS).
- **Git**: Ramas mínimas: main, develop, feature/*.

## Reuniones y Cadencia

- **Daily**: Diario.
- **PO/Cliente**: Reunión cada 2 días.
- **Sprint Review**: Demo ~45 min + 10 min iniciales en inglés.
- **Sprint Retro**: Usar el kanban como base.

## Entregables

- Repositorio en GitHub con ramas y commits.
- Build de producción generado.
- Código fuente, prototipos exportados (PDF) y presentación de sprint review.

## Estado de Requisitos (Revisión 2026-02-13)

- [ ] **Responsividad**: 3 breakpoints definidos y verificados.
- [ ] **Estética**: Estilo premium y dinámico validado.
- [ ] **Testing**: 5+ tests unitarios (actual: 1).
- [ ] **Composables**: Al menos 1 composable en `src/composables/`.
- [x] **Ciclo de Vida**: Uso de `onMounted` en vistas principales.
- [ ] **API JSON Server**: CRUD y `server/db.json` configurados.
- [ ] **Bocetado**: Prototipos PDF mobile/tablet/desktop.
- [ ] **Router**: Views principales definidas.
- [ ] **Atomic**: Componentes reutilizables según Atomic.
- [ ] **Git**: Ramas main/develop/feature/* definidas.
