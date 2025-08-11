<template>
  <div class="music-player-compact">
    <!-- Music Button (kept, no toggle) -->
    <button 
      class="music-button"
      :class="{ playing: store.musicPlaying }"
      title="Musique"
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
    <div class="music-player-panel">
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
      <div v-else class="player-content">
        <!-- YouTube Player -->
        <div v-if="store.selectedMusicSource?.type === 'youtube'" class="vinyl-player">
          <div class="player-container">
            <div class="album-sleeve">
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
            
            <div :class="['vinyl-wrapper', { 'is-playing': isPlaying }]">
              <img 
                :class="['vinyl-record', { 'is-spinning': isPlaying }]" 
                src="/assets/icons/vinyle.png" 
                alt="Disque vinyle"
              />
            </div>
          </div>
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
          
          <!-- Custom Audio Controls -->
          <div class="audio-controls">
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
            <div class="deezer-vinyl-wrapper">
              <img 
                :class="['vinyl-record', 'deezer-vinyl', { 'is-spinning': isPlaying }]" 
                src="/assets/icons/vinyle.png" 
                alt="Disque vinyle"
              />
            </div>
          </div>
        </div>

        <!-- Track Info -->
        <div class="current-track">
          <div class="track-name">{{ store.currentTrack }}</div>
          <div class="track-status">{{ getTrackStatus() }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, watch } from 'vue'
import { useAppStore } from '../stores/appStore'

const store = useAppStore()
const isPlaying = ref(false)
const ytReady = ref(false)
const localVolume = ref(0.7)
const audioPlayer = ref(null)
let ytPlayer = null

function openMusicSettings() {
  store.setActiveTab('music')
  if (!store.sidebarOpen) store.toggleSidebar()
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

// Sizing functions - significantly reduced size as requested (divide by 2)
function getPlayerWidth() {
  if (store.selectedMusicSource.type === 'deezer') {
    return '140'  // Significantly reduced square format (280/2)
  } else if (store.selectedMusicSource.type === 'spotify') {
    return '200'  // Reduced from 300px for better proportions
  }
  return '140'  // Significantly reduced width for YouTube (280/2)
}

function getPlayerHeight() {
  if (store.selectedMusicSource.type === 'deezer') {
    return '140'  // Square format matching width (280/2)
  } else if (store.selectedMusicSource.type === 'spotify') {
    return '80'   // Reduced mini player height
  }
  return '140'  // Significantly reduced square format for YouTube (280/2)
}

// Status Functions
function getTrackStatus() {
  if (!store.selectedMusicSource) return ''
  
  if (isPlaying.value) {
    return 'Playing'
  } else {
    return 'Ready'
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

onMounted(() => {
  // Only load YouTube API if we have a YouTube source
  if (store.selectedMusicSource?.type === 'youtube') {
    loadYouTubeAPI()
  }
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
})
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

  .vinyl-wrapper {
    width: 120px;
    height: 120px;
    margin-left: -40px;
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
  width: 240px; /* Accommodate default state (200px) and smaller widgets (140px) */
  background: rgba(255, 255, 255, 0.06); /* very light white, almost transparent */
  backdrop-filter: blur(14px);
  border: 1px solid rgba(255, 255, 255, 0.25);
  border-radius: 12px;
  overflow: hidden;
  margin-top: 10px; /* sits under the button */
  pointer-events: auto;
  z-index: 40;
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
  margin-top: 12px;
  display: flex;
  flex-direction: column;
  gap: 8px;
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

/* Embedded player styles */
.embedded-player {
  border-radius: 8px;
  overflow: hidden;
  margin-bottom: 12px;
  display: flex;
  justify-content: center; /* Center the iframe */
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
  margin-bottom: 16px;
  text-align: center;
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

/* Responsive design */
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
  
  .vinyl-wrapper {
    width: 110px;
    height: 110px;
    margin-left: -35px;
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
  
  .vinyl-wrapper {
    width: 100px;
    height: 100px;
    margin-left: -30px;
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
