// src/services/newsApiTransfers.ts
export interface TransferNews {
  id: string
  title: string
  description: string
  image: string
  date: string
  url: string
  source: string
}

const API_KEY = 'pub_443a91a06f0643feac8b67423cd94272'
const BASE_URL = 'https://newsdata.io/api/1/news'

export async function getTransferNews(teamName?: string): Promise<TransferNews[]> {
  try {
    const query = teamName ? `${teamName} transferencias fútbol` : 'fichajes fútbol mercado invierno'
    
    const params = new URLSearchParams({
      apikey: API_KEY,
      q: query,
      language: 'es',
      category: 'sports'
    })

    const res = await fetch(`${BASE_URL}?${params}`)
    
    if (!res.ok) {
      console.error('NewsData API error:', res.status)
      return []
    }

    const data = await res.json()
    
    if (!data.results || !Array.isArray(data.results)) {
      return []
    }

    const news: TransferNews[] = data.results.slice(0, 10).map((item: any, index: number) => ({
      id: item.article_id || String(index),
      title: item.title || 'Sin título',
      description: item.description || '',
      image: item.image_url || '',
      date: item.pubDate ? new Date(item.pubDate).toLocaleDateString('es-ES') : '',
      url: item.link || '',
      source: item.source_id || 'Unknown'
    }))

    return news
  } catch (err) {
    console.error('Error fetching transfer news:', err)
    return []
  }
}
