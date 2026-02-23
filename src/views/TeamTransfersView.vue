<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { RouterLink } from 'vue-router'
import { useApiErrorStore } from '../stores/apiError'
import { getTeamTransfers, getTeamTransfersFromTheSportsDB, type TransferItem } from '../services/transfersApi'

const route = useRoute()
const router = useRouter()
const apiErrorStore = useApiErrorStore()
const loading = ref(true)
const error = ref<string | null>(null)
const transfersIn = ref<TransferItem[]>([])
const transfersOut = ref<TransferItem[]>([])
const teamName = ref('')
const teamLogo = ref('')
const thumbError = reactive<Record<string, boolean>>({})

const teamId = computed(() => Number(route.params.id))
const hasTransfers = computed(() => transfersIn.value.length > 0 || transfersOut.value.length > 0)

onMounted(async () => {
  const state = history.state as { teamName?: string; teamLogo?: string } | undefined
  teamName.value = state?.teamName ?? route.query.name as string ?? 'Equipo'
  teamLogo.value = state?.teamLogo ?? (route.query.logo as string) ?? ''

  if (!teamId.value || isNaN(teamId.value)) {
    error.value = 'Invalid team'
    loading.value = false
    return
  }
  try {
    let res
    try {
      res = await getTeamTransfersFromTheSportsDB(teamId.value, teamName.value || undefined, teamLogo.value || undefined)
    } catch {
      res = await getTeamTransfers(teamId.value)
    }
    transfersIn.value = res.transfersIn ?? []
    transfersOut.value = res.transfersOut ?? []
    if (res.teamName) teamName.value = res.teamName
    if (res.teamLogo) teamLogo.value = res.teamLogo
    if ((!teamName.value || teamName.value === 'Equipo') && (transfersIn.value.length > 0 || transfersOut.value.length > 0)) {
      const firstIn = res.transfersIn?.[0]?.toTeam
      const firstOut = res.transfersOut?.[0]?.fromTeam
      if (firstIn?.name) teamName.value = firstIn.name
      else if (firstOut?.name) teamName.value = firstOut.name
      if (firstIn?.logo) teamLogo.value = firstIn.logo
      else if (firstOut?.logo) teamLogo.value = firstOut.logo
    }
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Failed to load transfers'
    error.value = msg
    apiErrorStore.setError(msg)
  } finally {
    loading.value = false
  }
})

function goBack() {
  router.push('/laliga2')
}

function initials(name: string): string {
  const parts = name.trim().split(/\s+/)
  if (parts.length >= 2) return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
  if (parts[0]?.length >= 2) return parts[0].slice(0, 2).toUpperCase()
  return parts[0]?.[0]?.toUpperCase() ?? '?'
}

</script>

<template>
  <div class="transfers-page">
    <button type="button" class="back" @click="goBack">← Volver a La Liga 2</button>

    <div v-if="loading" class="loading">Cargando fichajes…</div>
    <div v-else-if="error" class="error">{{ error }}</div>

    <template v-else>
      <header class="team-header">
        <img v-if="teamLogo" :src="teamLogo" :alt="teamName" class="team-logo" />
        <h1>{{ teamName }}</h1>
      </header>

      <p v-if="!hasTransfers" class="empty">No hay fichajes registrados para este equipo.</p>

      <section v-if="transfersIn.length > 0" class="section">
        <h2>Plantilla / Altas (fichajes)</h2>
        <p class="section-hint">Jugadores del equipo. Pulsa en un nombre para ver su ficha (Analyse).</p>
        <ul class="transfer-list">
          <li v-for="(t, i) in transfersIn" :key="i" class="transfer-card in">
            <img
              v-if="t.player.photo && !thumbError['in-' + i]"
              :src="t.player.photo"
              :alt="t.player.name"
              class="player-thumb"
              @error="thumbError['in-' + i] = true"
            />
            <div v-else class="player-thumb player-thumb-placeholder" :aria-label="t.player.name">{{ initials(t.player.name) }}</div>
            <div class="player-info">
            <div class="transfer-teams" v-if="t.fromTeam.name && t.fromTeam.name !== '—'">
              <span class="team-name">Fichaje: {{ t.fromTeam.name }}</span>
              <span class="arrow">→</span>
              <span class="team-name to">{{ t.toTeam.name }}</span>
            </div>
            <div class="player-row">
              <RouterLink
                v-if="t.player.id || t.player.name"
                :to="{
                  name: 'player-analysis',
                  params: { id: String(t.player.id || 0) },
                  query: { name: t.player.name },
                }"
                class="player-name link"
              >
                {{ t.player.name }}
                <span class="link-hint">→ Ver ficha / Analyse</span>
              </RouterLink>
              <span v-else class="player-name">{{ t.player.name }}</span>
            </div>
            <div class="transfer-meta" v-if="t.date || t.type">
              <span v-if="t.date">{{ t.date }}</span>
              <span v-if="t.type" class="type">{{ t.type }}</span>
            </div>
            </div>
          </li>
        </ul>
      </section>

      <section v-if="transfersOut.length > 0" class="section">
        <h2>Ventas (jugadores que salen)</h2>
        <ul class="transfer-list">
          <li v-for="(t, i) in transfersOut" :key="'out-' + i" class="transfer-card out">
            <img
              v-if="t.player.photo && !thumbError['out-' + i]"
              :src="t.player.photo"
              :alt="t.player.name"
              class="player-thumb"
              @error="thumbError['out-' + i] = true"
            />
            <div v-else class="player-thumb player-thumb-placeholder" :aria-label="t.player.name">{{ initials(t.player.name) }}</div>
            <div class="player-info">
            <div class="transfer-teams">
              <span class="team-name from">{{ t.fromTeam.name }}</span>
              <span class="arrow">→</span>
              <span class="team-name">{{ t.toTeam.name }}</span>
            </div>
            <div class="player-row">
              <RouterLink
                v-if="t.player.id || t.player.name"
                :to="{
                  name: 'player-analysis',
                  params: { id: String(t.player.id || 0) },
                  query: { name: t.player.name },
                }"
                class="player-name link"
              >
                {{ t.player.name }}
                <span class="link-hint">→ Ver ficha / Analyse</span>
              </RouterLink>
              <span v-else class="player-name">{{ t.player.name }}</span>
            </div>
            <div class="transfer-meta" v-if="t.date || t.type">
              <span v-if="t.date">{{ t.date }}</span>
              <span v-if="t.type" class="type">{{ t.type }}</span>
            </div>
            </div>
          </li>
        </ul>
      </section>
    </template>
  </div>
</template>

<style scoped>
.transfers-page {
  max-width: 720px;
  margin: 0 auto;
  padding: 1.5rem;
}
.back {
  background: var(--color-background-mute);
  border: 1px solid var(--color-border);
  padding: 0.5rem 1rem;
  border-radius: 8px;
  cursor: pointer;
  margin-bottom: 1.5rem;
  color: var(--color-text);
}
.back:hover {
  background: var(--color-border-hover);
}
.loading,
.error {
  text-align: center;
  padding: 2rem;
}
.error {
  color: #c00;
}
.team-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
}
.team-header .team-logo {
  width: 56px;
  height: 56px;
  object-fit: contain;
}
.team-header h1 {
  font-size: 1.5rem;
  margin: 0;
}
.empty {
  opacity: 0.85;
}
.section {
  margin-bottom: 2rem;
}
.section h2 {
  font-size: 1.15rem;
  margin-bottom: 0.35rem;
  color: var(--color-heading);
}
.section-hint {
  font-size: 0.9rem;
  opacity: 0.85;
  margin-bottom: 0.75rem;
}
.transfer-list {
  list-style: none;
  padding: 0;
  margin: 0;
}
.transfer-card {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  padding: 1rem;
  border-radius: 10px;
  border: 1px solid var(--color-border);
  margin-bottom: 0.75rem;
  background: var(--color-background-soft);
}
.player-thumb {
  width: 48px;
  height: 48px;
  object-fit: cover;
  border-radius: 8px;
  background: var(--color-background-mute);
  flex-shrink: 0;
}
.player-thumb-placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 0.95rem;
  color: var(--color-text);
  opacity: 0.9;
}
.player-info {
  flex: 1;
  min-width: 0;
}
.transfer-card.in {
  border-left: 4px solid #0a7;
}
.transfer-card.out {
  border-left: 4px solid #c60;
}
.transfer-teams {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.5rem;
  font-size: 0.9rem;
  color: var(--color-text);
  opacity: 0.9;
}
.team-name {
  max-width: 140px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.team-name.to,
.team-name.from {
  font-weight: 600;
}
.transfer-card.in .team-name.to {
  color: #0a7;
}
.transfer-card.out .team-name.from {
  color: #c60;
}
.arrow {
  opacity: 0.7;
}
.player-row {
  margin-top: 0.35rem;
}
.player-name {
  font-weight: 600;
  font-size: 1.05rem;
}
.player-name.link {
  color: hsla(160, 100%, 37%, 1);
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.35rem;
}
.player-name.link:hover {
  text-decoration: underline;
}
.player-name.link .link-hint {
  font-size: 0.8rem;
  font-weight: 500;
  opacity: 0.85;
}
.transfer-meta {
  margin-top: 0.35rem;
  font-size: 0.85rem;
  opacity: 0.8;
}
.transfer-meta .type {
  margin-left: 0.5rem;
}
</style>
