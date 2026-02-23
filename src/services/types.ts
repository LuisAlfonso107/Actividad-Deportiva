/**
 * Shared TypeScript types for the app.
 * Used by: standingsApi, playersApi, transfersApi, footballApi.
 *
 * All APIs return data in these shapes so views can use one consistent format.
 */

// ─── Player (used in search, squad, profile) ─────────────────────────────────

/** A single player: id, name, age, photo, etc. */
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

/** Team info attached to a player (e.g. current club). */
export interface ApiPlayerTeam {
  id: number
  name: string
  logo: string
}

/** One player plus optional stats (team, position, games). */
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

/** Response from any "search players" or "list players" API. */
export interface PlayersSearchResponse {
  get: string
  parameters: { search: string }
  errors: Record<string, unknown>
  results: number
  paging: { current: number; total: number }
  response: ApiPlayerResponse[]
}

// ─── Standings / league table ────────────────────────────────────────────────

/** One row in the league table (team, points, goals, etc.). */
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

/** Full standings response: league name, season, and list of rows. */
export interface StandingsResponse {
  leagueName: string
  leagueLogo?: string
  season: number
  standings: StandingRow[]
}

// ─── Transfers ───────────────────────────────────────────────────────────────

/** One transfer: player, from team, to team, type, date. */
export interface TransferItem {
  player: { id: number; name: string; photo?: string }
  fromTeam: { id: number; name: string; logo: string }
  toTeam: { id: number; name: string; logo: string }
  type: string
  date: string
  fee?: string
}

/** All transfers for a team: name, logo, arrivals and departures. */
export interface TeamTransfersResponse {
  teamId: number
  teamName: string
  teamLogo: string
  transfersIn: TransferItem[]
  transfersOut: TransferItem[]
}
