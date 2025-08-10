<template>
  <div class="panel-section">
    <h3>Statistics</h3>
    <p class="section-description">Track your productivity and focus sessions.</p>
    
    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-number">247</div>
        <div class="stat-label">Total Sessions</div>
      </div>
      <div class="stat-card">
        <div class="stat-number">103h</div>
        <div class="stat-label">Total Focus Time</div>
      </div>
      <div class="stat-card">
        <div class="stat-number">12</div>
        <div class="stat-label">Current Streak</div>
      </div>
      <div class="stat-card">
        <div class="stat-number">25</div>
        <div class="stat-label">Best Streak</div>
      </div>
    </div>
    
    <div class="setting-group">
      <h4>Weekly Progress</h4>
      <div class="progress-bar">
        <div class="progress-fill" :style="{ width: weekProgress + '%' }"></div>
      </div>
      <div class="progress-text">{{ weekProgress }}% of weekly goal</div>
    </div>
    
    <div class="setting-group">
      <h4>Settings</h4>
      <label class="setting-label">Weekly Goal (hours)</label>
      <input 
        type="number" 
        v-model="weeklyGoal" 
        class="number-input"
        min="1"
        max="168"
      />
    </div>
    
    <div class="setting-group">
      <label class="setting-label">Reset Statistics</label>
      <button class="reset-btn" @click="resetStats">Reset All Data</button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const weekProgress = ref(68)
const weeklyGoal = ref(25)

function resetStats() {
  if (confirm('Are you sure you want to reset all statistics? This action cannot be undone.')) {
    // Reset logic here
  }
}
</script>

<style scoped>
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 16px;
  margin-bottom: 32px;
}

.stat-card {
  background: rgba(255, 255, 255, 0.05);
  border-radius: var(--border-radius-md);
  padding: 20px;
  text-align: center;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.stat-number {
  font-size: 24px;
  font-weight: 700;
  color: var(--color-primary);
  margin-bottom: 4px;
}

.stat-label {
  font-size: 12px;
  color: var(--color-text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.progress-bar {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  height: 8px;
  overflow: hidden;
  margin-bottom: 8px;
}

.progress-fill {
  background: var(--color-primary);
  height: 100%;
  transition: width 0.3s ease;
}

.progress-text {
  font-size: 12px;
  color: var(--color-text-secondary);
}

.number-input {
  width: 100%;
  padding: 8px 12px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: var(--border-radius-sm);
  color: var(--color-text-primary);
  font-size: 14px;
}

.reset-btn {
  padding: 8px 16px;
  background: rgba(239, 68, 68, 0.2);
  border: 1px solid rgba(239, 68, 68, 0.3);
  border-radius: var(--border-radius-sm);
  color: #FCA5A5;
  font-size: 12px;
  transition: all 0.2s ease;
}

.reset-btn:hover {
  background: rgba(239, 68, 68, 0.3);
  border-color: rgba(239, 68, 68, 0.5);
}

h4 {
  margin: 0 0 16px 0;
  font-size: 16px;
  font-weight: 600;
  color: var(--color-text-primary);
}
</style>
