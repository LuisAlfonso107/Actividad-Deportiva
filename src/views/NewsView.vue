<script setup lang="ts">
import { ref, computed, onMounted } from "vue"
import type { FootballNewsArticle } from "../services/newsApiFootballScrapingBee"
import { getFootballNews } from "../services/newsApiFootballScrapingBee"

const footballNews = ref<FootballNewsArticle[]>([])
const loading = ref(true)
const visibleCount = ref(4)

/** Latest news for the hero section (first item from API) */
const heroArticle = computed<FootballNewsArticle | null>(() =>
  footballNews.value[0] ?? null
)

/** Rest of the news (skip first so it's not duplicated in the grid) */
const displayedNews = (): FootballNewsArticle[] => footballNews.value.slice(1)

onMounted(async () => {
  try {
    footballNews.value = await getFootballNews()
  } catch (error) {
    console.error("Error cargando noticias:", error)
    footballNews.value = []
  } finally {
    loading.value = false
  }
})

const loadMore = () => {
  visibleCount.value += 4
}

const getCategory = (_index?: number, _article?: FootballNewsArticle) => "Fútbol"

const getCategoryColor = (_index?: number, _article?: FootballNewsArticle) => "bg-emerald-600"

const getSource = (_index: number, article: FootballNewsArticle) => article.source || "Fútbol"

const getDate = (_index: number, article: FootballNewsArticle) =>
  article.date ? String(article.date).toUpperCase() : "RECIENTE"
</script>

<template>
  <div class="font-body text-slate-900 dark:text-slate-100 transition-colors duration-300">
    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      <!-- HERO SECTION (latest news from API) -->
      <section class="mb-12">
        <div class="relative rounded-[2rem] overflow-hidden group h-[500px]">
          <img
            v-if="heroArticle?.image"
            :src="heroArticle.image"
            :alt="heroArticle.title"
            class="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          />
          <img
            v-else
            alt="Estadio de fútbol"
            class="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            src="https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=1600&q=80"
          />
          <div class="absolute inset-0 hero-article-gradient"></div>
          <div class="absolute bottom-0 left-0 p-8 md:p-12 w-full md:w-2/3">
            <span
              class="inline-block bg-primary text-white text-xs font-black px-3 py-1 rounded-full uppercase tracking-widest mb-4"
            >
              BREAKING NEWS
            </span>
            <h1 class="text-4xl md:text-5xl lg:text-6xl font-display font-black text-white leading-tight mb-4">
              {{ heroArticle?.title || "Últimas noticias de fútbol" }}
            </h1>
            <p class="text-slate-200 text-lg mb-6 line-clamp-2">
              {{ heroArticle?.description || "Cargando las últimas noticias del mundo del fútbol." }}
            </p>
            <div class="flex items-center gap-4 text-white">
              <span class="flex items-center gap-1 text-sm font-semibold">
                <span class="material-symbols-rounded text-sm">schedule</span>
                {{ heroArticle?.date || "Reciente" }}
              </span>
              <a
                v-if="heroArticle?.url"
                :href="heroArticle.url"
                target="_blank"
                rel="noopener noreferrer"
                class="bg-white text-secondary font-black py-3 px-8 rounded-xl hover:bg-primary hover:text-white transition-all shadow-lg transform hover:-translate-y-1 uppercase tracking-widest inline-block"
              >
                LEER MÁS
              </a>
              <span
                v-else
                class="bg-white text-secondary font-black py-3 px-8 rounded-xl uppercase tracking-widest inline-block cursor-default"
              >
                LEER MÁS
              </span>
            </div>
          </div>
        </div>
      </section>

      <!-- SECCIÓN PRINCIPAL CON SIDEBAR -->
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <!-- BARRA PRINCIPAL DE NOTICIAS -->
        <div class="lg:col-span-8">
          <!-- CABECERA DE NOTICIAS -->
          <div class="flex items-center justify-between mb-10">
            <h2 class="text-2xl font-display font-black uppercase tracking-tight">ÚLTIMAS NOTICIAS</h2>
            
            <div class="flex items-center gap-4">
              <div class="flex gap-2">
                <button class="bg-white dark:bg-slate-800 p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm hover:bg-slate-50 transition-colors">
                  <span class="material-symbols-rounded text-xl block text-slate-700 dark:text-slate-300">grid_view</span>
                </button>
                <button class="bg-slate-200 dark:bg-slate-700 p-2.5 rounded-lg border border-transparent shadow-sm hover:bg-slate-300 transition-colors">
                  <span class="material-symbols-rounded text-xl block text-slate-800 dark:text-slate-100">list</span>
                </button>
              </div>

            </div>
          </div>

          <!-- Loading State -->
          <div v-if="loading && displayedNews().length === 0" class="flex flex-col items-center justify-center py-20">
            <div class="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
            <p class="text-slate-400 font-bold uppercase tracking-widest text-xs">Cargando...</p>
          </div>

          <!-- Empty State (API returned no news) -->
          <div v-else-if="!loading && displayedNews().length === 0" class="flex flex-col items-center justify-center py-20 rounded-[2rem] bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
            <span class="material-symbols-rounded text-5xl text-slate-300 dark:text-slate-600 mb-4">newspaper</span>
            <p class="text-slate-500 dark:text-slate-400 font-bold uppercase tracking-widest text-xs">No hay noticias por ahora</p>
            <p class="text-slate-400 dark:text-slate-500 text-sm mt-2">Comprueba que VITE_SCRAPINGBEE_API_KEY esté en .env y que la API tenga créditos.</p>
          </div>

          <!-- Noticias Grid -->
          <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-10">
            <article
              v-for="(article, index) in displayedNews().slice(0, visibleCount)"
              :key="article.id"
              class="bg-white dark:bg-slate-900 rounded-[2rem] overflow-hidden shadow-sm hover:shadow-xl transition-all border border-slate-100 dark:border-slate-800 group"
            >
              <div class="relative aspect-video overflow-hidden">
                <img
                  v-if="article.image"
                  :src="article.image"
                  :alt="article.title"
                  class="object-cover w-full h-full group-hover:scale-110 transition-transform duration-700"
                />
                <div v-else class="w-full h-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center">
                   <span class="material-symbols-rounded text-4xl text-slate-400 opacity-50">newspaper</span>
                </div>
                <span
                  :class="[
                    'absolute top-5 left-5 text-white text-[10px] font-bold px-3 py-1 rounded-md uppercase tracking-wider',
                    getCategoryColor(index, article)
                  ]"
                >
                  {{ getCategory(index, article) }}
                </span>
              </div>
              <div class="p-8">
                <h3 class="text-xl font-bold mb-3 group-hover:text-primary transition-colors leading-snug line-clamp-2">
                  {{ article.title }}
                </h3>
                <p class="text-slate-500 dark:text-slate-400 text-sm mb-6 leading-relaxed line-clamp-2">
                  {{ article.description }}
                </p>
                <div class="flex items-center justify-between text-[11px] font-bold text-[#b1bdce] uppercase tracking-[0.15em]">
                  <span>{{ getSource(index, article) }}</span>
                  <span>{{ getDate(index, article) }}</span>
                </div>
              </div>
            </article>
          </div>

          <!-- Botón Cargar Más -->
          <div v-if="displayedNews().length > visibleCount" class="mt-16 text-center">
            <button
              @click="loadMore"
              class="bg-[#0f172a] text-white font-black py-5 px-14 rounded-2xl hover:bg-slate-800 transition-all shadow-xl hover:shadow-[#0f172a]/20 transform active:scale-95 uppercase tracking-widest text-xs">
              CARGAR MÁS NOTICIAS
            </button>
          </div>
        </div>

        <!-- SIDEBAR -->
        <aside class="lg:col-span-4 space-y-8">
          <!-- Buscador -->
          <div class="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800">
            <div class="relative">
              <input
                class="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-xl py-3 pl-10 focus:ring-2 focus:ring-primary text-sm"
                placeholder="Buscar noticias..." type="text" />
              <span
                class="material-symbols-rounded absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">search</span>
            </div>
          </div>

          <!-- Trending Topics -->
          <div class="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-100 dark:border-slate-800">
            <h3 class="text-lg font-display font-black uppercase mb-6 flex items-center gap-2">
              <span class="material-symbols-rounded text-primary">trending_up</span>
              Trending Topics
            </h3>
            <div class="flex flex-wrap gap-2">
              <a href="#" class="bg-slate-100 dark:bg-slate-800 hover:bg-primary hover:text-white transition-colors px-4 py-2 rounded-full text-xs font-bold text-slate-600 dark:text-slate-300">#Fichajes</a>
              <a href="#" class="bg-slate-100 dark:bg-slate-800 hover:bg-primary hover:text-white transition-colors px-4 py-2 rounded-full text-xs font-bold text-slate-600 dark:text-slate-300">#LaLigaScouting</a>
              <a href="#" class="bg-slate-100 dark:bg-slate-800 hover:bg-primary hover:text-white transition-colors px-4 py-2 rounded-full text-xs font-bold text-slate-600 dark:text-slate-300">#TalentoEspaña</a>
              <a href="#" class="bg-slate-100 dark:bg-slate-800 hover:bg-primary hover:text-white transition-colors px-4 py-2 rounded-full text-xs font-bold text-slate-600 dark:text-slate-300">#Sub21</a>
              <a href="#" class="bg-slate-100 dark:bg-slate-800 hover:bg-primary hover:text-white transition-colors px-4 py-2 rounded-full text-xs font-bold text-slate-600 dark:text-slate-300">#AgentesFIFA</a>
            </div>
          </div>

          <!-- Lo más leído -->
          <div class="bg-secondary text-white p-8 rounded-3xl relative overflow-hidden">
            <div class="relative z-10">
              <h3 class="text-lg font-display font-black uppercase mb-6 flex items-center gap-2">
                <span class="material-symbols-rounded text-primary">visibility</span>
                Lo más leído
              </h3>
              <div class="space-y-6">
                <a class="group block" href="#">
                  <span class="text-primary font-black text-2xl mb-1 block">01</span>
                  <p class="font-bold leading-snug group-hover:text-primary transition-colors text-sm">Entrevista exclusiva con el Director Deportivo del Valencia CF.</p>
                </a>
                <div class="h-px bg-white/10"></div>
                <a class="group block" href="#">
                  <span class="text-primary font-black text-2xl mb-1 block">02</span>
                  <p class="font-bold leading-snug group-hover:text-primary transition-colors text-sm">Las 5 perlas de la Masía que vigila Europa.</p>
                </a>
                <div class="h-px bg-white/10"></div>
                <a class="group block" href="#">
                  <span class="text-primary font-black text-2xl mb-1 block">03</span>
                  <p class="font-bold leading-snug group-hover:text-primary transition-colors text-sm">Manual de supervivencia para el primer contrato Pro.</p>
                </a>
              </div>
            </div>
            <div class="absolute -bottom-6 -right-6 opacity-10">
              <span class="material-symbols-rounded text-[120px]">leaderboard</span>
            </div>
          </div>

          <!-- Newsletter -->
          <div class="bg-primary p-8 rounded-3xl text-white">
            <h3 class="text-xl font-display font-black mb-4">¡No te pierdas nada!</h3>
            <p class="text-sm text-emerald-100 mb-6 font-medium">Recibe las últimas noticias y ofertas de reclutamiento directamente en tu email.</p>
            <form class="space-y-3" @submit.prevent>
              <input
                class="w-full bg-white/20 border-none rounded-xl py-3 px-4 placeholder:text-emerald-100 focus:ring-white text-sm"
                placeholder="Tu correo electrónico" type="email" />
              <button
                class="w-full bg-white text-primary font-black py-3 rounded-xl hover:bg-slate-100 transition-colors shadow-lg transform active:scale-95">
                SUSCRIBIRME
              </button>
            </form>
          </div>
        </aside>
      </div>
    </main>
  </div>
</template>

<style scoped>
.hero-article-gradient {
  background: linear-gradient(to top, rgba(15, 23, 42, 0.95) 0%, rgba(15, 23, 42, 0.4) 50%, rgba(15, 23, 42, 0.1) 100%);
}

.font-display {
  font-family: 'Outfit', sans-serif;
}

.font-body {
  font-family: 'Inter', sans-serif;
}
</style>