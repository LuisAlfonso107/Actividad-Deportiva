/**
 * football-data.org API v4 – standings, teams, squad (players)
 * Docs: https://www.football-data.org/documentation/quickstart
 * API Reference: https://docs.football-data.org/general/v4/
 * Base: https://api.football-data.org/v4
 */

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

/* ---------- football-data.org response types ---------- */
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

/* ---------- App-facing types (unchanged for views) ---------- */
export interface ApiPlayer {
  id: number
  name: string
  firstname: string
  lastname: string
  common_name?: string
  display_name?: string
  age: number | null
  birth: { date: string; place: string | null; country: string }
  nationality: string
  height: string | null
  weight: string | null
  photo: string
  gender?: string
}

export interface ApiPlayerTeam {
  id: number
  name: string
  logo: string
}

export interface ApiPlayerResponse {
  player: ApiPlayer
  statistics?: Array<{
    team: ApiPlayerTeam
    games: {
      position: string
      rating: string | null
      captain: boolean
      minutes: number
      appearences: number
      lineups: number
      substitute_in: number
      substitute_out: number
    }
    goals?: { total: number; assists: number | null }
    shots?: { total: number; on: number | null }
    passes?: { total: number; accuracy: number | null }
    tackles?: { total: number }
    duels?: { total: number; won: number | null }
    dribbles?: { attempts: number; success: number | null }
    fouls?: { drawn: number; committed: number | null }
    cards?: { yellow: number; red: number }
    penalty?: { scored: number; missed: number }
  }>
}

export interface PlayersSearchResponse {
  get: string
  parameters: { search: string }
  errors: Record<string, unknown>
  results: number
  paging: { current: number; total: number }
  response: ApiPlayerResponse[]
}

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

/**
 * football-data.org does not offer player search by name; returns empty results.
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

/** Barcelona in football-data.org */
const DEFAULT_TEAM_ID = 81

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

/* ---------- Standings ---------- */
export interface StandingRow {
  rank: number
  team: { id: number; name: string; logo: string }
  points: number
  goalsDiff: number
  form: string
  played: number
  win: number
  draw: number
  lose: number
  goalsFor: number
  goalsAgainst: number
}

export interface StandingsResponse {
  leagueName: string
  leagueLogo?: string
  season: number
  standings: StandingRow[]
}

/** La Liga 2 = Segunda División, code "SD" in football-data.org */
export const LALIGA2_LEAGUE_ID = 141
export const LALIGA2_COMPETITION_CODE = 'SD'

/* ---------- Transfers (not provided by football-data.org) ---------- */
export interface TransferItem {
  player: { id: number; name: string; photo?: string }
  fromTeam: { id: number; name: string; logo: string }
  toTeam: { id: number; name: string; logo: string }
  type: string
  date: string
  fee?: string
}

export interface TeamTransfersResponse {
  teamId: number
  teamName: string
  teamLogo: string
  transfersIn: TransferItem[]
  transfersOut: TransferItem[]
}

export async function getTeamTransfers(_teamId: number): Promise<TeamTransfersResponse> {
  if (!API_TOKEN) {
    throw new Error('Add VITE_FOOTBALL_API_KEY to .env and restart dev server.')
  }
  return {
    teamId: _teamId,
    teamName: '',
    teamLogo: '',
    transfersIn: [],
    transfersOut: [],
  }
}

function mapStandingsResponse(res: {
  competition?: { id: number; name: string; emblem?: string }
  season?: { id?: number; startDate?: string }
  standings?: Array<{ type: string; table?: FDStandingsTableRow[] }>
}, seasonFallback: number): StandingsResponse {
  const totalTable = res.standings?.find((s) => s.type === 'TOTAL')?.table ?? []
  const seasonYear = res.season?.startDate ? new Date(res.season.startDate).getFullYear() : seasonFallback
  const standings: StandingRow[] = totalTable.map((row) => ({
    rank: row.position,
    team: {
      id: row.team.id,
      name: row.team.name,
      logo: row.team.crest ?? '',
    },
    points: row.points,
    goalsDiff: row.goalDifference,
    form: row.form ?? '',
    played: row.playedGames,
    win: row.won,
    draw: row.draw,
    lose: row.lost,
    goalsFor: row.goalsFor,
    goalsAgainst: row.goalsAgainst,
  }))
  return {
    leagueName: res.competition?.name ?? 'Segunda División',
    leagueLogo: res.competition?.emblem,
    season: seasonYear,
    standings,
  }
}

interface StandingsApiResponse {
  competition?: { id: number; name: string; emblem?: string }
  season?: { id?: number; startDate?: string }
  standings?: Array<{ type: string; table?: FDStandingsTableRow[] }>
}

export async function getStandings(
  _leagueId: number = LALIGA2_LEAGUE_ID,
  season: number = new Date().getFullYear()
): Promise<StandingsResponse> {
  if (!API_TOKEN) {
    throw new Error('Add VITE_FOOTBALL_API_KEY to .env and restart dev server.')
  }
  const seasonStr = season.toString()
  try {
    const res = await request<StandingsApiResponse>(`/competitions/${LALIGA2_COMPETITION_CODE}/standings`, { season: seasonStr })
    return mapStandingsResponse(res, season)
  } catch (err) {
    const is403 = err instanceof Error && (err.message.includes('403') || err.message.includes('forbidden'))
    if (is403) {
      try {
        const res = await request<StandingsApiResponse>('/competitions/PD/standings', { season: seasonStr })
        return mapStandingsResponse(res, season)
      } catch {
        throw new Error(
          'API access forbidden (403). Check your token at https://www.football-data.org/client/register and that your plan includes league standings.'
        )
      }
    }
    throw err
  }
}

/**
 * Get player by ID. football-data.org exposes persons; we try /persons/{id} and fallback to finding in a known team squad.
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
