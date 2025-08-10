<template>
  <div class="ambience-layout">
    <!-- Timer Section - positioned top right -->
    <div class="timer-section">
      <div class="timer-container">
        <!-- Mode Tabs -->
        <div class="mode-tabs">
          <button
            v-for="mode in modes"
            :key="mode.key"
            class="mode-tab"
            :class="{ active: store.timerMode === mode.key }"
            @click="store.switchMode(mode.key)"
          >
            {{ mode.label }}
          </button>
        </div>

        <!-- Timer Display -->
        <div class="timer-display">
          <div class="time">{{ store.displayTime }}</div>
          <div class="timer-controls">
            <button
              class="control-btn primary"
              @click="store.toggleTimer()"
            >
              {{ store.isRunning ? 'Pause' : 'Start' }}
            </button>
            <button
              class="control-btn secondary"
              @click="store.resetTimer()"
            >
              Reset
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useAppStore } from '../../stores/appStore'

const store = useAppStore()

const modes = [
  { key: 'pomodoro', label: 'Pomodoro' },
  { key: 'shortBreak', label: 'Pause Courte' },
  { key: 'longBreak', label: 'Pause Longue' }
]
</script>

<style scoped>
.ambience-layout {
  position: relative;
  min-height: 100vh;
  padding: 80px 20px 20px;
}

/* Timer Section - positioned top right */
.timer-section {
  position: absolute;
  top: 120px;
  right: 40px;
  z-index: 10;
}

.timer-container {
  text-align: center;
  max-width: 400px;
  width: 100%;
  background: rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  padding: 24px;
}

.mode-tabs {
  display: flex;
  justify-content: center;
  gap: 6px;
  margin-bottom: 20px;
  flex-wrap: wrap;
}

.mode-tab {
  padding: 8px 16px;
  border-radius: var(--border-radius-full, 25px);
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: rgba(255, 255, 255, 0.7);
  font-size: 12px;
  font-weight: 500;
  transition: all var(--transition-fast, 0.2s);
}

.mode-tab:hover {
  background: rgba(255, 255, 255, 0.15);
  color: rgba(255, 255, 255, 0.9);
}

.mode-tab.active {
  background: var(--color-primary, #8B5CF6);
  border-color: var(--color-primary, #8B5CF6);
  color: white;
}

.timer-display {
  margin-bottom: 20px;
}

.time {
  font-family: 'Be Vietnam Pro', 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  font-size: clamp(3rem, 8vw, 80px);
  font-weight: 900;
  line-height: 0.9;
  letter-spacing: -0.04em;
  margin-bottom: 20px;
  color: #fff;
  text-shadow: 0 4px 12px rgba(0, 0, 0, 0.5), 0 2px 4px rgba(0, 0, 0, 0.3);
}

.timer-controls {
  display: flex;
  justify-content: center;
  gap: 12px;
  flex-wrap: wrap;
}

.control-btn {
  padding: 10px 20px;
  border-radius: var(--border-radius-full, 25px);
  font-size: 13px;
  font-weight: 600;
  min-width: 80px;
  transition: all 0.3s ease;
}

.control-btn.primary {
  background: var(--color-primary, #8B5CF6);
  color: white;
}

.control-btn.primary:hover {
  background: var(--color-primary-dark, #7C3AED);
  transform: translateY(-1px);
}

.control-btn.secondary {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: rgba(255, 255, 255, 0.7);
}

.control-btn.secondary:hover {
  background: rgba(255, 255, 255, 0.2);
  color: white;
  transform: translateY(-1px);
}

/* Responsive Design */
@media (max-width: 1024px) {
  .timer-section {
    right: 30px;
    top: 100px;
  }

  .timer-container {
    max-width: 350px;
    padding: 20px;
  }
}

@media (max-width: 768px) {
  .timer-section {
    position: relative;
    top: auto;
    right: auto;
    display: flex;
    justify-content: center;
    margin-top: 40px;
  }

  .timer-container {
    max-width: 100%;
    padding: 24px;
  }
}

@media (max-width: 480px) {
  .timer-container {
    padding: 20px;
  }

  .timer-controls {
    flex-direction: column;
    gap: 8px;
  }
}
</style>
