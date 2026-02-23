/**
 * Standings API – league table (classification) only.
 *
 * Source: TheSportsDB (free tier: 5 requests/min for lookuptable).
 * Use this for: La Liga 2 table, any league standings.
 */

import type { StandingRow, StandingsResponse } from './types'

export type { StandingRow, StandingsResponse }

// ─── Config ─────────────────────────────────────────────────────────────────

const API_BASE = import.meta.env.DEV
  ? `${typeof location !== 'undefined' ? location.origin : ''}/api/thesportsdb`
  : 'https://www.thesportsdb.com/api/v1/json'
const API_KEY = (import.meta.env.VITE_THESPORTSDB_API_KEY ?? '123').trim()

/** La Liga 2 / Segunda División – TheSportsDB league ID. Use this for the standings page. */
export const THESPORTSDB_LALIGA2_LEAGUE_ID = '4400'

// ─── TheSportsDB raw response types (internal) ───────────────────────────────

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

// ─── Helpers ─────────────────────────────────────────────────────────────────

/** Parse API string to number; returns 0 if invalid. */
function toNum(s: string | undefined): number {
  if (s === undefined || s === null || s === '') return 0
  const n = parseInt(s, 10)
  return Number.isNaN(n) ? 0 : n
}

/** Current season in TheSportsDB format, e.g. "2025-2026". */
function getDefaultSeason(): string {
  return '2025-2026'
}

// ─── Public API ────────────────────────────────────────────────────────────────

/**
 * Fetch league standings (classification table).
 * @param leagueId – TheSportsDB league ID (default: La Liga 2)
 * @param season – Season string e.g. "2025-2026"
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
