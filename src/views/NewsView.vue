<script setup lang="ts">
import { ref, onMounted } from "vue"
import type { NewsArticle } from "../services/newsApiLaLiga2"
import type { TransferNews } from "../services/newsApiTransfers"
import { getLaLiga2News } from "../services/newsApiLaLiga2"
import { getTransferNews } from "../services/newsApiTransfers"

type TabType = "laliga2" | "transfers"

const activeTab = ref<TabType>("laliga2")

// Noticias estáticas iniciales para que el usuario las vea inmediatamente (como en el diseño)
const staticNews: NewsArticle[] = [
  {
    id: 's1',
    title: 'La inflación de los traspasos llega a la cantera',
    description: 'El precio de los juveniles se dispara tras el interés de clubes internacionales por el talento español.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDiIub-Ykm0A07nqJ4vInExYIc6qKs3yQjnDN7xpSCen60dV7YeiqLBBNt0-OFtUGxISseWrAdz0UQn9Hbu-UcqBI9xbUPJWQqX4n_VQbYE-ChFhcFg5KFNjTTcJrCiatPnsorsUZTTDX0-xxFhZyOFBtZ97kCxTxXfRA7l3lzr0PvjqkMA3sovJYDsDz4cTh8kPdJbUqu1nDTYCkzWOHFbQ4VzTipwPcSM0LlL8lTZSGhZZon87z2BszvOr6CHFgbJUPra2oi0dHc',
    date: 'Hace 2 horas'
  },
  {
    id: 's2',
    title: 'Claves para destacar en las pruebas de captación',
    description: 'Analizamos qué buscan los ojeadores de los grandes clubes durante los torneos regionales de este mes.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBfQ0TeKyGHGea7FsCmye-ZojlO9wVzU4p2KDI3YMihDB13ibgYkHva5hhWUieH9fKy9ri0V41FmsgtMyVxhCR5zQzGDWrGJJoIi73ataQqMbVt0fO8wnbIuR5G8SxZ356tpKBsQO2XdHwgVpW7umsIVPnBmmmF3srd-56AEwWfzt3ohP7kGoXsvDxW6xd3ZXh_gsVKk2u686J3Z2YeWon1niq-wvHYfKn1VmKeiQ9eTi9uSAfy1fEAc_Mmcwx4IKu1iVmYzQVOMVM',
    date: 'Hace 5 horas'
  },
  {
    id: 's3',
    title: 'Big Data: El nuevo aliado de los representantes',
    description: 'Cómo las métricas avanzadas están cambiando la forma en que se presentan los perfiles a los clubes.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCI6OKJT2q69fpQgm-29XghlsSd5w5QlaBQgBfavNawo8oA2AwzNgA36oj-JClfm81_t8LcCMjHWDVQx_exD296ONfC_0G4WZY4r0So3v0sGfKnzzzkaH5qcGDJzdofx3G2ox_Hk767-IlXeJnuBp67RSA7Vye6Cc7fayWbIvYsL3J8pmSPkGdO1oiXHk433-n9a6rzu0DLJ6Hzbt87QElynojKE8Awb6qkobb7kYVdtkQt9SJE149cKc5ISSCIeG7OIF4m86C4xU0',
    date: 'Ayer'
  },
  {
    id: 's4',
    title: 'Abiertas las inscripciones: Kaboom Show 2024',
    description: 'El mayor evento de reclutamiento de España abre sus puertas en Madrid para ojeadores internacionales.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDLngSFXjB9H5f8pj0Uow_RZa78oq5Awad7-llCmpxNz3NgmfZAao2lVHoAXEEjQhl2NG2o3WBfGM60LdzppLIUc5wZe0UppthoCH-VCEbxH5PbKVWXK-PRs3V2_J7cC0FH7X5QY1V__Y06srUt44TN7ZReFs8ooOIsNZBMTtuxdamD-GLmT3XApy0sjGsZeY9nvG5THPAWr0NXYSUfzKsW-SCrISODahlxipRTwgkwo_4wwK5u8A_KFZWvsJ-9-m7QWxG7r3Lw2xA',
    date: 'Ayer'
  },
  {
    id: 's5',
    title: 'Nuevas metodologías en el fútbol base',
    description: 'Los clubes de élite están cambiando sus sistemas de entrenamiento para potenciar la creatividad individual.',
    image: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
    date: 'Hace 8 horas'
  },
  {
    id: 's6',
    title: 'Impacto del Brexit en el mercado de fichajes',
    description: 'Cómo las nuevas normativas están afectando el flujo de talento joven entre España e Inglaterra.',
    image: 'https://images.unsplash.com/photo-1529900748604-07564a03e7a6?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
    date: 'Ayer'
  },
  {
    id: 's7',
    title: 'La salud mental en el deporte de élite',
    description: 'Kaboomfot lanza una iniciativa para monitorizar el bienestar emocional de los jugadores en formación.',
    image: 'https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
    date: 'Hace 2 días'
  },
  {
    id: 's8',
    title: 'Nuevas instalaciones en la Ciudad Deportiva',
    description: 'El proyecto de expansión incluye tecnología de última generación para la recuperación de lesiones.',
    image: 'https://images.unsplash.com/photo-1526232761682-d26e03ac148e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
    date: 'Hace 3 días'
  }
]

const laliga2News = ref<NewsArticle[]>([])
const transferNews = ref<TransferNews[]>([])
const loading = ref(true)
const visibleCount = ref(4)

onMounted(async () => {
  try {
    const [laliga2Data, transferData] = await Promise.all([
      getLaLiga2News(),
      getTransferNews()
    ])
    
    // Combinamos: Estáticas primero para mantener el diseño solicitado, luego las dinámicas
    laliga2News.value = [...staticNews, ...laliga2Data]
    transferNews.value = transferData
  } catch (error) {
    console.error("Error cargando noticias:", error)
    // Si falla la API, al menos mostramos las estáticas
    laliga2News.value = staticNews
  } finally {
    loading.value = false
  }
})

const displayedNews = () => {
  return activeTab.value === "laliga2" ? laliga2News.value : transferNews.value
}

const loadMore = () => {
  visibleCount.value += 4
}

const getCategory = (index: number, article: any) => {
  if (activeTab.value === 'transfers') return 'Mercado'
  // Si es una de las estáticas originales, mantenemos sus categorías
  if (index < 4) {
    const categories = ['Mercado', 'Cantera', 'Análisis', 'Eventos']
    return categories[index % categories.length]
  }
  return 'LaLiga 2'
}

const getCategoryColor = (index: number, article: any) => {
  if (activeTab.value === 'transfers') return 'bg-secondary'
  if (index < 4) {
    const colors = ['bg-[#0f172a]', 'bg-primary', 'bg-blue-600', 'bg-pink-500']
    return colors[index % colors.length]
  }
  return 'bg-slate-500'
}

const getSource = (index: number, article: any) => {
  if (index < 4) {
    const sources = ['ADMIN', 'SCOUTING TEAM', 'TECH LAB', 'EVENTOS']
    return sources[index % sources.length]
  }
  return (article as any).source || 'KABOOMFOT'
}

const getDate = (index: number, article: any) => {
  if (index < 4) return article.date.toUpperCase()
  return article.date ? article.date.toUpperCase() : 'RECIENTE'
}
</script>

<template>
  <div class="font-body text-slate-900 dark:text-slate-100 transition-colors duration-300">
    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      <!-- HERO SECTION -->
      <section class="mb-12">
        <div class="relative rounded-[2rem] overflow-hidden group h-[500px]">
          <img alt="Estadio de fútbol"
            class="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDTASgKon8Di4AGkjvsMe_YMdQQwdxfi-tBgkvCBQKranXQoQwAmuk-OTbJh5mckEiM69PNlDBW03hBtGVamlQkVVUsinvE8AvmUINkXGOI2EfKnlfH2ilu501qx0uScAIQrbeNgj3jdbN7XazlX23WHbb3_uAIBR-VB7iYdaM7br6t_9kV0TcJr2gQ4UjuQRnoAjwBhi3e83IoeL8WSBEQN6CqproyGod5IVD5dowXd0xqgTw1b6kv79Ng_Gy4b4Ksqz2IZ4b2Yk4" />
          <div class="absolute inset-0 hero-article-gradient"></div>
          <div class="absolute bottom-0 left-0 p-8 md:p-12 w-full md:w-2/3">
            <span
              class="inline-block bg-primary text-white text-xs font-black px-3 py-1 rounded-full uppercase tracking-widest mb-4">BREAKING
              NEWS</span>
            <h1 class="text-4xl md:text-5xl lg:text-6xl font-display font-black text-white leading-tight mb-4">
              Nueva Alianza Estratégica para el Scouting en España
            </h1>
            <p class="text-slate-200 text-lg mb-6 line-clamp-2">
              Kaboomfot anuncia un acuerdo con los principales clubes de Segunda División para digitalizar el
              seguimiento de talentos sub-17.
            </p>
            <div class="flex items-center gap-4 text-white">
              <span class="flex items-center gap-1 text-sm font-semibold">
                <span class="material-symbols-rounded text-sm">schedule</span> Hace 25 min
              </span>
              <button
                class="bg-white text-secondary font-black py-3 px-8 rounded-xl hover:bg-primary hover:text-white transition-all shadow-lg transform hover:-translate-y-1 uppercase tracking-widest">
                LEER MÁS
              </button>
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

              <div class="hidden sm:flex gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
                 <button 
                  @click="activeTab = 'laliga2'; visibleCount = 4"
                  :class="[
                    'px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase transition-all',
                    activeTab === 'laliga2' ? 'bg-white dark:bg-slate-700 text-primary shadow-sm' : 'text-slate-500'
                  ]"
                 >LaLiga 2</button>
                 <button 
                  @click="activeTab = 'transfers'; visibleCount = 4"
                  :class="[
                    'px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase transition-all',
                    activeTab === 'transfers' ? 'bg-white dark:bg-slate-700 text-secondary shadow-sm' : 'text-slate-500'
                  ]"
                 >Fichajes</button>
              </div>
            </div>
          </div>

          <!-- Loading State -->
          <div v-if="loading && displayedNews().length === 0" class="flex flex-col items-center justify-center py-20">
            <div class="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
            <p class="text-slate-400 font-bold uppercase tracking-widest text-xs">Cargando...</p>
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