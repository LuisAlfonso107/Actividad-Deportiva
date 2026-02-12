/**
 * API-Football (api-sports.io) – full player info + club
 * Docs: https://www.api-football.com/documentation-v3
 * Base: https://v3.football.api-sports.io
 */

const API_BASE = import.meta.env.DEV
  ? `${typeof location !== 'undefined' ? location.origin : ''}/api/apifootball`
  : 'https://v3.football.api-sports.io'
const API_KEY = (import.meta.env.VITE_FOOTBALL_API_KEY ?? import.meta.env.VITE_APIFOOTBALL_KEY ?? '').trim()

/* ---------- API-Football response types ---------- */
export interface ApiFootballPlayer {
  id: number
  name: string
  firstname: string
  lastname: string
  age: number | null
  birth: { date: string; place: string | null; country: string }
  nationality: string
  height: string | null
  weight: string | null
  photo: string
}

export interface ApiFootballTeam {
  id: number
  name: string
  logo: string
}

export interface ApiFootballStatistic {
  team: ApiFootballTeam
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
}

export interface ApiFootballPlayerResponse {
  player: ApiFootballPlayer
  statistics: ApiFootballStatistic[]
}

export interface ApiFootballApiResponse {
  get: string
  parameters: Record<string, string | number>
  errors: Record<string, unknown>
  results: number
  paging: { current: number; total: number }
  response: ApiFootballPlayerResponse[]
}

/* ---------- App-facing types (same as before for views) ---------- */
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

function mapOne(item: ApiFootballPlayerResponse): ApiPlayerResponse {
  const p = item.player
  const player: ApiPlayer = {
    id: p.id,
    name: p.name,
    firstname: p.firstname,
    lastname: p.lastname,
    age: p.age,
    birth: p.birth ?? { date: '', place: null, country: '' },
    nationality: p.nationality ?? '',
    height: p.height ?? null,
    weight: p.weight ?? null,
    photo: p.photo ?? '',
  }
  const statistics = (item.statistics ?? []).map((s) => ({
    team: {
      id: s.team.id,
      name: s.team.name,
      logo: s.team.logo ?? '',
    },
    games: s.games,
    goals: s.goals,
    shots: s.shots,
    passes: s.passes,
    tackles: s.tackles,
    duels: s.duels,
    dribbles: s.dribbles,
    fouls: s.fouls,
    cards: s.cards,
    penalty: s.penalty,
  }))
  return { player, statistics: statistics.length ? statistics : undefined }
}

async function request<T>(path: string, params: Record<string, string | number> = {}): Promise<T> {
  const base = API_BASE.endsWith('/') ? API_BASE : API_BASE + '/'
  const pathRelative = path.startsWith('/') ? path.slice(1) : path
  const url = new URL(pathRelative, base)
  Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, String(v)))
  const res = await fetch(url.toString(), {
    headers: {
      'x-apisports-key': API_KEY,
      Accept: 'application/json',
    },
  })
  if (res.status === 401) {
    throw new Error('Invalid or missing API key. Check VITE_FOOTBALL_API_KEY in .env')
  }
  if (res.status === 429) {
    throw new Error('API limit reached (429). Free tier has a daily limit – try again later.')
  }
  if (res.status === 403) {
    throw new Error('API access forbidden (403). Check your plan or API key.')
  }
  if (!res.ok) {
    let msg = `API error: ${res.status}`
    try {
      const body = await res.json() as { message?: string; errors?: Record<string, unknown> }
      if (body?.message) msg = body.message
      else if (body?.errors && typeof body.errors === 'object') {
        const first = Object.values(body.errors)[0]
        if (first) msg = String(first)
      }
    } catch {
      // ignore
    }
    throw new Error(msg)
  }
  return res.json() as Promise<T>
}

/**
 * Search players by name. Uses league 39 (Premier League) if no league/team given.
 */
export async function searchPlayers(
  search: string,
  options?: { league?: number; team?: number; season?: number }
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
  if (!API_KEY) {
    throw new Error('Add VITE_FOOTBALL_API_KEY to .env and restart dev server.')
  }
  const params: Record<string, string | number> = {
    search: q,
    season: options?.season ?? 2024,
  }
  if (options?.league) params.league = options.league
  if (options?.team) params.team = options.team
  if (!params.league && !params.team) params.league = 39

  const res = await request<ApiFootballApiResponse>('/players', params)
  const response = (res.response ?? []).map(mapOne)
  return {
    get: res.get,
    parameters: { search: q },
    errors: res.errors ?? {},
    results: response.length,
    paging: res.paging ?? { current: 1, total: 1 },
    response,
  }
}

/**
 * Initial list: show one club's squad (e.g. Barcelona) so we have players + club.
 */
const DEFAULT_TEAM_ID = 529 // Barcelona – change to any team id you like
export async function getInitialPlayers(): Promise<PlayersSearchResponse> {
  if (!API_KEY) {
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
    const res = await request<ApiFootballApiResponse>('/players', {
      team: DEFAULT_TEAM_ID,
      season: 2024,
    })
    const response = (res.response ?? []).map(mapOne)
    return {
      get: res.get,
      parameters: { search: '' },
      errors: {},
      results: response.length,
      paging: res.paging ?? { current: 1, total: 1 },
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

/* ---------- Standings (La Liga 2, etc.) ---------- */
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

/** La Liga 2 = Segunda División, league id 141 in API-Football */
export const LALIGA2_LEAGUE_ID = 141

/* ---------- Transfers (in/out by team) ---------- */
export interface TransferItem {
  player: { id: number; name: string }
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

export async function getTeamTransfers(teamId: number): Promise<TeamTransfersResponse> {
  if (!API_KEY) {
    throw new Error('Add VITE_FOOTBALL_API_KEY to .env and restart dev server.')
  }
  const res = await request<{
    response?: Array<{
      player?: { id?: number; name?: string }
      update?: string
      transfers?: Array<{
        date?: string
        type?: string
        team?: { id: number; name: string; logo?: string }
        teams?: { in?: { id: number; name: string; logo?: string }; out?: { id: number; name: string; logo?: string } }
      }>
    }>
  }>('/transfers', { team: teamId })
  const list = res.response ?? []
  const transfersIn: TransferItem[] = []
  const transfersOut: TransferItem[] = []
  for (const item of list) {
    const transfers = item.transfers ?? []
    for (const t of transfers) {
      const from = t.teams?.out ?? t.team
      const to = t.teams?.in ?? t.team
      if (!from || !to) continue
      const row: TransferItem = {
        player: { id: item.player?.id ?? 0, name: item.player?.name ?? '—' },
        fromTeam: { id: from.id, name: from.name, logo: from.logo ?? '' },
        toTeam: { id: to.id, name: to.name, logo: to.logo ?? '' },
        type: t.type ?? '',
        date: t.date ?? '',
      }
      if (to.id === teamId) transfersIn.push(row)
      if (from.id === teamId) transfersOut.push(row)
    }
  }
  return {
    teamId,
    teamName: '',
    teamLogo: '',
    transfersIn,
    transfersOut,
  }
}

export async function getStandings(
  leagueId: number = LALIGA2_LEAGUE_ID,
  season: number = 2024
): Promise<StandingsResponse> {
  if (!API_KEY) {
    throw new Error('Add VITE_FOOTBALL_API_KEY to .env and restart dev server.')
  }
  const res = await request<{
    response?: Array<{
      league: { id: number; name: string; logo?: string; standings?: Array<Array<{
        rank: number
        team: { id: number; name: string; logo: string }
        points: number
        goalsDiff: number
        form?: string
        all?: { played: number; win: number; draw: number; lose: number; goals: { for: number; against: number } }
      }>> }
      season?: number
    }>
  }>('/standings', { league: leagueId, season })
  const first = res.response?.[0]
  const league = first?.league
  const rawStandings = league?.standings?.[0] ?? []
  const standings: StandingRow[] = rawStandings.map((row: {
    rank: number
    team: { id: number; name: string; logo: string }
    points: number
    goalsDiff: number
    form?: string
    all?: { played: number; win: number; draw: number; lose: number; goals: { for: number; against: number } }
  }) => ({
    rank: row.rank,
    team: row.team ?? { id: 0, name: '', logo: '' },
    points: row.points ?? 0,
    goalsDiff: row.goalsDiff ?? 0,
    form: row.form ?? '',
    played: row.all?.played ?? 0,
    win: row.all?.win ?? 0,
    draw: row.all?.draw ?? 0,
    lose: row.all?.lose ?? 0,
    goalsFor: row.all?.goals?.for ?? 0,
    goalsAgainst: row.all?.goals?.against ?? 0,
  }))
  return {
    leagueName: league?.name ?? 'La Liga 2',
    leagueLogo: league?.logo,
    season: first?.season ?? season,
    standings,
  }
}

/**
 * Get full player info + all clubs (teams) and statistics by ID.
 */
export async function getPlayer(id: number, season: number = 2024): Promise<PlayersSearchResponse> {
  if (!API_KEY) {
    throw new Error('Add VITE_FOOTBALL_API_KEY to .env and restart dev server.')
  }
  const res = await request<ApiFootballApiResponse>('/players', { id, season })
  const list = res.response ?? []
  const response = list.map(mapOne)
  return {
    get: res.get,
    parameters: { search: '' },
    errors: res.errors ?? {},
    results: response.length,
    paging: { current: 1, total: response.length ? 1 : 0 },
    response,
  }
}
