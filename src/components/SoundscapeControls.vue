<template>
  <div class="soundscape-controls">
    <div class="soundscape-container">
      <!-- Master Volume -->
      <div class="master-volume">
        <VolumeIcon />
        <input 
          type="range"
          min="0"
          max="1"
          step="0.1"
          :value="store.volume"
          @input="store.volume = $event.target.value"
          class="master-slider"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { useAppStore } from '../stores/appStore'

const store = useAppStore()
</script>

<script>
const VolumeIcon = {
  template: `
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M15.54 8.46C16.4731 9.39309 17.0018 10.6691 17.0018 11.995C17.0018 13.3209 16.4731 14.5969 15.54 15.53" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
  `
}

export default {
  components: {
    VolumeIcon
  }
}
</script>

<style scoped>
.soundscape-controls {
  background: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(40px);
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.soundscape-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px 24px;
  display: flex;
  align-items: center;
  gap: 24px;
}

.master-volume {
  display: flex;
  align-items: center;
  border-left: 1px solid rgba(255, 255, 255, 0.15);
  color: rgba(255, 255, 255, 0.8);
  gap: 12px;
  padding-left: 24px;
}

.master-slider {
  width: 80px;
  height: 4px;
  border-radius: 2px;
  background: rgba(255, 255, 255, 0.2);
  outline: none;
  cursor: pointer;
}

.master-slider::-webkit-slider-thumb {
  appearance: none;
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background: var(--color-primary);
  cursor: pointer;
}

.master-slider::-moz-range-thumb {
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background: var(--color-primary);
  cursor: pointer;
  border: none;
}

/* Responsive */
@media (max-width: 768px) {
  .soundscape-container {
    padding: 12px 15px;
    gap: 15px;
  }
  
  .master-volume {
    padding-left: 15px;
  }
  
  .master-slider {
    width: 60px;
  }
}

@media (max-width: 480px) {
  .soundscape-container {
    justify-content: center;
  }
  
  .master-volume {
    border-left: none;
    padding-left: 0;
  }
}
</style>
