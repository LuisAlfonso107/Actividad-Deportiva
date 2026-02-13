<script setup lang="ts">
import { ref, onMounted } from "vue"
import type { NewsArticle } from "../services/newsApiLaLiga2" // ✅ usar `type` para interfaces
import { getLaLiga2News } from "../services/newsApiLaLiga2"

const news = ref<NewsArticle[]>([])
const loading = ref(true)

onMounted(async () => {
  news.value = await getLaLiga2News()
  loading.value = false
})
</script>


<template>
  <div class="font-body text-slate-900 dark:text-slate-100 transition-colors duration-300">
    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

      <!-- HERO -->
      <section class="mb-12">
        <div class="relative rounded-[2rem] overflow-hidden group h-[500px]">
          <img
            alt="Estadio de fútbol"
            class="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            src="https://images.unsplash.com/photo-1508098682722-e99c643e7f0b"
          />
          <div class="absolute inset-0 hero-article-gradient"></div>
          <div class="absolute bottom-0 left-0 p-8 md:p-12 w-full md:w-2/3">
            <span class="inline-block bg-primary text-white text-xs font-black px-3 py-1 rounded-full uppercase tracking-widest mb-4">
              BREAKING NEWS
            </span>
            <h1 class="text-4xl md:text-5xl lg:text-6xl font-display font-black text-white leading-tight mb-4">
              Noticias de LaLiga 2
            </h1>
            <p class="text-slate-200 text-lg mb-6 line-clamp-2">
              Últimas noticias y actualizaciones de los equipos y jugadores.
            </p>
          </div>
        </div>
      </section>

      <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div class="lg:col-span-8">

          <!-- Título -->
          <div class="flex items-center justify-between mb-8">
            <h2 class="text-2xl font-display font-black uppercase tracking-tight">
              Últimas Noticias
            </h2>
          </div>

          <!-- Loading -->
          <div v-if="loading" class="text-center py-16 font-semibold">
            Cargando noticias...
          </div>

          <!-- Noticias -->
          <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-8">
            <article
              v-for="article in news"
              :key="article.id"
              class="bg-white dark:bg-slate-900 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all border border-slate-100 dark:border-slate-800 group"
            >
              <div class="relative aspect-video overflow-hidden">
                <img
                  :src="article.image"
                  class="object-cover w-full h-full group-hover:scale-110 transition-transform duration-500"
                />
              </div>
              <div class="p-6">
                <h3 class="text-xl font-bold mb-2 group-hover:text-primary transition-colors">
                  {{ article.title }}
                </h3>
                <p class="text-slate-500 dark:text-slate-400 text-sm mb-4">
                  {{ article.description }}
                </p>
                <div class="flex items-center justify-between text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                  <span>Fuente: Football-Data / TheSportsDB</span>
                  <span>{{ article.date }}</span>
                </div>
              </div>
            </article>
          </div>

        </div>

        <!-- Sidebar -->
        <aside class="lg:col-span-4 space-y-8">
          <div class="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800">
            <input class="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-xl py-3 pl-10 focus:ring-2 focus:ring-primary text-sm" placeholder="Buscar noticias..." type="text"/>
          </div>
        </aside>

      </div>
    </main>
  </div>
</template>

<style scoped>
.hero-article-gradient {
  background: linear-gradient(to top, rgba(15,23,42,0.95) 0%, rgba(15,23,42,0.4) 50%, rgba(15,23,42,0.1) 100%);
}
</style>
