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
        <svg width="24" height="24" viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg">
          <!-- Lotus meditation icon -->
          <path d="M256 110.086l46.344 46.258c14.398 19.441 23.512 42.594 23.512 67.547 0 61.883-50.203 112.086-112.086 112.086-61.883 0-112.086-50.203-112.086-112.086 0-24.953 9.114-48.106 23.512-67.547L256 110.086z" fill="currentColor"/>
          <path d="M113.43 174.344c-36.602 33.93-59.516 82.562-59.516 136.547 0 101.77 82.516 184.086 184.086 184.086 35.668 0 68.852-10.242 97.031-27.742-9.668-12.84-15.461-28.797-15.461-46.125 0-41.883 33.953-75.836 75.836-75.836 17.328 0 33.285 5.793 46.125 15.461 17.5-28.179 27.742-61.363 27.742-97.031 0-101.57-82.316-184.086-184.086-184.086-53.985 0-102.617 22.914-136.547 59.516-0.879 1.086-2.164 1.77-3.59 1.77s-2.711-0.684-3.59-1.77C137.531 154.836 113.43 174.344 113.43 174.344z" fill="currentColor"/>
          <path d="M340.57 174.344c36.602 33.93 59.516 82.562 59.516 136.547 0 101.77-82.516 184.086-184.086 184.086-35.668 0-68.852-10.242-97.031-27.742 9.668-12.84 15.461-28.797 15.461-46.125 0-41.883-33.953-75.836-75.836-75.836-17.328 0-33.285 5.793-46.125 15.461-17.5-28.179-27.742-61.363-27.742-97.031 0-101.57 82.316-184.086 184.086-184.086 53.985 0 102.617 22.914 136.547 59.516" fill="currentColor"/>
          <path d="M0 246.852c0 75.648 61.352 137 137 137 30.059 0 57.75-9.715 80.25-26.117C205.547 350.617 197 336.57 197 320.891c0-33.504 27.145-60.649 60.649-60.649 15.68 0 29.726 5.936 40.344 15.645 16.402-22.5 26.117-50.191 26.117-80.25 0-75.648-61.352-137-137-137C61.352 109.852 0 171.203 0 246.852z" fill="currentColor"/>
          <path d="M512 246.852c0 75.648-61.352 137-137 137-30.059 0-57.75-9.715-80.25-26.117C306.453 350.617 315 336.57 315 320.891c0-33.504-27.145-60.649-60.649-60.649-15.68 0-29.726 5.936-40.344 15.645-16.402-22.5-26.117-50.191-26.117-80.25 0-75.648 61.352-137 137-137C450.648 109.852 512 171.203 512 246.852z" fill="currentColor"/>
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
