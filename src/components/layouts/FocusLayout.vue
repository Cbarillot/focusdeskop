<template>
  <div class="focus-layout">
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

      <!-- Focus Session Info -->
      <div class="session-info">
        <div class="cycle-counter">
          <span class="label">Session</span>
          <span class="value">{{ store.cycle + 1 }}</span>
        </div>
        <div class="mode-indicator">
          <span class="current-mode">{{ getCurrentModeLabel() }}</span>
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

function getCurrentModeLabel() {
  const mode = modes.find(m => m.key === store.timerMode)
  return mode ? mode.label : 'Pomodoro'
}
</script>

<style scoped>
.focus-layout {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
  padding: 100px 20px 80px;
}

.timer-container {
  text-align: center;
  max-width: 520px;
  width: 100%;
  opacity: 0.85;
}

.mode-tabs {
  display: flex;
  justify-content: center;
  gap: 8px;
  margin-bottom: 60px;
  flex-wrap: wrap;
}

.mode-tab {
  padding: 12px 24px;
  border-radius: var(--border-radius-full, 25px);
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: rgba(255, 255, 255, 0.7);
  font-size: 14px;
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
  margin-bottom: 40px;
}

.time {
  font-family: 'Be Vietnam Pro', 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  font-size: clamp(5rem, 15vw, 140px);
  font-weight: 900;
  line-height: 0.9;
  letter-spacing: -0.04em;
  margin-bottom: 40px;
  color: #fff;
  text-shadow: 0 4px 12px rgba(0, 0, 0, 0.5), 0 2px 4px rgba(0, 0, 0, 0.3);
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.timer-controls {
  display: flex;
  justify-content: center;
  gap: 16px;
  flex-wrap: wrap;
}

.control-btn {
  padding: 16px 32px;
  border-radius: var(--border-radius-full, 25px);
  font-size: 16px;
  font-weight: 600;
  min-width: 120px;
  transition: all var(--transition-fast, 0.2s);
}

.control-btn.primary {
  background: var(--color-primary, #8B5CF6);
  color: white;
}

.control-btn.primary:hover {
  background: var(--color-primary-dark, #7C3AED);
  transform: translateY(-2px);
  box-shadow: 0 4px 20px rgba(139, 92, 246, 0.4);
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
  transform: translateY(-2px);
}

.session-info {
  display: flex;
  justify-content: center;
  gap: 40px;
  align-items: center;
  margin-top: 40px;
}

.cycle-counter, .mode-indicator {
  text-align: center;
}

.cycle-counter .label, .mode-indicator .current-mode {
  display: block;
  color: rgba(255, 255, 255, 0.6);
  font-size: 14px;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.cycle-counter .value {
  display: block;
  color: white;
  font-size: 28px;
  font-weight: 700;
  margin-top: 4px;
}

.mode-indicator .current-mode {
  color: var(--color-primary, #8B5CF6);
  font-size: 16px;
  font-weight: 600;
  text-transform: none;
}

/* Responsive design */
@media (max-width: 768px) {
  .focus-layout {
    padding: 80px 20px 60px;
  }
  
  .mode-tabs {
    margin-bottom: 40px;
  }
  
  .mode-tab {
    padding: 10px 20px;
    font-size: 13px;
  }
  
  .control-btn {
    padding: 14px 28px;
    font-size: 15px;
    min-width: 100px;
  }
  
  .session-info {
    gap: 30px;
  }
}

@media (max-width: 480px) {
  .focus-layout {
    padding: 70px 15px 80px;
  }
  
  .mode-tabs {
    gap: 6px;
    margin-bottom: 30px;
  }
  
  .mode-tab {
    padding: 8px 16px;
    font-size: 12px;
  }
  
  .timer-controls {
    gap: 12px;
  }
  
  .control-btn {
    padding: 12px 24px;
    font-size: 14px;
    min-width: 90px;
  }
  
  .session-info {
    flex-direction: column;
    gap: 20px;
  }
}
</style>
