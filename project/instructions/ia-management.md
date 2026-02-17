# Guía de Manejo de IA (Paso a Paso)

Para asegurar que el proyecto se mantenga organizado y siga los estándares de calidad, todo Agente de IA debe seguir este flujo:

## Paso 1: Planificación (PLANNING)

1. **Analizar**: Revisar los archivos en `project/instructions/` antes de tocar el código.
2. **Consultar Historias**: Ver `project/stories/` para entender las necesidades del usuario final.
3. **Propuesta**: Crear o actualizar el `implementation_plan.md` y solicitar feedback.

## Paso 2: Ejecución (EXECUTION)

1. **Atomicidad**: Realizar cambios pequeños y lógicos.
2. **Consistencia**: Seguir las convenciones de `project/instructions.md` (Inglés en código, BEM en CSS).
3. **Documentación**: Si se crea un nuevo patrón, documentarlo en la carpeta de instrucciones.

## Paso 3: Seguimiento (TRACKING)

1. **Kanban**: Mover las tareas en `project/kanban.md` al estado correspondiente.
2. **Stories**: Registrar las instrucciones realizadas en el apartado correspondiente dentro de `project/stories/`.

## Paso 4: Verificación (VERIFICATION)

1. **Testing**: Crear tests unitarios antes o durante la implementación de la lógica.
2. **Responsividad**: Verificar visualmente (o mediante tests E2E) que se cumplen los 3 breakpoints.
3. **Walkthrough**: Documentar lo realizado en `walkthrough.md`.

---

**CRÍTICO**: No saltarse la fase de planificación ni la actualización del Kanban. La organización es nuestra prioridad.
