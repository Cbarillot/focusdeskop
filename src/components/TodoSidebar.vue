<template>
  <div class="todo-sidebar" :class="{ expanded: isExpanded }">
    <!-- Sidebar Toggle Button -->
    <button 
      class="sidebar-toggle"
      @click="toggleSidebar"
      @mouseenter="showPreview"
      @mouseleave="hidePreviewDelayed"
      :title="isExpanded ? 'Réduire' : 'Tâches rapides'"
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M9 11L12 14L22 4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M21 12V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H16" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
      <span class="task-count" v-if="!isExpanded">{{ incompleteTasks.length }}</span>
    </button>

    <!-- Task Preview Dropdown -->
    <div 
      class="task-preview"
      v-if="showTaskPreview && !isExpanded"
      @mouseenter="showPreview"
      @mouseleave="hidePreviewDelayed"
    >
      <div class="preview-header">
        <span>Tâches à faire</span>
        <span class="preview-count">{{ incompleteTasks.length }}</span>
      </div>
      <div class="preview-list">
        <div 
          v-for="task in previewTasks"
          :key="task.id"
          class="preview-task-item"
        >
          <button 
            @click="store.toggleTodo(task.id)"
            class="preview-task-check"
          >
            <svg v-if="task.completed" width="8" height="8" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M20 6L9 17L4 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>
          <span class="preview-task-text">{{ task.text }}</span>
        </div>
        <div v-if="incompleteTasks.length === 0" class="preview-empty">
          Aucune tâche
        </div>
        <div v-if="incompleteTasks.length > 3" class="preview-more">
          +{{ incompleteTasks.length - 3 }} autres...
        </div>
      </div>
      <div class="preview-actions">
        <button @click="toggleSidebar" class="preview-action-btn">
          Tout voir
        </button>
      </div>
    </div>

    <!-- Expanded Sidebar Content -->
    <div class="sidebar-content" v-if="isExpanded">
      <div class="sidebar-header">
        <h3>Tâches rapides</h3>
        <button class="add-task-btn" @click="showAddTask = !showAddTask">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <line x1="12" y1="5" x2="12" y2="19" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            <line x1="5" y1="12" x2="19" y2="12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          </svg>
        </button>
      </div>

      <!-- Add task form -->
      <div v-if="showAddTask" class="add-task-form">
        <input 
          v-model="newTaskText"
          @keyup.enter="addQuickTask"
          @keyup.escape="cancelAdd"
          type="text" 
          placeholder="Nouvelle tâche..."
          class="task-input"
          ref="taskInput"
        />
        <div class="task-actions">
          <button @click="addQuickTask" class="task-action-btn primary">+</button>
          <button @click="cancelAdd" class="task-action-btn">×</button>
        </div>
      </div>

      <!-- Todo list -->
      <div class="todo-list">
        <div 
          v-for="task in recentTasks"
          :key="task.id"
          class="task-item"
          :class="{ completed: task.completed }"
        >
          <button 
            @click="store.toggleTodo(task.id)"
            class="task-check"
          >
            <svg v-if="task.completed" width="10" height="10" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M20 6L9 17L4 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>
          <span class="task-text">{{ task.text }}</span>
          <button @click="store.deleteTodo(task.id)" class="task-delete">
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>
        </div>

        <div v-if="recentTasks.length === 0" class="empty-state">
          <p>Aucune tâche</p>
        </div>
      </div>

      <!-- Footer -->
      <div class="sidebar-footer">
        <button @click="openFullTodo" class="view-all-btn">
          Tout voir
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, nextTick } from 'vue'
import { useAppStore } from '../stores/appStore'

const store = useAppStore()

// Component state
const isExpanded = ref(false)
const showAddTask = ref(false)
const newTaskText = ref('')
const taskInput = ref(null)
const showTaskPreview = ref(false)
let previewTimeout = null

// Computed properties
const recentTasks = computed(() => {
  return store.todos.slice(-8).reverse()
})

const incompleteTasks = computed(() => {
  return store.todos.filter(task => !task.completed)
})

const previewTasks = computed(() => {
  return incompleteTasks.value.slice(0, 3)
})

// Methods
function toggleSidebar() {
  isExpanded.value = !isExpanded.value
  showTaskPreview.value = false
  if (!isExpanded.value) {
    showAddTask.value = false
  }
}

function showPreview() {
  if (previewTimeout) {
    clearTimeout(previewTimeout)
    previewTimeout = null
  }
  if (!isExpanded.value) {
    showTaskPreview.value = true
  }
}

function hidePreviewDelayed() {
  previewTimeout = setTimeout(() => {
    showTaskPreview.value = false
  }, 300)
}

function addQuickTask() {
  if (newTaskText.value.trim()) {
    store.addTodo({
      text: newTaskText.value.trim(),
      priority: 'medium',
      urgency: 'medium'
    })
    newTaskText.value = ''
    showAddTask.value = false
  }
}

function cancelAdd() {
  showAddTask.value = false
  newTaskText.value = ''
}

function openFullTodo() {
  store.setActiveTab('todo')
  if (!store.sidebarOpen) {
    store.toggleSidebar()
  }
}

// Auto-focus the input when showing add task form
watch(showAddTask, (newVal) => {
  if (newVal) {
    nextTick(() => {
      taskInput.value?.focus()
    })
  }
})

// Close sidebar when clicking outside
function handleClickOutside(event) {
  if (isExpanded.value && !event.target.closest('.todo-sidebar')) {
    isExpanded.value = false
    showAddTask.value = false
  }
  if (showTaskPreview.value && !event.target.closest('.todo-sidebar')) {
    showTaskPreview.value = false
  }
}

if (typeof document !== 'undefined') {
  document.addEventListener('click', handleClickOutside)
}
</script>

<style scoped>
.todo-sidebar {
  position: fixed;
  left: 20px;
  top: 50%;
  transform: translateY(-50%);
  z-index: 110; /* Higher than corner navigation which is z-index: 100 */
  width: 40px;
  transition: all 0.3s ease;
}

.todo-sidebar.expanded {
  width: 280px;
}

.sidebar-toggle {
  width: 40px;
  height: 40px;
  border-radius: 20px 20px 0 0;
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-bottom: none;
  color: rgba(255, 255, 255, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
}

.todo-sidebar.expanded .sidebar-toggle {
  border-radius: 12px 12px 0 0;
  width: 100%;
  justify-content: flex-start;
  padding-left: 12px;
}

.sidebar-toggle:hover {
  background: rgba(255, 255, 255, 0.25);
  transform: translateX(2px);
}

.task-count {
  position: absolute;
  top: -2px;
  right: -2px;
  background: #ef4444;
  color: white;
  border-radius: 50%;
  width: 16px;
  height: 16px;
  font-size: 10px;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  line-height: 1;
}

/* Task Preview Dropdown */
.task-preview {
  position: absolute;
  left: 50px;
  top: 0;
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 12px;
  padding: 8px;
  width: 200px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  z-index: 120;
}

.preview-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 4px 8px 6px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  margin-bottom: 6px;
}

.preview-header span {
  font-size: 11px;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.9);
}

.preview-count {
  background: rgba(255, 255, 255, 0.2);
  border-radius: 10px;
  padding: 2px 6px;
  font-size: 9px;
}

.preview-list {
  max-height: 120px;
  overflow-y: auto;
}

.preview-task-item {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 4px 0;
  font-size: 11px;
}

.preview-task-check {
  width: 12px;
  height: 12px;
  border-radius: 2px;
  border: 1px solid rgba(255, 255, 255, 0.4);
  background: transparent;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  flex-shrink: 0;
}

.preview-task-check:hover {
  border-color: rgba(255, 255, 255, 0.6);
}

.preview-task-text {
  flex: 1;
  color: rgba(255, 255, 255, 0.9);
  line-height: 1.2;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.preview-empty {
  text-align: center;
  padding: 12px;
  color: rgba(255, 255, 255, 0.6);
  font-size: 11px;
}

.preview-more {
  text-align: center;
  padding: 4px;
  color: rgba(255, 255, 255, 0.7);
  font-size: 10px;
  font-style: italic;
}

.preview-actions {
  margin-top: 6px;
  padding-top: 6px;
  border-top: 1px solid rgba(255, 255, 255, 0.2);
  text-align: center;
}

.preview-action-btn {
  padding: 3px 8px;
  border-radius: 4px;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: rgba(255, 255, 255, 0.8);
  font-size: 10px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.preview-action-btn:hover {
  background: rgba(255, 255, 255, 0.2);
  color: rgba(255, 255, 255, 1);
}

.sidebar-content {
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-top: none;
  border-radius: 0 0 12px 12px;
  padding: 12px;
  max-height: 400px;
  overflow-y: auto;
}

.sidebar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
  padding-bottom: 8px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
}

.sidebar-header h3 {
  margin: 0;
  font-size: 14px;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.9);
}

.add-task-btn {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
  border: none;
  color: rgba(255, 255, 255, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
}

.add-task-btn:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: scale(1.1);
}

.add-task-form {
  margin-bottom: 12px;
  padding: 8px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.task-input {
  width: 100%;
  padding: 6px 8px;
  border-radius: 4px;
  border: 1px solid rgba(255, 255, 255, 0.3);
  background: rgba(255, 255, 255, 0.1);
  color: rgba(255, 255, 255, 0.9);
  font-size: 12px;
  margin-bottom: 6px;
}

.task-input:focus {
  border-color: rgba(255, 255, 255, 0.5);
  background: rgba(255, 255, 255, 0.15);
  outline: none;
}

.task-input::placeholder {
  color: rgba(255, 255, 255, 0.6);
}

.task-actions {
  display: flex;
  gap: 4px;
  justify-content: flex-end;
}

.task-action-btn {
  width: 24px;
  height: 24px;
  border-radius: 4px;
  border: none;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.task-action-btn.primary {
  background: rgba(34, 197, 94, 0.8);
  color: white;
}

.task-action-btn.primary:hover {
  background: rgba(34, 197, 94, 1);
}

.task-action-btn:not(.primary) {
  background: rgba(255, 255, 255, 0.2);
  color: rgba(255, 255, 255, 0.8);
}

.task-action-btn:not(.primary):hover {
  background: rgba(255, 255, 255, 0.3);
  color: rgba(255, 255, 255, 1);
}

.todo-list {
  max-height: 250px;
  overflow-y: auto;
}

.task-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  transition: opacity 0.2s ease;
}

.task-item:last-child {
  border-bottom: none;
}

.task-item.completed {
  opacity: 0.6;
}

.task-check {
  width: 16px;
  height: 16px;
  border-radius: 3px;
  border: 2px solid rgba(255, 255, 255, 0.4);
  background: transparent;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  flex-shrink: 0;
}

.task-check:hover {
  border-color: rgba(255, 255, 255, 0.6);
}

.task-item.completed .task-check {
  background: rgba(34, 197, 94, 0.8);
  border-color: rgba(34, 197, 94, 0.8);
  color: white;
}

.task-text {
  flex: 1;
  font-size: 12px;
  color: rgba(255, 255, 255, 0.9);
  line-height: 1.3;
}

.task-item.completed .task-text {
  text-decoration: line-through;
  color: rgba(255, 255, 255, 0.6);
}

.task-delete {
  width: 20px;
  height: 20px;
  border-radius: 3px;
  border: none;
  background: transparent;
  color: rgba(255, 255, 255, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  flex-shrink: 0;
  opacity: 0;
}

.task-item:hover .task-delete {
  opacity: 1;
}

.task-delete:hover {
  background: rgba(239, 68, 68, 0.2);
  color: rgba(239, 68, 68, 0.8);
}

.empty-state {
  text-align: center;
  padding: 20px 10px;
  color: rgba(255, 255, 255, 0.6);
}

.empty-state p {
  margin: 0;
  font-size: 12px;
}

.sidebar-footer {
  margin-top: 8px;
  padding-top: 8px;
  border-top: 1px solid rgba(255, 255, 255, 0.2);
  text-align: center;
}

.view-all-btn {
  padding: 4px 12px;
  border-radius: 4px;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: rgba(255, 255, 255, 0.8);
  font-size: 11px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.view-all-btn:hover {
  background: rgba(255, 255, 255, 0.2);
  color: rgba(255, 255, 255, 1);
}

/* Responsive */
@media (max-width: 768px) {
  .todo-sidebar {
    left: 15px;
    top: 45%;
  }
  
  .todo-sidebar.expanded {
    width: 250px;
  }
  
  .task-preview {
    left: 45px;
    width: 180px;
  }
}

@media (max-width: 480px) {
  .todo-sidebar {
    left: 12px;
    top: 35%;
    z-index: 120; /* Even higher on mobile */
  }
  
  .todo-sidebar.expanded {
    width: calc(100vw - 80px);
    max-width: 220px;
  }
  
  .task-preview {
    left: 45px;
    width: 160px;
  }
}
</style>