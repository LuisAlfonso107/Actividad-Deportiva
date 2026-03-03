<script setup lang="ts">
import { RouterLink } from 'vue-router';
</script>

<template>
  <div class="font-body bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 min-h-screen">
    <!-- Hero -->
    <section class="hero-gradient py-16 px-4 text-center text-white">
      <div class="max-w-4xl mx-auto">
        <span class="inline-block bg-emerald-500/30 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-4">
          Sobre la plataforma
        </span>
        <h1 class="text-4xl md:text-6xl font-display font-black mb-4 tracking-tight">
          SOBRE <span class="text-primary">NOSOTROS</span>
        </h1>
        <p class="text-xl text-slate-300 max-w-2xl mx-auto font-light">
          Plataforma de scouting y fútbol centrada en jugadores, clasificación y mercado, con foco en LaLiga 2.
        </p>
      
      </div>
    </section>

    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
      <!-- Qué hacemos -->
      <section class="mb-20">
        <p class="text-white/90 text-lg md:text-xl mt-8 font-bold tracking-wide">
          Este proyecto ha sido creado con <span class="text-white font-black">Achraf RZZ</span>, <span class="text-white font-black">Luis Alfonso</span> y <span class="text-white font-black">JEREMI</span>
        </p>
        <h2 class="text-2xl md:text-3xl font-display font-black uppercase tracking-tight mb-8 text-slate-900 dark:text-white text-center">
          Qué hacemos
        </h2>
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
          <div class="bg-white dark:bg-slate-900 rounded-2xl p-6 md:p-8 border border-slate-200 dark:border-slate-800 shadow-sm">
            <div class="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center mb-6">
              <span class="material-symbols-rounded text-primary text-3xl">sports_soccer</span>
            </div>
            
            <h3 class="text-xl font-bold text-slate-900 dark:text-white mb-3">Actividad principal</h3>
            <p class="text-slate-600 dark:text-slate-300 leading-relaxed">
              La aplicación es una plataforma de scouting y consulta de fútbol: búsqueda y análisis de jugadores,
              clasificación de LaLiga 2, plantillas y fichajes por equipo, noticias y mercado. Pensada para ojeadores,
              aficionados y usuarios que quieran seguir jugadores y equipos de Segunda División y contexto español.
            </p>
          
          </div>
          <div class="bg-white dark:bg-slate-900 rounded-2xl p-6 md:p-8 border border-slate-200 dark:border-slate-800 shadow-sm">
            <div class="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center mb-6">
              <span class="material-symbols-rounded text-primary text-3xl">insights</span>
            </div>
            <h3 class="text-xl font-bold text-slate-900 dark:text-white mb-3">Funcionalidades</h3>
            <ul class="text-slate-600 dark:text-slate-300 space-y-2">
              <li class="flex items-center gap-2">
                <span class="material-symbols-rounded text-primary text-lg">check_circle</span>
                Búsqueda y ficha de jugadores (TheSportsDB, football-data.org)
              </li>
              <li class="flex items-center gap-2">
                <span class="material-symbols-rounded text-primary text-lg">check_circle</span>
                Clasificación LaLiga 2 y enlace a plantilla/fichajes por equipo
              </li>
              <li class="flex items-center gap-2">
                <span class="material-symbols-rounded text-primary text-lg">check_circle</span>
                Favoritos y listas personalizadas (backend local json-server)
              </li>
              <li class="flex items-center gap-2">
                <span class="material-symbols-rounded text-primary text-lg">check_circle</span>
                Noticias de fútbol vía RSS y ScrapingBee
              </li>
            </ul>
          </div>
        </div>
      </section>

      <!-- Tecnologías del proyecto -->
      <section class="mb-20">
        <h2 class="text-2xl md:text-3xl font-display font-black uppercase tracking-tight mb-8 text-slate-900 dark:text-white">
          Tecnologías del proyecto
        </h2>
        <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          <div class="bg-white dark:bg-slate-900 rounded-xl p-4 border border-slate-200 dark:border-slate-800 text-center">
            <span class="material-symbols-rounded text-4xl text-primary mb-2 block">code</span>
            <span class="font-bold text-slate-900 dark:text-white text-sm">Vue 3</span>
          </div>
          <div class="bg-white dark:bg-slate-900 rounded-xl p-4 border border-slate-200 dark:border-slate-800 text-center">
            <span class="material-symbols-rounded text-4xl text-primary mb-2 block">bolt</span>
            <span class="font-bold text-slate-900 dark:text-white text-sm">Vite</span>
          </div>
          <div class="bg-white dark:bg-slate-900 rounded-xl p-4 border border-slate-200 dark:border-slate-800 text-center">
            <span class="material-symbols-rounded text-4xl text-primary mb-2 block">terminal</span>
            <span class="font-bold text-slate-900 dark:text-white text-sm">TypeScript</span>
          </div>
          <div class="bg-white dark:bg-slate-900 rounded-xl p-4 border border-slate-200 dark:border-slate-800 text-center">
            <span class="material-symbols-rounded text-4xl text-primary mb-2 block">inventory_2</span>
            <span class="font-bold text-slate-900 dark:text-white text-sm">Pinia</span>
          </div>
          <div class="bg-white dark:bg-slate-900 rounded-xl p-4 border border-slate-200 dark:border-slate-800 text-center col-span-2 sm:col-span-1">
            <span class="material-symbols-rounded text-4xl text-primary mb-2 block">route</span>
            <span class="font-bold text-slate-900 dark:text-white text-sm">Vue Router</span>
          </div>
        </div>
      </section>

      <!-- Dependencias clave -->
      <section class="mb-20">
        <h2 class="text-2xl md:text-3xl font-display font-black uppercase tracking-tight mb-8 text-slate-900 dark:text-white">
          Dependencias clave
        </h2>
        <div class="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
          <ul class="divide-y divide-slate-200 dark:divide-slate-800">
            <li class="px-6 py-4 flex items-center gap-3">
              <span class="material-symbols-rounded text-primary">extension</span>
              <span><code class="bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded text-sm">@vitejs/plugin-vue</code> — compilación Vue en Vite</span>
            </li>
            <li class="px-6 py-4 flex items-center gap-3">
              <span class="material-symbols-rounded text-primary">extension</span>
              <span><code class="bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded text-sm">@vitejs/plugin-vue-jsx</code> — soporte JSX en Vue</span>
            </li>
            <li class="px-6 py-4 flex items-center gap-3">
              <span class="material-symbols-rounded text-primary">bug_report</span>
              <span><code class="bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded text-sm">vite-plugin-vue-devtools</code> — herramientas de desarrollo</span>
            </li>
            <li class="px-6 py-4 flex items-center gap-3">
              <span class="material-symbols-rounded text-primary">science</span>
              <span><code class="bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded text-sm">vitest</code>, <code class="bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded text-sm">@vue/test-utils</code>, <code class="bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded text-sm">jsdom</code> — tests unitarios</span>
            </li>
            <li class="px-6 py-4 flex items-center gap-3">
              <span class="material-symbols-rounded text-primary">storage</span>
              <span><code class="bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded text-sm">json-server</code> — API REST local (usuarios, favoritos, listas)</span>
            </li>
            <li class="px-6 py-4 flex items-center gap-3">
              <span class="material-symbols-rounded text-primary">hub</span>
              <span><code class="bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded text-sm">npm-run-all2</code> — ejecución de scripts en paralelo (build, type-check)</span>
            </li>
          </ul>
        </div>
      </section>

      <!-- APIs y servicios -->
      <section class="mb-20">
        <h2 class="text-2xl md:text-3xl font-display font-black uppercase tracking-tight mb-8 text-slate-900 dark:text-white">
          APIs y servicios
        </h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div class="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
            <div class="flex items-center gap-3 mb-4">
              <div class="w-12 h-12 bg-emerald-500/20 rounded-xl flex items-center justify-center">
                <span class="material-symbols-rounded text-primary text-2xl">sports</span>
              </div>
              <h3 class="font-bold text-lg text-slate-900 dark:text-white">TheSportsDB</h3>
            </div>
            <p class="text-slate-600 dark:text-slate-300 text-sm mb-3">
              Base: <code class="bg-slate-100 dark:bg-slate-800 px-1 rounded text-xs break-all">thesportsdb.com/api/v1/json</code>
            </p>
            <p class="text-slate-500 dark:text-slate-400 text-sm mb-2">Endpoints: <code class="text-xs">searchplayers.php</code>, <code class="text-xs">lookup_all_players.php</code>, <code class="text-xs">lookupplayer.php</code>, <code class="text-xs">lookuptable.php</code></p>
            <p class="text-slate-500 dark:text-slate-400 text-sm">Uso: jugadores, plantillas, clasificación, transferencias simuladas.</p>
          </div>
          <div class="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
            <div class="flex items-center gap-3 mb-4">
              <div class="w-12 h-12 bg-emerald-500/20 rounded-xl flex items-center justify-center">
                <span class="material-symbols-rounded text-primary text-2xl">person</span>
              </div>
              <h3 class="font-bold text-lg text-slate-900 dark:text-white">football-data.org</h3>
            </div>
            <p class="text-slate-600 dark:text-slate-300 text-sm mb-3">
              Base: <code class="bg-slate-100 dark:bg-slate-800 px-1 rounded text-xs break-all">api.football-data.org/v4</code>
            </p>
            <p class="text-slate-500 dark:text-slate-400 text-sm mb-2">Endpoint: <code class="text-xs">/persons/{id}</code></p>
            <p class="text-slate-500 dark:text-slate-400 text-sm">Uso: datos de jugador por ID y compatibilidad con otros flujos.</p>
          </div>
          <div class="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
            <div class="flex items-center gap-3 mb-4">
              <div class="w-12 h-12 bg-emerald-500/20 rounded-xl flex items-center justify-center">
                <span class="material-symbols-rounded text-primary text-2xl">newspaper</span>
              </div>
              <h3 class="font-bold text-lg text-slate-900 dark:text-white">RSS + ScrapingBee</h3>
            </div>
            <p class="text-slate-600 dark:text-slate-300 text-sm mb-3">
              Base: <code class="bg-slate-100 dark:bg-slate-800 px-1 rounded text-xs break-all">app.scrapingbee.com/api/v1</code>
            </p>
            <p class="text-slate-500 dark:text-slate-400 text-sm">Uso: noticias de fútbol desde feeds (Marca, AS) con fallback.</p>
          </div>
          <div class="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm md:col-span-2 lg:col-span-1">
            <div class="flex items-center gap-3 mb-4">
              <div class="w-12 h-12 bg-emerald-500/20 rounded-xl flex items-center justify-center">
                <span class="material-symbols-rounded text-primary text-2xl">dns</span>
              </div>
              <h3 class="font-bold text-lg text-slate-900 dark:text-white">json-server</h3>
            </div>
            <p class="text-slate-600 dark:text-slate-300 text-sm mb-3">
              Base: <code class="bg-slate-100 dark:bg-slate-800 px-1 rounded text-xs">http://localhost:3000</code>
            </p>
            <p class="text-slate-500 dark:text-slate-400 text-sm">Recursos: <code class="text-xs">/users</code>, <code class="text-xs">/favorites</code>, <code class="text-xs">/lists</code> (login, favoritos, listas personalizadas).</p>
          </div>
        </div>
      </section>

      <!-- Variables de entorno -->
      <section class="mb-20">
        <h2 class="text-2xl md:text-3xl font-display font-black uppercase tracking-tight mb-8 text-slate-900 dark:text-white">
          Configuración (.env)
        </h2>
        <p class="text-slate-600 dark:text-slate-300 mb-4">
          Las claves se definen en <code class="bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded">.env</code> y se exponen con prefijo <code class="bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded">VITE_</code>. No se exponen secretos en este documento.
        </p>
        <div class="flex flex-wrap gap-2">
          <span class="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-3 py-1.5 rounded-lg text-sm font-mono">VITE_FOOTBALL_API_KEY</span>
          <span class="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-3 py-1.5 rounded-lg text-sm font-mono">VITE_FOOTBALL_DATA_TOKEN</span>
          <span class="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-3 py-1.5 rounded-lg text-sm font-mono">VITE_FOOTBALL_API_KEY_2</span>
          <span class="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-3 py-1.5 rounded-lg text-sm font-mono">VITE_THESPORTSDB_API_KEY</span>
          <span class="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-3 py-1.5 rounded-lg text-sm font-mono">VITE_SCRAPINGBEE_API_KEY</span>
        </div>
      </section>

      <!-- Arquitectura funcional -->
      <section class="mb-20">
        <h2 class="text-2xl md:text-3xl font-display font-black uppercase tracking-tight mb-8 text-slate-900 dark:text-white">
          Arquitectura funcional
        </h2>
        <div class="bg-white dark:bg-slate-900 rounded-2xl p-6 md:p-8 border border-slate-200 dark:border-slate-800">
          <p class="text-slate-600 dark:text-slate-300 mb-6 leading-relaxed">
            Las <strong>vistas</strong> (Vue SFC en <code class="bg-slate-100 dark:bg-slate-800 px-1 rounded">src/views/</code>) consumen datos a través de <strong>stores Pinia</strong> (<code class="bg-slate-100 dark:bg-slate-800 px-1 rounded">src/stores/</code>) y de funciones en <strong>servicios</strong> (<code class="bg-slate-100 dark:bg-slate-800 px-1 rounded">src/services/</code>). Los servicios hacen las peticiones a las APIs externas y al backend local; los stores centralizan estado (listas, favoritos, auth, errores). Vue Router define las rutas y la navegación. La configuración de entorno (claves API) se lee en los servicios vía <code class="bg-slate-100 dark:bg-slate-800 px-1 rounded">import.meta.env.VITE_*</code>.
          </p>
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
            <div class="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4">
              <span class="font-bold text-primary block mb-2">Vistas</span>
              <span class="text-slate-500 dark:text-slate-400">PlayersView, LaLiga2StandingsView, NewsView, MiListaView, FavoritesView, etc.</span>
            </div>
            <div class="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4">
              <span class="font-bold text-primary block mb-2">Stores</span>
              <span class="text-slate-500 dark:text-slate-400">auth, lists, favorites, apiError, toast</span>
            </div>
            <div class="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4">
              <span class="font-bold text-primary block mb-2">Servicios</span>
              <span class="text-slate-500 dark:text-slate-400">playersApi, standingsApi, footballApi, listsApi, newsApiFootballScrapingBee</span>
            </div>
          </div>
        </div>
      </section>

      <!-- CTA final -->
      <section class="text-center">
        <div class="bg-gradient-to-br from-primary to-emerald-800 rounded-3xl p-10 md:p-16 text-white">
          <h2 class="text-3xl md:text-4xl font-display font-black mb-4">
            Explora jugadores y clasificación
          </h2>
          <p class="text-emerald-100 mb-8 max-w-xl mx-auto">
            Accede al listado de jugadores o a la tabla de LaLiga 2 desde aquí.
          </p>
          <div class="flex flex-col sm:flex-row gap-4 justify-center">
            <RouterLink
              to="/players"
              class="inline-flex items-center justify-center gap-2 bg-white text-secondary font-bold py-3 px-8 rounded-xl hover:bg-slate-100 transition-colors"
            >
              <span class="material-symbols-rounded">group</span>
              Ver jugadores
            </RouterLink>
            <RouterLink
              to="/laliga2"
              class="inline-flex items-center justify-center gap-2 bg-white/20 text-white font-bold py-3 px-8 rounded-xl hover:bg-white/30 transition-colors border border-white/40"
            >
              <span class="material-symbols-rounded">leaderboard</span>
              Clasificación LaLiga 2
            </RouterLink>
          </div>
        </div>
      </section>
    </main>
  </div>
</template>
