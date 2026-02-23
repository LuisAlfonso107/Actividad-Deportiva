/**
 * Transfers API – team arrivals and departures (squad as "transfers in").
 *
 * football-data.org: no transfers on free tier (getTeamTransfers returns empty).
 * TheSportsDB: we use the squad list as "transfers in" for the club page.
 */

import type { TeamTransfersResponse, TransferItem } from './types'

export type { TransferItem, TeamTransfersResponse }

// ─── Config ─────────────────────────────────────────────────────────────────

const API_BASE = import.meta.env.DEV
  ? `${typeof location !== 'undefined' ? location.origin : ''}/api/thesportsdb`
  : 'https://www.thesportsdb.com/api/v1/json'
const API_KEY = (import.meta.env.VITE_THESPORTSDB_API_KEY ?? '123').trim()

// ─── TheSportsDB raw types (internal) ─────────────────────────────────────────

interface TheSportsDBPlayer {
  idPlayer?: string
  idTeam?: string
  strPlayer?: string
  strTeam?: string
  strPosition?: string
  strThumb?: string
  strSport?: string
  strSigning?: string
}

interface TheSportsDBPlayersResponse {
  player?: TheSportsDBPlayer[]
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function toNum(s: string | undefined): number {
  if (s === undefined || s === null || s === '') return 0
  const n = parseInt(s, 10)
  return Number.isNaN(n) ? 0 : n
}

// ─── Public API ──────────────────────────────────────────────────────────────

/**
 * football-data.org transfers. On free tier this returns empty; kept for API compatibility.
 */
export async function getTeamTransfers(_teamId: number): Promise<TeamTransfersResponse> {
  return {
    teamId: _teamId,
    teamName: '',
    teamLogo: '',
    transfersIn: [],
    transfersOut: [],
  }
}

/**
 * Team squad from TheSportsDB shown as "transfers in". Use on the club/team page.
 * Note: transfersOut is not provided by the API (empty array).
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
