/**
 * Players API – search, squad lists, and single-player profile.
 *
 * Source: TheSportsDB (free tier: 2 req/min search, 10 req/min squad).
 * Use this for: Home/Players list, search, and player profile page.
 */

import { getLaLigaStandings, THESPORTSDB_LALIGA2_LEAGUE_ID } from './standingsApi'
import type { ApiPlayerResponse, PlayersSearchResponse } from './types'

export type { ApiPlayerResponse, PlayersSearchResponse }

// ─── Config ─────────────────────────────────────────────────────────────────

const API_BASE = import.meta.env.DEV
  ? `${typeof location !== 'undefined' ? location.origin : ''}/api/thesportsdb`
  : 'https://www.thesportsdb.com/api/v1/json'
const API_KEY = (import.meta.env.VITE_THESPORTSDB_API_KEY ?? '123').trim()

const THESPORTSDB_BARCELONA_TEAM_ID = '133739'
const THESPORTSDB_ZARAGOZA_TEAM_ID = '134777'

// ─── TheSportsDB raw response types (internal) ──────────────────────────────

interface TheSportsDBPlayer {
  idPlayer?: string
  idTeam?: string
  strPlayer?: string
  strLastName?: string
  strTeam?: string
  strPosition?: string
  strThumb?: string
  strNationality?: string
  dateBorn?: string
  strSport?: string
  strSigning?: string
}

interface TheSportsDBPlayersResponse {
  player?: TheSportsDBPlayer[]
}

interface TheSportsDBLookupPlayerResponse {
  players?: TheSportsDBPlayer[]
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function toNum(s: string | undefined): number {
  if (s === undefined || s === null || s === '') return 0
  const n = parseInt(s, 10)
  return Number.isNaN(n) ? 0 : n
}

// ─── Cache (La Liga 2 team IDs for search filter) ────────────────────────────

let laliga2TeamIdsCache: Set<number> | null = null

/**
 * All TheSportsDB team IDs that are in La Liga 2. Cached per session.
 * Used so we only show La Liga 2 players in search.
 */
export async function getLaLiga2TeamIds(): Promise<Set<number>> {
  if (laliga2TeamIdsCache != null) return laliga2TeamIdsCache
  const { standings } = await getLaLigaStandings(THESPORTSDB_LALIGA2_LEAGUE_ID)
  laliga2TeamIdsCache = new Set(standings.map((row) => row.team.id).filter(Boolean))
  return laliga2TeamIdsCache
}

// ─── Public API: Search ─────────────────────────────────────────────────────

/**
 * Search players by name (TheSportsDB). Returns all matches; use searchPlayersLaLiga2 for La Liga 2 only.
 */
export async function searchPlayersTheSportsDB(q: string): Promise<PlayersSearchResponse> {
  const trimmed = q.trim()
  if (trimmed.length < 2) {
    return { get: 'players', parameters: { search: trimmed }, errors: {}, results: 0, paging: { current: 1, total: 0 }, response: [] }
  }
  const base = API_BASE.replace(/\/$/, '')
  const url = `${base}/${API_KEY}/searchplayers.php?p=${encodeURIComponent(trimmed)}`
  const res = await fetch(url)
  if (!res.ok) {
    throw new Error(`TheSportsDB error: ${res.status}`)
  }
  const text = await res.text()
  if (!text.trim()) {
    return { get: 'players', parameters: { search: q }, errors: {}, results: 0, paging: { current: 1, total: 0 }, response: [] }
  }
  let data: TheSportsDBPlayersResponse
  try {
    data = JSON.parse(text) as TheSportsDBPlayersResponse
  } catch {
    return { get: 'players', parameters: { search: q }, errors: {}, results: 0, paging: { current: 1, total: 0 }, response: [] }
  }
  const list = data.player ?? []
  const response: ApiPlayerResponse[] = list
    .filter((p) => (p.strSport ?? 'Soccer') === 'Soccer')
    .map((p) => {
      const name = p.strPlayer ?? '—'
      const last = p.strLastName ?? ''
      const first = last ? name.replace(new RegExp(`\\s*${last}$`), '').trim() : name.split(' ')[0] ?? name
      return {
        player: {
          id: toNum(p.idPlayer),
          name,
          firstname: first,
          lastname: last,
          age: p.dateBorn ? new Date().getFullYear() - new Date(p.dateBorn).getFullYear() : null,
          birth: { date: p.dateBorn ?? '', place: null, country: p.strNationality ?? '' },
          nationality: p.strNationality ?? '',
          height: null,
          weight: null,
          photo: p.strThumb ?? '',
        },
        statistics: [
          {
            team: { id: toNum(p.idTeam), name: p.strTeam ?? '—', logo: '' },
            games: {
              position: p.strPosition ?? '',
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
      }
    })
  return {
    get: 'players',
    parameters: { search: q },
    errors: {},
    results: response.length,
    paging: { current: 1, total: response.length },
    response,
  }
}

/**
 * Search by name and keep only La Liga 2 players with a photo. Use this on the Players page.
 */
export async function searchPlayersLaLiga2(q: string): Promise<PlayersSearchResponse> {
  const [teamIds, res] = await Promise.all([
    getLaLiga2TeamIds(),
    searchPlayersTheSportsDB(q),
  ])
  const all = res.response ?? []
  const filtered = all.filter((item) => {
    const teamId = item.statistics?.[0]?.team?.id
    const hasPhoto = (item.player?.photo ?? '').trim() !== ''
    return teamId != null && teamIds.has(teamId) && hasPhoto
  })
  return {
    get: res.get,
    parameters: res.parameters,
    errors: res.errors,
    results: filtered.length,
    paging: { current: 1, total: filtered.length },
    response: filtered,
  }
}

// ─── Public API: Squad lists ─────────────────────────────────────────────────

/**
 * Barcelona squad with photos (TheSportsDB).
 */
export async function getBarcelonaPlayersWithPhotos(): Promise<PlayersSearchResponse> {
  const base = API_BASE.replace(/\/$/, '')
  const url = `${base}/${API_KEY}/lookup_all_players.php?id=${THESPORTSDB_BARCELONA_TEAM_ID}`
  const res = await fetch(url)
  if (!res.ok) {
    throw new Error(`TheSportsDB error: ${res.status}`)
  }
  const text = await res.text()
  if (!text.trim()) {
    throw new Error('TheSportsDB returned an empty response.')
  }
  let data: TheSportsDBPlayersResponse
  try {
    data = JSON.parse(text) as TheSportsDBPlayersResponse
  } catch {
    throw new Error('Invalid response from TheSportsDB.')
  }
  const list = data.player ?? []
  const teamName = list[0]?.strTeam ?? 'FC Barcelona'
  const teamId = toNum(list[0]?.idTeam)
  const playersOnly = list.filter(
    (p) => p.strPosition && p.strPosition.toLowerCase() !== 'manager'
  )
  const response: ApiPlayerResponse[] = playersOnly.map((p) => {
    const name = p.strPlayer ?? '—'
    const last = p.strLastName ?? ''
    const first = last ? name.replace(new RegExp(`\\s*${last}$`), '').trim() : name.split(' ')[0] ?? name
    return {
      player: {
        id: toNum(p.idPlayer),
        name,
        firstname: first,
        lastname: last,
        age: p.dateBorn ? new Date().getFullYear() - new Date(p.dateBorn).getFullYear() : null,
        birth: { date: p.dateBorn ?? '', place: null, country: p.strNationality ?? '' },
        nationality: p.strNationality ?? '',
        height: null,
        weight: null,
        photo: p.strThumb ?? '',
      },
      statistics: [
        {
          team: { id: teamId, name: teamName, logo: '' },
          games: {
            position: p.strPosition ?? '',
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
    }
  })
  return {
    get: 'players',
    parameters: { search: '' },
    errors: {},
    results: response.length,
    paging: { current: 1, total: 1 },
    response,
  }
}

/** Fetch one team's players from TheSportsDB and map to our format. Internal use. */
async function fetchTeamPlayers(teamId: number, teamName: string): Promise<ApiPlayerResponse[]> {
  const base = API_BASE.replace(/\/$/, '')
  const url = `${base}/${API_KEY}/lookup_all_players.php?id=${teamId}`
  const res = await fetch(url)
  if (!res.ok) return []
  const text = await res.text()
  if (!text.trim()) return []
  let data: TheSportsDBPlayersResponse
  try {
    data = JSON.parse(text) as TheSportsDBPlayersResponse
  } catch {
    return []
  }
  const list = data.player ?? []
  const nameFromApi = list[0]?.strTeam ?? teamName
  const teamIdFromApi = toNum(list[0]?.idTeam) || teamId
  const playersOnly = list.filter(
    (p) =>
      p.strPosition &&
      p.strPosition.toLowerCase() !== 'manager' &&
      (p.strThumb ?? '').trim() !== ''
  )
  return playersOnly.map((p) => {
    const name = p.strPlayer ?? '—'
    const last = p.strLastName ?? ''
    const first = last ? name.replace(new RegExp(`\\s*${last}$`), '').trim() : name.split(' ')[0] ?? name
    return {
      player: {
        id: toNum(p.idPlayer),
        name,
        firstname: first,
        lastname: last,
        age: p.dateBorn ? new Date().getFullYear() - new Date(p.dateBorn).getFullYear() : null,
        birth: { date: p.dateBorn ?? '', place: null, country: p.strNationality ?? '' },
        nationality: p.strNationality ?? '',
        height: null,
        weight: null,
        photo: p.strThumb ?? '',
      },
      statistics: [
        {
          team: { id: teamIdFromApi, name: nameFromApi, logo: '' },
          games: {
            position: p.strPosition ?? '',
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
    }
  })
}

/**
 * Players from several La Liga 2 teams (top 8 in table). Use for Home and Players list.
 * Max 8 teams to respect API rate limits.
 */
export async function getLaLiga2PlayersFromMultipleTeams(): Promise<PlayersSearchResponse> {
  const { standings } = await getLaLigaStandings(THESPORTSDB_LALIGA2_LEAGUE_ID)
  const teamsToFetch = standings.slice(0, 8)
  const allPlayers: ApiPlayerResponse[] = []
  const seenIds = new Set<number>()
  for (const row of teamsToFetch) {
    const teamId = row.team.id
    const teamName = row.team.name
    if (!teamId) continue
    const teamPlayers = await fetchTeamPlayers(teamId, teamName)
    for (const item of teamPlayers) {
      if (!seenIds.has(item.player.id)) {
        seenIds.add(item.player.id)
        allPlayers.push(item)
      }
    }
  }
  return {
    get: 'players',
    parameters: { search: '' },
    errors: {},
    results: allPlayers.length,
    paging: { current: 1, total: allPlayers.length },
    response: allPlayers,
  }
}

/**
 * Real Zaragoza squad with photos (example La Liga 2 team).
 */
export async function getLaLiga2PlayersWithPhotos(): Promise<PlayersSearchResponse> {
  const teamPlayers = await fetchTeamPlayers(toNum(THESPORTSDB_ZARAGOZA_TEAM_ID), 'Real Zaragoza')
  return {
    get: 'players',
    parameters: { search: '' },
    errors: {},
    results: teamPlayers.length,
    paging: { current: 1, total: teamPlayers.length },
    response: teamPlayers,
  }
}

// ─── Public API: Single player ──────────────────────────────────────────────

/**
 * Fetch one player by ID. Use on the player profile / "Ver perfil" page.
 */
export async function getPlayerFromTheSportsDB(playerId: number | string): Promise<PlayersSearchResponse> {
  const base = API_BASE.replace(/\/$/, '')
  const url = `${base}/${API_KEY}/lookupplayer.php?id=${encodeURIComponent(String(playerId))}`
  const res = await fetch(url)
  if (!res.ok) {
    throw new Error(`TheSportsDB error: ${res.status}`)
  }
  const text = await res.text()
  if (!text.trim()) {
    throw new Error('TheSportsDB returned an empty response.')
  }
  let data: TheSportsDBLookupPlayerResponse
  try {
    data = JSON.parse(text) as TheSportsDBLookupPlayerResponse
  } catch {
    throw new Error('Invalid response from TheSportsDB.')
  }
  const list = data.players ?? []
  const p = list[0]
  if (!p) {
    return {
      get: 'players',
      parameters: { search: '' },
      errors: {},
      results: 0,
      paging: { current: 1, total: 0 },
      response: [],
    }
  }
  const name = p.strPlayer ?? '—'
  const last = p.strLastName ?? ''
  const first = last ? name.replace(new RegExp(`\\s*${last}$`), '').trim() : name.split(' ')[0] ?? name
  const teamId = toNum(p.idTeam)
  const response: ApiPlayerResponse[] = [
    {
      player: {
        id: toNum(p.idPlayer),
        name,
        firstname: first,
        lastname: last,
        age: p.dateBorn ? new Date().getFullYear() - new Date(p.dateBorn).getFullYear() : null,
        birth: { date: p.dateBorn ?? '', place: null, country: p.strNationality ?? '' },
        nationality: p.strNationality ?? '',
        height: null,
        weight: null,
        photo: p.strThumb ?? '',
      },
      statistics: [
        {
          team: { id: teamId, name: p.strTeam ?? '—', logo: '' },
          games: {
            position: p.strPosition ?? '',
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
    },
  ]
  return {
    get: 'players',
    parameters: { search: '' },
    errors: {},
    results: 1,
    paging: { current: 1, total: 1 },
    response,
  }
}
