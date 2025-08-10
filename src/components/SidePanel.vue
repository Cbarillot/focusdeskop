<template>
  <div class="side-panel">
    <!-- Header -->
    <div class="panel-header">
      <h2>Settings</h2>
      <button class="close-btn" @click="store.toggleSidebar()">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </button>
    </div>
    
    <!-- Navigation Tabs -->
    <nav class="panel-nav">
      <button 
        v-for="tab in tabs"
        :key="tab.key"
        class="nav-tab"
        :class="{ active: store.activeTab === tab.key }"
        @click="store.setActiveTab(tab.key)"
      >
        <component :is="tab.icon" />
        <span>{{ tab.label }}</span>
      </button>
    </nav>
    
    <!-- Content Area -->
    <div class="panel-content">
      <component :is="activeComponent" />
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useAppStore } from '../stores/appStore'
import ThemeSettings from './panels/ThemeSettings.vue'
import TimerSettings from './panels/TimerSettings.vue'
import MusicSettings from './panels/MusicSettings.vue'
import SoundsSettings from './panels/SoundsSettings.vue'
import TodoSettings from './panels/TodoSettings.vue'

const store = useAppStore()

const tabs = [
  {
    key: 'themes',
    label: 'Themes',
    icon: 'ThemeIcon'
  },
  {
    key: 'timer',
    label: 'Timer Settings',
    icon: 'TimerIcon'
  },
  {
    key: 'music',
    label: 'Music & Sounds',
    icon: 'MusicIcon'
  },
  {
    key: 'sounds',
    label: 'Ambient Sounds',
    icon: 'SoundsIcon'
  },
  {
    key: 'todo',
    label: 'Tasks & Todo',
    icon: 'TodoIcon'
  }
]

const activeComponent = computed(() => {
  switch (store.activeTab) {
    case 'themes': return ThemeSettings
    case 'timer': return TimerSettings
    case 'music': return MusicSettings
    case 'sounds': return SoundsSettings
    case 'todo': return TodoSettings
    default: return ThemeSettings
  }
})
</script>

<script>
// Flocus-style SVG Icon components

const TimerIcon = {
  template: `
    <svg width="20" height="20" viewBox="0 0 36 36" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path d="M18 6c-6.075 0-11 4.925-11 11s4.925 11 11 11 11-4.925 11-11S24.075 6 18 6zm0 19.25c-4.558 0-8.25-3.692-8.25-8.25S13.442 8.75 18 8.75 26.25 12.442 26.25 17 22.558 25.25 18 25.25zm3.438-8.25H18V12.125a1.375 1.375 0 1 0-2.75 0V18.375c0 .758.617 1.375 1.375 1.375h4.813a1.375 1.375 0 1 0 0-2.75z"/>
      <path d="M14.5 3h7v2h-7zM16.25 0h3.5v1.5h-3.5z"/>
    </svg>
  `
}



const SoundsIcon = {
  template: `
    <svg width="20" height="20" viewBox="0 0 36 36" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path d="M10.3 12.8L15 8.1c.4-.4 1-.1 1 .4v18.9c0 .6-.6.8-1 .4l-4.7-4.7H5c-.6 0-1-.4-1-1v-8.6c0-.6.4-1 1-1h5.3z"/>
      <path d="M19.5 12c1.4 1.4 1.4 3.6 0 5s-3.6 1.4-5 0"/>
      <path d="M23.1 8.4c2.8 2.8 2.8 7.4 0 10.2s-7.4 2.8-10.2 0"/>
      <path d="M26.7 4.8c4.2 4.2 4.2 11 0 15.2s-11 4.2-15.2 0"/>
    </svg>
  `
}


const ThemeIcon = {
  template: `
    <svg width="20" height="20" viewBox="0 0 36 36" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path d="M18 2.5c-.4 0-.8.1-1.2.3L7.6 7.6c-.8.4-1.3 1.3-1.3 2.2v16.4c0 .9.5 1.8 1.3 2.2l9.2 4.8c.8.4 1.7.4 2.4 0l9.2-4.8c.8-.4 1.3-1.3 1.3-2.2V9.8c0-.9-.5-1.8-1.3-2.2L19.2 2.8c-.4-.2-.8-.3-1.2-.3zm0 3.2l7.8 4.1v14.4L18 28.3V5.7z"/>
    </svg>
  `
}

const MusicIcon = {
  template: `
    <svg width="20" height="20" viewBox="0 0 36 36" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path d="M33 6.5c0-.8-.7-1.5-1.5-1.5-.3 0-.5.1-.8.2L13 9.8c-.8.3-1.3 1-1.3 1.8v13.9c-1-.6-2.2-1-3.7-1-3.3 0-6 1.8-6 4s2.7 4 6 4 6-1.8 6-4V16.2l16.5-5.5v8.8c-1-.6-2.2-1-3.7-1-3.3 0-6 1.8-6 4s2.7 4 6 4 6-1.8 6-4V6.5z"/>
    </svg>
  `
}

const BackgroundIcon = {
  template: `
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="3" y="3" width="18" height="18" rx="2" ry="2" stroke="currentColor" stroke-width="2"/>
      <circle cx="8.5" cy="8.5" r="1.5" stroke="currentColor" stroke-width="2"/>
      <path d="M21 15L16 10L5 21" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
  `
}

const TodoIcon = {
  template: `
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M9 11L12 14L22 4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M21 12V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H16" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
  `
}

export default {
  components: {
    TimerIcon,
    ThemeIcon,
    MusicIcon,
    SoundsIcon
  }
}
</script>

<style scoped>
.side-panel {
  height: 100%;
  display: flex;
  flex-direction: column;
  background: rgba(0, 0, 0, 0.95);
  backdrop-filter: blur(20px);
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

.panel-nav {
  padding: 16px;
  border-bottom: 1px solid var(--color-border);
}

.nav-tab {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  margin-bottom: 4px;
  border-radius: var(--border-radius-md);
  background: transparent;
  color: var(--color-text-secondary);
  text-align: left;
  font-size: 14px;
  font-weight: 500;
  transition: all var(--transition-fast);
  position: relative;
}

.nav-tab:hover {
  background: rgba(255, 255, 255, 0.05);
  color: var(--color-text-primary);
}

.nav-tab.active {
  background: var(--color-primary);
  color: var(--color-text-primary);
}

.nav-tab:last-child {
  margin-bottom: 0;
}


.panel-content {
  flex: 1;
  overflow-y: auto;
  padding: 32px;
}

/* Responsive */
@media (max-width: 480px) {
  .panel-header {
    padding: 20px;
  }
  
  .panel-nav {
    padding: 12px;
  }
  
  .nav-tab {
    padding: 10px 12px;
    font-size: 13px;
  }
  
  .panel-content {
    padding: 20px;
  }
}
</style>
