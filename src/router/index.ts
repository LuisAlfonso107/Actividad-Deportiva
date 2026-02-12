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
      path: '/player/:id',
      name: 'player-analysis',
      component: () => import('../views/PlayerAnalysisView.vue'),
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
