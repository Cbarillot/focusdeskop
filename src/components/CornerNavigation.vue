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
        :class="{ active: store.activeTab === 'todo' && store.sidebarOpen }"
        @click="openTodo"
        :title="'To-do'"
        :aria-label="'To-do'"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/>
          <path d="M8 12l2 2 4-4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </button>
    </div>

    <!-- Bottom-Left Corner: Music -->
    <div class="corner-container corner-bottom-left">
      <!-- Music Button -->
      <button
        class="corner-button"
        :class="{ active: musicPlayerVisible }"
        @click="toggleMusicPlayer"
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
        @dblclick="toggleMusicSelector"
      >
        <!-- Album Cover avec YouTube Player -->
        <div class="album-sleeve">
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
                <button @click="openMusic" class="settings-link">
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
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { useAppStore } from '../stores/appStore'

const store = useAppStore()
const musicPlayerVisible = ref(false)
const musicSelectorVisible = ref(false)
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
  store.setActiveTab('music')
  if (!store.sidebarOpen) {
    store.toggleSidebar()
  }
  musicPlayerVisible.value = false
}

function openTodo() {
  store.setActiveTab('todo')
  if (!store.sidebarOpen) {
    store.toggleSidebar()
  }
}

function toggleMusicPlayer() {
  musicPlayerVisible.value = !musicPlayerVisible.value
  if (musicPlayerVisible.value && !youtubePlayer.value) {
    initializeYouTubePlayer()
  }
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
    youtubePlayer.value = new YT.Player(`youtube-player-${playerId.value}`, {
      height: '100%',
      width: '100%',
      videoId: extractedVideoId.value,
      playerVars: {
        'playsinline': 1,
        'controls': 1,
        'loop': 1,
        'playlist': extractedVideoId.value
      },
      events: {
        'onStateChange': onPlayerStateChange
      }
    })
  }
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
  top: 50%;
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
    width: 200px;
  }

  .album-sleeve {
    width: 90px;
    height: 90px;
    padding: 6px;
  }

  .vinyl-wrapper {
    left: 55px;
    width: 90px;
    height: 90px;
  }

  .vinyl-wrapper.slide-out {
    transform: translateX(45px);
  }

  .vinyl-wrapper.is-playing {
    transform: translateX(45px);
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
    width: 180px;
  }

  .vinyl-player.visible {
    height: 100px;
  }

  .album-sleeve {
    width: 80px;
    height: 80px;
    padding: 6px;
  }

  .vinyl-wrapper {
    left: 50px;
    width: 80px;
    height: 80px;
  }

  .vinyl-wrapper.slide-out,
  .vinyl-wrapper.is-playing {
    transform: translateX(40px);
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
</style>
