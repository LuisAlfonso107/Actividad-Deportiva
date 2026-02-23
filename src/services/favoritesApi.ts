/**
 * Favorites API – user's saved players.
 *
 * Data lives in json-server (db.json) at http://localhost:3000.
 * Same server as auth; run with: npx json-server db.json --port 3000
 */

const API_BASE = 'http://localhost:3000'

// ─── Types ──────────────────────────────────────────────────────────────────

/** One row in the favorites list (stored in db.json). */
export interface FavoriteRow {
  id?: number
  playerId: number
  name: string
  photo: string
  team?: string
  teamLogo?: string
}

// ─── Public API ──────────────────────────────────────────────────────────────

/** Load all favorites from the server. */
export async function getFavorites(): Promise<FavoriteRow[]> {
  const res = await fetch(`${API_BASE}/favorites`)
  if (!res.ok) throw new Error('No se pudieron cargar los favoritos')
  const data = await res.json()
  return Array.isArray(data) ? data : []
}

/** Add a player to favorites. */
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

/** Remove a favorite by its row id (from db.json). */
export async function removeFavoriteByRowId(rowId: number): Promise<void> {
  const res = await fetch(`${API_BASE}/favorites/${rowId}`, { method: 'DELETE' })
  if (!res.ok) throw new Error('No se pudo eliminar el favorito')
}
