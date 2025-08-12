<template>
  <div class="ambience-layout">
    <!-- Timer Section - positioned top right -->
    <div
      ref="timerSection"
      class="timer-section"
      :class="{ 'is-dragging': isDragging, 'is-resizing': isResizing }"
      :style="{
        left: timerPosition.x + 'px',
        top: timerPosition.y + 'px'
      }"
    >
      <div
        ref="timerContainer"
        class="timer-container resizable"
        :style="{
          width: timerSize.width + 'px',
          height: typeof timerSize.height === 'number' ? timerSize.height + 'px' : 'auto',
          minHeight: timerSize.minHeight + 'px'
        }"
        @mousedown="handleTimerMouseDown"
      >
        <!-- Resize handles -->
        <div class="resize-handle resize-handle-nw" @mousedown="startResize($event, 'top-left')"></div>
        <div class="resize-handle resize-handle-ne" @mousedown="startResize($event, 'top-right')"></div>
        <div class="resize-handle resize-handle-sw" @mousedown="startResize($event, 'bottom-left')"></div>
        <div class="resize-handle resize-handle-se" @mousedown="startResize($event, 'bottom-right')"></div>
        <div class="resize-handle resize-handle-n" @mousedown="startResize($event, 'top')"></div>
        <div class="resize-handle resize-handle-s" @mousedown="startResize($event, 'bottom')"></div>
        <div class="resize-handle resize-handle-w" @mousedown="startResize($event, 'left')"></div>
        <div class="resize-handle resize-handle-e" @mousedown="startResize($event, 'right')"></div>
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
          <div class="time" @click="openTimerSettings" title="Cliquez pour changer la durée">{{ store.displayTime }}</div>
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
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useAppStore } from '../../stores/appStore'

const store = useAppStore()

// Drag and resize functionality
const isDragging = ref(false)
const isResizing = ref(false)
const timerPosition = ref({ x: 40, y: 120 }) // Initial position (right: 40px, top: 120px converted to left positioning)
const timerSize = ref({ width: 400, height: 'auto', minHeight: 200 })
const timerSection = ref(null)
const timerContainer = ref(null)

// Drag state
let dragStart = { x: 0, y: 0, timerX: 0, timerY: 0 }
// Resize state
let resizeStart = { x: 0, y: 0, width: 0, height: 0 }

const modes = [
  { key: 'pomodoro', label: 'Pomodoro' },
  { key: 'shortBreak', label: 'Pause Courte' },
  { key: 'longBreak', label: 'Pause Longue' }
]

function openTimerSettings() {
  store.setActiveTab('timer')
  if (!store.sidebarOpen) {
    store.toggleSidebar()
  }
}

// Timer drag functionality
function handleTimerMouseDown(event) {
  // Don't start drag if clicking on interactive elements
  const interactiveElements = [
    'BUTTON', 'INPUT', 'SVG', 'PATH', 'CIRCLE', 'RECT', 'POLYGON'
  ]

  // Don't start drag if clicking on resize handles
  if (event.target.classList.contains('resize-handle') ||
      event.target.closest('.resize-handle')) {
    return
  }

  // Don't start drag if clicking on interactive elements
  if (interactiveElements.includes(event.target.tagName) ||
      event.target.closest('button, input, svg')) {
    return
  }

  // Start drag for background areas
  startDrag(event)
}

// Drag functionality
function startDrag(event) {
  if (isResizing.value) return

  isDragging.value = true
  dragStart.x = event.clientX
  dragStart.y = event.clientY
  dragStart.timerX = timerPosition.value.x
  dragStart.timerY = timerPosition.value.y

  document.addEventListener('mousemove', handleDrag)
  document.addEventListener('mouseup', endDrag)
  document.body.style.cursor = 'grabbing'
  document.body.style.userSelect = 'none'

  event.preventDefault()
}

function handleDrag(event) {
  if (!isDragging.value || typeof window === 'undefined') return

  const deltaX = event.clientX - dragStart.x
  const deltaY = event.clientY - dragStart.y

  timerPosition.value.x = Math.max(0, Math.min(window.innerWidth - timerSize.value.width, dragStart.timerX + deltaX))
  timerPosition.value.y = Math.max(0, Math.min(window.innerHeight - 200, dragStart.timerY + deltaY))

  updateTimerPosition()
}

function endDrag() {
  isDragging.value = false
  document.removeEventListener('mousemove', handleDrag)
  document.removeEventListener('mouseup', endDrag)
  document.body.style.cursor = ''
  document.body.style.userSelect = ''
  saveTimerSettings()
}

// Resize functionality
function startResize(event, direction) {
  if (isDragging.value) return

  isResizing.value = true
  resizeStart.x = event.clientX
  resizeStart.y = event.clientY
  resizeStart.width = timerSize.value.width
  resizeStart.height = timerContainer.value?.offsetHeight || timerSize.value.minHeight

  const resizeHandler = (e) => handleResize(e, direction)
  document.addEventListener('mousemove', resizeHandler)
  document.addEventListener('mouseup', () => endResize(resizeHandler))
  document.body.style.userSelect = 'none'

  event.preventDefault()
  event.stopPropagation()
}

function handleResize(event, direction) {
  if (!isResizing.value) return

  const deltaX = event.clientX - resizeStart.x
  const deltaY = event.clientY - resizeStart.y

  let newWidth = resizeStart.width
  let newHeight = resizeStart.height

  if (direction.includes('right')) {
    newWidth = Math.max(250, Math.min(800, resizeStart.width + deltaX))
  }
  if (direction.includes('left')) {
    newWidth = Math.max(250, Math.min(800, resizeStart.width - deltaX))
  }
  if (direction.includes('bottom')) {
    newHeight = Math.max(200, Math.min(600, resizeStart.height + deltaY))
  }
  if (direction.includes('top')) {
    newHeight = Math.max(200, Math.min(600, resizeStart.height - deltaY))
  }

  timerSize.value.width = newWidth
  timerSize.value.height = newHeight

  updateTimerSize()
}

function endResize(resizeHandler) {
  isResizing.value = false
  document.removeEventListener('mousemove', resizeHandler)
  document.removeEventListener('mouseup', endResize)
  document.body.style.userSelect = ''
  saveTimerSettings()
}

// Update functions
function updateTimerPosition() {
  if (timerSection.value && typeof window !== 'undefined') {
    timerSection.value.style.left = timerPosition.value.x + 'px'
    timerSection.value.style.top = timerPosition.value.y + 'px'
  }
}

function updateTimerSize() {
  if (timerContainer.value) {
    timerContainer.value.style.width = timerSize.value.width + 'px'
    if (typeof timerSize.value.height === 'number') {
      timerContainer.value.style.height = timerSize.value.height + 'px'
    }
  }
}

// Settings persistence
function saveTimerSettings() {
  const settings = {
    position: timerPosition.value,
    size: timerSize.value
  }
  localStorage.setItem('timerSettings', JSON.stringify(settings))
}

function loadTimerSettings() {
  try {
    const saved = localStorage.getItem('timerSettings')
    if (saved) {
      const settings = JSON.parse(saved)
      if (settings.position) {
        // Convert old right positioning to left positioning
        if (typeof window !== 'undefined' && settings.position.x < 100) {
          settings.position.x = window.innerWidth - settings.position.x - (settings.size?.width || 400)
        }
        timerPosition.value = settings.position
      }
      if (settings.size) {
        timerSize.value = { ...timerSize.value, ...settings.size }
      }
    }
  } catch (error) {
    console.warn('Error loading timer settings:', error)
  }
}

// Window resize handler
function handleWindowResize() {
  if (typeof window === 'undefined') return

  // Ensure timer stays within bounds when window is resized
  const maxX = Math.max(0, window.innerWidth - timerSize.value.width)
  const maxY = Math.max(0, window.innerHeight - 200)

  timerPosition.value.x = Math.min(timerPosition.value.x, maxX)
  timerPosition.value.y = Math.min(timerPosition.value.y, maxY)

  updateTimerPosition()
}

onMounted(() => {
  // Initialize timer positioning based on viewport
  if (typeof window !== 'undefined') {
    // Set initial position from right side
    timerPosition.value.x = window.innerWidth - 440 // 400px width + 40px margin

    window.addEventListener('resize', handleWindowResize)
  }

  // Load saved settings and apply initial position/size
  loadTimerSettings()
  updateTimerPosition()
  updateTimerSize()
})

onBeforeUnmount(() => {
  // Remove resize listener
  if (typeof window !== 'undefined') {
    window.removeEventListener('resize', handleWindowResize)
  }

  // Clean up drag/resize event listeners
  document.removeEventListener('mousemove', handleDrag)
  document.removeEventListener('mouseup', endDrag)

  // Save settings
  saveTimerSettings()
})
</script>

<style scoped>
.ambience-layout {
  position: relative;
  min-height: 100vh;
  padding: 80px 20px 20px;
}

/* Timer Section - positioned top right */
.timer-section {
  position: absolute;
  top: 120px;
  right: 40px;
  z-index: 10;
}

.timer-container {
  text-align: center;
  max-width: 400px;
  width: 100%;
  background: rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  padding: 24px;
}

.mode-tabs {
  display: flex;
  justify-content: center;
  gap: 6px;
  margin-bottom: 20px;
  flex-wrap: wrap;
}

.mode-tab {
  padding: 8px 16px;
  border-radius: var(--border-radius-full, 25px);
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: rgba(255, 255, 255, 0.7);
  font-size: 12px;
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
  margin-bottom: 20px;
}

.time {
  font-family: 'Be Vietnam Pro', 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  font-size: clamp(3rem, 8vw, 80px);
  font-weight: 900;
  line-height: 0.9;
  letter-spacing: -0.04em;
  margin-bottom: 20px;
  color: #fff;
  text-shadow: 0 4px 12px rgba(0, 0, 0, 0.5), 0 2px 4px rgba(0, 0, 0, 0.3);
  cursor: pointer;
  transition: all 0.2s ease;
}

.time:hover {
  opacity: 0.8;
  transform: scale(1.02);
}

.timer-controls {
  display: flex;
  justify-content: center;
  gap: 12px;
  flex-wrap: wrap;
}

.control-btn {
  padding: 10px 20px;
  border-radius: var(--border-radius-full, 25px);
  font-size: 13px;
  font-weight: 600;
  min-width: 80px;
  transition: all 0.3s ease;
}

.control-btn.primary {
  background: var(--color-primary, #8B5CF6);
  color: white;
}

.control-btn.primary:hover {
  background: var(--color-primary-dark, #7C3AED);
  transform: translateY(-1px);
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
  transform: translateY(-1px);
}

/* Responsive Design */
@media (max-width: 1024px) {
  .timer-section {
    right: 30px;
    top: 100px;
  }

  .timer-container {
    max-width: 350px;
    padding: 20px;
  }
}

@media (max-width: 768px) {
  .timer-section {
    position: relative;
    top: auto;
    right: auto;
    display: flex;
    justify-content: center;
    margin-top: 40px;
  }

  .timer-container {
    max-width: 100%;
    padding: 24px;
  }
}

@media (max-width: 480px) {
  .timer-container {
    padding: 20px;
  }

  .timer-controls {
    flex-direction: column;
    gap: 8px;
  }
}
</style>
