<template>
  <div class="app">
    <!-- Dynamic Background -->
    <DynamicBackground />

    <!-- Main Layout -->
    <div class="main-layout">
      <!-- Header with Settings Button -->
      <header class="app-header">
        <button 
          class="settings-btn"
          @click="openSettings"
          :class="{ active: store.sidebarOpen }"
          title="Paramètres"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M3 12H21M3 6H21M3 18H21" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
      </header>
      
      <!-- Main Content Area - Changes based on mood -->
      <main class="main-content">
        <component :is="currentLayout" />
      </main>

      <!-- Corner Navigation - for fixed elements -->
      <CornerNavigation />
      
      <!-- Mood Bar - for mood switching -->
      <MoodBar />
    </div>

    <!-- Side Panel -->
    <Transition name="slide">
      <div v-if="store.sidebarOpen" class="sidebar">
        <SidePanel />
      </div>
    </Transition>

    <!-- Sidebar Overlay -->
    <Transition name="fade">
      <div 
        v-if="store.sidebarOpen" 
        class="sidebar-overlay"
        @click="store.toggleSidebar()"
      ></div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useAppStore } from './stores/appStore'
import DynamicBackground from './components/DynamicBackground.vue'
import SidePanel from './components/SidePanel.vue'
import CornerNavigation from './components/CornerNavigation.vue'
import MoodBar from './components/MoodBar.vue'
import HomeLayout from './components/layouts/HomeLayout.vue'
import AmbienceLayout from './components/layouts/AmbienceLayout.vue'
import FocusLayout from './components/layouts/FocusLayout.vue'

const store = useAppStore()

// Get current layout component based on mood
const currentLayout = computed(() => {
  switch (store.mood) {
    case 'home':
      return HomeLayout
    case 'ambience':
      return AmbienceLayout
    case 'focus':
      return FocusLayout
    default:
      return FocusLayout
  }
})

// Ouvre la sidebar et sélectionne l'onglet "settings"
function openSettings() {
  store.setActiveTab('settings') // ou 'timer', selon ta logique SidePanel.vue
  if (!store.sidebarOpen) {
    store.toggleSidebar()
  }
}
</script>

<style scoped>
.app {
  min-height: 100vh;
  position: relative;
  overflow: hidden;
}

.main-layout {
  position: relative;
  z-index: 1;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

/* Header */
.app-header {
  position: fixed;
  top: 20px;
  left: 20px;
  z-index: 100;
}

.settings-btn {
  width: 48px;
  height: 48px;
  border-radius: var(--border-radius-full);
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid var(--color-border);
  color: var(--color-text-primary);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all var(--transition-normal);
}

.settings-btn:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: scale(1.05);
}

.settings-btn.active {
  background: var(--color-primary);
  border-color: var(--color-primary);
}

/* Main Content Area */
.main-content {
  flex: 1;
  position: relative;
  z-index: 1;
}

/* Sidebar */
.sidebar {
  position: fixed;
  top: 0;
  right: 0;
  width: 400px;
  height: 100vh;
  background: rgba(0, 0, 0, 0.9);
  backdrop-filter: blur(20px);
  z-index: 200;
  overflow-y: auto;
}

.sidebar-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 150;
}

/* Responsive */
@media (max-width: 768px) {
  .sidebar {
    width: 100vw;
  }
  
  .app-header {
    top: 15px;
    left: 15px;
  }
  
  .settings-btn {
    width: 44px;
    height: 44px;
  }
}

@media (max-width: 480px) {
  .app-header {
    top: 15px;
    left: 15px;
  }
  
  .settings-btn {
    width: 44px;
    height: 44px;
  }
}
</style>
