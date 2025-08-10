<template>
  <div class="panel-section">
    <h3>Clock Settings</h3>
    <p class="section-description">Customize your clock display preferences.</p>
    
    <div class="setting-group">
      <label class="setting-label">Time Format</label>
      <div class="radio-group">
        <label class="radio-option">
          <input type="radio" value="12" v-model="clockFormat" />
          <span>12-hour</span>
        </label>
        <label class="radio-option">
          <input type="radio" value="24" v-model="clockFormat" />
          <span>24-hour</span>
        </label>
      </div>
    </div>
    
    <div class="setting-group">
      <label class="setting-label">Show Seconds</label>
      <label class="toggle-switch">
        <input type="checkbox" v-model="showSeconds" />
        <span class="slider"></span>
      </label>
    </div>
    
    <div class="setting-group">
      <label class="setting-label">Show Date</label>
      <label class="toggle-switch">
        <input type="checkbox" v-model="showDate" />
        <span class="slider"></span>
      </label>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const clockFormat = ref('12')
const showSeconds = ref(true)
const showDate = ref(true)
</script>

<style scoped>
.panel-section {
  padding: 0;
}

.section-description {
  color: var(--color-text-secondary);
  font-size: 14px;
  margin-bottom: 24px;
  line-height: 1.5;
}

.setting-group {
  margin-bottom: 24px;
}

.setting-label {
  display: block;
  font-size: 14px;
  font-weight: 500;
  color: var(--color-text-primary);
  margin-bottom: 8px;
}

.radio-group {
  display: flex;
  gap: 16px;
}

.radio-option {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: var(--color-text-secondary);
  cursor: pointer;
}

.radio-option input[type="radio"] {
  accent-color: var(--color-primary);
}

.toggle-switch {
  position: relative;
  display: inline-block;
  width: 48px;
  height: 24px;
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
  border-radius: 24px;
}

.slider:before {
  position: absolute;
  content: "";
  height: 20px;
  width: 20px;
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
  transform: translateX(24px);
}
</style>
