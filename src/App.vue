<template>
  <div class="app">
    <!-- Dynamic Background -->
    <DynamicBackground />

    <!-- Main Layout -->
    <div class="main-layout">
       <MusicPlayerCompact />
      <!-- Header with Settings Button removed (corner button retained in CornerNavigation.vue) -->
      
      <!-- Main Content Area - Changes based on mood -->
      <main class="main-content">
        <component :is="currentLayout" />
      </main>

      <!-- Corner Navigation - for fixed elements -->
      <CornerNavigation />

      <!-- Mood Bar - for mood switching -->
      <MoodBar />
    </div>

    <!-- Preview Overlay -->
    <PreviewOverlay />

    <!-- Device Choice Modal -->
    <DeviceChoiceModal 
      @device-selected="handleDeviceSelected" 
      @dismissed="handleDeviceChoiceDismissed"
    />

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
import MusicPlayerCompact from './components/MusicPlayerCompact.vue'
import { ref, computed, onMounted } from 'vue'
import { useAppStore } from './stores/appStore'
import DynamicBackground from './components/DynamicBackground.vue'
import SidePanel from './components/SidePanel.vue'
import CornerNavigation from './components/CornerNavigation.vue'
import MoodBar from './components/MoodBar.vue'
import HomeLayout from './components/layouts/HomeLayout.vue'
import AmbienceLayout from './components/layouts/AmbienceLayout.vue'
import FocusLayout from './components/layouts/FocusLayout.vue'
import PreviewOverlay from './components/PreviewOverlay.vue'
import DeviceChoiceModal from './components/DeviceChoiceModal.vue'
import { detectDevice, getOptimalPreviewSize } from './utils/deviceDetection'

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

function handleDeviceSelected(deviceType) {
  // Set optimal preview size based on device type but don't auto-enable preview
  const device = detectDevice()
  const optimalSize = getOptimalPreviewSize({ ...device, type: deviceType })
  
  // Find matching preset
  const presets = {
    'desktop': 'desktop-15-landscape',
    'mobile': device.orientation === 'portrait' ? 'mobile-6-portrait' : 'mobile-6-landscape'
  }
  
  const presetId = presets[deviceType] || 'desktop-15-landscape'
  store.setPreviewPreset(presetId)
  // Note: Preview remains disabled until user manually enables it in settings
}

function handleDeviceChoiceDismissed() {
  // User dismissed the modal, keep current settings
  console.log('Device choice dismissed')
}

onMounted(() => {
  // Listen for show device choice events from settings
  window.addEventListener('show-device-choice', () => {
    // Force show device choice modal
    localStorage.removeItem('device-choice-made')
    location.reload() // Simple way to retrigger the modal
  })
  
  // Auto-detect and set initial preview preset if no choice was made, but don't enable preview
  if (!localStorage.getItem('device-choice-made')) {
    const device = detectDevice()
    const optimalSize = getOptimalPreviewSize(device)
    
    // Set default preview based on detected device but keep preview disabled
    const presets = {
      'desktop': 'desktop-15-landscape',
      'mobile': device.orientation === 'portrait' ? 'mobile-6-portrait' : 'mobile-6-landscape'
    }
    
    const presetId = presets[device.type] || 'desktop-15-landscape'
    // Only set the preset, don't enable the preview
    store.previewPreset = presetId
  }
})

// Settings are opened via CornerNavigation corner-button now.
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

/* Header settings button removed; using CornerNavigation corner-button instead */

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
  /* Let inner SidePanel control the background & blur */
  background: transparent;
  backdrop-filter: none;
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
  
  /* removed responsive rules for settings button */
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
