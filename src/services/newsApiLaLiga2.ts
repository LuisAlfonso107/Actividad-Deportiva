// src/services/newsApiLaLiga2.ts
export interface NewsArticle {
  id: string
  title: string
  description: string
  image: string
  date: string
}

// Función para obtener noticias de LaLiga 2
export async function getLaLiga2News(): Promise<NewsArticle[]> {
  const token = import.meta.env.VITE_FOOTBALL_API_KEY as string
  if (!token) throw new Error("VITE_FOOTBALL_API_KEY no está definido")

  try {
    // Fetch de equipos de LaLiga 2 (Segunda División)
    const res = await fetch("https://api.football-data.org/v4/competitions/PD/teams", {
      headers: new Headers({
        "X-Auth-Token": token
      })
    })

    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`)

    const data = await res.json()

    // Transformamos los equipos en "noticias" ficticias
    const articles: NewsArticle[] = data.teams.map((team: any, index: number) => ({
      id: team.id || String(index),
      title: `Últimas noticias de ${team.name}`,
      description: `Noticias y actualizaciones del equipo ${team.name} en LaLiga 2.`,
      image: team.crest || "https://images.unsplash.com/photo-1508098682722-e99c643e7f0b",
      date: new Date().toLocaleDateString()
    }))

    return articles
  } catch (err) {
    console.error("Error obteniendo noticias LaLiga2:", err)
    return []
  }
}
