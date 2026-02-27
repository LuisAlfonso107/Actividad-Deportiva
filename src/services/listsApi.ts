/**
 * Lists API – user's custom player lists.
 *
 * Data lives in json-server (db.json) at http://localhost:3000.
 */

const API_BASE = 'http://localhost:3000'

export interface PlayerList {
  id?: string
  userId: string
  name: string
  players: number[]
  createdAt: string
}

export async function getLists(userId: string): Promise<PlayerList[]> {
  const res = await fetch(`${API_BASE}/lists?userId=${userId}`)
  if (!res.ok) throw new Error('No se pudieron cargar las listas')
  const data = await res.json()
  return Array.isArray(data) ? data : []
}

// Fallback: obtener todas las listas (independiente de usuario).
export async function getAllLists(): Promise<PlayerList[]> {
  const res = await fetch(`${API_BASE}/lists`)
  if (!res.ok) throw new Error('No se pudieron cargar las listas')
  const data = await res.json()
  return Array.isArray(data) ? data : []
}

export async function getListById(listId: string): Promise<PlayerList | null> {
  const res = await fetch(`${API_BASE}/lists/${listId}`)
  if (!res.ok) return null
  return res.json()
}

export async function createList(list: Omit<PlayerList, 'id'>): Promise<PlayerList> {
  const res = await fetch(`${API_BASE}/lists`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(list),
  })
  if (!res.ok) throw new Error('No se pudo crear la lista')
  return res.json()
}

export async function updateList(listId: string, data: Partial<PlayerList>): Promise<PlayerList> {
  const res = await fetch(`${API_BASE}/lists/${listId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  if (!res.ok) throw new Error('No se pudo actualizar la lista')
  return res.json()
}

export async function deleteList(listId: string): Promise<void> {
  const res = await fetch(`${API_BASE}/lists/${listId}`, { method: 'DELETE' })
  if (!res.ok) throw new Error('No se pudo eliminar la lista')
}
