<template>
  <div 
    ref="musicPlayerContainer"
    class="music-player-compact"
    :class="{ 'is-dragging': isDragging, 'is-resizing': isResizing }"
    :style="{ 
      left: playerPosition.x + 'px', 
      bottom: typeof window !== 'undefined' ? (window.innerHeight - playerPosition.y - 200) + 'px' : '20px'
    }"
  >
    <!-- Music Button (kept, no toggle) - serves as drag handle -->
    <button 
      class="music-button drag-handle"
      :class="{ playing: store.musicPlaying }"
      title="Musique - Glisser pour déplacer"
      @mousedown.left="startDrag"
      @click="openMusicSettings"
    >
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/>
        <polygon v-if="!store.musicPlaying" points="10,8 16,12 10,16" fill="currentColor"/>
        <rect v-else x="9" y="8" width="2" height="8" fill="currentColor"/>
        <rect v-else x="13" y="8" width="2" height="8" fill="currentColor"/>
      </svg>
    </button>

    <!-- Compact Music Player (always visible) -->
    <div
      ref="musicPlayerPanel"
      class="music-player-panel resizable"
      :style="{
        width: playerSize.width + 'px',
        height: typeof playerSize.height === 'number' ? playerSize.height + 'px' : 'auto'
      }"
      @mousedown="handlePanelMouseDown"
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

      <!-- Default state - no music selected -->
      <div v-if="!store.musicSelected" class="player-content" @click="openMusicSettings" title="Cliquez pour ouvrir les réglages musique">
        <div class="default-state">
          <div class="default-icon-container">
            <!-- Music note icon -->
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="default-music-icon">
              <path d="M12 3V13.55L11.4 13.1C10.8 12.65 10 12.65 9.4 13.1L8 14.1V3H12ZM8 15.35L9.4 14.35C10 14.05 10.6 14.05 11.2 14.35L12 14.9V3H8V15.35ZM6 3V17L10.5 14L15 17V3H6Z" fill="currentColor"/>
              <circle cx="7" cy="19" r="2" fill="currentColor"/>
              <circle cx="17" cy="19" r="2" fill="currentColor"/>
            </svg>
          </div>
          <div class="default-message">let's play something !</div>
          <div class="default-instruction">Click to select music</div>
        </div>
      </div>

      <!-- Music selected and playing -->
      <div v-else class="player-content centered-layout">
        <!-- YouTube Player -->
        <div v-if="store.selectedMusicSource?.type === 'youtube'" class="vinyl-player">
          <div class="player-container">
            <div class="album-sleeve youtube-player">
              <div class="sleeve-inner">
                <div v-if="ytReady" id="youtube-player"></div>
                <iframe 
                  v-else 
                  class="yt-fallback" 
                  width="100%" height="100%" 
                  :src="getYouTubeEmbedUrl()"
                  title="YouTube video player" 
                  frameborder="0" 
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                  allowfullscreen
                ></iframe>
              </div>
            </div>
            
            <div :class="['vinyl-wrapper', 'youtube-vinyl', { 'is-playing': isPlaying }]">
              <img 
                :class="['vinyl-record', { 'is-spinning': isPlaying }]" 
                src="/assets/icons/vinyle.png" 
                alt="Disque vinyle"
              />
            </div>
          </div>
          
        </div>

        <!-- YouTube Volume Control (moved outside and below player) -->
        <div v-if="store.selectedMusicSource?.type === 'youtube'" class="youtube-volume-control volume-section">
          <div class="volume-label">Volume</div>
          <input
            type="range"
            min="0"
            max="100"
            step="1"
            v-model="youtubeVolume"
            @input="updateYouTubeVolume"
            class="youtube-volume-slider"
          />
          <div class="volume-value">{{ youtubeVolume }}%</div>
        </div>

        <!-- Local Audio Player -->
        <div v-else-if="store.selectedMusicSource?.type === 'local'" class="vinyl-player">
          <div class="player-container">
            <div class="album-sleeve">
              <div class="sleeve-inner">
                <img 
                  v-if="store.localAudioFile?.cover" 
                  :src="store.localAudioFile.cover" 
                  alt="Album cover"
                  class="album-cover"
                />
                <div v-else class="default-cover">
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 3V13.55L11.4 13.1C10.8 12.65 10 12.65 9.4 13.1L8 14.1V3H12ZM8 15.35L9.4 14.35C10 14.05 10.6 14.05 11.2 14.35L12 14.9V3H8V15.35ZM6 3V17L10.5 14L15 17V3H6Z" fill="currentColor"/>
                  </svg>
                </div>
              </div>
            </div>
            
            <div :class="['vinyl-wrapper', { 'is-playing': isPlaying }]">
              <img 
                :class="['vinyl-record', { 'is-spinning': isPlaying }]" 
                src="/assets/icons/vinyle.png" 
                alt="Disque vinyle"
              />
            </div>
          </div>
          
        </div>

        <!-- Custom Audio Controls (moved outside and below player) -->
        <div v-if="store.selectedMusicSource?.type === 'local'" class="audio-controls volume-section">
          <audio
            ref="audioPlayer"
            :src="store.localAudioFile?.url"
            @loadedmetadata="onAudioLoaded"
            @timeupdate="onTimeUpdate"
            @ended="onAudioEnded"
          ></audio>

          <div class="control-buttons">
            <button @click="previousTrack" class="control-btn">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M6 6V18L18 12L6 6Z" fill="currentColor"/>
                <rect x="4" y="6" width="2" height="12" fill="currentColor"/>
              </svg>
            </button>

            <button @click="toggleLocalPlayback" class="control-btn play-btn">
              <svg v-if="!isPlaying" width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M8 5V19L19 12L8 5Z" fill="currentColor"/>
              </svg>
              <svg v-else width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="6" y="4" width="4" height="16" fill="currentColor"/>
                <rect x="14" y="4" width="4" height="16" fill="currentColor"/>
              </svg>
            </button>

            <button @click="nextTrack" class="control-btn">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M6 18L18 12L6 6V18Z" fill="currentColor"/>
                <rect x="18" y="6" width="2" height="12" fill="currentColor"/>
              </svg>
            </button>
          </div>

          <div class="volume-control">
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              v-model="localVolume"
              @input="updateLocalVolume"
              class="volume-slider"
            />
          </div>
        </div>

        <!-- Spotify Embedded Player -->
        <div v-else-if="store.selectedMusicSource?.type === 'spotify'" class="embedded-player">
          <iframe 
            :src="getEmbedUrl()"
            :width="getPlayerWidth()" 
            :height="getPlayerHeight()"
            frameborder="0"
            allowtransparency="true"
            allow="encrypted-media; clipboard-write"
            loading="lazy"
          ></iframe>
        </div>

        <!-- Deezer Embedded Player with Vinyl (Horizontal Layout) -->
        <div v-else-if="store.selectedMusicSource?.type === 'deezer'" class="deezer-vinyl-player">
          <div class="deezer-container">
            <!-- Album Cover (Deezer Widget) -->
            <div class="album-cover-frame">
              <div class="embedded-player">
                <iframe 
                  :src="getEmbedUrl()"
                  :width="getPlayerWidth()" 
                  :height="getPlayerHeight()"
                  frameborder="0"
                  allowtransparency="true"
                  allow="encrypted-media; clipboard-write"
                  loading="lazy"
                ></iframe>
              </div>
            </div>
            
            <!-- Vinyl Element to the Right -->
            <div class="deezer-vinyl-wrapper deezer-vinyl-enhanced">
              <img 
                :class="['vinyl-record', 'deezer-vinyl', { 'is-spinning': isPlaying }]" 
                src="/assets/icons/vinyle.png" 
                alt="Disque vinyle"
              />
            </div>
          </div>
        </div>

        <!-- Track Info (moved to bottom) -->
        <div class="current-track track-info-bottom">
          <div class="track-name">{{ store.currentTrack }}</div>
          <div class="track-status">{{ getTrackStatus() }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, watch, nextTick } from 'vue'
import { useAppStore } from '../stores/appStore'

const store = useAppStore()
const isPlaying = ref(false)
const ytReady = ref(false)
const localVolume = ref(0.7)
const youtubeVolume = ref(50)
const audioPlayer = ref(null)
let ytPlayer = null

// Drag and resize functionality
const isDragging = ref(false)
const isResizing = ref(false)
const playerPosition = ref({ x: 20, y: 20 })
const playerSize = ref({ width: 280, height: 'auto' })
const musicPlayerContainer = ref(null)
const musicPlayerPanel = ref(null)

// Drag state
let dragStart = { x: 0, y: 0, playerX: 0, playerY: 0 }
// Resize state  
let resizeStart = { x: 0, y: 0, width: 0, height: 0 }

function openMusicSettings() {
  store.setActiveTab('music')
  if (!store.sidebarOpen) store.toggleSidebar()
}

// Panel drag functionality
function handlePanelMouseDown(event) {
  // Don't start drag if clicking on interactive elements
  const interactiveElements = [
    'INPUT', 'BUTTON', 'IFRAME', 'SVG', 'PATH', 'CIRCLE', 'RECT', 'POLYGON'
  ]

  // Don't start drag if clicking on resize handles
  if (event.target.classList.contains('resize-handle') ||
      event.target.closest('.resize-handle')) {
    return
  }

  // Don't start drag if clicking on interactive elements
  if (interactiveElements.includes(event.target.tagName) ||
      event.target.closest('button, input, iframe, svg')) {
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
  dragStart.playerX = playerPosition.value.x
  dragStart.playerY = playerPosition.value.y
  
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
  
  playerPosition.value.x = Math.max(0, Math.min(window.innerWidth - 300, dragStart.playerX + deltaX))
  playerPosition.value.y = Math.max(0, Math.min(window.innerHeight - 200, dragStart.playerY + deltaY))
  
  updatePlayerPosition()
}

function endDrag() {
  isDragging.value = false
  document.removeEventListener('mousemove', handleDrag)
  document.removeEventListener('mouseup', endDrag)
  document.body.style.cursor = ''
  document.body.style.userSelect = ''
  savePlayerSettings()
}

// Resize functionality
function startResize(event, direction) {
  if (isDragging.value) return
  
  isResizing.value = true
  resizeStart.x = event.clientX
  resizeStart.y = event.clientY
  resizeStart.width = playerSize.value.width
  resizeStart.height = musicPlayerPanel.value?.offsetHeight || 200
  
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
    newWidth = Math.max(200, Math.min(600, resizeStart.width + deltaX))
  }
  if (direction.includes('left')) {
    newWidth = Math.max(200, Math.min(600, resizeStart.width - deltaX))
  }
  if (direction.includes('bottom')) {
    newHeight = Math.max(150, Math.min(500, resizeStart.height + deltaY))
  }
  if (direction.includes('top')) {
    newHeight = Math.max(150, Math.min(500, resizeStart.height - deltaY))
  }
  
  playerSize.value.width = newWidth
  playerSize.value.height = newHeight
  
  updatePlayerSize()
}

function endResize(resizeHandler) {
  isResizing.value = false
  document.removeEventListener('mousemove', resizeHandler)
  document.removeEventListener('mouseup', endResize)
  document.body.style.userSelect = ''
  savePlayerSettings()
}

// Update functions
function updatePlayerPosition() {
  if (musicPlayerContainer.value && typeof window !== 'undefined') {
    musicPlayerContainer.value.style.left = playerPosition.value.x + 'px'
    musicPlayerContainer.value.style.bottom = (window.innerHeight - playerPosition.value.y - 200) + 'px'
  }
}

function updatePlayerSize() {
  if (musicPlayerPanel.value) {
    musicPlayerPanel.value.style.width = playerSize.value.width + 'px'
    if (typeof playerSize.value.height === 'number') {
      musicPlayerPanel.value.style.height = playerSize.value.height + 'px'
    }
  }
  
  // Update child components proportionally
  setTimeout(() => {
    const baseSize = Math.min(playerSize.value.width * 0.4, 150)
    const albumSleeves = document.querySelectorAll('.album-sleeve')
    const vinylWrappers = document.querySelectorAll('.vinyl-wrapper, .deezer-vinyl-wrapper')
    const iframes = document.querySelectorAll('.embedded-player iframe')
    
    albumSleeves.forEach(sleeve => {
      sleeve.style.width = baseSize + 'px'
      sleeve.style.height = baseSize + 'px'
    })
    
    vinylWrappers.forEach(vinyl => {
      vinyl.style.width = baseSize + 'px'
      vinyl.style.height = baseSize + 'px'
    })
    
    iframes.forEach(iframe => {
      iframe.style.width = baseSize + 'px'
      iframe.style.height = baseSize + 'px'
    })
  }, 10)
}

// Settings persistence
function savePlayerSettings() {
  const settings = {
    position: playerPosition.value,
    size: playerSize.value
  }
  localStorage.setItem('musicPlayerSettings', JSON.stringify(settings))
}

function loadPlayerSettings() {
  try {
    const saved = localStorage.getItem('musicPlayerSettings')
    if (saved) {
      const settings = JSON.parse(saved)
      if (settings.position) {
        playerPosition.value = settings.position
      }
      if (settings.size) {
        playerSize.value = settings.size
      }
    }
  } catch (error) {
    console.warn('Error loading player settings:', error)
  }
}

// YouTube Player Functions
function createYouTubePlayer() {
  if (!window.YT || !window.YT.Player) return
  if (ytPlayer) return
  
  const videoId = extractYouTubeId(store.selectedMusicSource?.url) || 'jfKfPfyJRdk'
  
  ytPlayer = new window.YT.Player('youtube-player', {
    height: '100%',
    width: '100%',
    videoId: videoId,
    playerVars: { 
      playsinline: 1, 
      controls: 1, 
      loop: 1, 
      playlist: videoId,
      enablejsapi: 1,
      origin: window.location.origin
    },
    events: {
      onReady: () => {
        console.log('YouTube Player Ready')
        window.ytPlayer = ytPlayer
        ytReady.value = true
      },
      onStateChange: (event) => {
        const YTPS = window.YT.PlayerState
        if (!YTPS) return
        
        if (event.data === YTPS.PLAYING) {
          isPlaying.value = true
          store.musicPlaying = true
        } else if (event.data === YTPS.PAUSED || event.data === YTPS.ENDED) {
          isPlaying.value = false
          store.musicPlaying = false
        }
      },
      onError: (error) => {
        console.error('YouTube Player Error:', error)
      }
    }
  })
}

function loadYouTubeAPI() {
  if (window.YT && window.YT.Player) {
    createYouTubePlayer()
    return
  }
  const tag = document.createElement('script')
  tag.src = 'https://www.youtube.com/iframe_api'
  document.body.appendChild(tag)
  window.onYouTubeIframeAPIReady = () => {
    createYouTubePlayer()
  }
}

function getYouTubeEmbedUrl() {
  if (!store.selectedMusicSource?.url) return ''
  const videoId = extractYouTubeId(store.selectedMusicSource.url)
  return `https://www.youtube.com/embed/${videoId}?playsinline=1&controls=1&loop=1&playlist=${videoId}`
}

function extractYouTubeId(url) {
  if (!url) return ''
  const match = url.match(/(?:v=|youtu\.be\/|embed\/)([A-Za-z0-9_-]{11})/)
  return match ? match[1] : ''
}

// YouTube Volume Control
function updateYouTubeVolume() {
  if (ytPlayer && ytPlayer.setVolume) {
    try {
      ytPlayer.setVolume(youtubeVolume.value)
    } catch (e) {
      console.warn('Error setting YouTube volume:', e)
    }
  }
}

// Local Audio Functions
function toggleLocalPlayback() {
  if (!audioPlayer.value) return
  
  if (isPlaying.value) {
    audioPlayer.value.pause()
    isPlaying.value = false
    store.musicPlaying = false
  } else {
    audioPlayer.value.play()
    isPlaying.value = true
    store.musicPlaying = true
  }
}

function updateLocalVolume() {
  if (audioPlayer.value) {
    audioPlayer.value.volume = localVolume.value
  }
}

function onAudioLoaded() {
  if (audioPlayer.value) {
    audioPlayer.value.volume = localVolume.value
  }
}

function onTimeUpdate() {
  // Update progress if needed
}

function onAudioEnded() {
  isPlaying.value = false
  store.musicPlaying = false
}

function previousTrack() {
  // Implement previous track logic if needed
  console.log('Previous track')
}

function nextTrack() {
  // Implement next track logic if needed
  console.log('Next track')
}

// Embedded Player Functions
function getEmbedUrl() {
  if (!store.selectedMusicSource?.url) return ''
  
  if (store.selectedMusicSource.type === 'spotify') {
    // Convert Spotify URL to embed format
    const match = store.selectedMusicSource.url.match(/(?:track|playlist|album)\/([a-zA-Z0-9]+)/)
    if (match) {
      const id = match[1]
      const type = store.selectedMusicSource.url.includes('track') ? 'track' :
                   store.selectedMusicSource.url.includes('playlist') ? 'playlist' : 'album'
      return `https://open.spotify.com/embed/${type}/${id}?utm_source=generator`
    }
  } else if (store.selectedMusicSource.type === 'deezer') {
    // Use widget URL if available, otherwise fallback to regular URL
    return store.selectedMusicSource.widgetUrl || store.selectedMusicSource.url
  }
  
  return store.selectedMusicSource.url
}

// Enhanced sizing functions - respects recommended ranges (320-400px width, 180-400px height)
function getPlayerWidth() {
  const baseSize = getBasePlayerSize()
  
  if (store.selectedMusicSource.type === 'deezer') {
    return Math.min(400, Math.max(320, baseSize)).toString() // Square format within range
  } else if (store.selectedMusicSource.type === 'spotify') {
    return Math.min(380, Math.max(300, baseSize * 1.4)).toString() // Wider for Spotify
  } else if (store.selectedMusicSource.type === 'youtube') {
    return Math.min(400, Math.max(320, baseSize * 1.2)).toString() // 16:9 friendly
  }
  return baseSize.toString()
}

function getPlayerHeight() {
  const baseSize = getBasePlayerSize()
  
  if (store.selectedMusicSource.type === 'deezer') {
    return Math.min(400, Math.max(320, baseSize)).toString() // Square format
  } else if (store.selectedMusicSource.type === 'spotify') {
    return '120' // Mini player height as recommended
  } else if (store.selectedMusicSource.type === 'youtube') {
    const width = parseInt(getPlayerWidth())
    return Math.min(400, Math.max(180, Math.round(width * 9/16))).toString() // 16:9 ratio
  }
  return baseSize.toString()
}

// Dynamic base size calculation based on screen size and aspect ratio
function getBasePlayerSize() {
  if (typeof window === 'undefined') return 140
  
  const vw = window.innerWidth
  const vh = window.innerHeight
  const aspectRatio = vw / vh
  
  // Wide screens (ratio > 1.4) can handle larger players
  if (aspectRatio > 1.4 && vw >= 1200) {
    return 160 // Larger for wide screens
  }
  // Narrow screens (ratio < 1.4) need smaller players  
  else if (aspectRatio <= 1.4) {
    return 120 // Smaller for narrow screens
  }
  // Mobile screens
  else if (vw <= 768) {
    return 110 // Mobile size
  }
  // Default size
  else {
    return 140
  }
}

// Enhanced status and reactive sizing functions
function getTrackStatus() {
  if (!store.selectedMusicSource) return ''
  
  if (isPlaying.value) {
    return 'Playing'
  } else {
    return 'Ready'
  }
}

// Reactive panel width calculation
function getPanelWidth() {
  if (!store.selectedMusicSource) {
    return '240px' // Default width for "let's play something" state
  }
  
  const playerWidth = parseInt(getPlayerWidth())
  const vinylWidth = getBasePlayerSize()
  const totalWidth = playerWidth + (vinylWidth * 0.5) + 32 // 32px margin
  
  return Math.max(240, totalWidth) + 'px'
}

// Update panel width reactively
function updatePanelSize() {
  if (typeof window !== 'undefined') {
    const panel = document.querySelector('.music-player-panel')
    if (panel) {
      panel.style.width = getPanelWidth()
    }
  }
}

// Watch for music selection changes
watch(() => store.selectedMusicSource, (newSource) => {
  if (newSource && newSource.type === 'youtube') {
    ytReady.value = false
    if (ytPlayer) {
      try {
        ytPlayer.destroy()
      } catch (e) {
        console.warn('Error destroying YouTube player:', e)
      }
      ytPlayer = null
    }
    setTimeout(() => {
      loadYouTubeAPI()
    }, 100)
  } else if (newSource && newSource.type === 'deezer') {
    // For Deezer, assume playing state (since we can't detect iframe playback)
    isPlaying.value = true
    store.musicPlaying = true
  }
}, { deep: true })

watch(() => store.musicPlaying, (playing) => {
  isPlaying.value = playing
})

// Watch for window resize to update panel sizing (existing functionality)
let resizeTimeout
function handlePanelResize() {
  clearTimeout(resizeTimeout)
  resizeTimeout = setTimeout(() => {
    updatePanelSize()
  }, 100)
}

onMounted(() => {
  // Only load YouTube API if we have a YouTube source
  if (store.selectedMusicSource?.type === 'youtube') {
    loadYouTubeAPI()
  }
  
  // Add resize listener for responsive sizing
  if (typeof window !== 'undefined') {
    window.addEventListener('resize', handleWindowResize)
    // Initial panel size update
    updatePanelSize()
  }
  
  // Load saved settings and apply initial position/size
  loadPlayerSettings()
  updatePlayerPosition()
  updatePlayerSize()
})

onBeforeUnmount(() => {
  try { 
    if (ytPlayer && ytPlayer.destroy) {
      ytPlayer.destroy() 
    }
  } catch (e) {
    console.warn('Error destroying YouTube player:', e)
  }
  ytPlayer = null
  
  // Remove resize listener
  if (typeof window !== 'undefined') {
    window.removeEventListener('resize', handleWindowResize)
  }
  
  // Clean up drag/resize event listeners
  document.removeEventListener('mousemove', handleDrag)
  document.removeEventListener('mouseup', endDrag)
  
  // Save settings
  savePlayerSettings()
})

// Window resize handler
function handleWindowResize() {
  if (typeof window === 'undefined') return
  
  // Ensure player stays within bounds when window is resized
  const maxX = Math.max(0, window.innerWidth - playerSize.value.width)
  const maxY = Math.max(0, window.innerHeight - 200)
  
  playerPosition.value.x = Math.min(playerPosition.value.x, maxX)
  playerPosition.value.y = Math.min(playerPosition.value.y, maxY)
  
  updatePlayerPosition()
  updatePanelSize() // Keep existing responsive behavior
}
</script>

<style scoped>
.music-player-compact {
  position: fixed;
  bottom: 20px;
  left: 20px;
  z-index: 150;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0;
  transition: none; /* Disable transitions when dragging/resizing */
}

.music-player-compact.is-dragging {
  transition: none;
  z-index: 200; /* Higher z-index when dragging */
}

.music-player-compact.is-resizing {
  transition: none;
}

.music-button {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.12); /* semi-transparent white */
  color: rgba(255, 255, 255, 0.95);
  box-shadow: 0 8px 24px rgba(0,0,0,0.18);
  border: 1px solid rgba(255, 255, 255, 0.35);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  position: relative;
  z-index: 50; /* ensure above the panel */
}

.music-button.drag-handle {
  cursor: grab;
}

.music-button.drag-handle:active,
.is-dragging .music-button.drag-handle {
  cursor: grabbing;
}

.music-button:hover {
  transform: scale(1.05);
  box-shadow: 0 10px 28px rgba(0, 0, 0, 0.24);
}

.music-button.playing {
  background: rgba(255, 255, 255, 0.2);
  border-color: rgba(255, 255, 255, 0.5);
  box-shadow: 0 8px 28px rgba(0, 0, 0, 0.26);
}

/* 15" desktop optimization (heights <= 820px) */
@media (max-height: 820px) and (min-width: 1024px) {
  .music-player-compact {
    bottom: 16px;
    left: 16px;
    gap: 2px;
  }

  .music-button {
    width: 48px;
    height: 48px;
  }

  .music-player-panel {
    width: 220px; /* Further reduced for compact desktop screens */
  }

  .music-player-panel .player-content {
    padding: 8px;
  }

  .album-sleeve {
    width: 120px; /* Even smaller for compact desktop */
    height: 120px;
  }

  .album-sleeve.youtube-player {
    margin-left: 15px; /* Proportional adjustment for compact desktop */
  }

  .vinyl-wrapper {
    width: 120px;
    height: 120px;
    margin-left: -40px;
  }

  .vinyl-wrapper.youtube-vinyl {
    margin-left: -55px; /* Proportional adjustment for compact desktop */
  }

  .deezer-vinyl-wrapper {
    width: 120px;
    height: 120px;
    margin-left: -40px;
  }

  .vinyl-player .player-container {
    transform: scale(0.95);
    transform-origin: top left;
  }
}

.music-player-panel {
  width: 280px; /* Default width - can be overridden by user resizing */
  min-width: 200px;
  max-width: 600px;
  background: rgba(255, 255, 255, 0.06); /* very light white, almost transparent */
  backdrop-filter: blur(14px);
  border: 1px solid rgba(255, 255, 255, 0.25);
  border-radius: 12px;
  overflow: visible; /* Allow resize handles to be visible outside panel */
  margin-top: 10px; /* sits under the button */
  pointer-events: auto;
  z-index: 40;
  position: relative; /* For resize handles positioning */
  cursor: grab; /* Show grab cursor when hovering over draggable areas */
}

.music-player-panel:active {
  cursor: grabbing;
}

.is-dragging .music-player-panel {
  cursor: grabbing;
}

.music-player-panel.resizable {
  resize: none; /* Disable native resize, use custom handles */
}

/* Resize handles */
.resize-handle {
  position: absolute;
  background: rgba(255, 255, 255, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.4);
  opacity: 0;
  transition: opacity 0.2s ease;
  z-index: 60;
}

.music-player-panel:hover .resize-handle {
  opacity: 1;
}

.resize-handle:hover {
  background: rgba(0, 191, 165, 0.3);
  border-color: rgba(0, 191, 165, 0.5);
}

/* Corner handles */
.resize-handle-nw, .resize-handle-ne, .resize-handle-sw, .resize-handle-se {
  width: 12px;
  height: 12px;
  border-radius: 50%;
}

.resize-handle-nw {
  top: -6px;
  left: -6px;
  cursor: nw-resize;
}

.resize-handle-ne {
  top: -6px;
  right: -6px;
  cursor: ne-resize;
}

.resize-handle-sw {
  bottom: -6px;
  left: -6px;
  cursor: sw-resize;
}

.resize-handle-se {
  bottom: -6px;
  right: -6px;
  cursor: se-resize;
}

/* Edge handles */
.resize-handle-n, .resize-handle-s {
  height: 4px;
  left: 20px;
  right: 20px;
  border-radius: 2px;
}

.resize-handle-w, .resize-handle-e {
  width: 4px;
  top: 20px;
  bottom: 20px;
  border-radius: 2px;
}

.resize-handle-n {
  top: -2px;
  cursor: n-resize;
}

.resize-handle-s {
  bottom: -2px;
  cursor: s-resize;
}

.resize-handle-w {
  left: -2px;
  cursor: w-resize;
}

.resize-handle-e {
  right: -2px;
  cursor: e-resize;
}

.player-header h3 {
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
  font-size: 18px;
  cursor: pointer;
  padding: 0;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color 0.2s ease;
}

.close-btn:hover {
  color: white;
}

.player-content {
  padding: 16px;
}

/* New centered layout */
.player-content.centered-layout {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  cursor: grab; /* Allow dragging when clicking on the content background */
}

.player-content.centered-layout:active {
  cursor: grabbing;
}

.centered-player {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
}

/* Volume section styling */
.volume-section {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

/* Track info at bottom */
.track-info-bottom {
  margin-top: auto;
  margin-bottom: 0;
  width: 100%;
  text-align: center;
}

/* Default state styles - optimized 200x200px format */
.default-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 20px;
  cursor: pointer;
  transition: all 0.2s ease;
  width: 200px; /* Target 200x200px as requested */
  height: 160px; /* Slightly reduced to accommodate text */
  margin: 0 auto;
  border: 2px dashed rgba(255, 255, 255, 0.3);
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.02);
}

.default-state:hover {
  background: rgba(255, 255, 255, 0.08);
  border-color: rgba(255, 255, 255, 0.5);
  transform: scale(1.02);
}

.default-icon-container {
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 80px;
  height: 80px;
  background: rgba(0, 191, 165, 0.1);
  border-radius: 50%;
  border: 2px solid rgba(0, 191, 165, 0.3);
}

.default-music-icon {
  color: rgba(0, 191, 165, 0.8);
  transition: all 0.2s ease;
}

.default-state:hover .default-music-icon {
  color: rgba(0, 191, 165, 1);
  transform: scale(1.1);
}

.default-message {
  color: rgba(255, 255, 255, 0.9);
  font-size: 14px;
  font-weight: 500;
  margin-bottom: 6px;
}

.default-instruction {
  color: rgba(255, 255, 255, 0.6);
  font-size: 11px;
  font-style: italic;
}

/* Vinyl player layout (compact) */
.vinyl-player {
  display: flex;
  justify-content: center;
}

.vinyl-player.centered-player {
  width: 100%;
  margin-bottom: 0;
}

.player-container {
  display: flex;
  align-items: center;
  gap: 10px;
  position: relative; /* create stacking context */
}

.album-sleeve {
  width: 140px; /* Significantly reduced from 280px for much smaller layout */
  height: 140px; /* Square format */
  background: #ffffff; /* opaque white frame */
  border: 2px solid rgba(255,255,255,0.6); /* subtle white border */
  border-radius: 14px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.2), inset 0 0 8px rgba(0,0,0,0.04);
  overflow: hidden;
  position: relative;
  z-index: 2; /* above vinyl */
}

/* YouTube player specific positioning */
.album-sleeve.youtube-player {
  margin-left: 20px; /* Shift YouTube player to the right */
}

.sleeve-inner {
  width: calc(100% - 12px); /* leave a white frame */
  height: calc(100% - 12px);
  margin: 6px;
  border-radius: 10px;
  overflow: hidden;
  background: #000; /* video surface */
}

.vinyl-wrapper {
  width: 140px; /* Match significantly reduced widget size */
  height: 140px; /* Square format */
  transition: transform 0.4s ease-out;
  margin-left: -50px; /* Proportionally reduced overlap for emerging effect */
  position: relative;
  z-index: 1; /* behind sleeve */
  pointer-events: none; /* avoid blocking interactions */
}

/* YouTube vinyl positioning - cover about half of the player */
.vinyl-wrapper.youtube-vinyl {
  margin-left: -70px; /* Increased overlap to cover about half of the YouTube player */
}

.music-player-panel:hover .vinyl-wrapper:not(.is-playing) {
  transform: translateX(15px); /* Proportionally reduced hover effect */
}

.vinyl-record {
  width: 100%;
  height: 100%;
  object-fit: contain; /* Prevent distortion */
  animation: spin 10s linear infinite;
  animation-play-state: paused;
}

.vinyl-record.is-spinning { animation-play-state: running; }

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

/* Ensure YouTube fills the sleeve */
.sleeve-inner { position: relative; }
.sleeve-inner #youtube-player,
.sleeve-inner iframe,
.yt-fallback {
  width: 100%;
  height: 100%;
  display: block;
  border: 0;
}

/* Album cover for local audio */
.album-cover {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 6px;
}

.default-cover {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.1);
  color: rgba(255, 255, 255, 0.6);
  border-radius: 6px;
}

/* Audio controls for local files */
.audio-controls {
  margin-top: 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 8px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.control-buttons {
  display: flex;
  justify-content: center;
  gap: 8px;
}

.control-btn {
  width: 32px;
  height: 32px;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 6px;
  color: rgba(255, 255, 255, 0.8);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.control-btn:hover {
  background: rgba(255, 255, 255, 0.2);
  color: white;
  transform: scale(1.05);
}

.play-btn {
  width: 40px;
  height: 40px;
  background: rgba(0, 191, 165, 0.2);
  border-color: rgba(0, 191, 165, 0.4);
}

.play-btn:hover {
  background: rgba(0, 191, 165, 0.3);
  border-color: rgba(0, 191, 165, 0.6);
}

.volume-control {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 0 8px;
}

.volume-slider {
  flex: 1;
  height: 4px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 2px;
  outline: none;
  cursor: pointer;
}

.volume-slider::-webkit-slider-thumb {
  appearance: none;
  width: 12px;
  height: 12px;
  background: rgba(0, 191, 165, 1);
  border-radius: 50%;
  cursor: pointer;
}

.volume-slider::-moz-range-thumb {
  width: 12px;
  height: 12px;
  background: rgba(0, 191, 165, 1);
  border-radius: 50%;
  cursor: pointer;
  border: none;
}

/* YouTube Volume Control */
.youtube-volume-control {
  margin-top: 0;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px;
  justify-content: center;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.volume-label {
  color: rgba(255, 255, 255, 0.7);
  font-size: 10px;
  font-weight: 500;
  min-width: 40px;
}

.youtube-volume-slider {
  flex: 1;
  height: 4px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 2px;
  outline: none;
  cursor: pointer;
  appearance: none;
}

.youtube-volume-slider::-webkit-slider-thumb {
  appearance: none;
  width: 12px;
  height: 12px;
  background: rgba(239, 68, 68, 1); /* Red color for YouTube */
  border-radius: 50%;
  cursor: pointer;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.youtube-volume-slider::-moz-range-thumb {
  width: 12px;
  height: 12px;
  background: rgba(239, 68, 68, 1); /* Red color for YouTube */
  border-radius: 50%;
  cursor: pointer;
  border: none;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.volume-value {
  color: rgba(255, 255, 255, 0.6);
  font-size: 10px;
  min-width: 30px;
  text-align: right;
}

/* Embedded player styles */
.embedded-player {
  border-radius: 8px;
  overflow: hidden;
  margin-bottom: 0;
  display: flex;
  justify-content: center; /* Center the iframe */
}

.embedded-player.centered-player {
  width: 100%;
  margin-bottom: 0;
}

.embedded-player iframe {
  border-radius: 8px;
  max-width: 100%;
  height: auto;
}

/* Deezer player with vinyl (Horizontal Layout - vinyl to the right like album cover) */
.deezer-vinyl-player {
  display: flex;
  justify-content: center;
}

.deezer-vinyl-player.centered-player {
  width: 100%;
  margin-bottom: 0;
}

.deezer-container {
  display: flex;
  align-items: center;
  gap: 10px;
  position: relative;
}

.album-cover-frame {
  position: relative;
  z-index: 2;
  /* White album cover frame */
  background: #ffffff;
  padding: 6px;
  border-radius: 14px;
  box-shadow: 0 8px 24px rgba(0,0,0,0.2), inset 0 0 8px rgba(0,0,0,0.04);
  border: 2px solid rgba(255,255,255,0.8);
}

.album-cover-frame .embedded-player {
  border-radius: 8px;
  overflow: hidden;
  margin-bottom: 0; /* Remove bottom margin for tight frame */
}

.album-cover-frame .embedded-player iframe {
  display: block;
  border-radius: 8px;
}

.deezer-vinyl-wrapper {
  width: 140px; /* Match significantly reduced widget size exactly for proper proportions */
  height: 140px; /* Ensure vinyl doesn't exceed widget height */
  position: relative;
  z-index: 1;
  margin-left: -50px; /* Proportionally reduced overlap consistent with YouTube layout */
  pointer-events: none; /* Avoid blocking widget interactions */
}

/* Enhanced Deezer vinyl sizing to match player height */
.deezer-vinyl-wrapper.deezer-vinyl-enhanced {
  width: 140px; /* Match widget dimensions exactly */
  height: 140px; /* Match widget height exactly */
  margin-left: -50px; /* Optimal overlap for album cover effect */
}

.vinyl-record.deezer-vinyl {
  width: 100%;
  height: 100%;
  object-fit: contain; /* Prevent distortion */
  animation: spin 10s linear infinite;
  animation-play-state: running; /* Always spinning when visible */
}

/* Hover effect - vinyl slides out more when hovering over the player */
.music-player-panel:hover .deezer-vinyl-wrapper {
  transform: translateX(15px); /* Proportionally reduced hover effect for smaller size */
  transition: transform 0.4s ease-out;
}

.current-track {
  margin-bottom: 0;
  text-align: center;
  padding: 8px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.current-track.track-info-bottom {
  margin-top: 8px;
  width: 100%;
}

.track-name {
  color: white;
  font-size: 13px;
  font-weight: 500;
  margin-bottom: 4px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.track-status {
  color: rgba(255, 255, 255, 0.6);
  font-size: 11px;
}

.no-track {
  color: rgba(255, 255, 255, 0.5);
  font-size: 12px;
  text-align: center;
  margin-bottom: 16px;
  font-style: italic;
}

/* Responsive design - Aspect ratio based sizing */
@media (max-width: 768px) {
  .music-player-compact {
    bottom: 90px;
    left: 15px;
  }
  
  .music-button {
    width: 44px;
    height: 44px;
  }
  
  .music-player-panel {
    width: 180px; /* Proportionally reduced for mobile */
  }
  
  .album-sleeve {
    width: 110px; /* Proportionally reduced square on mobile */
    height: 110px;
  }
  
  .album-sleeve.youtube-player {
    margin-left: 12px; /* Proportional adjustment for mobile */
  }
  
  .vinyl-wrapper {
    width: 110px;
    height: 110px;
    margin-left: -35px;
  }

  .vinyl-wrapper.youtube-vinyl {
    margin-left: -45px; /* Proportional adjustment for mobile */
  }
  
  /* Adjust Deezer layout for mobile */
  .deezer-container {
    flex-direction: column;
    gap: 12px;
  }
  
  .deezer-vinyl-wrapper {
    width: 110px;
    height: 110px;
    margin-left: 0;
  }
  
  .album-cover-frame .embedded-player iframe {
    width: 110px;
    height: 110px;
  }
}

/* Aspect ratio responsive design - Square or tall screens */
@media (max-aspect-ratio: 1.4/1) {
  .music-player-panel {
    width: 200px; /* Reduced width for narrow screens */
  }
  
  .album-sleeve {
    width: 120px; /* Smaller for narrow screens */
    height: 120px;
  }
  
  .album-sleeve.youtube-player {
    margin-left: 15px; /* Proportional adjustment for narrow screens */
  }
  
  .vinyl-wrapper {
    width: 120px;
    height: 120px;
    margin-left: -40px;
  }

  .vinyl-wrapper.youtube-vinyl {
    margin-left: -55px; /* Proportional adjustment for narrow screens */
  }
  
  .deezer-vinyl-wrapper {
    width: 120px;
    height: 120px;
    margin-left: -40px;
  }

  .deezer-vinyl-wrapper.deezer-vinyl-enhanced {
    width: 120px;
    height: 120px;
    margin-left: -40px;
  }

  .default-state {
    width: 160px; /* Smaller default state for narrow screens */
    height: 140px;
  }
}

/* Wide screen optimization */
@media (min-aspect-ratio: 1.4/1) and (min-width: 1200px) {
  .music-player-panel {
    width: 280px; /* Larger on wide screens */
  }
  
  .album-sleeve {
    width: 160px; /* Slightly larger for wide screens */
    height: 160px;
  }
  
  .album-sleeve.youtube-player {
    margin-left: 25px; /* Proportional adjustment for wide screens */
  }
  
  .vinyl-wrapper {
    width: 160px;
    height: 160px;
    margin-left: -60px;
  }

  .vinyl-wrapper.youtube-vinyl {
    margin-left: -80px; /* Proportional adjustment for wide screens */
  }
  
  .deezer-vinyl-wrapper {
    width: 160px;
    height: 160px;
    margin-left: -60px;
  }

  .deezer-vinyl-wrapper.deezer-vinyl-enhanced {
    width: 160px;
    height: 160px;
    margin-left: -60px;
  }

  .default-state {
    width: 220px; /* Larger default state for wide screens */
    height: 180px;
  }
}

@media (max-width: 480px) {
  .music-player-compact {
    bottom: 85px;
    left: 10px;
  }
  
  .music-player-panel {
    width: 160px; /* Proportionally reduced for small screens */
  }
  
  .album-sleeve {
    width: 100px;
    height: 100px;
  }
  
  .album-sleeve.youtube-player {
    margin-left: 10px; /* Proportional adjustment for small screens */
  }
  
  .vinyl-wrapper {
    width: 100px;
    height: 100px;
    margin-left: -30px;
  }

  .vinyl-wrapper.youtube-vinyl {
    margin-left: -40px; /* Proportional adjustment for small screens */
  }
  
  .player-header {
    padding: 10px 12px;
  }
  
  .player-content {
    padding: 12px;
  }
  
  /* Mobile Deezer layout adjustments */
  .deezer-vinyl-wrapper {
    width: 100px;
    height: 100px;
  }
  
  .album-cover-frame .embedded-player iframe {
    width: 100px;
    height: 100px;
  }
}
</style>
