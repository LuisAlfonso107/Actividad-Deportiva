# Conexión API: Clasificación y .env (resumen)

## 1. Página de clasificación (La Liga 2)

- **Vista:** `LaLiga2StandingsView.vue` → ruta `/laliga2`.
- **Qué hace:** Muestra la tabla de La Liga 2. Al hacer clic en un equipo, vas a plantilla/fichajes de ese equipo.
- **API:** La vista usa `standingsApi.ts` → función `getLaLigaStandings()` → pide datos a **TheSportsDB**. Los datos se guardan y se muestran en la tabla.
- **¿Se relaciona con Noticias?** No. Clasificación = TheSportsDB. Noticias = ScrapingBee. Son APIs distintas.

## 2. Uso del archivo .env

- Las claves de API se ponen en **`.env`** (en la raíz del proyecto).
- En Vite solo se usan variables que empiezan por **`VITE_`**.
- En el código: `import.meta.env.VITE_NOMBRE` (ej. en `standingsApi.ts`: `VITE_THESPORTSDB_API_KEY`).
- Si la variable falta o está mal, la petición puede fallar.
- **Importante:** Después de cambiar `.env`, reinicia el servidor de desarrollo.

### Tabla rápida

| Página / uso            | Variable en `.env`           | API          |
|-------------------------|------------------------------|--------------|
| Clasificación La Liga 2 | `VITE_THESPORTSDB_API_KEY`   | TheSportsDB  |
| Noticias                | `VITE_SCRAPINGBEE_API_KEY`   | ScrapingBee  |
| Jugadores / fútbol      | `VITE_FOOTBALL_API_KEY`      | api-football |
