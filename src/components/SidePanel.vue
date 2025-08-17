<template>
  <div 
    class="side-panel"
    :class="{ 'open': store.sidebarOpen }"
    :style="{ width: panelWidth + 'px' }"
  >
    <div 
      class="resize-handle"
      @mousedown="startResize"
    ></div>
    <!-- Header -->
    <div class="panel-header">
      <div class="header-top">
        <h2>Settings</h2>
        <button class="close-btn" @click="store.toggleSidebar()">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
      </div>
      
      <!-- Titre de l'onglet actif -->
      <h3 class="panel-title">
        {{ activeTabTitle }}
      </h3>
    </div>
    
    <!-- Panel Body: Slim vertical nav + content -->
    <div class="panel-body">
      <nav class="panel-nav">
        <button 
          v-for="tab in tabs"
          :key="tab.key"
          class="nav-tab"
          :class="{ active: store.activeTab === tab.key }"
          @click="store.setActiveTab(tab.key)"
          :title="tab.label"
        >
          <component :is="tab.icon" />
          <span>{{ tab.label }}</span>
        </button>
      </nav>
      
      <!-- Content Area -->
      <div class="panel-content">
        <div class="panel-component">
          <component :is="activeComponent" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, onMounted, onUnmounted, watch } from 'vue'
import { useAppStore } from '../stores/appStore'
import ThemeSettings from './panels/ThemeSettings.vue'
import TimerSettings from './panels/TimerSettings.vue'
import MusicSettings from './panels/MusicSettings.vue'
import TodoPanel from './panels/TodoPanel.vue'

// La gestion des couleurs a été déplacée dans ThemeSettings.vue

// Import des composants d'icônes
import ThemeIcon from './icons/ThemeIcon.vue'
import TimerIcon from './icons/TimerIcon.vue'
import MusicIcon from './icons/MusicIcon.vue'
import TodoIcon from './icons/TodoIcon.vue'

const store = useAppStore()
const panelWidth = ref(500) // Largeur par défaut augmentée pour mieux afficher le contenu
const isResizing = ref(false)
const startX = ref(0)
const startWidth = ref(500)

const minWidth = 300
const maxWidth = 800

function startResize(e) {
  isResizing.value = true
  startX.value = e.clientX
  startWidth.value = panelWidth.value
  
  document.addEventListener('mousemove', handleResize)
  document.addEventListener('mouseup', stopResize)
  document.body.style.cursor = 'col-resize'
  document.body.style.userSelect = 'none'
}

function handleResize(e) {
  if (!isResizing.value) return
  
  const dx = startX.value - e.clientX
  let newWidth = startWidth.value + dx
  
  // Limiter la largeur entre min et max
  newWidth = Math.max(minWidth, Math.min(maxWidth, newWidth))
  panelWidth.value = newWidth
}

function stopResize() {
  isResizing.value = false
  document.removeEventListener('mousemove', handleResize)
  document.removeEventListener('mouseup', stopResize)
  document.body.style.cursor = ''
  document.body.style.userSelect = ''
}

// Sauvegarder/charger la largeur du panneau
onMounted(() => {
  const savedWidth = localStorage.getItem('panelWidth')
  if (savedWidth) {
    panelWidth.value = parseInt(savedWidth, 10)
  }
  
  // Sauvegarder la largeur quand elle change
  const unwatch = watch(panelWidth, (newWidth) => {
    localStorage.setItem('panelWidth', newWidth.toString())
  })
  
  onUnmounted(() => {
    unwatch()
  })
})

const tabs = [
  {
    key: 'themes',
    label: 'Themes',
    icon: ThemeIcon,
    title: 'Theme Library'
  },
  {
    key: 'timer',
    label: 'Timer',
    icon: TimerIcon,
    title: 'Timer Settings'
  },
  {
    key: 'music',
    label: 'Music',
    icon: MusicIcon,
    title: 'Music Player'
  },
  {
    key: 'todo',
    label: 'Tasks',
    icon: TodoIcon,
    title: 'Tasks & Todo'
  }
]

const activeComponent = computed(() => {
  switch (store.activeTab) {
    case 'themes': return ThemeSettings
    case 'timer': return TimerSettings
    case 'music': return MusicSettings
    case 'todo': return TodoPanel
    default: return ThemeSettings
  }
})

const activeTabTitle = computed(() => {
  const tab = tabs.find(t => t.key === store.activeTab)
  return tab ? tab.title : ''
})
</script>

<style scoped>
.side-panel {
  height: 100%;
  display: flex;
  flex-direction: column;
  /* Adaptive background following dominant theme color, 65% opacity */
  background: rgba(var(--dominant-rgb, 0, 0, 0), 0.65);
  backdrop-filter: blur(20px);
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  width: 400px;
  min-width: 300px;
  max-width: 90%;
  transition: transform 0.3s ease, width 0.2s ease;
  z-index: 1000;
  transform: translateX(100%);
  will-change: transform, width;
}

.side-panel.open {
  transform: translateX(0);
}

/* Poignée de redimensionnement */
.resize-handle {
  position: absolute;
  top: 0;
  left: -4px;
  width: 8px;
  height: 100%;
  cursor: col-resize;
  z-index: 1001;
  opacity: 0;
  transition: opacity 0.2s;
  background: transparent;
}

.side-panel:hover .resize-handle {
  opacity: 0.5;
  background: linear-gradient(90deg, rgba(255,255,255,0.3), transparent);
}

.resize-handle:hover,
.resize-handle:active {
  opacity: 1 !important;
  background: var(--color-primary) !important;
}

.panel-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 24px;
  border-bottom: 1px solid var(--color-border);
}

.panel-header h2 {
  margin: 0;
  font-size: 20px;
  font-weight: 600;
  color: var(--color-text-primary);
}

.close-btn {
  width: 40px;
  height: 40px;
  border-radius: var(--border-radius-full);
  background: transparent;
  color: var(--color-text-secondary);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all var(--transition-fast);
}

.close-btn:hover {
  background: rgba(255, 255, 255, 0.1);
  color: var(--color-text-primary);
}

.panel-body {
  display: flex;
  flex: 1 1 auto;
  min-height: 0; /* allow children to scroll */
}

.panel-nav {
  flex: 0 0 92px; /* slim vertical bar */
  padding: 16px 10px;
  border-right: 1px solid var(--color-border);
  border-bottom: none;
  display: flex;
  flex-direction: column;
  gap: 8px;
  overflow-y: auto; /* slide vertical */
}

.nav-tab {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  width: 100%;
  text-align: left;
  background: transparent;
  border: none;
  color: white;
  font-size: 0.9rem;
  font-weight: 500;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.nav-tab:hover {
  background: rgba(255, 255, 255, 0.2);
  color: white;
}

.nav-tab.active {
  background: var(--color-primary, #3B82F6);
  color: white;
  font-weight: 500;
}

.nav-tab:last-child {
  margin-bottom: 0;
}

.panel-content {
  flex: 1;
  padding: 20px;
  overflow-y: auto;
  overflow-x: hidden;
  display: flex;
  flex-direction: column;
  gap: 20px;
  background: rgba(0, 0, 0, 0.1);
}

.panel-title {
  font-size: 1.1rem;
  font-weight: 600;
  margin: 8px 0 12px 0;
  color: white;
  text-align: center;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.panel-title::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 40px;
  height: 3px;
  background: var(--accent-color, #7C3AED);
  border-radius: 3px;
  box-shadow: 0 0 10px var(--accent-color, #7C3AED);
}

.panel-component {
  flex: 1;
  display: flex;
  flex-direction: column;
}

/* Responsive */
@media (max-width: 480px) {
  .panel-header {
    padding: 20px;
  }
  .panel-nav {
    flex-basis: 80px;
    padding: 12px 8px;
  }
  
  .nav-tab {
    padding: 8px 6px;
    font-size: 11px;
  }
  
  .panel-content {
    padding: 20px;
  }
}
</style>
