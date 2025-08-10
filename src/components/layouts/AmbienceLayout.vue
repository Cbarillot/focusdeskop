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
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 100px 20px 80px;
}

.content-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 80px;
  max-width: 1200px;
  width: 100%;
  align-items: center;
}

/* Timer Section */
.timer-section {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.timer-container {
  text-align: center;
  max-width: 500px;
  width: 100%;
}

.mode-tabs {
  display: flex;
  justify-content: center;
  gap: 8px;
  margin-bottom: 40px;
  flex-wrap: wrap;
}

.mode-tab {
  padding: 10px 20px;
  border-radius: var(--border-radius-full, 25px);
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: rgba(255, 255, 255, 0.7);
  font-size: 13px;
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
  margin-bottom: 30px;
}

.time {
  font-family: 'Be Vietnam Pro', 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  font-size: clamp(4rem, 12vw, 100px);
  font-weight: 900;
  line-height: 0.9;
  letter-spacing: -0.04em;
  margin-bottom: 30px;
  color: #fff;
  text-shadow: 0 4px 12px rgba(0, 0, 0, 0.5), 0 2px 4px rgba(0, 0, 0, 0.3);
}

.timer-controls {
  display: flex;
  justify-content: center;
  gap: 16px;
  flex-wrap: wrap;
}

.control-btn {
  padding: 14px 28px;
  border-radius: var(--border-radius-full, 25px);
  font-size: 14px;
  font-weight: 600;
  min-width: 100px;
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

/* Music Section */
.music-section {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.music-player {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  padding: 32px;
  width: 100%;
  max-width: 400px;
}

.section-title {
  color: white;
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 24px;
  text-align: center;
}

.current-track {
  margin-bottom: 24px;
  text-align: center;
}

.track-name {
  color: white;
  font-weight: 500;
  margin-bottom: 4px;
}

.track-status {
  color: rgba(255, 255, 255, 0.6);
  font-size: 14px;
}

.music-controls {
  display: flex;
  gap: 12px;
  margin-bottom: 24px;
  justify-content: center;
}

.music-btn {
  padding: 12px 24px;
  border-radius: var(--border-radius-full, 25px);
  font-size: 14px;
  font-weight: 500;
  transition: all 0.3s ease;
  background: var(--color-primary, #8B5CF6);
  color: white;
}

.music-btn:hover:not(:disabled) {
  background: var(--color-primary-dark, #7C3AED);
  transform: translateY(-1px);
}

.music-btn.secondary {
  background: rgba(255, 255, 255, 0.1);
  color: rgba(255, 255, 255, 0.7);
}

.music-btn.secondary:hover:not(:disabled) {
  background: rgba(255, 255, 255, 0.2);
  color: white;
}

.music-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.playlist-selection h4 {
  color: rgba(255, 255, 255, 0.8);
  font-size: 16px;
  margin-bottom: 16px;
  text-align: center;
}

.playlist-buttons {
  display: flex;
  gap: 8px;
  justify-content: center;
}

.playlist-btn {
  padding: 8px 16px;
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.1);
  color: rgba(255, 255, 255, 0.8);
  font-size: 12px;
  font-weight: 500;
  transition: all 0.3s ease;
}

.playlist-btn:hover {
  background: rgba(255, 255, 255, 0.2);
  color: white;
  transform: translateY(-1px);
}

/* Responsive Design */
@media (max-width: 1024px) {
  .content-container {
    gap: 60px;
  }
}

@media (max-width: 768px) {
  .content-container {
    grid-template-columns: 1fr;
    gap: 40px;
  }
  
  .ambience-layout {
    padding: 80px 20px 60px;
  }
  
  .music-player {
    padding: 24px;
    max-width: none;
  }
}

@media (max-width: 480px) {
  .content-container {
    gap: 30px;
  }
  
  .music-player {
    padding: 20px;
  }
  
  .music-controls {
    flex-direction: column;
  }
  
  .playlist-buttons {
    flex-direction: column;
  }
}
</style>
