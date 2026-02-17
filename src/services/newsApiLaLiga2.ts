// src/services/newsApiLaLiga2.ts
export interface NewsArticle {
  id: string
  title: string
  description: string
  image: string
  date: string
  source?: string
}

const API_KEY = 'pub_443a91a06f0643feac8b67423cd94272'
const BASE_URL = 'https://newsdata.io/api/1/news'

export async function getLaLiga2News(): Promise<NewsArticle[]> {
  try {
    const params = new URLSearchParams({
      apikey: API_KEY,
      q: 'LaLiga 2 fútbol España',
      language: 'es',
      category: 'sports'
    })

    const res = await fetch(`${BASE_URL}?${params}`)

    if (!res.ok) {
      console.error('NewsData API error (LaLiga2):', res.status)
      return []
    }

    const data = await res.json()

    if (!data.results || !Array.isArray(data.results)) {
      return []
    }

    const articles: NewsArticle[] = data.results.map((item: any, index: number) => ({
      id: item.article_id || String(index),
      title: item.title || 'Sin título',
      description: item.description || '',
      image: item.image_url || 'https://images.unsplash.com/photo-1508098682722-e99c643e7f0b',
      date: item.pubDate ? new Date(item.pubDate).toLocaleDateString('es-ES') : new Date().toLocaleDateString('es-ES'),
      source: item.source_id || 'News'
    }))

    return articles
  } catch (err) {
    console.error("Error obteniendo noticias LaLiga2:", err)
    return []
  }
}
