/**
 * football-data.org API v4 – players only (search, squad, get by id).
 *
 * Used by: PlayerAnalysisView (get player by id, search).
 * Standings → standingsApi.ts  |  Transfers → transfersApi.ts  |  Players (TheSportsDB) → playersApi.ts
 */

import type { ApiPlayer, ApiPlayerResponse, PlayersSearchResponse } from './types'

export type { ApiPlayer, ApiPlayerTeam, ApiPlayerResponse, PlayersSearchResponse } from './types'

// ─── Config ─────────────────────────────────────────────────────────────────

const API_BASE = import.meta.env.DEV
  ? `${typeof location !== 'undefined' ? location.origin : ''}/api/footballdata/v4`
  : 'https://api.football-data.org/v4'

const API_TOKENS: string[] = [
  (import.meta.env.VITE_FOOTBALL_API_KEY ?? import.meta.env.VITE_FOOTBALL_DATA_TOKEN ?? '').trim(),
  (import.meta.env.VITE_FOOTBALL_API_KEY_2 ?? '').trim(),
].filter((t): t is string => Boolean(t))

let _tokenIndex = 0
function getNextToken(): string {
  if (API_TOKENS.length === 0) return ''
  const token = API_TOKENS[_tokenIndex % API_TOKENS.length] ?? ''
  _tokenIndex += 1
  return token
}

const API_TOKEN = API_TOKENS[0] ?? ''

// ─── football-data.org raw response types (internal) ─────────────────────────

interface FDTeam {
  id: number
  name: string
  shortName?: string
  tla?: string
  crest?: string
}

interface FDSquadPerson {
  id: number
  firstName: string | null
  lastName: string | null
  name: string
  position?: string
  dateOfBirth?: string
  nationality?: string
  shirtNumber?: number
}

interface FDStandingsTableRow {
  position: number
  team: FDTeam
  playedGames: number
  form?: string
  won: number
  draw: number
  lost: number
  points: number
  goalsFor: number
  goalsAgainst: number
  goalDifference: number
}

// ─── Helpers (map API response → our types) ─────────────────────────────────

function squadPersonToPlayer(p: FDSquadPerson, team: FDTeam): ApiPlayer {
  const first = p.firstName ?? ''
  const last = p.lastName ?? ''
  return {
    id: p.id,
    name: p.name,
    firstname: first,
    lastname: last,
    age: p.dateOfBirth ? new Date().getFullYear() - new Date(p.dateOfBirth).getFullYear() : null,
    birth: { date: p.dateOfBirth ?? '', place: null, country: p.nationality ?? '' },
    nationality: p.nationality ?? '',
    height: null,
    weight: null,
    photo: '',
  }
}

function squadToPlayerResponses(squad: FDSquadPerson[], team: FDTeam): ApiPlayerResponse[] {
  return squad.map((p) => ({
    player: squadPersonToPlayer(p, team),
    statistics: [
      {
        team: { id: team.id, name: team.name, logo: team.crest ?? '' },
        games: {
          position: p.position ?? '',
          rating: null,
          captain: false,
          minutes: 0,
          appearences: 0,
          lineups: 0,
          substitute_in: 0,
          substitute_out: 0,
        },
      },
    ],
  }))
}

/** HTTP request to football-data.org with auth and error handling. */
async function request<T>(path: string, params: Record<string, string | number> = {}, tryCount = 0): Promise<T> {
  const token = getNextToken()
  if (!token) {
    throw new Error('Invalid or missing API token. Add VITE_FOOTBALL_API_KEY (or VITE_FOOTBALL_API_KEY_2) in .env')
  }
  const base = API_BASE.endsWith('/') ? API_BASE : API_BASE + '/'
  const pathRelative = path.startsWith('/') ? path.slice(1) : path
  const url = new URL(pathRelative, base)
  Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, String(v)))
  const res = await fetch(url.toString(), {
    headers: {
      'X-Auth-Token': token,
      Accept: 'application/json',
    },
  })
  if (res.status === 401) {
    throw new Error('Invalid or missing API token. Check VITE_FOOTBALL_API_KEY in .env')
  }
  if (res.status === 429 && API_TOKENS.length > 1 && tryCount < 1) {
    return request<T>(path, params, tryCount + 1)
  }
  if (res.status === 429) {
    throw new Error('API limit reached (429). Free tier has a daily limit – try again later.')
  }
  if (res.status === 403) {
    throw new Error('API access forbidden (403). Check your plan or API token.')
  }
  if (!res.ok) {
    let msg = `API error: ${res.status}`
    try {
      const body = (await res.json()) as { message?: string }
      if (body?.message) msg = body.message
    } catch {
      // ignore
    }
    throw new Error(msg)
  }
  return res.json() as Promise<T>
}

// ─── Public API ──────────────────────────────────────────────────────────────

/** La Liga 2 in football-data.org (used e.g. in PlayerAnalysisView). */
export const LALIGA2_LEAGUE_ID = 141
export const LALIGA2_COMPETITION_CODE = 'SD'

/**
 * Player search by name. football-data.org does not support this; returns empty.
 * Kept for API compatibility; app uses playersApi.searchPlayersLaLiga2 for real search.
 */
export async function searchPlayers(
  search: string,
  _options?: { league?: number; team?: number; season?: number }
): Promise<PlayersSearchResponse> {
  const q = search.trim()
  if (q.length < 4) {
    return {
      get: 'players',
      parameters: { search: q },
      errors: {},
      results: 0,
      paging: { current: 1, total: 0 },
      response: [],
    }
  }
  if (!API_TOKEN) {
    throw new Error('Add VITE_FOOTBALL_API_KEY to .env and restart dev server.')
  }
  return {
    get: 'players',
    parameters: { search: q },
    errors: { note: 'Player search by name is not available in football-data.org API' },
    results: 0,
    paging: { current: 1, total: 0 },
    response: [],
  }
}

const DEFAULT_TEAM_ID = 81 // Barcelona in football-data.org

/** Initial player list from football-data.org (one team squad). Rarely used; app prefers playersApi. */
export async function getInitialPlayers(): Promise<PlayersSearchResponse> {
  if (!API_TOKEN) {
    return {
      get: 'players',
      parameters: { search: '' },
      errors: {},
      results: 0,
      paging: { current: 1, total: 0 },
      response: [],
    }
  }
  try {
    const team = await request<{ id: number; name: string; crest?: string; squad?: FDSquadPerson[] }>(
      `/teams/${DEFAULT_TEAM_ID}`
    )
    const squad = team.squad ?? []
    const response = squadToPlayerResponses(squad, {
      id: team.id,
      name: team.name,
      crest: team.crest,
    })
    return {
      get: 'players',
      parameters: { search: '' },
      errors: {},
      results: response.length,
      paging: { current: 1, total: 1 },
      response,
    }
  } catch {
    return {
      get: 'players',
      parameters: { search: '' },
      errors: {},
      results: 0,
      paging: { current: 1, total: 0 },
      response: [],
    }
  }
}

/**
 * Get one player by ID from football-data.org. Used in PlayerAnalysisView.
 * Uses /persons/{id}; current team and position included when available.
 */
export async function getPlayer(id: number, _season: number = 2024): Promise<PlayersSearchResponse> {
  if (!API_TOKEN) {
    throw new Error('Add VITE_FOOTBALL_API_KEY to .env and restart dev server.')
  }
  try {
    const person = await request<{
      id: number
      firstName?: string | null
      lastName?: string | null
      name: string
      position?: string
      dateOfBirth?: string
      nationality?: string
      currentTeam?: { id: number; name: string; crest?: string } | null
    }>(`/persons/${id}`)
    const player: ApiPlayer = {
      id: person.id,
      name: person.name,
      firstname: person.firstName ?? '',
      lastname: person.lastName ?? '',
      age: person.dateOfBirth ? new Date().getFullYear() - new Date(person.dateOfBirth).getFullYear() : null,
      birth: { date: person.dateOfBirth ?? '', place: null, country: person.nationality ?? '' },
      nationality: person.nationality ?? '',
      height: null,
      weight: null,
      photo: '',
    }
    const statistics = person.currentTeam
      ? [
          {
            team: {
              id: person.currentTeam.id,
              name: person.currentTeam.name,
              logo: person.currentTeam.crest ?? '',
            },
            games: {
              position: person.position ?? '',
              rating: null,
              captain: false,
              minutes: 0,
              appearences: 0,
              lineups: 0,
              substitute_in: 0,
              substitute_out: 0,
            },
          },
        ]
      : undefined
    const response: ApiPlayerResponse[] = [{ player, statistics }]
    return {
      get: 'players',
      parameters: { search: '' },
      errors: {},
      results: 1,
      paging: { current: 1, total: 1 },
      response,
    }
  } catch {
    return {
      get: 'players',
      parameters: { search: '' },
      errors: {},
      results: 0,
      paging: { current: 1, total: 0 },
      response: [],
    }
  }
}
