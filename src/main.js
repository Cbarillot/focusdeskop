import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import './style.css'

const app = createApp(App)
const pinia = createPinia()
app.use(pinia)

// Initialize theme colors after mounting
const mountedApp = app.mount('#app')

// Apply initial theme colors
import { useAppStore } from './stores/appStore'
const store = useAppStore()
store.applyThemeColors()