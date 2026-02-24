# Workflow de Desarrollo (Git y Branching)

## Estrategia de Branching

Utilizamos **Git Flow simplificado** con las siguientes ramas:

### Ramas Principales

- **`main`**: Código en producción (siempre estable).
- **`premain`**: Rama de integración para desarrollo activo.

### Ramas de Trabajo

- **`feature/[nombre]`**: Para nuevas funcionalidades.
  - Ejemplo: `feature/scouts-favorites`
- **`fix/[nombre]`**: Para correcciones de bugs.
  - Ejemplo: `fix/player-card-layout`
- **`docs/[nombre]`**: Para cambios en documentación.
  - Ejemplo: `docs/update-testing-guide`

## Flujo de Trabajo

### 1. Crear una nueva rama

```bash
# Asegurarse de estar en develop actualizado
git checkout develop
git pull origin develop

# Crear rama de feature
git checkout -b feature/scouts-page
```

### 2. Desarrollo

- Hacer commits pequeños y atómicos.
- Seguir convenciones de commits (ver abajo).

### 3. Antes de hacer Push

```bash
# Ejecutar tests
npm run test:unit

# Verificar tipos TypeScript
npm run type-check

# Formatear código (si hay prettier/eslint)
npm run lint
```

### 4. Push y Pull Request

```bash
git push origin feature/scouts-page
```

- Crear Pull Request en GitHub hacia `develop`.
- Solicitar revisión de código.

### 5. Merge

- Una vez aprobado, hacer **Squash and Merge** para mantener historial limpio.

## Convenciones de Commits

Seguir el formato **Conventional Commits**:

```
<tipo>(<scope>): <descripción>

[cuerpo opcional]
```

### Tipos

- **feat**: Nueva funcionalidad.
- **fix**: Corrección de bug.
- **docs**: Cambios en documentación.
- **style**: Cambios de formato (no afectan lógica).
- **refactor**: Refactorización de código.
- **test**: Añadir o modificar tests.
- **chore**: Tareas de mantenimiento.

### Ejemplos

```bash
git commit -m "feat(scouts): add favorites functionality to PlayerCard"
git commit -m "fix(api): correct endpoint for player details"
git commit -m "docs(readme): update installation instructions"
git commit -m "test(composables): add tests for usePlayers"
```

## Reglas de Oro

- ❌ **Nunca** hacer commit directamente a `main`.
- ✅ Siempre trabajar en ramas de feature.
- ✅ Hacer Pull Request incluso para cambios pequeños (trazabilidad).
- ✅ Resolver conflictos localmente antes de hacer push.
