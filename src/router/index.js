import { createRouter, createWebHashHistory } from 'vue-router'
import LoginView from '@/views/LoginView.vue'

const routes = [
  {
    path: '/',
    name: 'Login',
    component: LoginView
  },
  {
    path: '/home',
    name: 'Home',
    component: () => import(/* webpackChunkName: "home" */ '@/views/HomeView.vue')
  },
  {
    path: '/operate',
    name: 'Operate',
    component: () => import(/* webpackChunkName: "operate" */ '@/views/OperateView.vue')
  },
  {
    path: '/history',
    name: 'History',
    component: () => import(/* webpackChunkName: "history" */ '@/views/HistoryView.vue')
  },
  {
    path: '/balance',
    name: 'Balance',
    component: () => import(/* webpackChunkName: "balance" */ '@/views/BalanceView.vue')
  },
  {
    path: '/about',
    name: 'About',
    component: () => import(/* webpackChunkName: "about" */ '@/views/AboutView.vue')
  }
]
const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
