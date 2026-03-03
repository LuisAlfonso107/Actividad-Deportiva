/**
 * Favorites API – user's saved players.
 *
 * Data lives in json-server (db.json) at http://localhost:3000.
 * Same server as auth; run with: npx json-server db.json --port 3000
 */

/** Base URL for the local json-server instance that stores favorites data. */
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

/**
 * Fetches the full favorites collection from the local API.
 * Returns an empty array when the API response is not an array.
 */
export async function getFavorites(): Promise<FavoriteRow[]> {
  const res = await fetch(`${API_BASE}/favorites`)
  if (!res.ok) throw new Error('No se pudieron cargar los favoritos')
  const data = await res.json()
  return Array.isArray(data) ? data : []
}

/**
 * Creates a new favorite record for the provided player.
 * Maps the UI player shape (`id`) to the backend field (`playerId`).
 */
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

/**
 * Deletes a favorite row using its database row identifier.
 * Throws when the server cannot complete the delete operation.
 */
export async function removeFavoriteByRowId(rowId: number): Promise<void> {
  const res = await fetch(`${API_BASE}/favorites/${rowId}`, { method: 'DELETE' })
  if (!res.ok) throw new Error('No se pudo eliminar el favorito')
}
