# Instrucciones Generales del Proyecto

## Stack Tecnológico

- **Framework**: Vue 3 (Composition API)
- **Lenguaje**: TypeScript
- **Estado**: Pinia
- **Build Tool**: Vite
- **Estilos**: Vanilla CSS (BEM recomendado)
- **Testing**: Vitest + Vue Test Utils

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

## Requisitos Técnicos

- **Testing**: Mínimo 5 tests unitarios que cubran diferentes contextos.
- **Composables**: Uso obligatorio de al menos un Composable personalizado.
- **Ciclo de Vida**: Uso de hooks de ciclo de vida de Vue (`onMounted`, etc.).
- **API**: Integración con JSON Server (CRUD completo).
