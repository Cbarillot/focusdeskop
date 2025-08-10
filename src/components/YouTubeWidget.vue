<template>
  <div class="youtube-widget" :class="{ 'embedded-mode': embedded }">
    <div class="widget-header" v-if="!embedded">
      <h4>Music Player</h4>
      <button @click="minimizePlayer" class="minimize-btn">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </button>
    </div>
    
    <div class="playlist-controls">
      <div class="current-playlist">
        <span class="playlist-name" :class="{ 'compact': embedded }">{{ currentPlaylistName }}</span>
        <div class="control-buttons">
          <button @click="previousPlaylist" class="control-btn">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <polygon points="19,20 9,12 19,4" stroke="currentColor" stroke-width="2" fill="currentColor"/>
              <line x1="5" y1="19" x2="5" y2="5" stroke="currentColor" stroke-width="2"/>
            </svg>
          </button>
          
          <button @click="togglePlayback" class="control-btn primary">
            <svg v-if="!isPlaying" width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <polygon points="5,3 19,12 5,21" fill="currentColor"/>
            </svg>
            <svg v-else width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="6" y="4" width="4" height="16" fill="currentColor"/>
              <rect x="14" y="4" width="4" height="16" fill="currentColor"/>
            </svg>
          </button>
          
          <button @click="nextPlaylist" class="control-btn">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <polygon points="5,4 15,12 5,20" stroke="currentColor" stroke-width="2" fill="currentColor"/>
              <line x1="19" y1="5" x2="19" y2="19" stroke="currentColor" stroke-width="2"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
    
    <!-- Embedded YouTube Player -->
    <div class="player-frame" v-show="showPlayer && currentPlaylist" :class="{ 'compact-player': embedded }">
      <div id="youtube-player-container" class="youtube-container">
        <div ref="youtubePlayer" :id="`youtube-player-${widgetId}`"></div>
      </div>
    </div>
    
    <!-- Playlist Quick Access -->
    <div class="playlist-selector" v-if="!embedded">
      <button 
        v-for="playlist in playlists" 
        :key="playlist.id"
        @click="selectPlaylist(playlist)"
        :class="{ active: currentPlaylistId === playlist.id }"
        class="playlist-btn"
      >
        {{ playlist.shortName }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue'
import { useAppStore } from '../stores/appStore'

const props = defineProps({
  embedded: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['close'])
const store = useAppStore()

const widgetId = ref(Math.random().toString(36).substring(2, 9))
const showPlayer = ref(true)
const currentPlaylistId = ref('lofi-study')
const youtubePlayer = ref(null)
let player = null
let playerReady = false

// Curated YouTube playlists for focus/productivity
const playlists = ref([
  {
    id: 'lofi-study',
    name: 'Lo-Fi Study Music',
    shortName: 'Lo-Fi',
    videoId: 'jfKfPfyJRdk', // Popular lo-fi hip hop playlist
    playlistId: 'PLOHoVaTp8R7dVwdwCNHBGqm42LGqdJ6jF'
  },
  {
    id: 'classical-focus', 
    name: 'Classical Focus',
    shortName: 'Classical',
    videoId: '6p0DAz_30qQ', // Classical music for studying
    playlistId: 'PLcTXJLJDvKS32JMrYJGW5_VBPb6w1CEHX'
  },
  {
    id: 'ambient-chill',
    name: 'Ambient Chill',
    shortName: 'Ambient',
    videoId: '5qap5aO4i9A', // Ambient music
    playlistId: 'PLcTXJLJDvKS0Vy9XXXRqzPGHp8LvA-kEG'
  },
  {
    id: 'nature-sounds',
    name: 'Nature Sounds',
    shortName: 'Nature',
    videoId: 'eKFTSSKCzWA', // Nature sounds for focus
    playlistId: 'PLcTXJLJDvKS3B4ZmN4MXLKNY8hVUGI0Xm'
  }
])

const currentPlaylist = computed(() => {
  return playlists.value.find(p => p.id === currentPlaylistId.value) || playlists.value[0]
})

const currentPlaylistName = computed(() => {
  return currentPlaylist.value.name
})

const isPlaying = computed(() => {
  return store.musicPlaying && store.currentTrack === currentPlaylist.value.name
})

// Load YouTube IFrame API
function loadYouTubeAPI() {
  return new Promise((resolve) => {
    if (window.YT && window.YT.Player) {
      resolve()
      return
    }
    
    if (window.onYouTubeIframeAPIReady) {
      // API is loading, wait for it
      const originalCallback = window.onYouTubeIframeAPIReady
      window.onYouTubeIframeAPIReady = function() {
        originalCallback()
        resolve()
      }
      return
    }
    
    // Load the API
    window.onYouTubeIframeAPIReady = function() {
      resolve()
    }
    
    const tag = document.createElement('script')
    tag.src = 'https://www.youtube.com/iframe_api'
    const firstScriptTag = document.getElementsByTagName('script')[0]
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag)
  })
}

// Initialize YouTube player
async function initializePlayer() {
  try {
    await loadYouTubeAPI()
    await nextTick()
    
    if (!youtubePlayer.value) return
    
    player = new window.YT.Player(`youtube-player-${widgetId.value}`, {
      height: '200',
      width: '100%',
      videoId: currentPlaylist.value.videoId,
      playerVars: {
        autoplay: 0,
        controls: 1,
        modestbranding: 1,
        rel: 0,
        showinfo: 0,
        loop: 1,
        playlist: currentPlaylist.value.videoId
      },
      events: {
        onReady: onPlayerReady,
        onStateChange: onPlayerStateChange
      }
    })
  } catch (error) {
    console.error('Error initializing YouTube player:', error)
  }
}

function onPlayerReady() {
  playerReady = true
  console.log('YouTube player ready')
}

function onPlayerStateChange(event) {
  const isCurrentlyPlaying = event.data === window.YT.PlayerState.PLAYING
  store.musicPlaying = isCurrentlyPlaying
  
  if (isCurrentlyPlaying) {
    store.currentTrack = currentPlaylist.value.name
  }
}

function selectPlaylist(playlist) {
  currentPlaylistId.value = playlist.id
  store.setMusicUrl(`https://www.youtube.com/watch?v=${playlist.videoId}`)
  store.currentTrack = playlist.name
  
  if (player && playerReady) {
    player.loadVideoById(playlist.videoId)
  }
}

function togglePlayback() {
  if (!player || !playerReady) return
  
  if (isPlaying.value) {
    player.pauseVideo()
    store.stopMusic()
  } else {
    player.playVideo()
    store.musicPlaying = true
    store.currentTrack = currentPlaylist.value.name
  }
}

function nextPlaylist() {
  const currentIndex = playlists.value.findIndex(p => p.id === currentPlaylistId.value)
  const nextIndex = (currentIndex + 1) % playlists.value.length
  selectPlaylist(playlists.value[nextIndex])
}

function previousPlaylist() {
  const currentIndex = playlists.value.findIndex(p => p.id === currentPlaylistId.value)
  const prevIndex = (currentIndex - 1 + playlists.value.length) % playlists.value.length
  selectPlaylist(playlists.value[prevIndex])
}

function minimizePlayer() {
  emit('close')
}

onMounted(async () => {
  await initializePlayer()
  // Set initial playlist
  store.setMusicUrl(`https://www.youtube.com/watch?v=${currentPlaylist.value.videoId}`)
  store.currentTrack = currentPlaylist.value.name
})

onUnmounted(() => {
  if (player) {
    player.destroy()
  }
})
</script>

<style scoped>
.youtube-widget {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 12px;
  padding: 16px;
  max-width: 320px;
  color: rgba(255, 255, 255, 0.9);
}

.widget-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.widget-header h4 {
  margin: 0;
  font-size: 14px;
  font-weight: 600;
}

.minimize-btn {
  width: 24px;
  height: 24px;
  border: none;
  background: transparent;
  color: rgba(255, 255, 255, 0.7);
  cursor: pointer;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.minimize-btn:hover {
  background: rgba(255, 255, 255, 0.1);
  color: rgba(255, 255, 255, 0.9);
}

.playlist-controls {
  margin-bottom: 16px;
}

.current-playlist {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.playlist-name {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.8);
  flex: 1;
}

.control-buttons {
  display: flex;
  gap: 8px;
}

.control-btn {
  width: 32px;
  height: 32px;
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 6px;
  background: rgba(255, 255, 255, 0.1);
  color: rgba(255, 255, 255, 0.8);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.control-btn:hover {
  background: rgba(255, 255, 255, 0.2);
  color: rgba(255, 255, 255, 1);
}

.control-btn.primary {
  background: rgba(255, 255, 255, 0.2);
  color: rgba(255, 255, 255, 1);
}

.control-btn.primary:hover {
  background: rgba(255, 255, 255, 0.3);
}

.player-frame {
  margin-bottom: 16px;
  border-radius: 8px;
  overflow: hidden;
  background: rgba(0, 0, 0, 0.3);
}

.youtube-container {
  position: relative;
  width: 100%;
  height: 200px;
}

.youtube-container iframe {
  width: 100%;
  height: 100%;
  border: none;
  border-radius: 8px;
}

.playlist-selector {
  display: flex;
  gap: 4px;
  flex-wrap: wrap;
}

.playlist-btn {
  padding: 6px 10px;
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.1);
  color: rgba(255, 255, 255, 0.8);
  font-size: 10px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.playlist-btn:hover {
  background: rgba(255, 255, 255, 0.2);
  color: rgba(255, 255, 255, 1);
}

.playlist-btn.active {
  background: rgba(255, 255, 255, 0.3);
  color: rgba(255, 255, 255, 1);
  border-color: rgba(255, 255, 255, 0.5);
}

/* Embedded mode styles */
.youtube-widget.embedded-mode {
  background: transparent;
  border: none;
  padding: 8px;
  max-width: 280px;
}

.youtube-widget.embedded-mode .playlist-name.compact {
  font-size: 12px;
  font-weight: 500;
}

.youtube-widget.embedded-mode .control-buttons {
  gap: 4px;
}

.youtube-widget.embedded-mode .control-btn {
  width: 28px;
  height: 28px;
}

.youtube-widget.embedded-mode .player-frame.compact-player {
  margin-bottom: 8px;
}

.youtube-widget.embedded-mode .youtube-container {
  height: 120px;
}
</style>