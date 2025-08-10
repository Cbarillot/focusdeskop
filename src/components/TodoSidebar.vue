<template>
  <div class="todo-sidebar">
    <!-- Todo Button -->
    <button 
      class="todo-button"
      @click="toggleSidebar"
      :class="{ expanded: isExpanded }"
      title="Tâches"
    >
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <!-- Timer/Stopwatch icon for tasks -->
        <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/>
        <polyline points="12,6 12,12 16,14" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    </button>

    <!-- Expandable Todo Panel -->
    <div 
      class="todo-panel"
      :class="{ expanded: isExpanded }"
    >
      <div class="todo-header">
        <h3>TO DO LIST</h3>
        <button class="close-btn" @click="toggleSidebar">×</button>
      </div>
      
      <div class="todo-content">
        <!-- Add Task -->
        <div class="add-task-section">
          <input 
            v-model="newTask"
            type="text"
            placeholder="Nouvelle tâche..."
            @keyup.enter="addTask"
            class="task-input"
          />
          <button @click="addTask" class="add-btn">+</button>
        </div>

        <!-- Task List -->
        <div class="task-list">
          <div 
            v-for="(task, index) in tasks" 
            :key="index"
            class="task-item"
            @mouseenter="hoveredTask = index"
            @mouseleave="hoveredTask = null"
          >
            <div class="task-icon">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="12" r="8" stroke="currentColor" stroke-width="2"/>
                <polyline points="12,8 12,12 15,13" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
              </svg>
            </div>
            
            <div class="task-content">
              <span class="task-name">{{ task.name }}</span>
              <div 
                v-if="hoveredTask === index" 
                class="task-tooltip"
              >
                {{ task.name }}
              </div>
            </div>
            
            <button 
              @click="removeTask(index)"
              class="task-remove"
            >
              ×
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'

const isExpanded = ref(false)
const newTask = ref('')
const hoveredTask = ref(null)

const tasks = reactive([
  { name: 'Tâche 1', completed: false },
  { name: 'Tâche 2', completed: false },
  { name: 'Tâche 3', completed: false }
])

function toggleSidebar() {
  isExpanded.value = !isExpanded.value
}

function addTask() {
  if (newTask.value.trim()) {
    tasks.push({
      name: newTask.value.trim(),
      completed: false
    })
    newTask.value = ''
  }
}

function removeTask(index) {
  tasks.splice(index, 1)
}
</script>

<style scoped>
.todo-sidebar {
  position: fixed;
  left: 20px;
  top: 50%;
  transform: translateY(-50%);
  z-index: 150;
  display: flex;
  align-items: flex-start;
  gap: 0;
}

.todo-button {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: rgba(0, 191, 165, 0.9);
  backdrop-filter: blur(10px);
  border: 2px solid rgba(0, 191, 165, 1);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  cursor: pointer;
  box-shadow: 0 4px 16px rgba(0, 191, 165, 0.3);
}

.todo-button:hover {
  transform: scale(1.05);
  box-shadow: 0 6px 20px rgba(0, 191, 165, 0.4);
}

.todo-button.expanded {
  border-radius: 12px 0 0 12px;
  background: rgba(0, 191, 165, 1);
}

.todo-panel {
  width: 0;
  height: 300px;
  background: rgba(0, 0, 0, 0.85);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-left: none;
  border-radius: 0 12px 12px 0;
  overflow: hidden;
  transition: all 0.3s ease;
  opacity: 0;
}

.todo-panel.expanded {
  width: 280px;
  opacity: 1;
}

.todo-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.todo-header h3 {
  color: rgba(0, 191, 165, 1);
  font-size: 14px;
  font-weight: 600;
  margin: 0;
  letter-spacing: 0.5px;
}

.close-btn {
  background: none;
  border: none;
  color: rgba(255, 255, 255, 0.6);
  font-size: 20px;
  cursor: pointer;
  padding: 0;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color 0.2s ease;
}

.close-btn:hover {
  color: white;
}

.todo-content {
  padding: 16px;
}

.add-task-section {
  display: flex;
  gap: 8px;
  margin-bottom: 16px;
}

.task-input {
  flex: 1;
  padding: 8px 12px;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  color: white;
  font-size: 14px;
  outline: none;
  transition: all 0.2s ease;
}

.task-input:focus {
  background: rgba(255, 255, 255, 0.15);
  border-color: rgba(0, 191, 165, 0.5);
}

.task-input::placeholder {
  color: rgba(255, 255, 255, 0.5);
}

.add-btn {
  width: 32px;
  height: 32px;
  background: rgba(0, 191, 165, 0.8);
  border: none;
  border-radius: 8px;
  color: white;
  font-size: 18px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.add-btn:hover {
  background: rgba(0, 191, 165, 1);
  transform: scale(1.05);
}

.task-list {
  max-height: 180px;
  overflow-y: auto;
  scrollbar-width: thin;
  scrollbar-color: rgba(255, 255, 255, 0.3) transparent;
}

.task-list::-webkit-scrollbar {
  width: 4px;
}

.task-list::-webkit-scrollbar-track {
  background: transparent;
}

.task-list::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.3);
  border-radius: 2px;
}

.task-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  position: relative;
}

.task-item:last-child {
  border-bottom: none;
}

.task-icon {
  color: rgba(0, 191, 165, 0.8);
  flex-shrink: 0;
}

.task-content {
  flex: 1;
  position: relative;
}

.task-name {
  color: rgba(255, 255, 255, 0.9);
  font-size: 13px;
  display: block;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 180px;
}

.task-tooltip {
  position: absolute;
  left: 0;
  top: -30px;
  background: rgba(0, 0, 0, 0.9);
  color: white;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  white-space: nowrap;
  z-index: 1000;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.task-remove {
  background: none;
  border: none;
  color: rgba(255, 255, 255, 0.4);
  font-size: 16px;
  cursor: pointer;
  padding: 0;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color 0.2s ease;
  flex-shrink: 0;
}

.task-remove:hover {
  color: rgba(255, 100, 100, 0.8);
}

/* Responsive design */
@media (max-width: 768px) {
  .todo-sidebar {
    left: 15px;
  }
  
  .todo-button {
    width: 44px;
    height: 44px;
  }
  
  .todo-panel.expanded {
    width: 260px;
  }
}

@media (max-width: 480px) {
  .todo-sidebar {
    left: 10px;
  }
  
  .todo-panel.expanded {
    width: 240px;
  }
  
  .todo-header {
    padding: 12px 16px;
  }
  
  .todo-content {
    padding: 12px;
  }
}
</style>
