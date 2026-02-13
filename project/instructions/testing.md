# Guía de Testing del Proyecto

## Filosofía de Testing

- **Test First**: Escribir tests antes o durante el desarrollo, no después.
- **Cobertura Mínima**: Al menos 5 tests unitarios que cubran diferentes contextos de ejecución.
- **Tests Significativos**: Evitar tests triviales; cada test debe validar comportamiento real.

## Herramientas

- **Vitest**: Framework de testing para Vue 3 y TypeScript.
- **Vue Test Utils**: Utilidades para montar y testear componentes Vue.
- **Happy-DOM**: Entorno DOM ligero para tests unitarios.

## Estructura de Tests

```
src/
├── components/
│   ├── PlayerCard.vue
│   └── PlayerCard.spec.ts       # Test del componente
├── composables/
│   ├── usePlayers.ts
│   └── usePlayers.spec.ts       # Test del composable
└── stores/
    ├── scoutStore.ts
    └── scoutStore.spec.ts       # Test del store
```

## Convenciones de Naming

- **Archivos de test**: `[nombre].spec.ts` (mismo directorio que el archivo fuente).
- **Describe blocks**: Usar el nombre del componente/función.
- **Test cases**: Describir el comportamiento esperado en español.

## Ejemplo de Test (Componente)

```typescript
import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import PlayerCard from "./PlayerCard.vue";

describe("PlayerCard", () => {
  it("debería mostrar el nombre del jugador", () => {
    const wrapper = mount(PlayerCard, {
      props: { player: { name: "Cristiano Ronaldo", position: "Delantero" } },
    });
    expect(wrapper.text()).toContain("Cristiano Ronaldo");
  });

  it("debería emitir evento al hacer click en favoritos", async () => {
    const wrapper = mount(PlayerCard, {
      props: { player: { id: 1, name: "Messi" } },
    });
    await wrapper.find('[data-testid="favorite-btn"]').trigger("click");
    expect(wrapper.emitted("addToFavorites")).toBeTruthy();
  });
});
```

## Ejemplo de Test (Composable)

```typescript
import { describe, it, expect } from "vitest";
import { usePlayers } from "./usePlayers";

describe("usePlayers", () => {
  it("debería filtrar jugadores por posición", () => {
    const { filterByPosition } = usePlayers();
    const players = [
      { id: 1, name: "Player 1", position: "Delantero" },
      { id: 2, name: "Player 2", position: "Defensa" },
    ];
    const result = filterByPosition(players, "Delantero");
    expect(result).toHaveLength(1);
    expect(result[0].name).toBe("Player 1");
  });
});
```

## Comandos

```bash
# Ejecutar todos los tests
npm run test:unit

# Ejecutar tests en modo watch
npm run test:unit -- --watch

# Ejecutar tests con cobertura
npm run test:unit -- --coverage
```

## Criterios de Aceptación

- ✅ Todos los tests deben pasar antes de hacer commit.
- ✅ Nuevas funcionalidades deben incluir tests.
- ✅ Los componentes críticos (PlayerCard, ScoutStore) deben tener >80% de cobertura.
