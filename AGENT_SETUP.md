# 🤖 Configuración para Agentes de IA

> **Punto de entrada rápido**: Este archivo te guía en cómo trabajar con el proyecto "Actividad Deportiva" siguiendo las mejores prácticas establecidas.

---

## 📂 Estructura de Documentación

Toda la documentación del proyecto está organizada en la carpeta `project/`:

```
project/
├── instructions.md              # ⭐ Instrucciones generales (Stack, Convenciones)
├── instructions/
│   ├── ia-management.md         # 🔄 Flujo de trabajo para IA (CRÍTICO)
│   ├── scouts-page.md           # 🎯 Especificaciones de la página de Ojeadores
│   ├── testing.md               # 🧪 Guía de testing (Vitest)
│   ├── workflow.md              # 🌿 Git Flow y convenciones de commits
│   └── api.md                   # 🔌 Endpoints de JSON Server
├── stories/
│   ├── scouts.md                # 📖 Historias de usuario + Log de tareas
│   └── template.md              # 📝 Template para nuevas historias
└── kanban.md                    # 📊 Estado actual del proyecto
```

---

## 🚀 Por Dónde Empezar (Checklist)

### 1️⃣ Contexto General

- [ ] Lee [`AGENTS.md`](file:///home/penascalf5/Escritorio/Actividad-Deportiva/AGENTS.md) para entender el stack (Vue 3 + Pinia + TypeScript).
- [ ] Lee [`project/instructions.md`](file:///home/penascalf5/Escritorio/Actividad-Deportiva/project/instructions.md) para conocer las convenciones de código.

### 2️⃣ Flujo de Trabajo

- [ ] **CRÍTICO**: Lee [`project/instructions/ia-management.md`](file:///home/penascalf5/Escritorio/Actividad-Deportiva/project/instructions/ia-management.md) para seguir el proceso de 4 pasos (Planificación → Ejecución → Seguimiento → Verificación).

### 3️⃣ Tarea Específica

- [ ] Revisa [`project/kanban.md`](file:///home/penascalf5/Escritorio/Actividad-Deportiva/project/kanban.md) para ver qué está pendiente.
- [ ] Consulta las instrucciones temáticas según tu tarea:
  - **Página de Ojeadores**: [`scouts-page.md`](file:///home/penascalf5/Escritorio/Actividad-Deportiva/project/instructions/scouts-page.md)
  - **Testing**: [`testing.md`](file:///home/penascalf5/Escritorio/Actividad-Deportiva/project/instructions/testing.md)
  - **API**: [`api.md`](file:///home/penascalf5/Escritorio/Actividad-Deportiva/project/instructions/api.md)
  - **Git**: [`workflow.md`](file:///home/penascalf5/Escritorio/Actividad-Deportiva/project/instructions/workflow.md)

### 4️⃣ Historias de Usuario

- [ ] Lee [`project/stories/scouts.md`](file:///home/penascalf5/Escritorio/Actividad-Deportiva/project/stories/scouts.md) para entender las necesidades del usuario final.

---

## 🎯 Reglas de Oro

1. **Siempre** seguir el flujo de [`ia-management.md`](file:///home/penascalf5/Escritorio/Actividad-Deportiva/project/instructions/ia-management.md):
   - ✅ Planificar antes de codificar
   - ✅ Actualizar el Kanban
   - ✅ Crear tests
   - ✅ Documentar cambios

2. **Código en INGLÉS**, UI en ESPAÑOL (ver [`instructions.md`](file:///home/penascalf5/Escritorio/Actividad-Deportiva/project/instructions.md)).

3. **No saltarse el testing** (mínimo 5 tests unitarios).

4. **Actualizar el log** en [`project/stories/scouts.md`](file:///home/penascalf5/Escritorio/Actividad-Deportiva/project/stories/scouts.md) después de cada tarea completada.

---

## 📌 Quick Reference

| Necesito...                     | Archivo                                 |
| ------------------------------- | --------------------------------------- |
| Ver qué hacer                   | `project/kanban.md`                     |
| Entender el flujo de trabajo IA | `project/instructions/ia-management.md` |
| Saber cómo testear              | `project/instructions/testing.md`       |
| Ver endpoints de la API         | `project/instructions/api.md`           |
| Crear una historia de usuario   | `project/stories/template.md`           |
| Convenciones de código          | `project/instructions.md`               |

---

**¿Primera vez aquí?** → Empieza por [`project/instructions/ia-management.md`](file:///home/penascalf5/Escritorio/Actividad-Deportiva/project/instructions/ia-management.md) 🚀
