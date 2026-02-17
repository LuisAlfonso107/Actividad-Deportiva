/**
 * TheSportsDB API v1 – used for La Liga standings (league table) and player photos
 * Docs: https://www.thesportsdb.com/documentation#free_vs_premium
 * Free key: 123 | Premium: from user profile
 */

import type {
  ApiPlayerResponse,
  PlayersSearchResponse,
  StandingRow,
  StandingsResponse,
  TeamTransfersResponse,
  TransferItem,
} from './footballApi'

const API_BASE = import.meta.env.DEV
  ? `${typeof location !== 'undefined' ? location.origin : ''}/api/thesportsdb`
  : 'https://www.thesportsdb.com/api/v1/json'
const API_KEY = (import.meta.env.VITE_THESPORTSDB_API_KEY ?? '123').trim()

/** Spanish La Liga (Primera División) – TheSportsDB league ID */
export const THESPORTSDB_LALIGA_LEAGUE_ID = '4335'
/** La Liga 2 / Segunda División – TheSportsDB league ID */
export const THESPORTSDB_LALIGA2_LEAGUE_ID = '4400'

/** Barcelona – TheSportsDB team ID (for player list with photos) */
export const THESPORTSDB_BARCELONA_TEAM_ID = '133739'
/** Real Zaragoza – TheSportsDB team ID (example La Liga 2 team for player list) */
export const THESPORTSDB_ZARAGOZA_TEAM_ID = '134777'

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

interface TheSportsDBTableRow {
  idStanding?: string
  intRank?: string
  idTeam?: string
  strTeam?: string
  strBadge?: string
  idLeague?: string
  strLeague?: string
  strSeason?: string
  strForm?: string
  intPlayed?: string
  intWin?: string
  intDraw?: string
  intLoss?: string
  intGoalsFor?: string
  intGoalsAgainst?: string
  intGoalDifference?: string
  intPoints?: string
}

interface TheSportsDBTableResponse {
  table?: TheSportsDBTableRow[]
}

function toNum(s: string | undefined): number {
  if (s === undefined || s === null || s === '') return 0
  const n = parseInt(s, 10)
  return Number.isNaN(n) ? 0 : n
}

/** Build season string in TheSportsDB format, e.g. "2025-2026". Default: live season for 2026. */
function getDefaultSeason(): string {
  return '2025-2026'
}

/**
 * Get La Liga (or other league) standings from TheSportsDB.
 * Free tier: 5 requests per minute for lookuptable (see docs).
 */
export async function getLaLigaStandings(
  leagueId: string = THESPORTSDB_LALIGA2_LEAGUE_ID,
  season: string = getDefaultSeason()
): Promise<StandingsResponse> {
  const base = API_BASE.replace(/\/$/, '')
  const url = `${base}/${API_KEY}/lookuptable.php?l=${encodeURIComponent(leagueId)}&s=${encodeURIComponent(season)}`
  const res = await fetch(url)
  if (!res.ok) {
    throw new Error(`TheSportsDB error: ${res.status}. Check https://www.thesportsdb.com/documentation#free_vs_premium`)
  }
  const text = await res.text()
  if (!text.trim()) {
    throw new Error('TheSportsDB returned an empty response. Try again or check the season.')
  }
  let data: TheSportsDBTableResponse
  try {
    data = JSON.parse(text) as TheSportsDBTableResponse
  } catch {
    throw new Error('Invalid response from TheSportsDB. Try again later.')
  }
  const table = data.table ?? []
  const first = table[0]
  const leagueName = first?.strLeague ?? 'Spanish La Liga'
  const parts = first?.strSeason?.split('-') ?? []
  const seasonYear = parts.length >= 2 ? toNum(parts[1]) : parts.length === 1 ? toNum(parts[0]) : new Date().getFullYear()

  const standings: StandingRow[] = table.map((row, index) => ({
    rank: toNum(row.intRank) || index + 1,
    team: {
      id: toNum(row.idTeam),
      name: row.strTeam ?? '—',
      logo: row.strBadge ?? '',
    },
    points: toNum(row.intPoints),
    goalsDiff: toNum(row.intGoalDifference),
    form: row.strForm ?? '',
    played: toNum(row.intPlayed),
    win: toNum(row.intWin),
    draw: toNum(row.intDraw),
    lose: toNum(row.intLoss),
    goalsFor: toNum(row.intGoalsFor),
    goalsAgainst: toNum(row.intGoalsAgainst),
  }))

  return {
    leagueName,
    leagueLogo: undefined,
    season: seasonYear,
    standings,
  }
}

/**
 * Search players by name using TheSportsDB (searchplayers.php).
 * Free tier: 2 requests per minute. Returns players with photos.
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

/** Cached La Liga 2 team IDs (TheSportsDB) so search can filter by league. */
let laliga2TeamIdsCache: Set<number> | null = null

/**
 * Get the set of TheSportsDB team IDs that belong to La Liga 2 (from league table).
 * Result is cached for the session.
 */
export async function getLaLiga2TeamIds(): Promise<Set<number>> {
  if (laliga2TeamIdsCache != null) return laliga2TeamIdsCache
  const { standings } = await getLaLigaStandings(THESPORTSDB_LALIGA2_LEAGUE_ID)
  laliga2TeamIdsCache = new Set(standings.map((row) => row.team.id).filter(Boolean))
  return laliga2TeamIdsCache
}

/**
 * Search players by name and return only those in La Liga 2 (Segunda División).
 * Uses TheSportsDB search then filters by La Liga 2 team IDs.
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

/**
 * Get Barcelona squad with player photos from TheSportsDB (for home page initial list).
 * Free tier: 10 requests per minute for list endpoints.
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
  // Exclude manager/coach
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

/**
 * Fetch one team's players and map to ApiPlayerResponse[] (shared logic for La Liga 2).
 */
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
 * Get La Liga 2 players from multiple teams (for home "Jugadores Destacados").
 * Uses standings to get team list, then fetches players from several teams. Max 8 teams to respect rate limits.
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
 * Get Real Zaragoza squad with player photos from TheSportsDB (for home page initial list - La Liga 2).
 * Free tier: 10 requests per minute for list endpoints.
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

/** TheSportsDB lookupplayer.php returns { players: [...] } */
interface TheSportsDBLookupPlayerResponse {
  players?: TheSportsDBPlayer[]
}

/**
 * Get a single player by TheSportsDB id (for "Analyse" when the player came from TheSportsDB list).
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

/**
 * Get team squad from TheSportsDB as "transfers in" (arrivals / signings) so the club page
 * can show who joined (with strSigning info). Clicking a player goes to Analyse.
 * transfersOut not available from API.
 */
export async function getTeamTransfersFromTheSportsDB(
  teamId: number | string,
  teamName?: string,
  teamLogo?: string
): Promise<TeamTransfersResponse> {
  const base = API_BASE.replace(/\/$/, '')
  const url = `${base}/${API_KEY}/lookup_all_players.php?id=${encodeURIComponent(String(teamId))}`
  const res = await fetch(url)
  if (!res.ok) {
    throw new Error(`TheSportsDB error: ${res.status}`)
  }
  const text = await res.text()
  if (!text.trim()) {
    return {
      teamId: toNum(String(teamId)),
      teamName: teamName ?? '',
      teamLogo: teamLogo ?? '',
      transfersIn: [],
      transfersOut: [],
    }
  }
  let data: TheSportsDBPlayersResponse
  try {
    data = JSON.parse(text) as TheSportsDBPlayersResponse
  } catch {
    return {
      teamId: toNum(String(teamId)),
      teamName: teamName ?? '',
      teamLogo: teamLogo ?? '',
      transfersIn: [],
      transfersOut: [],
    }
  }
  const list = data.player ?? []
  const name = teamName ?? list[0]?.strTeam ?? ''
  const tid = toNum(String(teamId))
  const transfersIn: TransferItem[] = list
    .filter((p) => (p.strSport ?? 'Soccer') === 'Soccer' && (p.strPosition ?? '').toLowerCase() !== 'manager')
    .map((p) => ({
      player: { id: toNum(p.idPlayer), name: p.strPlayer ?? '—', photo: p.strThumb ?? '' },
      fromTeam: { id: 0, name: p.strSigning?.trim() ? p.strSigning : '—', logo: '' },
      toTeam: { id: tid, name, logo: teamLogo ?? '' },
      type: p.strSigning ?? '',
      date: '',
    }))
  return {
    teamId: tid,
    teamName: name,
    teamLogo: teamLogo ?? '',
    transfersIn,
    transfersOut: [],
  }
}
