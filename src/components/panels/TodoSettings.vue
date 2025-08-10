<template>
  <div class="todo-settings">
    <!-- Microsoft To-Do Widget -->
    <div class="section">
      <h3 class="section-title">Microsoft To-Do</h3>
      <p class="section-description">Access your Microsoft To-Do tasks directly in the app.</p>
      
      <div class="microsoft-todo-widget">
        <iframe 
          src="https://to-do.office.com/tasks/today"
          frameborder="0"
          class="microsoft-todo-iframe"
          title="Microsoft To-Do"
        ></iframe>
        <div class="widget-overlay">
          <p>Microsoft To-Do integration</p>
          <button @click="openMicrosoftTodo" class="open-todo-btn">
            Open Microsoft To-Do
          </button>
        </div>
      </div>
    </div>

    <!-- Local Task Manager -->
    <div class="section">
      <h3 class="section-title">Local Task Manager</h3>
      
      <div class="add-task-form">
        <input 
          v-model="newTask.title"
          type="text"
          placeholder="Enter task title..."
          class="task-input"
          @keyup.enter="addTask"
        />
        
        <div class="task-options">
          <!-- Eisenhower Matrix Toggle -->
          <div class="eisenhower-toggle">
            <label class="toggle-label">Eisenhower Matrix</label>
            <div class="matrix-selector">
              <button 
                v-for="quadrant in eisenhowerQuadrants"
                :key="quadrant.key"
                class="matrix-btn"
                :class="{ active: newTask.eisenhowerQuadrant === quadrant.key }"
                @click="newTask.eisenhowerQuadrant = quadrant.key"
                :title="quadrant.description"
              >
                {{ quadrant.icon }} {{ quadrant.label }}
              </button>
            </div>
          </div>
          
          <!-- Time Estimation -->
          <div class="time-estimation">
            <label class="toggle-label">Estimated Time</label>
            <div class="time-selector">
              <button 
                v-for="timeOption in timeOptions"
                :key="timeOption.minutes"
                class="time-btn"
                :class="{ active: newTask.estimatedMinutes === timeOption.minutes }"
                @click="newTask.estimatedMinutes = timeOption.minutes"
              >
                {{ timeOption.icon }} {{ timeOption.label }}
              </button>
            </div>
          </div>
          
          <select v-model="newTask.priority" class="priority-select">
            <option value="low">Low Priority</option>
            <option value="medium">Medium Priority</option>
            <option value="high">High Priority</option>
          </select>
        </div>
        
        <div class="task-tags">
          <input 
            v-model="newTagInput"
            type="text"
            placeholder="Add tags (press Enter)..."
            class="tag-input"
            @keyup.enter="addTag"
          />
          
          <div class="tag-list">
            <span 
              v-for="tag in newTask.tags"
              :key="tag"
              class="tag"
            >
              {{ tag }}
              <button @click="removeTag(tag)" class="tag-remove">×</button>
            </span>
          </div>
        </div>
        
        <button @click="addTask" class="add-btn">Add Task</button>
      </div>
    </div>
    
    <div class="section">
      <h3 class="section-title">Tasks</h3>
      
      <div class="task-controls">
        <div class="filter-tabs">
          <button 
            v-for="filter in filters"
            :key="filter.key"
            class="filter-tab"
            :class="{ active: store.todoFilter === filter.key }"
            @click="store.todoFilter = filter.key"
          >
            {{ filter.label }}
          </button>
        </div>
        
        <select v-model="store.todoSort" class="sort-select">
          <option value="created">Date Created</option>
          <option value="priority">Priority</option>
          <option value="due">Due Date</option>
          <option value="alphabetical">Alphabetical</option>
          <option value="pomodoros">Estimated Time</option>
        </select>
      </div>
      
      <div class="task-list" v-if="filteredTodos.length > 0">
        <div 
          v-for="todo in filteredTodos"
          :key="todo.id"
          class="task-card"
          :class="{ completed: todo.completed }"
          draggable="true"
          @dragstart="onDragStart($event, todo)"
          @dragover.prevent
          @drop="onDrop($event, todo)"
        >
          <div class="task-header">
            <button 
              @click="store.toggleTodo(todo.id)"
              class="task-checkbox"
              :class="{ checked: todo.completed }"
            >
              <svg v-if="todo.completed" width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M20 6L9 17L4 12" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </button>
            
            <div class="task-content">
              <h4 class="task-title">{{ todo.title }}</h4>
              <div class="task-meta">
                <span 
                  class="priority-badge"
                  :class="todo.priority"
                >
                  {{ todo.priority }}
                </span>
                <span v-if="todo.estimatedPomodoros" class="pomodoro-estimate">
                  🍅 {{ todo.estimatedPomodoros }}
                </span>
              </div>
            </div>
            
            <div class="task-actions">
              <button @click="editTask(todo)" class="action-btn">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M11 4H4C3.46957 4 2.96086 4.21071 2.58579 4.58579C2.21071 4.96086 2 5.46957 2 6V20C2 20.5304 2.21071 21.0391 2.58579 21.4142C2.96086 21.7893 3.46957 22 4 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V13" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M18.5 2.50023C18.8978 2.1024 19.4374 1.87891 20 1.87891C20.5626 1.87891 21.1022 2.1024 21.5 2.50023C21.8978 2.89805 22.1213 3.43762 22.1213 4.00023C22.1213 4.56284 21.8978 5.1024 21.5 5.50023L12 15.0002L8 16.0002L9 12.0002L18.5 2.50023Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </button>
              <button @click="store.deleteTodo(todo.id)" class="action-btn delete">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M3 6H5H21" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M8 6V4C8 3.46957 8.21071 2.96086 8.58579 2.58579C8.96086 2.21071 9.46957 2 10 2H14C14.5304 2 15.0391 2.21071 15.4142 2.58579C15.7893 2.96086 16 3.46957 16 4V6M19 6V20C19 20.5304 18.7893 21.0391 18.4142 21.4142C18.0391 21.7893 17.5304 22 17 22H7C6.46957 22 5.96086 21.7893 5.58579 21.4142C5.21071 21.0391 5 20.5304 5 20V6H19Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </button>
            </div>
          </div>
          
          <div v-if="todo.tags && todo.tags.length > 0" class="task-tags-display">
            <span 
              v-for="tag in todo.tags"
              :key="tag"
              class="task-tag"
            >
              {{ tag }}
            </span>
          </div>
          
          <div v-if="todo.subtasks && todo.subtasks.length > 0" class="subtasks">
            <h5 class="subtasks-title">Subtasks</h5>
            <div 
              v-for="subtask in todo.subtasks"
              :key="subtask.id"
              class="subtask"
            >
              <button 
                @click="toggleSubtask(todo.id, subtask.id)"
                class="subtask-checkbox"
                :class="{ checked: subtask.completed }"
              >
                <svg v-if="subtask.completed" width="10" height="10" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M20 6L9 17L4 12" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </button>
              <span class="subtask-title">{{ subtask.title }}</span>
            </div>
          </div>
        </div>
      </div>
      
      <div v-else class="empty-state">
        <p>No tasks yet. Add your first task above!</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useAppStore } from '../../stores/appStore'

const store = useAppStore()

const newTask = ref({
  title: '',
  priority: 'medium',
  estimatedPomodoros: 1,
  estimatedMinutes: 30,
  eisenhowerQuadrant: 'important-urgent', // important-urgent, important-not-urgent, not-important-urgent, not-important-not-urgent
  tags: []
})

const newTagInput = ref('')

// Eisenhower Matrix quadrants
const eisenhowerQuadrants = [
  {
    key: 'important-urgent',
    label: 'Do First',
    icon: '🔴',
    description: 'Important & Urgent - Do immediately'
  },
  {
    key: 'important-not-urgent', 
    label: 'Schedule',
    icon: '🟡',
    description: 'Important & Not Urgent - Plan to do'
  },
  {
    key: 'not-important-urgent',
    label: 'Delegate',
    icon: '🔵', 
    description: 'Not Important & Urgent - Delegate if possible'
  },
  {
    key: 'not-important-not-urgent',
    label: 'Eliminate',
    icon: '⚪',
    description: 'Not Important & Not Urgent - Consider eliminating'
  }
]

// Time estimation options with clock icons
const timeOptions = [
  { minutes: 15, label: '15min', icon: '🕐' },
  { minutes: 30, label: '30min', icon: '🕓' },
  { minutes: 60, label: '1h', icon: '🕕' },
  { minutes: 90, label: '1h30', icon: '🕘' },
  { minutes: 120, label: '2h', icon: '🕘' },
  { minutes: 150, label: '2h+', icon: '🕘' }
]

const filters = [
  { key: 'all', label: 'All' },
  { key: 'active', label: 'Active' },
  { key: 'completed', label: 'Completed' }
]

const filteredTodos = computed(() => {
  let filtered = store.todos

  // Apply filter
  switch (store.todoFilter) {
    case 'active':
      filtered = filtered.filter(todo => !todo.completed)
      break
    case 'completed':
      filtered = filtered.filter(todo => todo.completed)
      break
  }

  // Apply sort
  switch (store.todoSort) {
    case 'priority':
      const priorityOrder = { high: 3, medium: 2, low: 1 }
      filtered = [...filtered].sort((a, b) => priorityOrder[b.priority] - priorityOrder[a.priority])
      break
    case 'alphabetical':
      filtered = [...filtered].sort((a, b) => a.title.localeCompare(b.title))
      break
    case 'pomodoros':
      filtered = [...filtered].sort((a, b) => (b.estimatedPomodoros || 0) - (a.estimatedPomodoros || 0))
      break
    case 'created':
    default:
      filtered = [...filtered].sort((a, b) => new Date(b.created) - new Date(a.created))
  }

  return filtered
})

function openMicrosoftTodo() {
  window.open('https://to-do.office.com/tasks/today', '_blank')
}

function addTask() {
  if (newTask.value.title.trim()) {
    store.addTodo({
      ...newTask.value,
      title: newTask.value.title.trim(),
      estimatedPomodoros: Math.ceil(newTask.value.estimatedMinutes / 25) // Convert minutes to pomodoros
    })
    
    // Reset form
    newTask.value = {
      title: '',
      priority: 'medium',
      estimatedPomodoros: 1,
      estimatedMinutes: 30,
      eisenhowerQuadrant: 'important-urgent',
      tags: []
    }
  }
}

function addTag() {
  const tag = newTagInput.value.trim()
  if (tag && !newTask.value.tags.includes(tag)) {
    newTask.value.tags.push(tag)
    newTagInput.value = ''
  }
}

function removeTag(tagToRemove) {
  newTask.value.tags = newTask.value.tags.filter(tag => tag !== tagToRemove)
}

function editTask(todo) {
  // TODO: Implement edit functionality
  console.log('Edit task:', todo)
}

function toggleSubtask(todoId, subtaskId) {
  const todo = store.todos.find(t => t.id === todoId)
  if (todo) {
    const subtask = todo.subtasks.find(s => s.id === subtaskId)
    if (subtask) {
      subtask.completed = !subtask.completed
    }
  }
}

// Drag and drop functionality
let draggedItem = null

function onDragStart(event, todo) {
  draggedItem = todo
  event.dataTransfer.effectAllowed = 'move'
}

function onDrop(event, targetTodo) {
  if (draggedItem && draggedItem.id !== targetTodo.id) {
    const dragIndex = store.todos.findIndex(t => t.id === draggedItem.id)
    const targetIndex = store.todos.findIndex(t => t.id === targetTodo.id)
    
    // Reorder the todos
    const todos = [...store.todos]
    const [removed] = todos.splice(dragIndex, 1)
    todos.splice(targetIndex, 0, removed)
    
    store.todos = todos
  }
  draggedItem = null
}
</script>

<style scoped>
.todo-settings {
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

.section-description {
  margin: 0 0 16px 0;
  font-size: 14px;
  color: var(--color-text-secondary);
}

/* Microsoft To-Do Widget Styles */
.microsoft-todo-widget {
  position: relative;
  height: 300px;
  border-radius: var(--border-radius-md);
  overflow: hidden;
  border: 1px solid var(--color-border);
  background: rgba(255, 255, 255, 0.05);
}

.microsoft-todo-iframe {
  width: 100%;
  height: 100%;
  border: none;
}

.widget-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;
  color: var(--color-text-primary);
}

.open-todo-btn {
  padding: 12px 24px;
  background: var(--color-primary);
  color: var(--color-text-primary);
  border: none;
  border-radius: var(--border-radius-md);
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.open-todo-btn:hover {
  background: var(--color-primary-dark);
  transform: translateY(-2px);
}

/* Eisenhower Matrix Styles */
.eisenhower-toggle {
  margin-bottom: 16px;
}

.toggle-label {
  display: block;
  margin-bottom: 8px;
  font-size: 14px;
  font-weight: 500;
  color: var(--color-text-primary);
}

.matrix-selector {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 8px;
}

.matrix-btn {
  padding: 8px 12px;
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius-sm);
  background: rgba(255, 255, 255, 0.05);
  color: var(--color-text-secondary);
  font-size: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
  text-align: center;
}

.matrix-btn:hover {
  background: rgba(255, 255, 255, 0.1);
  color: var(--color-text-primary);
}

.matrix-btn.active {
  background: var(--color-primary);
  border-color: var(--color-primary);
  color: var(--color-text-primary);
}

/* Time Estimation Styles */
.time-estimation {
  margin-bottom: 16px;
}

.time-selector {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 6px;
}

.time-btn {
  padding: 8px 6px;
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius-sm);
  background: rgba(255, 255, 255, 0.05);
  color: var(--color-text-secondary);
  font-size: 11px;
  cursor: pointer;
  transition: all 0.2s ease;
  text-align: center;
}

.time-btn:hover {
  background: rgba(255, 255, 255, 0.1);
  color: var(--color-text-primary);
}

.time-btn.active {
  background: var(--color-primary);
  border-color: var(--color-primary);
  color: var(--color-text-primary);
}

.add-task-form {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 16px;
  border-radius: var(--border-radius-md);
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid var(--color-border);
}

.task-input {
  padding: 12px 16px;
  border-radius: var(--border-radius-sm);
  border: 1px solid var(--color-border);
  background: rgba(255, 255, 255, 0.05);
  color: var(--color-text-primary);
  font-size: 14px;
}

.task-input:focus {
  border-color: var(--color-primary);
  background: rgba(255, 255, 255, 0.1);
}

.task-input::placeholder {
  color: var(--color-text-muted);
}

.task-options {
  display: flex;
  gap: 12px;
}

.priority-select,
.pomodoro-input {
  padding: 8px 12px;
  border-radius: var(--border-radius-sm);
  border: 1px solid var(--color-border);
  background: rgba(255, 255, 255, 0.05);
  color: var(--color-text-primary);
  font-size: 13px;
}

.priority-select {
  flex: 1;
}

.pomodoro-input {
  width: 120px;
}

.task-tags {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.tag-input {
  padding: 8px 12px;
  border-radius: var(--border-radius-sm);
  border: 1px solid var(--color-border);
  background: rgba(255, 255, 255, 0.05);
  color: var(--color-text-primary);
  font-size: 13px;
}

.tag-list {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.tag {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 4px 8px;
  border-radius: var(--border-radius-sm);
  background: var(--color-primary);
  color: var(--color-text-primary);
  font-size: 11px;
  font-weight: 500;
}

.tag-remove {
  background: none;
  border: none;
  color: inherit;
  font-size: 14px;
  line-height: 1;
  cursor: pointer;
  padding: 0;
  margin: 0;
}

.tag-remove:hover {
  opacity: 0.7;
}

.add-btn {
  padding: 10px 16px;
  border-radius: var(--border-radius-sm);
  background: var(--color-primary);
  color: var(--color-text-primary);
  font-size: 14px;
  font-weight: 500;
  transition: all var(--transition-fast);
  align-self: flex-end;
}

.add-btn:hover {
  background: var(--color-primary-dark);
}

.task-controls {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  gap: 16px;
}

.filter-tabs {
  display: flex;
  gap: 4px;
}

.filter-tab {
  padding: 6px 12px;
  border-radius: var(--border-radius-sm);
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid var(--color-border);
  color: var(--color-text-secondary);
  font-size: 12px;
  font-weight: 500;
  transition: all var(--transition-fast);
}

.filter-tab:hover {
  background: rgba(255, 255, 255, 0.1);
  color: var(--color-text-primary);
}

.filter-tab.active {
  background: var(--color-primary);
  border-color: var(--color-primary);
  color: var(--color-text-primary);
}

.sort-select {
  padding: 6px 10px;
  border-radius: var(--border-radius-sm);
  border: 1px solid var(--color-border);
  background: rgba(255, 255, 255, 0.05);
  color: var(--color-text-primary);
  font-size: 12px;
}

.task-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.task-card {
  padding: 16px;
  border-radius: var(--border-radius-md);
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid var(--color-border);
  transition: all var(--transition-fast);
  cursor: move;
}

.task-card:hover {
  background: rgba(255, 255, 255, 0.1);
  border-color: rgba(255, 255, 255, 0.2);
}

.task-card.completed {
  opacity: 0.6;
}

.task-card.completed .task-title {
  text-decoration: line-through;
}

.task-header {
  display: flex;
  align-items: flex-start;
  gap: 12px;
}

.task-checkbox {
  width: 20px;
  height: 20px;
  border-radius: 4px;
  border: 2px solid var(--color-border);
  background: transparent;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  margin-top: 2px;
  transition: all var(--transition-fast);
  cursor: pointer;
}

.task-checkbox:hover {
  border-color: var(--color-primary);
}

.task-checkbox.checked {
  background: var(--color-primary);
  border-color: var(--color-primary);
  color: white;
}

.task-content {
  flex: 1;
}

.task-title {
  margin: 0 0 4px 0;
  font-size: 14px;
  font-weight: 500;
  color: var(--color-text-primary);
  line-height: 1.4;
}

.task-meta {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
}

.priority-badge {
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 10px;
  font-weight: 600;
  text-transform: uppercase;
}

.priority-badge.high {
  background: #ef4444;
  color: white;
}

.priority-badge.medium {
  background: #f59e0b;
  color: white;
}

.priority-badge.low {
  background: #10b981;
  color: white;
}

.pomodoro-estimate {
  font-size: 11px;
  color: var(--color-text-muted);
}

.task-actions {
  display: flex;
  gap: 4px;
}

.action-btn {
  width: 28px;
  height: 28px;
  border-radius: 4px;
  background: transparent;
  color: var(--color-text-muted);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all var(--transition-fast);
}

.action-btn:hover {
  background: rgba(255, 255, 255, 0.1);
  color: var(--color-text-primary);
}

.action-btn.delete:hover {
  background: rgba(239, 68, 68, 0.2);
  color: #ef4444;
}

.task-tags-display {
  margin-top: 8px;
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
}

.task-tag {
  padding: 2px 6px;
  border-radius: 4px;
  background: rgba(255, 255, 255, 0.1);
  color: var(--color-text-secondary);
  font-size: 10px;
  font-weight: 500;
}

.subtasks {
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px solid var(--color-border);
}

.subtasks-title {
  margin: 0 0 8px 0;
  font-size: 12px;
  font-weight: 600;
  color: var(--color-text-secondary);
}

.subtask {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 6px;
}

.subtask-checkbox {
  width: 16px;
  height: 16px;
  border-radius: 3px;
  border: 1px solid var(--color-border);
  background: transparent;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: all var(--transition-fast);
  cursor: pointer;
}

.subtask-checkbox:hover {
  border-color: var(--color-primary);
}

.subtask-checkbox.checked {
  background: var(--color-primary);
  border-color: var(--color-primary);
  color: white;
}

.subtask-title {
  font-size: 12px;
  color: var(--color-text-secondary);
}

.empty-state {
  text-align: center;
  padding: 40px 20px;
  color: var(--color-text-muted);
}

.empty-state p {
  margin: 0;
  font-size: 14px;
}

/* Responsive */
@media (max-width: 480px) {
  .task-options {
    flex-direction: column;
  }
  
  .pomodoro-input {
    width: 100%;
  }
  
  .task-controls {
    flex-direction: column;
    align-items: stretch;
    gap: 12px;
  }
  
  .filter-tabs {
    justify-content: center;
  }
  
  .task-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }
  
  .task-actions {
    align-self: flex-end;
  }
}
</style>