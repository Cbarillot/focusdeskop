<template>
  <div class="timer-settings">
    <div class="section">
      <h3 class="section-title">Timer Duration</h3>
      
      <div class="setting-group">
        <label class="setting-label">
          <span>Pomodoro</span>
          <div class="time-input">
            <input 
              type="number" 
              :value="Math.floor(store.pomodoroTime / 60)"
              @input="updatePomodoroTime($event.target.value)"
              min="1"
              max="60"
              class="time-field"
            />
            <span class="time-unit">min</span>
          </div>
        </label>
        
        <label class="setting-label">
          <span>Short Break</span>
          <div class="time-input">
            <input 
              type="number" 
              :value="Math.floor(store.shortBreakTime / 60)"
              @input="updateShortBreakTime($event.target.value)"
              min="1"
              max="30"
              class="time-field"
            />
            <span class="time-unit">min</span>
          </div>
        </label>
        
        <label class="setting-label">
          <span>Long Break</span>
          <div class="time-input">
            <input 
              type="number" 
              :value="Math.floor(store.longBreakTime / 60)"
              @input="updateLongBreakTime($event.target.value)"
              min="1"
              max="60"
              class="time-field"
            />
            <span class="time-unit">min</span>
          </div>
        </label>
      </div>
    </div>
    
    <div class="section">
      <h3 class="section-title">Auto Start</h3>
      
      <div class="toggle-group">
        <label class="toggle-label">
          <input type="checkbox" class="toggle-input" />
          <span class="toggle-slider"></span>
          <span>Auto start breaks</span>
        </label>
        
        <label class="toggle-label">
          <input type="checkbox" class="toggle-input" />
          <span class="toggle-slider"></span>
          <span>Auto start pomodoros</span>
        </label>
      </div>
    </div>
    
    <div class="section">
      <h3 class="section-title">Long Break Interval</h3>
      
      <div class="setting-group">
        <label class="setting-label">
          <span>After every</span>
          <div class="time-input">
            <input 
              type="number" 
              value="4"
              min="2"
              max="10"
              class="time-field"
            />
            <span class="time-unit">pomodoros</span>
          </div>
        </label>
      </div>
    </div>
    
    <div class="section">
      <h3 class="section-title">Timer Display Mode</h3>
      <p class="section-description">Choose how the timer appears on your screen.</p>
      
      <div class="display-modes">
        <div 
          v-for="mode in displayModes"
          :key="mode.key"
          class="mode-option"
          :class="{ active: store.timerDisplayMode === mode.key }"
          @click="store.setTimerDisplayMode(mode.key)"
        >
          <div class="mode-preview">
            <div class="preview-container" :class="mode.key">
              <div class="preview-timer" :class="mode.key">
                {{ mode.key === 'home' ? '14:32' : '25:00' }}
              </div>
              <div v-if="mode.key === 'ambiance'" class="preview-content">
                <div class="preview-placeholder">Content Area</div>
              </div>
              <div v-if="mode.key === 'home'" class="preview-content">
                <div class="preview-placeholder">Dashboard</div>
              </div>
            </div>
          </div>
          <div class="mode-info">
            <h4 class="mode-name">{{ mode.name }}</h4>
            <p class="mode-description">{{ mode.description }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useAppStore } from '../../stores/appStore'

const store = useAppStore()

const displayModes = [
  {
    key: 'focus',
    name: 'Focus',
    description: 'Timer centered on screen - perfect for deep focus sessions'
  },
  {
    key: 'ambiance',
    name: 'Ambiance',
    description: 'Small timer in top-right corner - ideal for background timing'
  },
  {
    key: 'home',
    name: 'Home',
    description: 'Clock display centered at top - less imposing, more casual'
  }
]

function updatePomodoroTime(minutes) {
  store.pomodoroTime = parseInt(minutes) * 60
  if (store.timerMode === 'pomodoro') {
    store.timeRemaining = store.pomodoroTime
  }
}

function updateShortBreakTime(minutes) {
  store.shortBreakTime = parseInt(minutes) * 60
  if (store.timerMode === 'shortBreak') {
    store.timeRemaining = store.shortBreakTime
  }
}

function updateLongBreakTime(minutes) {
  store.longBreakTime = parseInt(minutes) * 60
  if (store.timerMode === 'longBreak') {
    store.timeRemaining = store.longBreakTime
  }
}
</script>

<style scoped>
.timer-settings {
  color: var(--color-text-primary);
}

.section {
  margin-bottom: 32px;
}

.section:last-child {
  margin-bottom: 0;
}

.section-title {
  margin: 0 0 16px 0;
  font-size: 16px;
  font-weight: 600;
  color: var(--color-text-primary);
}

.setting-group {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.setting-label {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  color: var(--color-text-secondary);
}

.time-input {
  display: flex;
  align-items: center;
  gap: 8px;
}

.time-field {
  width: 60px;
  padding: 8px 12px;
  border-radius: var(--border-radius-sm);
  border: 1px solid var(--color-border);
  background: rgba(255, 255, 255, 0.05);
  color: var(--color-text-primary);
  font-size: 14px;
  text-align: center;
}

.time-field:focus {
  border-color: var(--color-primary);
  background: rgba(255, 255, 255, 0.1);
}

.time-unit {
  font-size: 12px;
  color: var(--color-text-muted);
  min-width: 40px;
}

.toggle-group {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.toggle-label {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 14px;
  color: var(--color-text-secondary);
  cursor: pointer;
}

.toggle-input {
  display: none;
}

.toggle-slider {
  position: relative;
  width: 44px;
  height: 24px;
  border-radius: var(--border-radius-full);
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid var(--color-border);
  transition: all var(--transition-fast);
  cursor: pointer;
}

.toggle-slider::before {
  content: '';
  position: absolute;
  top: 2px;
  left: 2px;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: var(--color-text-secondary);
  transition: all var(--transition-fast);
}

.toggle-input:checked + .toggle-slider {
  background: var(--color-primary);
  border-color: var(--color-primary);
}

.toggle-input:checked + .toggle-slider::before {
  transform: translateX(20px);
  background: var(--color-text-primary);
}

.section-description {
  margin: 0 0 16px 0;
  font-size: 14px;
  color: var(--color-text-secondary);
}

/* Timer Display Mode Styles */
.display-modes {
  display: grid;
  gap: 16px;
}

.mode-option {
  display: flex;
  gap: 16px;
  padding: 16px;
  border-radius: var(--border-radius-md);
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid var(--color-border);
  cursor: pointer;
  transition: all 0.2s ease;
}

.mode-option:hover {
  background: rgba(255, 255, 255, 0.1);
  transform: translateY(-2px);
}

.mode-option.active {
  background: rgba(139, 92, 246, 0.1);
  border-color: var(--color-primary);
}

.mode-preview {
  width: 100px;
  height: 60px;
  border-radius: var(--border-radius-sm);
  background: rgba(0, 0, 0, 0.3);
  overflow: hidden;
  position: relative;
}

.preview-container {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  position: relative;
}

.preview-container.focus {
  justify-content: center;
  align-items: center;
}

.preview-container.ambiance {
  padding: 4px;
}

.preview-container.home {
  justify-content: flex-start;
  align-items: center;
  padding: 8px 4px 4px 4px;
}

.preview-timer {
  font-size: 10px;
  font-weight: 600;
  color: var(--color-text-primary);
  text-align: center;
}

.preview-timer.focus {
  font-size: 12px;
}

.preview-timer.ambiance {
  font-size: 8px;
  position: absolute;
  top: 2px;
  right: 2px;
  background: rgba(0, 0, 0, 0.5);
  padding: 2px 4px;
  border-radius: 2px;
}

.preview-timer.home {
  font-size: 10px;
  margin-bottom: 2px;
}

.preview-content {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}

.preview-placeholder {
  font-size: 8px;
  color: var(--color-text-secondary);
  opacity: 0.7;
}

.mode-info {
  flex: 1;
}

.mode-name {
  margin: 0 0 4px 0;
  font-size: 16px;
  font-weight: 600;
  color: var(--color-text-primary);
}

.mode-description {
  margin: 0;
  font-size: 14px;
  color: var(--color-text-secondary);
}

/* Responsive */
@media (max-width: 480px) {
  .setting-label {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }
  
  .time-input {
    align-self: flex-end;
  }
}
</style>