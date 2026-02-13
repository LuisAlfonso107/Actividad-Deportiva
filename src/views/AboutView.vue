<template>
  <div class="py-8">
    <!-- Hero Section -->
    <section class="hero-gradient py-16 px-4 text-center text-white">
      <div class="max-w-4xl mx-auto">
        <h1 class="text-4xl md:text-6xl font-display font-black mb-4 tracking-tight">
          ACERCA DE <span class="text-primary">KABOOMFOT</span>
        </h1>
        <p class="text-xl text-slate-300 max-w-2xl mx-auto font-light">
          La plataforma líder en reclutamiento de fútbol en España
        </p>
      </div>
    </section>

    <!-- About Content -->
    <section class="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div>
          <h2 class="text-3xl font-display font-black mb-6 uppercase tracking-tight">
            Conectando <span class="text-primary">Talentos</span>
          </h2>
          <p class="text-lg text-slate-600 dark:text-slate-300 mb-6 leading-relaxed">
            Kaboomfot es la plataforma revolucionaria que está cambiando el modo en que los clubes, 
            agentes y ojeadores descubren nuevos talentos futbolísticos en España.
          </p>
          <p class="text-lg text-slate-600 dark:text-slate-300 mb-8 leading-relaxed">
            Utilizamos tecnología de vanguardia y análisis de datos avanzado para proporcionar 
            información detallada sobre jugadores de La Liga 2 y categorías inferiores, 
            ayudando a tomar decisiones informadas en el proceso de reclutamiento.
          </p>
          <div class="grid grid-cols-2 gap-6">
            <div class="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-lg border border-slate-100 dark:border-slate-800">
              <div class="w-12 h-12 bg-primary rounded-xl flex items-center justify-center mb-4">
                <span class="material-symbols-rounded text-white text-2xl">groups</span>
              </div>
              <h3 class="font-black text-lg mb-2">500+ Jugadores</h3>
              <p class="text-slate-500 text-sm">Analizados y monitorizados</p>
            </div>
            <div class="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-lg border border-slate-100 dark:border-slate-800">
              <div class="w-12 h-12 bg-primary rounded-xl flex items-center justify-center mb-4">
                <span class="material-symbols-rounded text-white text-2xl">business</span>
              </div>
              <h3 class="font-black text-lg mb-2">50+ Clubes</h3>
              <p class="text-slate-500 text-sm">Confían en nuestra plataforma</p>
            </div>
          </div>
        </div>
        <div class="relative">
          <div class="bg-gradient-to-br from-primary to-emerald-800 rounded-3xl p-8 text-white relative overflow-hidden">
            <div class="relative z-10">
              <h3 class="text-2xl font-display font-black mb-6 uppercase">Nuestra Misión</h3>
              <p class="text-lg leading-relaxed mb-6">
                Facilitar el descubrimiento de talentos futbolísticos proporcionando 
                herramientas avanzadas de análisis y una plataforma intuitiva que 
                conecte a todos los actores del mundo del fútbol.
              </p>
              <div class="space-y-4">
                <div class="flex items-center gap-3">
                  <span class="material-symbols-rounded text-primary">check_circle</span>
                  <span class="font-semibold">Análisis de rendimiento en tiempo real</span>
                </div>
                <div class="flex items-center gap-3">
                  <span class="material-symbols-rounded text-primary">check_circle</span>
                  <span class="font-semibold">Base de datos integral de jugadores</span>
                </div>
                <div class="flex items-center gap-3">
                  <span class="material-symbols-rounded text-primary">check_circle</span>
                  <span class="font-semibold">Herramientas de comparación avanzadas</span>
                </div>
              </div>
            </div>
            <div class="absolute -bottom-10 -right-10 opacity-10">
              <span class="material-symbols-rounded text-[200px]">sports_soccer</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Features Section -->
      <div class="mt-20">
        <h2 class="text-3xl font-display font-black mb-12 text-center uppercase tracking-tight">
          Características <span class="text-primary">Principales</span>
        </h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div class="bg-white dark:bg-slate-900 p-8 rounded-3xl shadow-lg border border-slate-100 dark:border-slate-800 text-center">
            <div class="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-6">
              <span class="material-symbols-rounded text-white text-3xl">search</span>
            </div>
            <h3 class="font-black text-xl mb-4">Búsqueda Avanzada</h3>
            <p class="text-slate-600 dark:text-slate-300">
              Encuentra jugadores por posición, edad, estadísticas y más con nuestro potente motor de búsqueda.
            </p>
          </div>
          <div class="bg-white dark:bg-slate-900 p-8 rounded-3xl shadow-lg border border-slate-100 dark:border-slate-800 text-center">
            <div class="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-6">
              <span class="material-symbols-rounded text-white text-3xl">analytics</span>
            </div>
            <h3 class="font-black text-xl mb-4">Análisis Detallado</h3>
            <p class="text-slate-600 dark:text-slate-300">
              Estadísticas completas, métricas de rendimiento y análisis comparativo de jugadores.
            </p>
          </div>
          <div class="bg-white dark:bg-slate-900 p-8 rounded-3xl shadow-lg border border-slate-100 dark:border-slate-800 text-center">
            <div class="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-6">
              <span class="material-symbols-rounded text-white text-3xl">favorite</span>
            </div>
            <h3 class="font-black text-xl mb-4">Favoritos</h3>
            <p class="text-slate-600 dark:text-slate-300">
              Guarda y sigue a tus jugadores favoritos para monitorizar su progreso y rendimiento.
            </p>
          </div>
        </div>
      </div>

      <!-- CTA Section -->
      <div class="mt-20 text-center">
        <div class="bg-gradient-to-br from-primary to-emerald-800 rounded-[3rem] p-12 md:p-20 text-white relative overflow-hidden">
          <div class="relative z-10">
            <h2 class="text-4xl md:text-6xl font-display font-black mb-8 leading-tight">
              ¿Listo para descubrir el próximo talento?
            </h2>
            <p class="text-xl text-emerald-100 mb-12 max-w-2xl mx-auto">
              Únete a la comunidad de profesionales del fútbol que ya están usando Kaboomfot.
            </p>
            <div class="flex flex-col sm:flex-row gap-4 justify-center">
              <RouterLink 
                to="/" 
                class="bg-white text-secondary font-black py-4 px-10 rounded-2xl hover:bg-slate-100 transition-all text-lg shadow-xl inline-block"
              >
                EXPLORAR JUGADORES
              </RouterLink>
              <RouterLink 
                to="/laliga2" 
                class="bg-secondary text-white font-black py-4 px-10 rounded-2xl hover:bg-slate-800 transition-all text-lg shadow-xl inline-block"
              >
                VER CLASIFICACIÓN
              </RouterLink>
            </div>
          </div>
        </div>
      </div>
    </section>
  </main>
</template>
