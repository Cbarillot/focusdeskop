<template>
  <!-- 
    Corner Navigation Component - Updated for Mood System
    Distributes fixed navigation buttons across corners as per requirements:
    - Top-Right: Settings (Paramètres)
    - Bottom-Left: ToDo List, Music (gauche)  
    - Bottom-Right: Fullscreen (bas droite)
  -->
  <div class="corner-navigation">
    
    <!-- Top-Right Corner: Settings -->
    <div class="corner-container corner-top-right">
      <!-- Settings Button -->
      <button 
        class="corner-button"
        :class="{ active: store.sidebarOpen && ['timer', 'themes', 'background'].includes(store.activeTab) }"
        @click="openSettings"
        :title="'Paramètres'"
        :aria-label="'Paramètres'"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <path d="M12 16a4 4 0 1 0 0-8 4 4 0 0 0 0 8zm8.94-2a7.95 7.95 0 0 0 0-4l-2.12-.33a6.023 6.023 0 0 0-.97-2.35l1.25-1.81a8.003 8.003 0 0 0-2.83-2.83l-1.81 1.25a6.023 6.023 0 0 0-2.35-.97l-.33-2.12a7.95 7.95 0 0 0-4 0l-.33 2.12a6.023 6.023 0 0 0-2.35.97l-1.81-1.25a8.003 8.003 0 0 0-2.83 2.83l1.25 1.81a6.023 6.023 0 0 0-.97 2.35l-2.12.33a7.95 7.95 0 0 0 0 4l2.12.33c.23.86.56 1.68.97 2.35l-1.25 1.81a8.003 8.003 0 0 0 2.83 2.83l1.81-1.25c.67.41 1.49.74 2.35.97l.33 2.12a7.95 7.95 0 0 0 4 0l.33-2.12a6.023 6.023 0 0 0 2.35-.97l1.81 1.25a8.003 8.003 0 0 0 2.83-2.83l-1.25-1.81c.41-.67.74-1.49.97-2.35l2.12-.33z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </button>
    </div>

    <!-- Middle-Left: ToDo Button -->
    <div class="corner-container corner-middle-left">
      <!-- Todo Button -->
      <button
        class="corner-button"
        :class="{ active: todoModalVisible }"
        @click="openTodo"
        :title="'To-do'"
        :aria-label="'To-do'"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/>
          <path d="M8 12l2 2 4-4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        <span v-if="pendingCount > 0" class="todo-badge" aria-label="Tâches en attente">{{ pendingCount }}</span>
      </button>

      <!-- Mini To-Do Preview Sidebar -->
      <div v-if="miniTasks.length" class="todo-mini-panel" aria-label="Aperçu des tâches">
        <ul>
          <li v-for="t in miniTasks" :key="t.id" class="mini-item" :title="t.title + ' · ' + t.durationMin + ' min'">
            <div class="mini-stack">
              <button class="mini-check" :style="{ borderColor: colorForTask(t), background: t.done ? colorForTask(t) : 'transparent', color: t.done ? '#fff' : colorForTask(t) }" @click="todoStore.toggleDone(t.id)">
                <template v-if="t.done">
                  <span>✓</span>
                </template>
                <template v-else>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                    <circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="2" fill="none"/>
                    <path d="M8 12l2 2 4-4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
                  </svg>
                </template>
              </button>
              <div class="mini-chronos" :aria-label="t.durationMin + ' minutes'">
                <i v-for="(piece, idx) in chronoPieces(t.durationMin)" :key="idx" class="icon icon-chrono" :class="piece" :style="{ backgroundColor: colorForTask(t) }"></i>
              </div>
            </div>
          </li>
        </ul>
      </div>
    </div>

    <!-- To-Do Centered Modal -->
    <div v-if="todoModalVisible" class="todo-overlay" @click="closeTodo"></div>
    <div class="todo-modal-panel" :class="{ visible: todoModalVisible }" role="dialog" aria-modal="true" aria-label="Panneau To-Do">
      <div class="selector-header">
        <h3>To-Do</h3>
        <button class="open-settings" title="ouvrir dans paramètres" aria-label="ouvrir dans paramètres" @click="openSettings">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <rect x="3.5" y="3.5" width="12" height="12" rx="2" stroke="currentColor" stroke-width="2" fill="none"/>
            <path d="M13 11h7v9H11v-7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
            <path d="M13 11L20 4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
        <button @click="closeTodo" class="close-selector">×</button>
      </div>
      <div class="selector-content">
        <TodoPanel />
      </div>
    </div>

    <!-- Bottom-Left Corner: Music (hidden; handled by MusicPlayerCompact) -->
    <div v-if="false" class="corner-container corner-bottom-left">
      <!-- Music Button -->
      <button
        class="corner-button"
        :class="{ active: musicPlayerVisible }"
        @click="openMusic"
        @dblclick="openMusicSettings"
        :title="'Musique'"
        :aria-label="'Musique'"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <path d="M9 18V5L21 3V16" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          <circle cx="6" cy="18" r="3" stroke="currentColor" stroke-width="2"/>
          <circle cx="18" cy="16" r="3" stroke="currentColor" stroke-width="2"/>
        </svg>
      </button>

      <!-- Vinyl Music Player -->
      <div
        class="vinyl-player"
        :class="{ visible: musicPlayerVisible, 'is-playing': store.musicPlaying }"
        @mouseenter="handleMouseEnter"
        @mouseleave="handleMouseLeave"
      >
        <!-- Album Cover avec YouTube Player -->
        <div class="album-sleeve" @dblclick="toggleMusicSelector">
          <div class="album-cover">
            <!-- YouTube Player Container -->
            <div
              :id="'youtube-player-' + playerId"
              class="youtube-player"
            ></div>

            <!-- Overlay avec controls quand pas de vidéo -->
            <div v-if="!currentVideoId" class="player-overlay">
              <div class="no-video-message">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9 18V5L21 3V16" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  <circle cx="6" cy="18" r="3" stroke="currentColor" stroke-width="2"/>
                  <circle cx="18" cy="16" r="3" stroke="currentColor" stroke-width="2"/>
                </svg>
                <p>Aucune musique</p>
                <button @click="openMusicSettings" class="settings-link">
                  Paramètres
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Vinyl Record -->
        <div class="vinyl-wrapper" :class="{ 'slide-out': vinylSlideOut, 'is-playing': store.musicPlaying }">
          <div class="vinyl-record" :class="{ 'is-spinning': store.musicPlaying }">
            <img
              src="https://cdn.builder.io/api/v1/image/assets%2F65e0ac12b2f240efbb50b7ef46d7e58e%2Fc1c134f21db64c34b85a9e7d79334b8b"
              alt="Disque vinyle"
              class="vinyl-image"
            />
          </div>
        </div>
      </div>

      <!-- Music Selector Overlay -->
      <div
        v-if="musicSelectorVisible"
        class="music-selector-overlay"
        @click="toggleMusicSelector"
      ></div>

      <!-- Music Selector Panel -->
      <div
        class="music-selector-panel"
        :class="{ visible: musicSelectorVisible }"
      >
        <div class="selector-header">
          <h3>Sélectionner une musique</h3>
          <button @click="toggleMusicSelector" class="close-selector">×</button>
        </div>

        <div class="selector-content">
          <!-- YouTube URL Input -->
          <div class="url-input-section">
            <label>Lien YouTube :</label>
            <div class="url-input-group">
              <input
                v-model="customYouTubeUrl"
                type="url"
                placeholder="https://youtube.com/watch?v=..."
                class="url-input"
                @keyup.enter="loadCustomVideo"
              />
              <button @click="loadCustomVideo" class="load-btn">Charger</button>
            </div>
          </div>

          <!-- Preset Playlists -->
          <div class="presets-section">
            <label>Playlists pré-enregistrées :</label>
            <div class="presets-grid">
              <button
                v-for="preset in musicPresets"
                :key="preset.id"
                @click="loadPresetVideo(preset.videoId)"
                class="preset-btn"
                :class="{ active: currentVideoId === preset.videoId }"
              >
                <div class="preset-title">{{ preset.title }}</div>
                <div class="preset-desc">{{ preset.description }}</div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Bottom-Right Corner: Fullscreen -->
    <div class="corner-container corner-bottom-right">
      <!-- Fullscreen Button -->
      <button 
        class="corner-button"
        :class="{ active: store.isFullscreen }"
        @click="toggleFullscreen"
        :title="'Plein écran'"
        :aria-label="'Plein écran'"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <path d="M8 3H5a2 2 0 0 0-2 2v3M16 3h3a2 2 0 0 1 2 2v3M8 21H5a2 2 0 0 1-2-2v-3M16 21h3a2 2 0 0 0 2-2v-3" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </button>
    </div>

    <!-- Mood Buttons -->
    <div class="mood-buttons" v-show="!todoModalVisible" :class="{ behind: todoModalVisible }">
      <!-- Home Mood Button -->
      <button class="mood-button" title="Mode Accueil" aria-label="Mode Accueil"><span class="icon icon-home" aria-hidden="true"></span></button>
      <!-- Ambience Mood Button (Lotus icon) -->
      <button class="mood-button" title="Mode Ambiance" aria-label="Mode Ambiance"><span class="icon icon-ambience" aria-hidden="true"></span></button>
      <!-- Focus Mood Button (Timer icon) -->
      <button class="mood-button active" title="Mode Focus" aria-label="Mode Focus"><span class="icon icon-focus" aria-hidden="true"></span></button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { useAppStore } from '../stores/appStore'
import { useTodoStore } from '../stores/todoStore'
import TodoPanel from './panels/TodoPanel.vue'

const store = useAppStore()
const todoStore = useTodoStore()
const musicPlayerVisible = ref(false)
const musicSelectorVisible = ref(false)
const todoModalVisible = ref(false)
const vinylSlideOut = ref(false)
const playerId = ref(Math.random().toString(36).substr(2, 9))
const youtubePlayer = ref(null)
const currentVideoId = ref('jfKfPfyJRdk') // Default video
const customYouTubeUrl = ref('')

const musicPresets = ref([
  {
    id: 1,
    title: 'Lofi Hip Hop',
    description: 'Beats to relax/study',
    videoId: 'jfKfPfyJRdk'
  },
  {
    id: 2,
    title: 'Jazz Café',
    description: 'Smooth jazz ambiance',
    videoId: '4xDzrJKXOOY'
  },
  {
    id: 3,
    title: 'Nature Sounds',
    description: 'Rain & forest sounds',
    videoId: 'nDq6TstdEi8'
  },
  {
    id: 4,
    title: 'Piano Study',
    description: 'Classical piano focus',
    videoId: 'DWcJFNfaw9c'
  }
])

// Watch for changes in store music URL to extract YouTube video ID
const extractedVideoId = computed(() => {
  if (store.musicUrl && store.musicUrl.includes('youtube.com')) {
    const videoId = extractYouTubeVideoId(store.musicUrl)
    return videoId
  }
  return currentVideoId.value
})

const pendingCount = computed(() => todoStore.pendingCount)

// Compact list for the mini To-Do preview (active only, first 6)
const miniTasks = computed(() => todoStore.activeTasks.slice(0, 6))

function colorForTask(t) {
  return todoStore.colorForTask(t)
}

function chronoPieces(min) {
  if (min <= 30) return ['half']
  if (min <= 60) return ['full']
  if (min <= 90) return ['full', 'half']
  return ['full', 'full']
}

function openSettings() {
  store.setActiveTab('timer')
  if (!store.sidebarOpen) {
    store.toggleSidebar()
  }
}

function toggleFullscreen() {
  store.toggleFullscreen()
}

function openMusic() {
  // Simple clic : ouvre/ferme le player de musique
  musicPlayerVisible.value = !musicPlayerVisible.value
  if (musicPlayerVisible.value && !youtubePlayer.value) {
    initializeYouTubePlayer()
  }
}

function openTodo() {
  // Open centered To-Do modal WITHOUT touching the sidebar
  todoModalVisible.value = !todoModalVisible.value
  toggleTodoGlobalClass()
}

function closeTodo() {
  todoModalVisible.value = false
  toggleTodoGlobalClass()
}

function handleKeydown(e) {
  if (e.key === 'Escape' && todoModalVisible.value) {
    e.stopPropagation()
    closeTodo()
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', onKeydown)
})

function toggleMusicSelector() {
  musicSelectorVisible.value = !musicSelectorVisible.value
}

function openMusicSettings() {
  // Ouvre les paramètres de musique dans la sidebar
  store.setActiveTab('music')
  if (!store.sidebarOpen) {
    store.toggleSidebar()
  }
}

function loadCustomVideo() {
  if (customYouTubeUrl.value) {
    const videoId = extractYouTubeVideoId(customYouTubeUrl.value)
    if (videoId) {
      currentVideoId.value = videoId

      // Sauvegarder dans le store pour persistence
      store.currentTrack = customYouTubeUrl.value
      store.musicUrl = customYouTubeUrl.value

      // Charger directement dans le player YouTube existant
      if (youtubePlayer.value && youtubePlayer.value.loadVideoById) {
        youtubePlayer.value.loadVideoById(videoId)
        // Démarrer automatiquement la lecture
        setTimeout(() => {
          if (youtubePlayer.value && youtubePlayer.value.playVideo) {
            youtubePlayer.value.playVideo()
          }
        }, 500)
      }

      customYouTubeUrl.value = ''
      musicSelectorVisible.value = false
    } else {
      alert('URL YouTube invalide. Vérifiez le format du lien.')
    }
  }
}

function loadPresetVideo(videoId) {
  currentVideoId.value = videoId

  // Sauvegarder dans le store pour persistence
  const preset = musicPresets.value.find(p => p.videoId === videoId)
  if (preset) {
    store.currentTrack = preset.title
    store.musicUrl = `https://youtube.com/watch?v=${videoId}`
  }

  // Charger directement dans le player YouTube existant
  if (youtubePlayer.value && youtubePlayer.value.loadVideoById) {
    youtubePlayer.value.loadVideoById(videoId)
    // Démarrer automatiquement la lecture
    setTimeout(() => {
      if (youtubePlayer.value && youtubePlayer.value.playVideo) {
        youtubePlayer.value.playVideo()
      }
    }, 500)
  }

  musicSelectorVisible.value = false
}

function handleMouseEnter() {
  if (!store.musicPlaying) {
    vinylSlideOut.value = true
  }
}

function handleMouseLeave() {
  if (!store.musicPlaying) {
    vinylSlideOut.value = false
  }
}

function extractYouTubeVideoId(url) {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/
  const match = url.match(regExp)
  return (match && match[2].length === 11) ? match[2] : null
}

function initializeYouTubePlayer() {
  if (typeof YT !== 'undefined' && YT.Player) {
    // Utiliser la musique sauvegardée ou par défaut
    const videoToLoad = extractedVideoId.value || currentVideoId.value

    youtubePlayer.value = new YT.Player(`youtube-player-${playerId.value}`, {
      height: '100%',
      width: '100%',
      videoId: videoToLoad,
      playerVars: {
        'playsinline': 1,
        'controls': 1,
        'loop': 1,
        'playlist': videoToLoad,
        'autoplay': 0
      },
      events: {
        'onStateChange': onPlayerStateChange,
        'onReady': onPlayerReady
      }
    })
  }
}

function onPlayerReady(event) {
  // Player est prêt, on peut maintenant contrôler la lecture
  console.log('YouTube player ready')
}

function onPlayerStateChange(event) {
  if (event.data === 1) { // YT.PlayerState.PLAYING
    store.musicPlaying = true
    vinylSlideOut.value = true
  } else {
    store.musicPlaying = false
    vinylSlideOut.value = false
  }
}

// Load YouTube API
function loadYouTubeAPI() {
  if (typeof YT === 'undefined') {
    const tag = document.createElement('script')
    tag.src = 'https://www.youtube.com/iframe_api'
    const firstScriptTag = document.getElementsByTagName('script')[0]
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag)

    window.onYouTubeIframeAPIReady = () => {
      if (musicPlayerVisible.value) {
        initializeYouTubePlayer()
      }
    }
  }
}

onMounted(() => {
  loadYouTubeAPI()
})

onUnmounted(() => {
  if (youtubePlayer.value && youtubePlayer.value.destroy) {
    youtubePlayer.value.destroy()
  }
})
</script>

<style scoped>
/* 
  Corner Navigation Styles - Updated for Mood System
  Clean, responsive design with blur effects and translucent backgrounds
  Positioned in screen corners for airy, minimal presentation
*/

.corner-navigation {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  z-index: 100;
}

/* Corner container base styles */
.corner-container {
  position: absolute;
  display: flex;
  gap: 8px;
  pointer-events: auto;
}

/* Corner positioning - updated layout */
.corner-top-right {
  top: 20px;
  right: 20px;
  flex-direction: row;
}

.corner-middle-left {
  top: 40%;
  left: 20px;
  transform: translateY(-50%);
  flex-direction: column;
  align-items: flex-start;
}

.corner-bottom-left {
  bottom: 20px;
  left: 20px;
  flex-direction: column;
  align-items: flex-start;
}

.corner-bottom-right {
  bottom: 20px;
  right: 20px;
  flex-direction: row;
}

/* Enhanced corner buttons with clean, light styling */
.corner-button {
  width: 48px;
  height: 48px;
  border-radius: var(--border-radius-full, 50%);
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  color: rgba(255, 255, 255, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  cursor: pointer;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
}

.corner-button:hover {
  background: rgba(255, 255, 255, 0.25);
  color: rgba(255, 255, 255, 1);
  transform: translateY(-2px) scale(1.05);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
  border-color: rgba(255, 255, 255, 0.4);
}

/* Active states with dynamic theme colors */
.corner-button.active {
  background: var(--color-primary, #8B5CF6);
  color: white;
  border-color: var(--color-primary, #8B5CF6);
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
}

/* 15" desktop optimization (common heights <= 820px) */
@media (max-height: 820px) and (min-width: 1024px) {
  .corner-container {
    gap: 6px;
  }

  .corner-button {
    width: 44px;
    height: 44px;
    backdrop-filter: blur(14px);
  }

  .corner-bottom-left {
    bottom: 16px;
    left: 18px;
  }

  .corner-bottom-right {
    bottom: 16px;
    right: 18px;
  }

  .corner-middle-left {
    top: 38%;
    left: 18px;
  }

  .vinyl-player {
    width: 230px;
  }

  .vinyl-player.visible {
    height: 125px;
  }

  .album-sleeve {
    width: 115px;
    height: 104px;
    padding: 6px;
  }

  .vinyl-wrapper {
    left: 72px;
    width: 96px;
    height: 96px;
  }
}

/* Responsive design for mobile devices */
@media (max-width: 768px) {
  /* Adjust corner positioning for mobile */
  .corner-top-right {
    top: 15px;
    right: 15px;
  }

  .corner-middle-left {
    left: 15px;
  }

  .corner-bottom-left {
    bottom: 15px;
    left: 15px;
  }

  .corner-bottom-right {
    bottom: 15px;
    right: 15px;
  }

  .corner-button {
    width: 44px;
    height: 44px;
  }

  .vinyl-player {
    width: 220px;
  }

  .vinyl-player.visible {
    height: 120px;
  }

  .album-sleeve {
    width: 110px;
    height: 100px;
    padding: 6px;
  }

  .vinyl-wrapper {
    left: 70px;
    width: 100px;
    height: 100px;
  }

  .vinyl-wrapper.slide-out,
  .vinyl-wrapper.is-playing {
    transform: translateX(25px);
  }

  .music-selector-panel {
    width: 360px;
  }

  .music-selector-panel.visible {
    height: 420px;
  }

  /* Stack buttons vertically on mobile for better touch targets */
  .corner-top-right,
  .corner-bottom-right {
    flex-direction: column;
  }
}

@media (max-width: 480px) {
  /* Further mobile optimizations */
  .corner-container {
    gap: 6px;
  }

  .corner-button {
    width: 40px;
    height: 40px;
  }

  .corner-top-right {
    top: 12px;
    right: 12px;
  }

  .corner-middle-left {
    left: 12px;
  }

  .corner-bottom-left {
    bottom: 12px;
    left: 12px;
  }

  .corner-bottom-right {
    bottom: 12px;
    right: 12px;
  }

  .vinyl-player {
    width: 200px;
  }

  .vinyl-player.visible {
    height: 110px;
  }

  .album-sleeve {
    width: 100px;
    height: 90px;
    padding: 6px;
  }

  .vinyl-wrapper {
    left: 60px;
    width: 90px;
    height: 90px;
  }

  .vinyl-wrapper.slide-out,
  .vinyl-wrapper.is-playing {
    transform: translateX(20px);
  }

  .music-selector-panel {
    width: 320px;
    transform: translate(-50%, -50%) scale(0.9);
  }

  .music-selector-panel.visible {
    height: 380px;
    transform: translate(-50%, -50%) scale(1);
  }

  .presets-grid {
    grid-template-columns: 1fr;
  }
}

/* Animation for smooth transitions */
@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.corner-container {
  animation: slideIn 0.3s ease-out;
}

/* Accessibility improvements */
@media (prefers-reduced-motion: reduce) {
  .corner-button {
    transition: none;
  }
  
  .corner-container {
    animation: none;
  }
}

/* Focus styles for keyboard navigation */
.corner-button:focus-visible {
  outline: 2px solid var(--color-primary, #8B5CF6);
  outline-offset: 2px;
}

/* Vinyl Music Player */
.vinyl-player {
  display: flex;
  align-items: center;
  margin-top: 8px;
  width: 250px;
  height: 0;
  opacity: 0;
  overflow: visible;
  transition: all 0.4s ease;
  position: relative;
}

.vinyl-player.visible {
  height: 140px;
  opacity: 1;
}

/* Album Sleeve (Cover) */
.album-sleeve {
  width: 130px;
  height: 120px;
  background: linear-gradient(145deg, rgba(248, 248, 248, 0.4), rgba(224, 224, 224, 0.4));
  border-radius: 8px;
  padding: 8px;
  box-shadow:
    0 8px 20px rgba(0, 0, 0, 0.1),
    inset 0 0 8px rgba(0, 0, 0, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.15);
  position: relative;
  z-index: 10;
  flex-shrink: 0;
  cursor: pointer;
  transition: all 0.2s ease;
}

.album-sleeve:hover {
  transform: scale(1.02);
  box-shadow:
    0 10px 25px rgba(0, 0, 0, 0.15),
    inset 0 0 12px rgba(0, 0, 0, 0.08);
}

.album-sleeve::after {
  content: '⚙️';
  position: absolute;
  top: 4px;
  right: 4px;
  font-size: 12px;
  opacity: 0;
  transition: opacity 0.2s ease;
  background: rgba(0, 0, 0, 0.6);
  border-radius: 50%;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.album-sleeve:hover::after {
  opacity: 1;
}

.album-cover {
  width: 100%;
  height: 100%;
  background: #000;
  border-radius: 4px;
  overflow: hidden;
  position: relative;
  box-shadow: inset 0 0 8px rgba(0, 0, 0, 0.5);
}

.youtube-player {
  width: 100%;
  height: 100%;
}

.player-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 20;
}

.no-video-message {
  text-align: center;
  color: rgba(255, 255, 255, 0.8);
}

.no-video-message svg {
  margin: 0 auto 8px;
  opacity: 0.6;
}

.no-video-message p {
  font-size: 11px;
  margin: 4px 0;
  opacity: 0.8;
}

.settings-link {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: rgba(255, 255, 255, 0.9);
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 10px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.settings-link:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: scale(1.05);
}

/* Vinyl Record */
.vinyl-wrapper {
  position: absolute;
  left: 80px;
  width: 120px;
  height: 120px;
  transition: transform 0.4s ease-out;
  z-index: 5;
}

.vinyl-wrapper.slide-out {
  transform: translateX(30px);
}

.vinyl-wrapper.is-playing {
  transform: translateX(30px);
}

.vinyl-record {
  width: 100%;
  height: 100%;
  position: relative;
  animation: spin 10s linear infinite;
  animation-play-state: paused;
}

.vinyl-record.is-spinning {
  animation-play-state: running;
}

.vinyl-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 50%;
  filter: drop-shadow(0 4px 12px rgba(0, 0, 0, 0.3));
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

/* Music Selector Overlay */
.music-selector-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(8px);
  z-index: 1999;
  animation: fadeIn 0.3s ease;
}

/* To-Do Modal Overlay */
.todo-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.55);
  backdrop-filter: blur(8px);
  z-index: 10098;
  animation: fadeIn 0.3s ease;
  pointer-events: auto;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

/* Music Selector Panel */
.music-selector-panel {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%) scale(0.8);
  width: 400px;
  height: 0;
  background: rgba(0, 0, 0, 0.95);
  backdrop-filter: blur(30px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 16px;
  overflow: hidden;
  transition: all 0.4s ease;
  opacity: 0;
  z-index: 2000;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
}

.music-selector-panel.visible {
  height: 450px;
  opacity: 1;
  transform: translate(-50%, -50%) scale(1);
}

/* To-Do Modal Panel */
.todo-modal-panel {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%) scale(0.9);
  width: min(640px, 90vw);
  max-height: 80vh;
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(30px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 16px;
  overflow: hidden;
  transition: all 0.25s ease;
  opacity: 0;
  z-index: 10100;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
  pointer-events: auto;
  display: flex;
  flex-direction: column;
}

.todo-modal-panel *,
.todo-modal-panel :deep(*) {
  pointer-events: auto;
}

.todo-modal-panel.visible {
  opacity: 1;
  transform: translate(-50%, -50%) scale(1);
}

.todo-modal-panel .selector-content {
  padding: 0;
  flex: 1 1 auto;
  overflow-y: auto;
}

/* Badge on To-Do button */
.todo-badge {
  position: absolute;
  top: -6px;
  right: -6px;
  min-width: 18px;
  height: 18px;
  padding: 0 5px;
  border-radius: 9px;
  background: #FF3B30;
  color: #fff;
  font-size: 11px;
  font-weight: 700;
  line-height: 18px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 6px rgba(0,0,0,0.3);
}

.selector-header {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 16px 40px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.selector-header h3 {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  margin: 0;
  text-align: center;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  font-size: 26px; /* plus grand */
  font-weight: 1000; /* extra gras */
  font-family: 'STHupo', 'STHupo Plus', 'SF Pro Rounded', 'Segoe UI Variable Display', 'Segoe UI Rounded', 'Inter', 'Segoe UI', system-ui, sans-serif;
  color: #ffffff;
  padding: 10px 22px; /* bulle plus généreuse */
  border-radius: 999px; /* bulle */
  background: var(--color-accent, var(--color-primary, #8B5CF6));
  border: 1px solid rgba(255,255,255,0.65);
  box-shadow: 0 10px 22px rgba(0,0,0,0.18), 0 2px 6px rgba(0,0,0,0.12), inset 0 1px 0 rgba(255,255,255,0.28);
  text-shadow:
    0 0 1px rgba(255,255,255,0.75),
    0 2px 6px rgba(0,0,0,0.28),
    0 0 12px rgba(139,92,246,0.45); /* halo légèrement diminué */
}

/* Settings button in To-Do header */
.selector-header .open-settings {
  position: absolute;
  right: 40px; /* leave room for close button at 12px */
  width: 28px;
  height: 28px;
  border-radius: 6px;
  border: 1px solid rgba(0,0,0,0.15);
  background: rgba(255,255,255,0.6);
  backdrop-filter: blur(6px);
  color: #0c0c0c;
  display: grid;
  place-items: center;
  cursor: pointer;
  transition: box-shadow .2s ease, transform .2s ease;
}
.selector-header .open-settings:hover {
  box-shadow: 0 8px 24px rgba(0,0,0,0.18), 0 2px 6px rgba(0,0,0,0.12);
  transform: translateY(-1px);
}

.close-selector {
  background: none;
  border: none;
  color: rgba(255, 255, 255, 0.6);
  font-size: 20px;
  cursor: pointer;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color 0.2s ease;
  position: absolute;
  right: 12px;
}

.close-selector:hover {
  color: white;
}

.selector-content {
  padding: 16px 16px 28px;
  color: #0c0c0c;
}

/* Mini To-Do preview under To-Do button */
.todo-mini-panel {
  --todo-button-size: 48px; /* fallback if not defined elsewhere */
  margin-top: 8px;
  padding: 8px;
  background: rgba(255, 255, 255, 0.12);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 14px;
  width: var(--todo-button-size);
  backdrop-filter: blur(10px);
}
.todo-mini-panel ul { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 10px; align-items: center; }
.mini-item { display: flex; align-items: center; justify-content: center; }
.mini-stack { display: flex; flex-direction: column; align-items: center; gap: 4px; }
.mini-check { width: 20px; height: 20px; border-radius: 50%; border: 2px solid rgba(255,255,255,0.6); background: transparent; display: flex; align-items: center; justify-content: center; font-size: 12px; cursor: pointer; }
.mini-chronos { display: inline-flex; gap: 2px; }
.icon { width: 12px; height: 12px; background-color: rgba(255,255,255,0.9); display: inline-block; -webkit-mask-repeat: no-repeat; -webkit-mask-position: center; -webkit-mask-size: contain; mask-repeat: no-repeat; mask-position: center; mask-size: contain; }
.icon-chrono { -webkit-mask-image: url('/assets/icons/focus%20icon.svg'); mask-image: url('/assets/icons/focus%20icon.svg'); }
.icon.half { clip-path: inset(0 50% 0 0); }

/* Keep To-Do button above overlay/modal so it is not blurred */
.corner-container.corner-middle-left .corner-button {
  position: relative;
  z-index: 10101;
  backdrop-filter: none !important;
  filter: none !important;
}

/* Ensure the parent container escapes lower stacking context when modal is open */
:global(.todo-open) .corner-container.corner-middle-left {
  z-index: 10102 !important;
}

/* Make active To-Do button opaque and crisp (no perceived blur thru transparency) */
.corner-container.corner-middle-left .corner-button.active {
  background: #ffffff;
  color: #0c0c0c;
  box-shadow: 0 6px 16px rgba(0,0,0,0.2);
}

/* While To-Do modal is open, prevent music player from intercepting events */
:global(.todo-open) .music-player-panel,
:global(.todo-open) .player-content,
:global(.todo-open) .player-content *,
:global(.todo-open) .player-content iframe,
:global(.todo-open) .quick-playlists {
  pointer-events: none !important;
}

.url-input-section,
.presets-section {
  margin-bottom: 20px;
}

.url-input-section label,
.presets-section label {
  display: block;
  color: rgba(255, 255, 255, 0.8);
  font-size: 14px;
  font-weight: 500;
  margin-bottom: 8px;
}

.url-input-group {
  display: flex;
  gap: 8px;
}

.url-input {
  flex: 1;
  padding: 8px 12px;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 6px;
  color: white;
  font-size: 13px;
  outline: none;
  transition: all 0.2s ease;
}

.url-input:focus {
  background: rgba(255, 255, 255, 0.15);
  border-color: rgba(0, 191, 165, 0.5);
}

.url-input::placeholder {
  color: rgba(255, 255, 255, 0.5);
}

.load-btn {
  padding: 8px 16px;
  background: rgba(0, 191, 165, 0.8);
  border: none;
  border-radius: 6px;
  color: white;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.load-btn:hover {
  background: rgba(0, 191, 165, 1);
  transform: scale(1.05);
}

.presets-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
}

.preset-btn {
  padding: 12px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  color: rgba(255, 255, 255, 0.8);
  cursor: pointer;
  transition: all 0.2s ease;
  text-align: left;
}

.preset-btn:hover {
  background: rgba(255, 255, 255, 0.1);
  border-color: rgba(255, 255, 255, 0.2);
  transform: scale(1.02);
}

.preset-btn.active {
  background: rgba(0, 191, 165, 0.2);
  border-color: rgba(0, 191, 165, 0.5);
  color: white;
}

.preset-title {
  font-size: 13px;
  font-weight: 600;
  margin-bottom: 4px;
}

.preset-desc {
  font-size: 11px;
  opacity: 0.8;
}
</style>
