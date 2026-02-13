# Documentación del proyecto – Actividad Deportiva

## Descripción general

Aplicación web para consultar datos de fútbol: jugadores favoritos, búsqueda, análisis de jugadores, clasificación de La Liga 2 y plantilla/fichajes por equipo. Utiliza **dos APIs** (football-data.org y TheSportsDB) para obtener resultados y reducir límites de uso.

---

## Tecnologías

- **Vue 3** (Composition API, `<script setup>`)
- **Vue Router 5** – rutas y navegación
- **Pinia** – estado global (favoritos, errores de API)
- **TypeScript**
- **Vite 7** – build y servidor de desarrollo

---

## Estructura del proyecto

```
src/
├── main.ts                 # Entrada de la app (Vue + Pinia + Router)
├── App.vue                 # Layout: cabecera, navegación, alertas de API
├── router/index.ts         # Rutas
├── services/
│   ├── footballApi.ts      # football-data.org (jugadores, persona, standings fallback)
│   └── thesportsdb.ts      # TheSportsDB (La Liga 2, plantilla con fotos, búsqueda, jugador)
├── stores/
│   ├── apiError.ts         # Mensajes de error de API
│   ├── favorites.ts        # Jugadores favoritos
│   └── counter.ts
├── views/
│   ├── HomeView.vue        # Inicio: búsqueda, lista de jugadores, favoritos
│   ├── LaLiga2StandingsView.vue  # Clasificación La Liga 2
│   ├── TeamTransfersView.vue     # Plantilla / fichajes de un equipo
│   ├── PlayerAnalysisView.vue    # Ficha del jugador (análisis)
│   └── AboutView.vue       # Acerca de
└── components/             # Componentes reutilizables
```

---

## Rutas y pantallas

| Ruta | Nombre | Descripción |
|------|--------|-------------|
| `/` | Home | Búsqueda de jugadores (mín. 4 caracteres), lista inicial (Barcelona con fotos), favoritos. Combina football-data.org y TheSportsDB. |
| `/player/:id` | Análisis de jugador | Ficha del jugador: foto, datos personales, club. Prueba football-data.org y luego TheSportsDB por ID. |
| `/laliga2` | Clasificación La Liga 2 | Tabla de La Liga 2 (Segunda División), temporada 2025-2026. Al hacer clic en un equipo se va a su plantilla. |
| `/team/:id/transfers` | Fichajes del equipo | Plantilla del equipo con foto y tipo de fichaje. Cada jugador enlaza a su ficha (Análisis). |
| `/about` | Acerca de | Página informativa. |

---

## APIs utilizadas

### 1. football-data.org (API v4)

- **Uso**: plantilla inicial (Barcelona) como respaldo, búsqueda (vacía), lookup de persona por ID, posibles standings si hay token válido.
- **Autenticación**: cabecera `X-Auth-Token`.
- **Tokens**: se pueden configurar dos claves en `.env` para rotar y evitar límites:
  - `VITE_FOOTBALL_API_KEY`
  - `VITE_FOOTBALL_API_KEY_2`
- **Proxy en desarrollo**: `/api/footballdata` → `https://api.football-data.org`.

### 2. TheSportsDB (API v1)

- **Uso**: clasificación La Liga 2, lista de jugadores del Barcelona con fotos, búsqueda de jugadores, lookup de jugador por ID, plantilla/fichajes por equipo.
- **Autenticación**: clave en la URL (ej. `.../123/...`).
- **Variable de entorno**: `VITE_THESPORTSDB_API_KEY` (por defecto 123, plan gratuito).
- **Proxy en desarrollo**: `/api/thesportsdb` → `https://www.thesportsdb.com/api/v1/json`.

---

## Configuración (.env)

Variables necesarias (copiar desde `.env.example` o crear `.env`):

```env
# football-data.org (una o ambas claves)
VITE_FOOTBALL_API_KEY=tu-token-1
VITE_FOOTBALL_API_KEY_2=tu-token-2

# TheSportsDB (clave gratuita: 123)
VITE_THESPORTSDB_API_KEY=123
```

Tras cambiar `.env`, hay que reiniciar el servidor de desarrollo.

---

## Cómo funciona cada parte

### Inicio (Home)

- Al cargar se pide la plantilla de Barcelona con fotos a TheSportsDB; si falla, se usa football-data.org (sin fotos).
- La búsqueda llama a football-data.org y TheSportsDB en paralelo y une resultados.
- Los jugadores sin foto muestran iniciales como placeholder.
- Se pueden marcar jugadores como favoritos (Pinia).

### Clasificación La Liga 2

- Pide la tabla a TheSportsDB (liga 4400, temporada 2025-2026).
- Se muestra el año de temporada como 2026.
- Clic en una fila: navegación a `/team/:id/transfers` con el ID de equipo de TheSportsDB.

### Plantilla / Fichajes del equipo

- Se pide la plantilla con TheSportsDB (`lookup_all_players.php`).
- Se muestra cada jugador con foto (o iniciales), nombre y tipo de fichaje (`strSigning`).
- Clic en el nombre del jugador: va a `/player/:id` (análisis). El ID es de TheSportsDB.

### Análisis del jugador

- Se intenta primero football-data.org (`/persons/:id`).
- Si no hay resultado, se usa TheSportsDB (`lookupplayer.php`).
- Así funcionan tanto IDs de football-data.org como de TheSportsDB (p. ej. desde la plantilla).

---

## Comandos

```bash
# Instalar dependencias
npm install

# Servidor de desarrollo (con proxy para las APIs)
npm run dev

# Compilar para producción
npm run build

# Vista previa de la build
npm run preview

# Tests unitarios
npm test
```

---

## Generar PDF de esta documentación

1. Abrir en el navegador el archivo `documentacion.html` (en la raíz del proyecto).
2. Menú del navegador: **Archivo → Imprimir** (o Ctrl/Cmd + P).
3. Elegir **Guardar como PDF** o **Microsoft Print to PDF** como destino.
4. Guardar el PDF donde quieras.

---

## Resumen de flujos

- **Ver clasificación**: La Liga 2 → tabla por temporada 2025-2026.
- **Ver equipo**: clic en equipo → plantilla con fotos y enlace a cada jugador.
- **Ver jugador**: desde Home (búsqueda/lista/favoritos) o desde plantilla → ficha de análisis.
- **Límites de API**: dos tokens de football-data.org en rotación; TheSportsDB con clave gratuita (límites según su documentación).
