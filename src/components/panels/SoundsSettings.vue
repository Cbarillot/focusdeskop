<template>
  <div class="panel-section">
    <h3>Sounds</h3>
    <p class="section-description">Manage sound effects and notifications for your focus sessions.</p>
    
    <div class="setting-group">
      <h4>Timer Sounds</h4>
      
      <div class="sound-option">
        <label class="setting-label">Start sound</label>
        <div class="sound-controls">
          <select v-model="startSound" class="sound-select">
            <option value="none">None</option>
            <option value="bell">Bell</option>
            <option value="chime">Chime</option>
            <option value="ding">Ding</option>
            <option value="pop">Pop</option>
          </select>
          <button class="play-btn" @click="playSound('start')">▶</button>
        </div>
      </div>
      
      <div class="sound-option">
        <label class="setting-label">End sound</label>
        <div class="sound-controls">
          <select v-model="endSound" class="sound-select">
            <option value="none">None</option>
            <option value="bell">Bell</option>
            <option value="chime">Chime</option>
            <option value="gong">Gong</option>
            <option value="notification">Notification</option>
          </select>
          <button class="play-btn" @click="playSound('end')">▶</button>
        </div>
      </div>
      
      <div class="sound-option">
        <label class="setting-label">Break sound</label>
        <div class="sound-controls">
          <select v-model="breakSound" class="sound-select">
            <option value="none">None</option>
            <option value="soft-bell">Soft Bell</option>
            <option value="whistle">Whistle</option>
            <option value="bird">Bird</option>
            <option value="wind">Wind</option>
          </select>
          <button class="play-btn" @click="playSound('break')">▶</button>
        </div>
      </div>
    </div>
    
    <div class="setting-group">
      <h4>Volume Settings</h4>
      
      <div class="volume-control">
        <label class="setting-label">Sound effects volume</label>
        <div class="volume-slider-container">
          <input 
            type="range" 
            min="0" 
            max="100" 
            v-model="soundVolume" 
            class="volume-slider"
          />
          <span class="volume-value">{{ soundVolume }}%</span>
        </div>
      </div>
    </div>
    
    <div class="setting-group">
      <h4>Notifications</h4>
      
      <div class="setting-item">
        <label class="setting-label">Browser notifications</label>
        <label class="toggle-switch">
          <input type="checkbox" v-model="browserNotifications" @change="requestNotificationPermission" />
          <span class="slider"></span>
        </label>
      </div>
      
      <div class="setting-item">
        <label class="setting-label">Sound with notifications</label>
        <label class="toggle-switch">
          <input type="checkbox" v-model="notificationSound" />
          <span class="slider"></span>
        </label>
      </div>
      
      <div class="setting-item">
        <label class="setting-label">Repeat notifications</label>
        <label class="toggle-switch">
          <input type="checkbox" v-model="repeatNotifications" />
          <span class="slider"></span>
        </label>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const startSound = ref('bell')
const endSound = ref('gong')
const breakSound = ref('soft-bell')
const soundVolume = ref(75)
const browserNotifications = ref(false)
const notificationSound = ref(true)
const repeatNotifications = ref(false)

function playSound(type) {
  console.log(`Playing ${type} sound`)
  // Sound playing logic would go here
}

function requestNotificationPermission() {
  if (browserNotifications.value && 'Notification' in window) {
    Notification.requestPermission()
  }
}
</script>

<style scoped>
.sound-option {
  margin-bottom: 16px;
}

.sound-controls {
  display: flex;
  align-items: center;
  gap: 8px;
}

.sound-select {
  flex: 1;
  padding: 8px 12px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: var(--border-radius-sm);
  color: var(--color-text-primary);
  font-size: 14px;
}

.play-btn {
  width: 32px;
  height: 32px;
  background: var(--color-primary);
  border: none;
  border-radius: 50%;
  color: white;
  font-size: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
}

.play-btn:hover {
  background: var(--color-primary-dark);
  transform: scale(1.1);
}

.volume-control {
  margin-bottom: 16px;
}

.volume-slider-container {
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
}

.volume-slider::-webkit-slider-thumb {
  appearance: none;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: var(--color-primary);
  cursor: pointer;
}

.volume-slider::-moz-range-thumb {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: var(--color-primary);
  cursor: pointer;
  border: none;
}

.volume-value {
  font-size: 12px;
  color: var(--color-text-secondary);
  min-width: 32px;
  text-align: right;
}

.setting-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.toggle-switch {
  position: relative;
  display: inline-block;
  width: 40px;
  height: 20px;
}

.toggle-switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(255, 255, 255, 0.2);
  transition: 0.2s;
  border-radius: 20px;
}

.slider:before {
  position: absolute;
  content: "";
  height: 16px;
  width: 16px;
  left: 2px;
  bottom: 2px;
  background-color: white;
  transition: 0.2s;
  border-radius: 50%;
}

input:checked + .slider {
  background-color: var(--color-primary);
}

input:checked + .slider:before {
  transform: translateX(20px);
}

h4 {
  margin: 0 0 16px 0;
  font-size: 16px;
  font-weight: 600;
  color: var(--color-text-primary);
}
</style>
