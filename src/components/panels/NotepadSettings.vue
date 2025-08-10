<template>
  <div class="panel-section">
    <h3>Notepad</h3>
    <p class="section-description">Keep track of your thoughts and tasks during focus sessions.</p>
    
    <div class="notepad-container">
      <textarea 
        v-model="noteContent"
        placeholder="Start typing your notes..."
        class="notepad-textarea"
        @input="saveNote"
      ></textarea>
      
      <div class="notepad-stats">
        <span>{{ characterCount }} characters</span>
        <span>{{ wordCount }} words</span>
      </div>
    </div>
    
    <div class="setting-group">
      <h4>Settings</h4>
      
      <div class="setting-item">
        <label class="setting-label">Auto-save</label>
        <label class="toggle-switch">
          <input type="checkbox" v-model="autoSave" />
          <span class="slider"></span>
        </label>
      </div>
      
      <div class="setting-item">
        <label class="setting-label">Word wrap</label>
        <label class="toggle-switch">
          <input type="checkbox" v-model="wordWrap" />
          <span class="slider"></span>
        </label>
      </div>
      
      <div class="setting-item">
        <label class="setting-label">Font size</label>
        <select v-model="fontSize" class="select-input">
          <option value="12">12px</option>
          <option value="14">14px</option>
          <option value="16">16px</option>
          <option value="18">18px</option>
        </select>
      </div>
    </div>
    
    <div class="action-buttons">
      <button class="action-btn secondary" @click="clearNote">Clear All</button>
      <button class="action-btn primary" @click="exportNote">Export</button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'

const noteContent = ref(localStorage.getItem('notepad-content') || '')
const autoSave = ref(true)
const wordWrap = ref(true)
const fontSize = ref('14')

const characterCount = computed(() => noteContent.value.length)
const wordCount = computed(() => {
  return noteContent.value.trim() === '' ? 0 : noteContent.value.trim().split(/\s+/).length
})

function saveNote() {
  if (autoSave.value) {
    localStorage.setItem('notepad-content', noteContent.value)
  }
}

function clearNote() {
  if (confirm('Are you sure you want to clear all notes?')) {
    noteContent.value = ''
    saveNote()
  }
}

function exportNote() {
  const blob = new Blob([noteContent.value], { type: 'text/plain' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `notes-${new Date().toISOString().split('T')[0]}.txt`
  a.click()
  URL.revokeObjectURL(url)
}

watch(fontSize, (newSize) => {
  document.documentElement.style.setProperty('--notepad-font-size', newSize + 'px')
})
</script>

<style scoped>
.notepad-container {
  margin-bottom: 24px;
}

.notepad-textarea {
  width: 100%;
  height: 300px;
  padding: 16px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: var(--border-radius-md);
  color: var(--color-text-primary);
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  font-size: var(--notepad-font-size, 14px);
  line-height: 1.5;
  resize: vertical;
  outline: none;
}

.notepad-textarea:focus {
  border-color: var(--color-primary);
  box-shadow: 0 0 0 2px rgba(139, 92, 246, 0.1);
}

.notepad-stats {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  color: var(--color-text-secondary);
  margin-top: 8px;
}

.setting-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.select-input {
  padding: 6px 8px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: var(--border-radius-sm);
  color: var(--color-text-primary);
  font-size: 12px;
}

.action-buttons {
  display: flex;
  gap: 12px;
  margin-top: 24px;
}

.action-btn {
  flex: 1;
  padding: 10px 16px;
  border-radius: var(--border-radius-md);
  font-size: 14px;
  font-weight: 500;
  transition: all 0.2s ease;
  border: 1px solid transparent;
}

.action-btn.primary {
  background: var(--color-primary);
  color: white;
}

.action-btn.secondary {
  background: rgba(255, 255, 255, 0.05);
  border-color: rgba(255, 255, 255, 0.1);
  color: var(--color-text-secondary);
}

.action-btn:hover {
  transform: translateY(-1px);
}

.action-btn.primary:hover {
  background: var(--color-primary-dark);
}

.action-btn.secondary:hover {
  background: rgba(255, 255, 255, 0.1);
  color: var(--color-text-primary);
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
