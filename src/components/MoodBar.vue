<template>
  <div class="mood-bar">
    <div class="mood-buttons">
      <!-- Home Mood Button -->
      <button 
        class="mood-button"
        :class="{ active: store.mood === 'home' }"
        @click="setMood('home')"
        :title="'Mode Accueil'"
        :aria-label="'Mode Accueil'"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          <polyline points="9,22 9,12 15,12 15,22" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </button>

      <!-- Ambience Mood Button (Lotus/Zen icon) -->
      <button 
        class="mood-button"
        :class="{ active: store.mood === 'ambience' }"
        @click="setMood('ambience')"
        :title="'Mode Ambiance'"
        :aria-label="'Mode Ambiance'"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <!-- Lotus icon with three leaves -->
          <!-- Top petal -->
          <path d="M12 3c-2 0-3.5 1.5-3.5 3.5s1.2 3.2 3 4c.2-.3.3-.6.5-1 .2.4.3.7.5 1 1.8-.8 3-2 3-4S14 3 12 3z" fill="currentColor"/>
          <!-- Left petal -->
          <path d="M6 12c0-2 1.5-3.5 3.5-3.5s3.2 1.2 4 3c-.3.2-.6.3-1 .5.4.2.7.3 1 .5-.8 1.8-2 3-4 3S6 14 6 12z" fill="currentColor"/>
          <!-- Right petal -->
          <path d="M18 12c0-2-1.5-3.5-3.5-3.5s-3.2 1.2-4 3c.3.2.6.3 1 .5-.4.2-.7.3-1 .5.8 1.8 2 3 4 3s3.5-1.5 3.5-3.5z" fill="currentColor"/>
          <!-- Center -->
          <circle cx="12" cy="12" r="1.5" fill="currentColor"/>
        </svg>
      </button>

      <!-- Focus Mood Button (Timer icon) -->
      <button 
        class="mood-button"
        :class="{ active: store.mood === 'focus' }"
        @click="setMood('focus')"
        :title="'Mode Focus'"
        :aria-label="'Mode Focus'"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/>
          <polyline points="12,6 12,12 16,14" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </button>
    </div>
  </div>
</template>

<script setup>
import { useAppStore } from '../stores/appStore'

const store = useAppStore()

function setMood(newMood) {
  store.setMood(newMood)
}
</script>

<style scoped>
.mood-bar {
  position: fixed;
  bottom: 30px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 200;
  pointer-events: auto;
}

.mood-buttons {
  display: flex;
  gap: 16px;
  padding: 12px 20px;
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(20px);
  border-radius: 50px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
}

.mood-button {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: rgba(255, 255, 255, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  cursor: pointer;
  position: relative;
}

.mood-button:hover {
  background: rgba(255, 255, 255, 0.2);
  color: rgba(255, 255, 255, 0.9);
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3);
}

.mood-button.active {
  background: var(--color-primary, #8B5CF6);
  color: white;
  border-color: var(--color-primary, #8B5CF6);
  transform: translateY(-2px);
  box-shadow: 0 4px 20px rgba(139, 92, 246, 0.4);
}

.mood-button.active::after {
  content: '';
  position: absolute;
  bottom: -8px;
  left: 50%;
  transform: translateX(-50%);
  width: 6px;
  height: 6px;
  background: var(--color-primary, #8B5CF6);
  border-radius: 50%;
}

/* Responsive design */
@media (max-width: 768px) {
  .mood-bar {
    bottom: 20px;
  }
  
  .mood-buttons {
    gap: 12px;
    padding: 10px 16px;
  }
  
  .mood-button {
    width: 48px;
    height: 48px;
  }
}

@media (max-width: 480px) {
  .mood-bar {
    bottom: 15px;
  }
  
  .mood-buttons {
    gap: 8px;
    padding: 8px 12px;
  }
  
  .mood-button {
    width: 44px;
    height: 44px;
  }
}

/* Accessibility */
.mood-button:focus-visible {
  outline: 2px solid var(--color-primary, #8B5CF6);
  outline-offset: 2px;
}

/* Animation */
@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateX(-50%) translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateX(-50%) translateY(0);
  }
}

.mood-bar {
  animation: slideUp 0.4s ease-out;
}
</style>
