<script setup lang="ts">
// Componente convertido desde ejemplonoticias.html a Vue 3 SFC.
// Asume que Tailwind y fuentes ya están configuradas en la app.
</script>

<template>
  <div class="font-body text-slate-900 dark:text-slate-100 transition-colors duration-300">
    <!-- NOTA: App.vue ya renderiza header y footer globales. Este componente solo incluye el contenido principal. -->
    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <section class="mb-12">
        <div class="relative rounded-[2rem] overflow-hidden group h-[500px]">
          <img alt="Estadio de fútbol" class="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDTASgKon8Di4AGkjvsMe_YMdQQwdxfi-tBgkvCBQKranXQoQwAmuk-OTbJh5mckEiM69PNlDBW03hBtGVamlQkVVUsinvE8AvmUINkXGOI2EfKnlfH2ilu501qx0uScAIQrbeNgj3jdbN7XazlX23WHbb3_uAIBR-VB7iYdaM7br6t_9kV0TcJr2gQ4UjuQRnoAjwBhi3e83IoeL8WSBEQN6CqproyGod5IVD5dowXd0xqgTw1b6kv79Ng_Gy4b4Ksqz2IZ4b2Yk4"/>
          <div class="absolute inset-0 hero-article-gradient"></div>
          <div class="absolute bottom-0 left-0 p-8 md:p-12 w-full md:w-2/3">
            <span class="inline-block bg-primary text-white text-xs font-black px-3 py-1 rounded-full uppercase tracking-widest mb-4">BREAKING NEWS</span>
            <h1 class="text-4xl md:text-5xl lg:text-6xl font-display font-black text-white leading-tight mb-4">
              Nueva Alianza Estratégica para el Scouting en España
            </h1>
            <p class="text-slate-200 text-lg mb-6 line-clamp-2">
              Kaboomfot anuncia un acuerdo con los principales clubes de Segunda División para digitalizar el seguimiento de talentos sub-17.
            </p>
            <div class="flex items-center gap-4 text-white">
              <span class="flex items-center gap-1 text-sm font-semibold"><span class="material-symbols-outlined text-sm">schedule</span> Hace 25 min</span>
              <button class="bg-white text-secondary font-black py-3 px-8 rounded-xl hover:bg-primary hover:text-white transition-all">LEER MÁS</button>
            </div>
          </div>
        </div>
      </section>

      <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div class="lg:col-span-8">
          <div class="flex items-center justify-between mb-8">
            <h2 class="text-2xl font-display font-black uppercase tracking-tight">Últimas Noticias</h2>
            <div class="flex gap-2">
              <button class="bg-white dark:bg-slate-800 p-2 rounded-lg border border-slate-200 dark:border-slate-700">
                <span class="material-symbols-outlined">grid_view</span>
              </button>
              <button class="bg-slate-200 dark:bg-slate-700 p-2 rounded-lg">
                <span class="material-symbols-outlined">list</span>
              </button>
            </div>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
            <!-- Articles: se mantienen estáticos tal como en el HTML original -->
            <article class="bg-white dark:bg-slate-900 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all border border-slate-100 dark:border-slate-800 group">
              <div class="relative aspect-video overflow-hidden">
                <img alt="Mercado de fichajes" class="object-cover w-full h-full group-hover:scale-110 transition-transform duration-500" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDiIub-Ykm0A07nqJ4vInExYIc6qKs3yQjnDN7xpSCen60dV7YeiqLBBNt0-OFtUGxISseWrAdz0UQn9Hbu-UcqBI9xbUPJWQqX4n_VQbYE-ChFhcFg5KFNjTTcJrCiatPnsorsUZTTDX0-xxFhZyOFBtZ97kCxTxXfRA7l3lzr0PvjqkMA3sovJYDsDz4cTh8kPdJbUqu1nDTYCkzWOHFbQ4VzTipwPcSM0LlL8lTZSGhZZon87z2BszvOr6CHFgbJUPra2oi0dHc"/>
                <span class="absolute top-4 left-4 bg-secondary text-white text-[10px] font-bold px-2 py-1 rounded-md uppercase tracking-wider">Mercado</span>
              </div>
              <div class="p-6">
                <h3 class="text-xl font-bold mb-2 group-hover:text-primary transition-colors">La inflación de los traspasos llega a la cantera</h3>
                <p class="text-slate-500 dark:text-slate-400 text-sm mb-4">El precio de los juveniles se dispara tras el interés de clubes internacionales por el talento español.</p>
                <div class="flex items-center justify-between text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                  <span>Admin</span>
                  <span>Hace 2 horas</span>
                </div>
              </div>
            </article>
            <!-- (otros artículos omitidos por brevedad; puedes transformarlos a data-driven más adelante) -->
            <article class="bg-white dark:bg-slate-900 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all border border-slate-100 dark:border-slate-800 group">
              <div class="relative aspect-video overflow-hidden">
                <img alt="Entrenamiento cantera" class="object-cover w-full h-full group-hover:scale-110 transition-transform duration-500" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBfQ0TeKyGHGea7FsCmye-ZojlO9wVzU4p2KDI3YMihDB13ibgYkHva5hhWUieH9fKy9ri0V41FmsgtMyVxhCR5zQzGDWrGJJoIi73ataQqMbVt0fO8wnbIuR5G8SxZ356tpKBsQO2XdHwgVpW7umsIVPnBmmmF3srd-56AEwWfzt3ohP7kGoXsvDxW6xd3ZXh_gsVKk2u686J3Z2YeWon1niq-wvHYfKn1VmKeiQ9eTi9uSAfy1fEAc_Mmcwx4IKu1iVmYzQVOMVM"/>
                <span class="absolute top-4 left-4 bg-primary text-white text-[10px] font-bold px-2 py-1 rounded-md uppercase tracking-wider">Cantera</span>
              </div>
              <div class="p-6">
                <h3 class="text-xl font-bold mb-2 group-hover:text-primary transition-colors">Claves para destacar en las pruebas de captación</h3>
                <p class="text-slate-500 dark:text-slate-400 text-sm mb-4">Analizamos qué buscan los ojeadores de los grandes clubes durante los torneos regionales de este mes.</p>
                <div class="flex items-center justify-between text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                  <span>Scouting Team</span>
                  <span>Hace 5 horas</span>
                </div>
              </div>
            </article>
          </div>
          <div class="mt-12 text-center">
            <button class="bg-secondary text-white font-bold py-4 px-12 rounded-2xl hover:bg-slate-800 transition-all shadow-lg">CARGAR MÁS NOTICIAS</button>
          </div>
        </div>
        <aside class="lg:col-span-4 space-y-8">
          <div class="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800">
            <div class="relative">
              <input class="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-xl py-3 pl-10 focus:ring-2 focus:ring-primary text-sm" placeholder="Buscar noticias..." type="text"/>
              <span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">search</span>
            </div>
          </div>
          <div class="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-100 dark:border-slate-800">
            <h3 class="text-lg font-display font-black uppercase mb-6 flex items-center gap-2">
              <span class="material-symbols-outlined text-primary">trending_up</span>
              Trending Topics
            </h3>
            <div class="flex flex-wrap gap-2">
              <a class="bg-slate-100 dark:bg-slate-800 hover:bg-primary hover:text-white transition-colors px-4 py-2 rounded-full text-xs font-bold text-slate-600 dark:text-slate-300" href="#">#Fichajes</a>
              <a class="bg-slate-100 dark:bg-slate-800 hover:bg-primary hover:text-white transition-colors px-4 py-2 rounded-full text-xs font-bold text-slate-600 dark:text-slate-300" href="#">#LaLigaScouting</a>
            </div>
          </div>
          <div class="bg-secondary text-white p-8 rounded-3xl relative overflow-hidden">
            <div class="relative z-10">
              <h3 class="text-lg font-display font-black uppercase mb-6 flex items-center gap-2">
                <span class="material-symbols-outlined text-primary">visibility</span>
                Lo más leído
              </h3>
              <div class="space-y-6">
                <a class="group block" href="#">
                  <span class="text-primary font-black text-2xl mb-1 block">01</span>
                  <p class="font-bold leading-snug group-hover:text-primary transition-colors">Entrevista exclusiva con el Director Deportivo del Valencia CF.</p>
                </a>
                <div class="h-px bg-white/10"></div>
                <a class="group block" href="#">
                  <span class="text-primary font-black text-2xl mb-1 block">02</span>
                  <p class="font-bold leading-snug group-hover:text-primary transition-colors">Las 5 perlas de la Masía que vigila Europa.</p>
                </a>
              </div>
            </div>
            <div class="absolute -bottom-6 -right-6 opacity-10">
              <span class="material-symbols-outlined text-[120px]">leaderboard</span>
            </div>
          </div>
          <div class="bg-primary p-8 rounded-3xl text-white">
            <h3 class="text-xl font-display font-black mb-4">¡No te pierdas nada!</h3>
            <p class="text-sm text-emerald-100 mb-6">Recibe las últimas noticias y ofertas de reclutamiento directamente en tu email.</p>
            <form class="space-y-3">
              <input class="w-full bg-white/20 border-none rounded-xl py-3 px-4 placeholder:text-emerald-100 focus:ring-white" placeholder="Tu correo electrónico" type="email"/>
              <button class="w-full bg-white text-primary font-black py-3 rounded-xl hover:bg-slate-100 transition-colors">SUSCRIBIRME</button>
            </form>
          </div>
        </aside>
      </div>
    </main>
  </div>
</template>

<style scoped>
/* Mantener solo las utilidades necesarias; los estilos globales y config de Tailwind deben residir en la app */
.hero-article-gradient {
  background: linear-gradient(to top, rgba(15, 23, 42, 0.95) 0%, rgba(15, 23, 42, 0.4) 50%, rgba(15, 23, 42, 0.1) 100%);
}
</style>
