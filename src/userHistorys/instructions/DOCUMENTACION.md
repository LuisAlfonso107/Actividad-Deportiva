# Documentación del proyecto – Actividad Deportiva (KABOOMFOT)

## Descripción general

Aplicación web para consultar datos de fútbol: jugadores, búsqueda, análisis de jugadores, favoritos, clasificación de La Liga 2, plantilla/fichajes por equipo, noticias y mercado. Incluye **autenticación** (login/registro), **perfil de usuario** y **favoritos** persistidos en un backend local (json-server). Utiliza **football-data.org**, **TheSportsDB** y, opcionalmente, **ScrapingBee** para noticias RSS.

---

## Tecnologías

- **Vue 3** (Composition API, `<script setup>`)
- **Vue Router 5** – rutas, navegación y guardas de autenticación
- **Pinia** – estado global (auth, favoritos, errores de API)
- **TypeScript**
- **Vite 7** – build y servidor de desarrollo
- **Vitest** – tests unitarios
- **json-server** – API local para usuarios y favoritos (desarrollo)

---

## Estructura del proyecto

```
src/
├── main.ts                    # Entrada (Vue + Pinia + Router)
├── App.vue                    # Layout: cabecera, navegación, alertas, modal registro
├── router/index.ts            # Rutas y guarda requiresAuth
├── services/
│   ├── footballApi.ts        # football-data.org (personas, plantilla, standings)
│   ├── playersApi.ts          # TheSportsDB – jugadores / búsqueda
│   ├── standingsApi.ts        # TheSportsDB – clasificación La Liga 2
│   ├── transfersApi.ts       # TheSportsDB – plantilla/fichajes por equipo
│   ├── favoritesApi.ts        # json-server – favoritos del usuario
│   ├── newsApiFootballScrapingBee.ts  # RSS (Marca, AS) + ScrapingBee opcional
│   └── types.ts               # Tipos compartidos
├── stores/
│   ├── auth.ts                # Login, registro, usuario actual (localStorage + json-server)
│   ├── apiError.ts            # Mensajes globales de error de API
│   ├── favorites.ts           # Lista de jugadores favoritos (Pinia + favoritesApi)
│   └── counter.ts
├── composables/
│   ├── useSearchPlayers.ts    # Búsqueda de jugadores (footballApi + TheSportsDB)
│   ├── useAuthForm.ts         # Formulario de login
│   ├── useProfileForm.ts      # Formulario de perfil
│   ├── useRegisterForm.ts     # Formulario de registro
│   ├── useRegisterAlert.ts    # Modal “Únete a KABOOMFOT”
│   └── useUiFeedback.ts       # Feedback de UI
├── views/
│   ├── HomeView.vue           # Inicio: búsqueda, lista, favoritos
│   ├── PlayersView.vue        # Catálogo de jugadores
│   ├── PlayerView.vue         # Redirección / resumen jugador
│   ├── PlayerAnalysisView.vue # Ficha de análisis del jugador
│   ├── FavoritesView.vue      # Lista de favoritos (requiere auth)
│   ├── MarketView.vue         # Mercado
│   ├── NewsView.vue           # Noticias (RSS + fallback)
│   ├── LaLiga2StandingsView.vue  # Clasificación La Liga 2
│   ├── TeamTransfersView.vue  # Plantilla / fichajes de un equipo
│   ├── ProfileView.vue        # Perfil de usuario (requiere auth)
│   ├── SettingsView.vue       # Configuración (requiere auth)
│   ├── AboutView.vue          # Acerca de KABOOMFOT
│   ├── LoginView.vue          # Inicio de sesión
│   └── RegisterView.vue       # Registro
├── components/                # Componentes reutilizables (AppFooter, iconos, etc.)
├── assets/                    # CSS, imágenes, fuentes
└── server/
    └── db.json                # Datos para json-server (users, favorites)
```

---

## Rutas y pantallas

| Ruta | Nombre | Descripción |
|------|--------|-------------|
| `/` | Inicio | Búsqueda, lista de jugadores, favoritos. Combina football-data.org y TheSportsDB. |
| `/players` | Jugadores | Catálogo de jugadores. |
| `/player/:id` | Jugador | Redirección o resumen del jugador. |
| `/player/:id/analysis` | Análisis de jugador | Ficha del jugador: foto, datos, club. football-data.org y TheSportsDB. |
| `/favorites` | Favoritos | Lista de jugadores favoritos (requiere login). |
| `/market` | Mercado | Vista de mercado. |
| `/news` | Noticias | Titulares de fútbol (RSS Marca/AS; opcional ScrapingBee). |
| `/laliga2` | Clasificación La Liga 2 | Tabla Segunda División. Clic en equipo → plantilla. |
| `/team/:id/transfers` | Fichajes del equipo | Plantilla con foto y tipo de fichaje. Enlace a ficha del jugador. |
| `/profile` | Perfil | Datos del usuario (requiere login). |
| `/settings` | Configuración | Ajustes (requiere login). Alias: `/config`. |
| `/about` | Acerca de | Información sobre KABOOMFOT. |
| `/login` | Login | Inicio de sesión. |
| `/register` | Registro | Alta de usuario. |

Las rutas con **meta: { requiresAuth: true }** redirigen a `/login` si el usuario no está autenticado.

---

## APIs y datos

### 1. football-data.org (API v4)

- **Uso**: personas por ID, plantilla de respaldo, posibles standings.
- **Autenticación**: cabecera `X-Auth-Token`.
- **Variables de entorno**: `VITE_FOOTBALL_API_KEY`, `VITE_FOOTBALL_DATA_TOKEN`, `VITE_FOOTBALL_API_KEY_2`.
- **Proxy en desarrollo**: `/api/footballdata` → `https://api.football-data.org`.

### 2. TheSportsDB (API v1)

- **Uso**: jugadores, búsqueda, clasificación La Liga 2, plantilla/fichajes por equipo.
- **Autenticación**: clave en la URL (por defecto `123`, plan gratuito).
- **Variable de entorno**: `VITE_THESPORTSDB_API_KEY`.
- **Proxy en desarrollo**: `/api/thesportsdb` → `https://www.thesportsdb.com/api/v1/json`.

### 3. Noticias (RSS + ScrapingBee)

- **Uso**: titulares de fútbol en la vista Noticias.
- **Fuentes**: RSS de Marca y AS; si fallan, se usa ScrapingBee (opcional).
- **Variable de entorno**: `VITE_SCRAPINGBEE_API_KEY` (opcional).
- Sin clave se usan feeds RSS directos o lista de fallback.

### 4. json-server (desarrollo)

- **Uso**: usuarios (login/registro) y lista de favoritos.
- **URL**: `http://localhost:3000` (ver `server/db.json`).
- **Comando**: `npm run server` (o `npx json-server --watch src/server/db.json --port 3000`).

---

## Configuración (.env)

Variables usadas (copiar desde `.env.example` o crear `.env` en la raíz):

```env
# football-data.org (una o varias)
VITE_FOOTBALL_API_KEY=tu-token-1
VITE_FOOTBALL_DATA_TOKEN=tu-token-alternativo
VITE_FOOTBALL_API_KEY_2=tu-token-2

# TheSportsDB (clave gratuita: 123)
VITE_THESPORTSDB_API_KEY=123

# ScrapingBee (opcional, para noticias cuando RSS falla)
VITE_SCRAPINGBEE_API_KEY=tu-clave
```

Otras declaradas en `env.d.ts` (para tipado): `VITE_APIFOOTBALL_KEY`, `VITE_SPORTMONKS_API_TOKEN`, `VITE_NEWSDATA_API_KEY`.  
Tras cambiar `.env`, reiniciar el servidor de desarrollo.

---

## Cómo funciona cada parte

### Inicio (Home)

- Lista de jugadores (TheSportsDB / football-data.org como respaldo).
- Búsqueda combinada (football-data.org + TheSportsDB).
- Favoritos con Pinia y, si se usa backend, `favoritesApi` (json-server).
- Placeholder de foto con iniciales cuando no hay imagen.

### Jugadores y análisis

- **Players**: catálogo de jugadores.
- **Player / Análisis**: se intenta football-data.org (`/persons/:id`) y luego TheSportsDB (`lookupplayer.php`) para soportar IDs de ambas APIs.

### Favoritos y perfil

- Favoritos: store Pinia + opcionalmente `favoritesApi` contra json-server.
- Perfil y configuración: solo accesibles con login; datos de usuario desde store auth (persistencia en localStorage y/o json-server).

### Clasificación La Liga 2

- Tabla desde TheSportsDB (liga 4400, temporada 2025-2026).
- Clic en equipo → `/team/:id/transfers` con ID de TheSportsDB.

### Plantilla / fichajes del equipo

- TheSportsDB (`lookup_all_players.php`).
- Jugadores con foto (o iniciales), nombre y tipo de fichaje; enlace a ficha de análisis.

### Noticias

- Se intenta obtener RSS de Marca/AS; si falla y existe `VITE_SCRAPINGBEE_API_KEY`, se usa ScrapingBee.
- Si todo falla, se muestra una lista de fallback para que la página siga funcionando.

### Autenticación

- Login y registro contra json-server (`/users`).
- Guarda de rutas: rutas con `meta.requiresAuth` redirigen a `/login` con `redirect` en query.

---

## Comandos

```bash
# Instalar dependencias
npm install

# Servidor de desarrollo (proxy para APIs)
npm run dev

# API local (usuarios + favoritos) en otro terminal
npm run server

# Compilar para producción
npm run build

# Vista previa del build
npm run preview

# Comprobar tipos TypeScript
npm run type-check

# Tests unitarios (Vitest)
npm run test:unit
```

---

## Generar PDF de esta documentación

1. Abrir en el navegador el archivo `documentacion.html` (si existe en la raíz).
2. Menú del navegador: **Archivo → Imprimir** (o Ctrl/Cmd + P).
3. Elegir **Guardar como PDF** como destino.

---

## Resumen de flujos

- **Clasificación**: La Liga 2 → tabla por temporada → clic en equipo → plantilla/fichajes.
- **Jugador**: desde Inicio, Jugadores o plantilla → ficha de análisis (football-data.org + TheSportsDB).
- **Favoritos**: marcar en Inicio/Jugadores; ver lista en Favoritos (con login).
- **Noticias**: RSS o ScrapingBee; fallback si fallan.
- **Límites de API**: varios tokens de football-data.org en rotación; TheSportsDB con clave gratuita según su documentación.
