import { createApp } from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import store from './store'
import { createPinia } from 'pinia'
const pinia = createPinia()


createApp(App).use(store).use(pinia).use(router).mount('#app')



