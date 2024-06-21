import { createApp } from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import store from './store'
import { CreatePinia } from 'pinia'
const pinia = CreatePinia()

createApp(App).use(store).use(router).use(pinia).mount('#app')