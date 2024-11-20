import { createRouter, createWebHashHistory } from 'vue-router'
import LoginView from '@/views/LoginView.vue'
import HomeView from '@/views/HomeView.vue'
import OperateView from '@/views/OperateView.vue'
import HistoryView from '@/views/HistoryView.vue'
import ControlView from '@/views/ControlView.vue'


const routes = [
  {
    path: '/',
    name: 'Login',
    component: LoginView
  },
  {
    path: '/home',
    name: 'Home',
    component: HomeView
  },
  {
    path: '/operate',
    name: 'Operate',
    component: OperateView
  },
  {
    path: '/history',
    name: 'History',
    component: HistoryView
  },
  {
    path: '/control',
    name: 'Control',
    component: ControlView
  },
]
const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
