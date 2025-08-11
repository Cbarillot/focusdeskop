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
      <div class="player-content" @dblclick="openMusicSettings" title="Double-cliquez pour ouvrir les réglages musique">
        <div class="vinyl-player">
          <div class="player-container">
            <div class="album-sleeve">
              <div class="sleeve-inner">
                <div v-if="ytReady" id="youtube-player"></div>
                <iframe 
                  v-else 
                  class="yt-fallback" 
                  width="100%" height="100%" 
                  src="https://www.youtube.com/embed/jfKfPfyJRdk?playsinline=1&controls=1&loop=1&playlist=jfKfPfyJRdk" 
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

        <!-- Quick Playlists (kept minimal to avoid overlays) -->
        <div v-if="store.youtubePlaylists?.length" class="quick-playlists">
          <div class="playlist-title">Accès rapide</div>
          <div class="playlist-buttons">
            <button 
              v-for="playlist in store.youtubePlaylists.slice(0, 2)"
              :key="playlist.id"
              class="playlist-btn"
              @click="store.playYouTubePlaylist(playlist.id)"
            >
              {{ playlist.shortName || playlist.title?.substring(0, 8) + '...' }}
            </button>
          </div>
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
let ytPlayer = null

function openMusicSettings() {
  store.setActiveTab('music')
  if (!store.sidebarOpen) store.toggleSidebar()
}

function createYouTubePlayer() {
  if (!window.YT || !window.YT.Player) return
  if (ytPlayer) return
  
  ytPlayer = new window.YT.Player('youtube-player', {
    height: '100%',
    width: '100%',
    videoId: getCurrentYouTubeId() || 'jfKfPfyJRdk',
    playerVars: { 
      playsinline: 1, 
      controls: 1, 
      loop: 1, 
      playlist: 'jfKfPfyJRdk',
      enablejsapi: 1,
      origin: window.location.origin
    },
    events: {
      onReady: () => {
        console.log('YouTube Player Ready')
        // Expose the player globally for other components to use
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

// Always load the API on mount (player is always visible)
onMounted(() => {
  loadYouTubeAPI()
})

onBeforeUnmount(() => {
  try { ytPlayer && ytPlayer.destroy && ytPlayer.destroy() } catch {}
  ytPlayer = null
})

// --- Bind to store.musicUrl so a pasted YouTube URL loads immediately ---
function getCurrentYouTubeId() {
  const url = store.musicUrl || ''
  // Prefer store.extractYouTubeId if available
  try {
    if (store.extractYouTubeId) {
      return store.extractYouTubeId(url)
    }
  } catch {}
  // Fallback regex
  const m = url.match(/(?:v=|youtu\.be\/|embed\/)([A-Za-z0-9_-]{11})/)
  return m ? m[1] : ''
}

watch(() => store.musicUrl, (newUrl) => {
  if (!newUrl || !ytPlayer || !window.YT) return
  const id = getCurrentYouTubeId()
  if (id) {
    try {
      if (typeof ytPlayer.loadVideoById === 'function') {
        ytPlayer.loadVideoById(id)
      } else if (typeof ytPlayer.cueVideoById === 'function') {
        ytPlayer.cueVideoById(id)
      }
    } catch {}
  }
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

  .music-player-panel .player-content {
    padding: 8px;
  }

  .vinyl-player .player-container {
    transform: scale(0.95);
    transform-origin: top left;
  }
}

.music-player-panel {
  width: 280px;
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
  width: 120px;
  aspect-ratio: 1 / 1;
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
  width: 120px;
  aspect-ratio: 1 / 1;
  transition: transform 0.4s ease-out;
  margin-left: -70px; /* deeper under sleeve */
  position: relative;
  z-index: 1; /* behind sleeve */
  pointer-events: none; /* avoid blocking interactions */
}

.music-player-panel:hover .vinyl-wrapper:not(.is-playing) {
  transform: translateX(30px);
}

.vinyl-record {
  width: 100%;
  height: 100%;
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

.music-controls {
  display: flex;
  gap: 8px;
  margin-bottom: 16px;
  justify-content: center;
}

.control-btn {
  width: 36px;
  height: 36px;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  color: rgba(255, 255, 255, 0.8);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.control-btn:hover:not(:disabled) {
  background: rgba(255, 255, 255, 0.2);
  color: white;
  transform: scale(1.05);
}

.control-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.settings-btn:hover:not(:disabled) {
  background: rgba(0, 191, 165, 0.3);
  border-color: rgba(0, 191, 165, 0.5);
}

.quick-playlists {
  border-top: 1px solid rgba(255, 255, 255, 0.25);
  padding-top: 12px;
}

.playlist-title {
  color: rgba(255, 255, 255, 0.7);
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 8px;
  text-align: center;
}

.playlist-buttons {
  display: flex;
  gap: 6px;
  justify-content: center;
}

.playlist-btn {
  padding: 4px 8px;
  border-radius: 6px;
  background: rgba(255, 255, 255, 0.1);
  color: rgba(255, 255, 255, 0.7);
  font-size: 10px;
  font-weight: 500;
  cursor: pointer;
  border: none;
  transition: all 0.2s ease;
  max-width: 60px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.playlist-btn:hover {
  background: rgba(255, 255, 255, 0.2);
  color: white;
  transform: scale(1.05);
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
    width: 260px;
  }
}

@media (max-width: 480px) {
  .music-player-compact {
    bottom: 85px;
    left: 10px;
  }
  
  .music-player-panel {
    width: 240px;
  }
  
  .player-header {
    padding: 10px 12px;
  }
  
  .player-content {
    padding: 12px;
  }
}
</style>
