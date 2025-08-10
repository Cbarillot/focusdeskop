<template>
  <div class="deezer-widget">
    <div class="widget-header">
      <h4>Deezer Player</h4>
      <button @click="minimizePlayer" class="minimize-btn">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </button>
    </div>
    
    <div class="playlist-controls">
      <div class="current-playlist">
        <span class="playlist-name">{{ currentPlaylistName }}</span>
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
    
    <!-- Embedded Deezer Player Frame -->
    <div class="player-frame" v-show="showPlayer">
      <iframe
        :src="currentEmbedUrl"
        width="100%"
        height="300"
        frameborder="0"
        allowtransparency="true"
        allow="encrypted-media; clipboard-write"
        loading="lazy"
      ></iframe>
    </div>
    
    <!-- Playlist Quick Access -->
    <div class="playlist-selector">
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
import { ref, computed, watch } from 'vue'
import { useAppStore } from '../stores/appStore'

const emit = defineEmits(['close'])
const store = useAppStore()

const showPlayer = ref(true)
const currentPlaylistId = ref('warm-melancholia')

const playlists = ref([
  {
    id: 'warm-melancholia',
    name: 'Warm Melancholia',
    shortName: 'Melancholia',
    embedId: '30I4s94Syhp5iuS3T0NW9',
    deezerUrl: 'https://link.deezer.com/s/30I4s94Syhp5iuS3T0NW9'
  },
  {
    id: 'classical-music',
    name: 'Classical Music',
    shortName: 'Classical',
    embedId: '30I4sTHKDNbVCXriMGGJY',
    deezerUrl: 'https://link.deezer.com/s/30I4sTHKDNbVCXriMGGJY'
  },
  {
    id: 'dance-music',
    name: 'Dance Music',
    shortName: 'Dance',
    embedId: '30I4tfQt1D3eTJ7FZKjpn',
    deezerUrl: 'https://link.deezer.com/s/30I4tfQt1D3eTJ7FZKjpn'
  },
  {
    id: 'coup-de-coeur',
    name: 'Coup de Coeur',
    shortName: 'Coup de Coeur',
    embedId: '30HLLIhq7W7gERuNFubDG',
    deezerUrl: 'https://link.deezer.com/s/30HLLIhq7W7gERuNFubDG'
  }
])

const currentPlaylist = computed(() => {
  return playlists.value.find(p => p.id === currentPlaylistId.value) || playlists.value[0]
})

const currentPlaylistName = computed(() => {
  return currentPlaylist.value.name
})

const currentEmbedUrl = computed(() => {
  // Try using Deezer's embed URL format
  return `https://widget.deezer.com/widget/dark/playlist/${currentPlaylist.value.embedId}?layout=dark&autoplay=false&tracklist=false&cover=true`
})

const isPlaying = computed(() => {
  return store.musicPlaying && store.currentTrack === currentPlaylist.value.name
})

function selectPlaylist(playlist) {
  currentPlaylistId.value = playlist.id
  store.setMusicUrl(playlist.deezerUrl)
  store.currentTrack = playlist.name
}

function togglePlayback() {
  if (isPlaying.value) {
    store.stopMusic()
  } else {
    store.playDeezerPlaylist(currentPlaylist.value.id)
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

// Update store when playlist changes
watch(currentPlaylistId, (newId) => {
  const playlist = playlists.value.find(p => p.id === newId)
  if (playlist) {
    store.setMusicUrl(playlist.deezerUrl)
    store.currentTrack = playlist.name
  }
})
</script>

<style scoped>
.deezer-widget {
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

.player-frame iframe {
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
</style>