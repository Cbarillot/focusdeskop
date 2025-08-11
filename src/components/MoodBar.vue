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
        <span class="icon icon-home" aria-hidden="true"></span>
      </button>

      <!-- Ambience Mood Button (Lotus icon) -->
      <button
        class="mood-button"
        :class="{ active: store.mood === 'ambience' }"
        @click="setMood('ambience')"
        :title="'Mode Ambiance'"
        :aria-label="'Mode Ambiance'"
      >
        <span class="icon icon-ambience" aria-hidden="true"></span>
      </button>

      <!-- Focus Mood Button (Timer icon) -->
      <button
        class="mood-button"
        :class="{ active: store.mood === 'focus' }"
        @click="setMood('focus')"
        :title="'Mode Focus'"
        :aria-label="'Mode Focus'"
      >
        <span class="icon icon-focus" aria-hidden="true"></span>
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
  background: rgba(255, 255, 255, 0.08); /* light white */
  backdrop-filter: blur(12px);
  border-radius: 50px;
  border: 1px solid rgba(255, 255, 255, 0.35);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.25);
}

.mood-button {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.12);
  backdrop-filter: blur(8px);
  border: 1px solid rgba(255, 255, 255, 0.35);
  color: rgba(255, 255, 255, 0.85);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;
}

.mood-button:hover {
  background: rgba(255, 255, 255, 0.2);
  color: rgba(255, 255, 255, 0.95);
  transform: translateY(-2px);
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.3);
}

/* Icon masks: keep 24x24 size and inherit currentColor */
.icon {
  width: 24px;
  height: 24px;
  display: block;
  background-color: currentColor;
  /* WebKit mask */
  -webkit-mask-repeat: no-repeat;
  -webkit-mask-position: center;
  -webkit-mask-size: contain;
  /* Standard mask */
  mask-repeat: no-repeat;
  mask-position: center;
  mask-size: contain;
}

.icon-home {
  -webkit-mask-image: url('/assets/icons/home%20icon.svg');
  mask-image: url('/assets/icons/home%20icon.svg');
}

.icon-ambience {
  -webkit-mask-image: url('/assets/icons/ambience%20icon.svg');
  mask-image: url('/assets/icons/ambience%20icon.svg');
}

.icon-focus {
  -webkit-mask-image: url('/assets/icons/focus%20icon.svg');
  mask-image: url('/assets/icons/focus%20icon.svg');
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
