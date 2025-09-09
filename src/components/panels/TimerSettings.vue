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
              @input="store.updatePomodoroTime($event.target.value)"
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
              @input="store.updateShortBreakTime($event.target.value)"
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
              @input="store.updateLongBreakTime($event.target.value)"
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
      <p class="section-description">Automatically transition between work sessions and breaks.</p>
      
      <div class="toggle-group">
        <label class="toggle-label highlight">
          <input 
            type="checkbox" 
            class="toggle-input"
            :checked="store.autoChainEnabled"
            @change="store.toggleAutoChain()"
          />
          <span class="toggle-slider"></span>
          <span>Auto-chain sessions (fully automatic)</span>
        </label>
        <p class="feature-description">When enabled, automatically starts the next session after each timer completes.</p>
      </div>
      
      <div class="advanced-settings" v-if="!store.autoChainEnabled">
        <h4>Manual Controls</h4>
        <div class="toggle-group">
          <label class="toggle-label">
            <input 
              type="checkbox" 
              class="toggle-input"
              :checked="store.autoStartBreaks"
              @change="store.toggleAutoStartBreaks()"
            />
            <span class="toggle-slider"></span>
            <span>Auto start breaks</span>
          </label>
          
          <label class="toggle-label">
            <input 
              type="checkbox" 
              class="toggle-input"
              :checked="store.autoStartPomodoros"
              @change="store.toggleAutoStartPomodoros()"
            />
            <span class="toggle-slider"></span>
            <span>Auto start pomodoros</span>
          </label>
        </div>
      </div>
      
      <div class="auto-start-settings" v-if="store.autoChainEnabled || store.autoStartBreaks || store.autoStartPomodoros">
        <label class="setting-label">
          <span>Auto-start delay</span>
          <div class="time-input">
            <input 
              type="number" 
              :value="store.autoStartDelay"
              @input="store.setAutoStartDelay($event.target.value)"
              min="0"
              max="30"
              class="time-field"
            />
            <span class="time-unit">seconds</span>
          </div>
        </label>
      </div>
    </div>
    
    <div class="section">
      <h3 class="section-title">Session Workflow</h3>
      <p class="section-description">Configure how your Pomodoro sessions flow together.</p>
      
      <div class="setting-group">
        <label class="setting-label">
          <span>Long break after every</span>
          <div class="time-input">
            <input 
              type="number" 
              :value="store.longBreakInterval"
              @input="store.setLongBreakInterval($event.target.value)"
              min="2"
              max="10"
              class="time-field"
            />
            <span class="time-unit">work sessions</span>
          </div>
        </label>
      </div>
      
      <div class="session-progress" v-if="store.sessionCount > 0">
        <div class="progress-info">
          <h4>Session Progress</h4>
          <div class="progress-stats">
            <div class="stat">
              <span class="stat-value">{{ store.sessionCount }}</span>
              <span class="stat-label">Completed Sessions</span>
            </div>
            <div class="stat">
              <span class="stat-value">{{ store.sessionProgress.remainingUntilLongBreak }}</span>
              <span class="stat-label">Until Long Break</span>
            </div>
          </div>
          <div class="next-break" :class="{ 'long-break': store.sessionProgress.isNextBreakLong }">
            Next: {{ store.sessionProgress.isNextBreakLong ? 'Long Break' : 'Short Break' }}
          </div>
        </div>
        
        <button class="reset-session-btn" @click="store.resetSession()" type="button">
          Reset Session Count
        </button>
      </div>
    </div>
    
    <div class="section">
      <h3 class="section-title">Audio Notifications</h3>
      <p class="section-description">Sound alerts when timer sessions complete.</p>
      
      <div class="toggle-group">
        <label class="toggle-label">
          <input 
            type="checkbox" 
            class="toggle-input"
            :checked="store.audioNotificationsEnabled"
            @change="store.toggleAudioNotifications()"
          />
          <span class="toggle-slider"></span>
          <span>Enable audio notifications</span>
        </label>
      </div>
      
      <!-- Volume Control -->
      <div class="volume-control" v-if="store.audioNotificationsEnabled">
        <label class="setting-label">
          <span>Notification Volume</span>
          <div class="volume-input">
            <input 
              type="range"
              min="0"
              max="1"
              step="0.1"
              :value="store.notificationVolume"
              @input="store.setNotificationVolume(parseFloat($event.target.value))"
              class="volume-slider"
            />
            <span class="volume-value">{{ Math.round(store.notificationVolume * 100) }}%</span>
          </div>
        </label>
      </div>
      
      <!-- Sound Selection -->
      <div class="sound-selection" v-if="store.audioNotificationsEnabled">
        <div class="sound-setting">
          <label class="toggle-label">
            <input 
              type="checkbox" 
              class="toggle-input"
              :checked="store.workEndSoundEnabled"
              @change="store.toggleWorkEndSound()"
            />
            <span class="toggle-slider"></span>
            <span>Work session end sound</span>
          </label>
          <div class="sound-picker" v-if="store.workEndSoundEnabled">
            <select 
              :value="store.workEndSound"
              @change="store.setWorkEndSound($event.target.value)"
              class="sound-select"
            >
              <option v-for="sound in availableSounds" :key="sound.id" :value="sound.id">
                {{ sound.name }}
              </option>
            </select>
            <button 
              class="preview-btn"
              @click="previewSound(store.workEndSound)"
              type="button"
            >
              🔊
            </button>
          </div>
        </div>
        
        <div class="sound-setting">
          <label class="toggle-label">
            <input 
              type="checkbox" 
              class="toggle-input"
              :checked="store.breakEndSoundEnabled"
              @change="store.toggleBreakEndSound()"
            />
            <span class="toggle-slider"></span>
            <span>Short break end sound</span>
          </label>
          <div class="sound-picker" v-if="store.breakEndSoundEnabled">
            <select 
              :value="store.shortBreakEndSound"
              @change="store.setShortBreakEndSound($event.target.value)"
              class="sound-select"
            >
              <option v-for="sound in availableSounds" :key="sound.id" :value="sound.id">
                {{ sound.name }}
              </option>
            </select>
            <button 
              class="preview-btn"
              @click="previewSound(store.shortBreakEndSound)"
              type="button"
            >
              🔊
            </button>
          </div>
        </div>
        
        <div class="sound-setting">
          <label class="toggle-label">
            <input 
              type="checkbox" 
              class="toggle-input"
              :checked="store.breakEndSoundEnabled"
            />
            <span class="toggle-slider disabled"></span>
            <span>Long break end sound</span>
          </label>
          <div class="sound-picker" v-if="store.breakEndSoundEnabled">
            <select 
              :value="store.longBreakEndSound"
              @change="store.setLongBreakEndSound($event.target.value)"
              class="sound-select"
            >
              <option v-for="sound in availableSounds" :key="sound.id" :value="sound.id">
                {{ sound.name }}
              </option>
            </select>
            <button 
              class="preview-btn"
              @click="previewSound(store.longBreakEndSound)"
              type="button"
            >
              🔊
            </button>
          </div>
        </div>
      </div>
      
      <div class="test-audio">
        <button 
          class="test-btn"
          @click="testAudio"
          :disabled="!store.audioNotificationsEnabled"
        >
          🔊 Test Audio
        </button>
        <span v-if="audioTestResult !== null" class="test-result" :class="{ success: audioTestResult, error: !audioTestResult }">
          {{ audioTestResult ? '✓ Audio working' : '✗ Audio failed' }}
        </span>
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
import { ref, computed, onMounted } from 'vue'
import { useAppStore } from '../../stores/appStore'

const store = useAppStore()
const audioTestResult = ref(null)
const availableSounds = ref([])

onMounted(() => {
  availableSounds.value = store.getAvailableSounds()
})

async function testAudio() {
  audioTestResult.value = null
  
  try {
    const result = await store.testAudioNotification()
    audioTestResult.value = result
    
    // Clear result after 3 seconds
    setTimeout(() => {
      audioTestResult.value = null
    }, 3000)
  } catch (error) {
    console.error('Audio test error:', error)
    audioTestResult.value = false
    
    setTimeout(() => {
      audioTestResult.value = null
    }, 3000)
  }
}

async function previewSound(soundName) {
  try {
    await store.previewSound(soundName)
  } catch (error) {
    console.warn('Preview sound error:', error)
  }
}

const displayModes = [
  {
    key: 'focus',
    name: 'Focus',
    description: 'Timer centered on screen - perfect for deep focus sessions'
  },
  {
    key: 'ambience',
    name: 'Ambience',
    description: 'Small timer in top-right corner - ideal for background timing'
  },
  {
    key: 'home',
    name: 'Home',
    description: 'Clock display centered at top - less imposing, more casual'
  }
]
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
  margin: 0 0 1rem 0;
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--color-text);
  text-align: center;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  position: relative;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid var(--color-border);
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

/* Audio notifications styles */
.toggle-label.disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.toggle-label.disabled .toggle-input:disabled + .toggle-slider {
  background: rgba(255, 255, 255, 0.1);
  border-color: rgba(255, 255, 255, 0.2);
  cursor: not-allowed;
}

.volume-control {
  margin: 16px 0;
  padding: 16px 0;
  border-top: 1px solid var(--color-border);
}

.volume-input {
  display: flex;
  align-items: center;
  gap: 12px;
}

.volume-slider {
  flex: 1;
  height: 4px;
  border-radius: 2px;
  background: rgba(255, 255, 255, 0.2);
  outline: none;
  cursor: pointer;
  -webkit-appearance: none;
  appearance: none;
}

.volume-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: var(--color-primary);
  cursor: pointer;
  border: 2px solid var(--color-bg-primary);
}

.volume-slider::-moz-range-thumb {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: var(--color-primary);
  cursor: pointer;
  border: 2px solid var(--color-bg-primary);
}

.volume-value {
  font-size: 12px;
  color: var(--color-text-secondary);
  min-width: 32px;
  text-align: right;
}

.sound-selection {
  margin: 16px 0;
  padding: 16px 0;
  border-top: 1px solid var(--color-border);
}

.sound-setting {
  margin-bottom: 20px;
}

.sound-setting:last-child {
  margin-bottom: 0;
}

.sound-picker {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 8px;
  margin-left: 56px; /* Align with toggle text */
}

.sound-select {
  flex: 1;
  padding: 8px 12px;
  border-radius: var(--border-radius-sm);
  border: 1px solid var(--color-border);
  background: rgba(255, 255, 255, 0.05);
  color: var(--color-text-primary);
  font-size: 14px;
}

.sound-select:focus {
  border-color: var(--color-primary);
  background: rgba(255, 255, 255, 0.1);
}

.preview-btn {
  width: 32px;
  height: 32px;
  border-radius: var(--border-radius-sm);
  border: 1px solid var(--color-border);
  background: rgba(255, 255, 255, 0.05);
  color: var(--color-text-secondary);
  font-size: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
}

.preview-btn:hover {
  background: rgba(255, 255, 255, 0.1);
  color: var(--color-text-primary);
  transform: scale(1.05);
}

.test-audio {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid var(--color-border);
}

.test-btn {
  padding: 8px 16px;
  border-radius: var(--border-radius-sm);
  background: rgba(0, 191, 165, 0.15);
  border: 1px solid rgba(0, 191, 165, 0.3);
  color: rgba(0, 191, 165, 0.9);
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.test-btn:hover:not(:disabled) {
  background: rgba(0, 191, 165, 0.25);
  color: rgba(0, 191, 165, 1);
  transform: translateY(-1px);
}

.test-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.test-result {
  font-size: 12px;
  font-weight: 500;
}

.test-result.success {
  color: #10b981;
}

.test-result.error {
  color: #ef4444;
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

/* Auto-chain and session workflow styles */
.toggle-label.highlight {
  background: rgba(139, 92, 246, 0.1);
  padding: 12px;
  border-radius: var(--border-radius-sm);
  border: 1px solid rgba(139, 92, 246, 0.2);
}

.feature-description {
  font-size: 12px;
  color: var(--color-text-muted);
  margin: 8px 0 0 56px;
  line-height: 1.4;
}

.advanced-settings {
  margin-top: 16px;
  padding: 16px;
  background: rgba(255, 255, 255, 0.02);
  border-radius: var(--border-radius-sm);
  border: 1px solid var(--color-border);
}

.advanced-settings h4 {
  margin: 0 0 12px 0;
  font-size: 14px;
  font-weight: 600;
  color: var(--color-text-secondary);
}

.auto-start-settings {
  margin-top: 16px;
  padding: 12px;
  background: rgba(255, 255, 255, 0.02);
  border-radius: var(--border-radius-sm);
}

.session-progress {
  margin-top: 20px;
  padding: 16px;
  background: rgba(255, 255, 255, 0.02);
  border-radius: var(--border-radius-sm);
  border: 1px solid var(--color-border);
}

.progress-info h4 {
  margin: 0 0 12px 0;
  font-size: 14px;
  font-weight: 600;
  color: var(--color-text-primary);
}

.progress-stats {
  display: flex;
  gap: 24px;
  margin-bottom: 12px;
}

.stat {
  text-align: center;
}

.stat-value {
  display: block;
  font-size: 18px;
  font-weight: 700;
  color: var(--color-primary);
  line-height: 1;
}

.stat-label {
  display: block;
  font-size: 11px;
  color: var(--color-text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-top: 4px;
}

.next-break {
  font-size: 12px;
  color: var(--color-text-secondary);
  padding: 6px 12px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: var(--border-radius-sm);
  text-align: center;
  margin-bottom: 12px;
}

.next-break.long-break {
  background: rgba(139, 92, 246, 0.1);
  color: rgba(139, 92, 246, 0.9);
  border: 1px solid rgba(139, 92, 246, 0.2);
}

.reset-session-btn {
  width: 100%;
  padding: 8px 16px;
  border-radius: var(--border-radius-sm);
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.3);
  color: rgba(239, 68, 68, 0.9);
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.reset-session-btn:hover {
  background: rgba(239, 68, 68, 0.2);
  color: rgba(239, 68, 68, 1);
  transform: translateY(-1px);
}
</style>