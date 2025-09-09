<template>
  <div class="preview-overlay" v-if="visible && activePreset !== 'off'">
    <!-- Preview Frame -->
    <div class="frame" :style="frameStyle" :class="frameClass">
      <div class="hint">{{ currentPreviewName }} — Aperçu visuel</div>
    </div>

    <!-- Backdrop for shading -->
    <div v-if="shade" class="backdrop" />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount, watch } from 'vue'
import { useAppStore } from '../stores/appStore'
import { getAvailablePreviewSizes } from '../utils/deviceDetection'

const store = useAppStore()

// Get settings from store
const visible = computed(() => store.previewOverlayVisible)
const activePreset = computed(() => store.previewPreset)
const shade = computed(() => store.previewShade)

const availablePresets = getAvailablePreviewSizes()

const currentPreviewName = computed(() => {
  const preset = availablePresets.find(p => p.id === activePreset.value)
  return preset ? preset.name : 'Off'
})

const frameStyle = computed(() => {
  const preset = availablePresets.find(p => p.id === activePreset.value)
  if (!preset) return { display: 'none' }
  
  return { 
    width: preset.width + 'px', 
    height: preset.height + 'px' 
  }
})

const frameClass = computed(() => {
  const preset = availablePresets.find(p => p.id === activePreset.value)
  return preset ? `preview-${preset.category}` : ''
})

watch(activePreset, (newPreset) => {
  // Apply CSS class for preview mode
  document.documentElement.classList.remove('preview-desktop', 'preview-mobile')
  
  if (newPreset !== 'off') {
    const preset = availablePresets.find(p => p.id === newPreset)
    if (preset) {
      document.documentElement.classList.add(`preview-${preset.category}`)
    }
  }
})

onMounted(() => {
  // Apply initial preview mode
  if (activePreset.value !== 'off') {
    const preset = availablePresets.find(p => p.id === activePreset.value)
    if (preset) {
      document.documentElement.classList.add(`preview-${preset.category}`)
    }
  }
})

onBeforeUnmount(() => {
  document.documentElement.classList.remove('preview-desktop', 'preview-mobile')
})
</script>

<style scoped>
.preview-overlay {
  position: fixed;
  inset: 0;
  pointer-events: none; /* overlay itself non-bloquant */
  z-index: 9999;
}

.frame {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  border: 2px dashed rgba(255,255,255,0.6);
  border-radius: 8px;
  pointer-events: none;
  transition: all 0.3s ease;
}

.frame.preview-mobile {
  border-color: rgba(0, 191, 165, 0.7);
  border-radius: 20px; /* Rounded corners for mobile */
}

.frame.preview-desktop {
  border-color: rgba(255, 255, 255, 0.6);
  border-radius: 8px;
}

.hint {
  position: absolute;
  top: -32px;
  left: 0;
  font-size: 12px;
  color: rgba(255,255,255,0.85);
  background: rgba(0, 0, 0, 0.6);
  padding: 4px 8px;
  border-radius: 4px;
  backdrop-filter: blur(4px);
  white-space: nowrap;
}

.backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.35);
  pointer-events: none;
  transition: opacity 0.3s ease;
}

/* Mobile preview specific styling */
.preview-mobile .hint {
  color: rgba(0, 191, 165, 1);
  border: 1px solid rgba(0, 191, 165, 0.3);
}

@media (max-width: 768px) {
  .frame {
    /* Ensure frame doesn't exceed viewport on small screens */
    max-width: calc(100vw - 20px);
    max-height: calc(100vh - 40px);
  }
  
  .hint {
    font-size: 10px;
    top: -28px;
  }
}
</style>
