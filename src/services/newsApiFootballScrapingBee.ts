/**
 * Football news via ScrapingBee API (with direct RSS fallback)
 * Docs: https://www.scrapingbee.com/documentation/
 */

const SCRAPINGBEE_BASE = "https://app.scrapingbee.com/api/v1"

const RSS_FEEDS = [
  "https://e00-marca.uecdn.es/rss/futbol.xml",
  "https://www.marca.com/rss/futbol.xml",
  "https://as.com/rss/tags/futbol.xml",
]

const FALLBACK_NEWS: FootballNewsArticle[] = [
  {
    id: "fb-1",
    title: "La Liga: última hora del mercado de fichajes",
    description: "Sigue la actualidad del fútbol español y las últimas novedades de los equipos de Primera y Segunda.",
    image: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=1000&q=80",
    date: "Reciente",
    source: "Fútbol",
  },
  {
    id: "fb-2",
    title: "Selección española: convocatoria y próximos partidos",
    description: "Toda la información de la Roja y el camino hacia las próximas competiciones internacionales.",
    image: "https://images.unsplash.com/photo-1529900748604-07564a03e7a6?w=1000&q=80",
    date: "Reciente",
    source: "Fútbol",
  },
  {
    id: "fb-3",
    title: "Champions League: resultados y calendario",
    description: "Sigue la Liga de Campeones y la Europa League con el mejor resumen de partidos y goles.",
    image: "https://images.unsplash.com/photo-1508098682722-e99c643e7f0b?w=1000&q=80",
    date: "Reciente",
    source: "Fútbol",
  },
  {
    id: "fb-4",
    title: "Fútbol base y cantera en España",
    description: "Noticias de las categorías inferiores y el talento joven del fútbol español.",
    image: "https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?w=1000&q=80",
    date: "Reciente",
    source: "Fútbol",
  },
]

export interface FootballNewsArticle {
  id: string
  title: string
  description: string
  image: string
  date: string
  source?: string
  url?: string
}

function getApiKey(): string {
  return import.meta.env.VITE_SCRAPINGBEE_API_KEY || ""
}

function stripCdata(text: string): string {
  const m = text.match(/<!\[CDATA\[([\s\S]*?)\]\]>/)
  return (m && m[1] != null) ? m[1].trim() : text
}

/** Remove HTML tags and decode entities (&nbsp;, &amp;, etc.) so text displays cleanly */
function stripHtml(html: string): string {
  if (!html) return ""
  const div = document.createElement("div")
  div.innerHTML = html
  const text = div.textContent ?? div.innerText ?? ""
  return text.replace(/\s+/g, " ").trim()
}

/** Parse RSS/XML into articles */
function parseRssToArticles(xmlText: string, sourceName: string): FootballNewsArticle[] {
  const articles: FootballNewsArticle[] = []
  const parser = new DOMParser()
  const doc = parser.parseFromString(xmlText, "text/xml")

  const items = doc.querySelectorAll("item")
  const entries = doc.querySelectorAll("entry")
  const list = items.length ? items : entries
  if (!list.length) return []

  const defaultImg = "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=1000&q=80"
  const max = Math.min(list.length, 15)

  for (let i = 0; i < max; i++) {
    const el = list[i]
    if (!el) continue
    let title = el.querySelector("title")?.textContent?.trim() || ""
    title = stripHtml(stripCdata(title))
    const linkEl = el.querySelector("link")
    const link =
      linkEl?.getAttribute("href") ||
      linkEl?.textContent?.trim() ||
      ""
    const descEl = el.querySelector("description") || el.querySelector("summary") || el.querySelector("content")
    let description = (descEl?.textContent ?? "").trim()
    description = stripHtml(stripCdata(description))
    if (description.length > 250) description = description.slice(0, 247) + "..."
    const enclosure = el.querySelector("enclosure")
    const mediaContent = el.querySelector("[url]")
    let image =
      enclosure?.getAttribute("url") ||
      mediaContent?.getAttribute("url") ||
      ""
    if (!image && description.includes("<img")) {
      const div = doc.createElement("div")
      div.innerHTML = description
      image = div.querySelector("img")?.getAttribute("src") ?? ""
    }
    const pubDate =
      el.querySelector("pubDate")?.textContent?.trim() ||
      el.querySelector("published")?.textContent?.trim() ||
      ""

    let dateLabel = "Reciente"
    if (pubDate) {
      try {
        const d = new Date(pubDate)
        const now = new Date()
        const diffMs = now.getTime() - d.getTime()
        const diffMins = Math.floor(diffMs / 60000)
        const diffHours = Math.floor(diffMs / 3600000)
        const diffDays = Math.floor(diffMs / 86400000)
        if (diffMins < 60) dateLabel = `Hace ${diffMins} min`
        else if (diffHours < 24) dateLabel = `Hace ${diffHours} horas`
        else if (diffDays === 1) dateLabel = "Ayer"
        else if (diffDays < 7) dateLabel = `Hace ${diffDays} días`
        else dateLabel = d.toLocaleDateString("es-ES")
      } catch {
        dateLabel = pubDate.slice(0, 25)
      }
    }

    if (!title) continue
    articles.push({
      id: `sb-${i}-${(link || title).slice(0, 30)}`.replace(/[^a-zA-Z0-9-_]/g, "-"),
      title,
      description: description || "Sin descripción",
      image: image || defaultImg,
      date: dateLabel,
      source: sourceName,
      url: link || undefined,
    })
  }
  return articles
}

/** Try to fetch RSS directly (works when feed allows CORS) */
async function fetchRssDirect(url: string): Promise<string | null> {
  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(8000) })
    if (!res.ok) return null
    return await res.text()
  } catch {
    return null
  }
}

/** Fetch RSS via ScrapingBee */
async function fetchRssViaScrapingBee(url: string): Promise<string | null> {
  const apiKey = getApiKey()
  if (!apiKey) return null
  try {
    const params = new URLSearchParams({
      api_key: apiKey,
      url,
      render_js: "false",
    })
    const res = await fetch(`${SCRAPINGBEE_BASE}?${params}`, { signal: AbortSignal.timeout(15000) })
    if (!res.ok) return null
    return await res.text()
  } catch {
    return null
  }
}

export async function getFootballNews(): Promise<FootballNewsArticle[]> {
  for (const feedUrl of RSS_FEEDS) {
    let text: string | null = null
    text = await fetchRssDirect(feedUrl)
    if (!text) text = await fetchRssViaScrapingBee(feedUrl)
    if (!text) continue

    const source = feedUrl.includes("marca") ? "MARCA" : feedUrl.includes("as.com") ? "AS" : "Fútbol"
    const articles = parseRssToArticles(text, source)
    if (articles.length > 0) return articles
  }

  return FALLBACK_NEWS
}
