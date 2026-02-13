import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/players',
      name: 'players',
      component: () => import('../views/PlayersView.vue'),
    },
    {
      path: '/player/:id',
      name: 'player',
      component: () => import('../views/PlayerView.vue'),
    },
    {
      path: '/player/:id/analysis',
      name: 'player-analysis',
      component: () => import('../views/PlayerAnalysisView.vue'),
    },
    {
      path: '/favorites',
      name: 'favorites',
      component: () => import('../views/FavoritesView.vue'),
    },
    {
      path: '/market',
      name: 'market',
      component: () => import('../views/MarketView.vue'),
    },
    {
      path: '/news',
      name: 'news',
      component: () => import('../views/NewsView.vue'),
    },
    {
      path: '/profile',
      name: 'profile',
      component: () => import('../views/ProfileView.vue'),
    },
    {
      path: '/settings',
      name: 'settings',
      component: () => import('../views/SettingsView.vue'),
    },
    {
      path: '/laliga2',
      name: 'laliga2-standings',
      component: () => import('../views/LaLiga2StandingsView.vue'),
    },
    {
      path: '/team/:id/transfers',
      name: 'team-transfers',
      component: () => import('../views/TeamTransfersView.vue'),
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('../views/AboutView.vue'),
    },
  ],
})

export default router
