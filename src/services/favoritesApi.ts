/**
 * Favorites API – syncs with json-server (db.json).
 * Base URL: http://localhost:3000 (same as users/auth).
 */

const API_BASE = 'http://localhost:3000'

export interface FavoriteRow {
  id?: number
  playerId: number
  name: string
  photo: string
  team?: string
  teamLogo?: string
}

export async function getFavorites(): Promise<FavoriteRow[]> {
  const res = await fetch(`${API_BASE}/favorites`)
  if (!res.ok) throw new Error('No se pudieron cargar los favoritos')
  const data = await res.json()
  return Array.isArray(data) ? data : []
}

export async function addFavorite(player: {
  id: number
  name: string
  photo: string
  team?: string
  teamLogo?: string
}): Promise<FavoriteRow> {
  const res = await fetch(`${API_BASE}/favorites`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      playerId: player.id,
      name: player.name,
      photo: player.photo,
      team: player.team,
      teamLogo: player.teamLogo,
    }),
  })
  if (!res.ok) throw new Error('No se pudo guardar el favorito')
  return res.json()
}

export async function removeFavoriteByRowId(rowId: number): Promise<void> {
  const res = await fetch(`${API_BASE}/favorites/${rowId}`, { method: 'DELETE' })
  if (!res.ok) throw new Error('No se pudo eliminar el favorito')
}
