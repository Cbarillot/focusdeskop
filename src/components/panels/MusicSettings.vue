<template>
  <div class="music-settings">
    <!-- En-tête avec titre -->
    <div class="section">
      <h2 class="section-title">Music & Sounds</h2>
      <p class="section-description">Gérez votre musique et vos sons d'ambiance</p>
    </div>

    <!-- Composant de musique universel -->
    <div class="section">
      <UniversalMusic />
    </div>

    <!-- Section des playlists -->
    <div class="section">
      <h3 class="section-subtitle">Playlists populaires</h3>
      
      <!-- Playlists YouTube -->
      <div class="playlist-section">
        <h4>YouTube</h4>
        <div class="playlist-grid">
          <div 
            v-for="playlist in youtubePresets"
            :key="'yt-' + playlist.id"
            class="playlist-card"
            @click="loadPreset(playlist.id)"
          >
            <div class="playlist-cover">
              <img 
                :src="`https://img.youtube.com/vi/${playlist.id}/mqdefault.jpg`" 
                :alt="playlist.title"
                class="playlist-thumbnail"
                loading="lazy"
                @error="handleImageError"
              >
              <div class="playlist-overlay">
                <div class="play-icon">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" fill="rgba(255,0,0,0.8)"/>
                    <path d="M10 16.5L16 12 10 7.5v9z" fill="white"/>
                  </svg>
                </div>
              </div>
              <div class="playlist-info">
                <h5 class="playlist-name">{{ playlist.title }}</h5>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Playlists Deezer -->
      <div class="playlist-section">
        <h4>Deezer</h4>
        <div class="playlist-grid">
          <div 
            v-for="playlist in deezerPlaylists"
            :key="'dz-' + playlist.id"
            class="playlist-card"
            @click="openDeezerPlaylist(playlist.url)"
          >
            <div class="playlist-cover deezer">
              <div class="playlist-image">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" fill="#FF6600"/>
                  <path d="M8 5V19L19 12L8 5Z" fill="white"/>
                </svg>
              </div>
              <div class="playlist-info">
                <h5 class="playlist-name">{{ playlist.name }}</h5>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- YouTube Music (Legacy Support) -->
    <div class="section">
      <h3 class="section-title">YouTube Music</h3>
      
      <div class="youtube-section">
        <div class="input-group">
          <input 
            v-model="youtubeUrl"
            type="text"
            placeholder="Enter YouTube URL or search term"
            class="youtube-input"
            @keyup.enter="loadYouTube"
          />
          <button @click="loadYouTube" class="load-btn">Load</button>
        </div>
        
        <div v-if="currentVideoId" class="youtube-player">
          <iframe 
            :src="`https://www.youtube.com/embed/${currentVideoId}?enablejsapi=1&autoplay=1&loop=1&playlist=${currentVideoId}`"
            frameborder="0"
            allowfullscreen
            allow="autoplay; encrypted-media"
            class="youtube-iframe"
          ></iframe>
        </div>
        
        <div class="youtube-presets">
          <h4 class="presets-title">Popular Focus Music</h4>
          <div class="preset-grid">
            <button 
              v-for="preset in youtubePresets"
              :key="preset.id"
              class="preset-btn"
              @click="loadPreset(preset.id)"
            >
              {{ preset.title }}
            </button>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Local Music -->
    <div class="section">
      <h3 class="section-title">Local Music</h3>
      
      <div class="local-music-section">
        <input 
          type="file"
          ref="fileInput"
          accept="audio/*"
          @change="loadLocalMusic"
          style="display: none"
        />
        
        <button @click="$refs.fileInput.click()" class="file-btn">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M21 15V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V15" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M17 8L12 3L7 8" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M12 3V15" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          Upload Audio File
        </button>
        
        <audio 
          v-if="localAudioSrc"
          :src="localAudioSrc"
          controls
          class="audio-player"
        ></audio>
      </div>
    </div>
    
    <!-- Music Settings -->
    <div class="section">
      <h3 class="section-title">Music Settings</h3>
      
      <div class="settings-group">
        <label class="toggle-label">
          <input type="checkbox" class="toggle-input" />
          <span class="toggle-slider"></span>
          <span>Auto-play music when timer starts</span>
        </label>
        
        <label class="toggle-label">
          <input type="checkbox" class="toggle-input" />
          <span class="toggle-slider"></span>
          <span>Fade out music during breaks</span>
        </label>
        
        <label class="toggle-label">
          <input type="checkbox" class="toggle-input" />
          <span class="toggle-slider"></span>
          <span>Loop current track</span>
        </label>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, computed, h } from 'vue'
import { useAppStore } from '../../stores/appStore'

// Composants SVG en ligne avec rendu de fonction
const PlayIcon = {
  render() {
    return h('svg', { 
      width: '24', 
      height: '24', 
      viewBox: '0 0 24 24', 
      fill: 'currentColor',
      xmlns: 'http://www.w3.org/2000/svg'
    }, [
      h('path', { d: 'M8 5V19L19 12L8 5Z' })
    ])
  }
}

const PauseIcon = {
  render() {
    return h('svg', { 
      width: '24', 
      height: '24', 
      viewBox: '0 0 24 24', 
      fill: 'currentColor',
      xmlns: 'http://www.w3.org/2000/svg'
    }, [
      h('rect', { x: '6', y: '5', width: '4', height: '14' }),
      h('rect', { x: '14', y: '5', width: '4', height: '14' })
    ])
  }
}

// Log de débogage
console.log('MusicSettings component - Script setup')

onMounted(() => {
  console.log('MusicSettings component - Mounted')
  console.log('Current activeTab:', store.activeTab)
  console.log('Current musicUrl:', store.musicUrl)
})
import UniversalMusic from '../UniversalMusic.vue'

const store = useAppStore()

// Deezer playlists with direct links
const deezerPlaylists = ref([
  {
    id: 1,
    title: 'Warm Melancholia',
    description: 'Atmospheric and emotional tracks',
    url: 'https://link.deezer.com/s/30I4s94Syhp5iuS3T0NW9'
  },
  {
    id: 2,
    title: 'Classical Music',
    description: 'Timeless classical compositions',
    url: 'https://link.deezer.com/s/30I4sTHKDNbVCXriMGGJY'
  },
  {
    id: 3,
    title: 'Dance Music',
    description: 'Energetic beats for focus',
    url: 'https://link.deezer.com/s/30I4tfQt1D3eTJ7FZKjpn'
  },
  {
    id: 4,
    title: 'Coup de Coeur',
    description: 'Handpicked favorites',
    url: 'https://link.deezer.com/s/30HLLIhq7W7gERuNFubDG'
  }
])

// YouTube integration
const youtubeUrl = ref('')
const currentVideoId = ref('')
const localAudioSrc = ref('')

// Watch for changes in music URL from store
watch(() => store.musicUrl, (newUrl) => {
  if (newUrl && newUrl.includes('youtube.com') || newUrl.includes('youtu.be')) {
    const videoId = extractYouTubeId(newUrl)
    if (videoId) {
      currentVideoId.value = videoId
      youtubeUrl.value = newUrl
    }
  }
}, { immediate: true })

const youtubePresets = [
  { id: 'zhDwjnYZiCo', title: 'Lofi Study', url: 'https://www.youtube.com/live/zhDwjnYZiCo?si=ZuFZCpaBymXSSoQG' },
  { id: 'Rik8YhvH09M', title: 'Home Cosy Ambiance', url: 'https://youtu.be/Rik8YhvH09M?si=1ZLAf8IbMfZ4Zlh3' },
  { id: 'kfZyQ4K2vcw', title: 'Forest Witch Ambiance', url: 'https://youtu.be/kfZyQ4K2vcw?si=_8pTMJePBKbLMmkU' },
  { id: '0L38Z9hIi5s', title: 'Coffee Piano Ambiance', url: 'https://youtu.be/0L38Z9hIi5s?si=l48HxC1vUNXa4rFG' },
  { id: 'PMMGwSJsHfU', title: 'Medieval Village', url: 'https://youtu.be/PMMGwSJsHfU?si=egnG7zejirdD1Zk8' },
  { id: 'XFGgeltLaks', title: 'Hogwarts Music', url: 'https://youtu.be/XFGgeltLaks?si=QvQEv9OV1owmTpnt' }
]

const handleImageError = (event) => {
  // Remplacer par une image par défaut en cas d'erreur
  event.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIwIiBoZWlnaHQ9IjE4MCIgdmlld0JveD0iMCAwIDMyMCAxODAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjMyMCIgaGVpZ2h0PSIxODAiIGZpbGw9IiMyMTIxMjEiLz48dGV4dCB4PSI1MCUiIHk9IjUwJSIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjE0IiBmaWxsPSJ3aGl0ZSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZG9taW5hbnQtYmFzZWxpbmU9Im1pZGRsZSI+SW1hZ2Ugbm90IGZvdW5kPC90ZXh0Pjwvc3ZnPg=='
}

function loadYouTube() {
  if (youtubeUrl.value) {
    // Extraire l'ID de la vidéo ou utiliser comme terme de recherche
    const videoId = extractYouTubeId(youtubeUrl.value)
    if (videoId) {
      // Mettre à jour le store avec la nouvelle URL YouTube
      store.setMusicUrl(`https://www.youtube.com/watch?v=${videoId}`)
      currentVideoId.value = videoId
      store.currentTrack = youtubeUrl.value
      store.musicPlaying = true
    } else {
      // Par simplicité, utiliser le premier préréglage si l'URL n'est pas valide
      currentVideoId.value = youtubePresets[0].id
    }
  }
}

function extractYouTubeId(url) {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/
  const match = url.match(regExp)
  return (match && match[2].length === 11) ? match[2] : null
}

function loadPreset(videoId) {
  const preset = youtubePresets.find(p => p.id === videoId)
  if (preset) {
    // Create the source object for the new workflow
    const source = {
      type: 'youtube',
      url: preset.url,
      title: preset.title,
      platform: 'youtube'
    }
    
    // Send to the front page player via the store
    store.playSelectedMusic(source)
    
    // Close the sidebar
    if (store.sidebarOpen) {
      store.toggleSidebar()
    }
  }
}

function togglePlayback(event) {
  event.stopPropagation() // Empêcher le déclenchement du clic sur la carte
  
  if (!window.ytPlayer) return
  
  if (store.musicPlaying) {
    window.ytPlayer.pauseVideo()
  } else {
    // Si aucune vidéo n'est chargée, charger la première de la liste
    if (!currentVideoId.value && youtubePresets.length > 0) {
      loadPreset(youtubePresets[0].id)
    } else if (currentVideoId.value) {
      window.ytPlayer.playVideo()
    }
  }
}

function loadLocalMusic(event) {
  const file = event.target.files[0]
  if (file) {
    const fileUrl = URL.createObjectURL(file)
    
    // Create the source object for the new workflow
    const source = {
      type: 'local',
      url: fileUrl,
      title: file.name,
      name: file.name,
      platform: 'local'
    }
    
    // Send to the front page player via the store
    store.playSelectedMusic(source)
    
    // Close the sidebar
    if (store.sidebarOpen) {
      store.toggleSidebar()
    }
  }
}

// Fonctions pour Deezer
function openDeezerPlaylist(url) {
  // Find the playlist details for a better title
  const playlist = store.deezerPlaylists.find(p => p.url === url)
  
  // Create the source object for the new workflow
  const source = {
    type: 'deezer',
    url: url,
    title: playlist?.name || 'Deezer Playlist',
    platform: 'deezer'
  }
  
  // Send to the front page player via the store
  store.playSelectedMusic(source)
  
  // Close the sidebar  
  if (store.sidebarOpen) {
    store.toggleSidebar()
  }
}
</script>

<style scoped>
.music-settings {
  color: var(--color-text-primary);
  padding: 1.5rem;
  height: 100%;
  overflow-y: auto;
}

.section {
  margin-bottom: 2rem;
  background: rgba(255, 255, 255, 0.03);
  border-radius: 12px;
  padding: 1.5rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

.section-title {
  margin: 0 0 16px 0;
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--color-text-primary);
  text-align: center;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.section-subtitle {
  margin: 24px 0 16px 0;
  font-size: 1rem;
  font-weight: 600;
  text-align: center;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--color-text-primary);
  display: flex;
  align-items: center;
  gap: 8px;
}

.section-title svg,
.section-subtitle svg {
  width: 20px;
  height: 20px;
}

.playlist-section {
  margin-bottom: 2rem;
}

.playlist-section h4 {
  margin: 0 0 12px 0;
  font-size: 0.9rem;
  font-weight: 500;
  color: var(--color-text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.playlist-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
  gap: 16px;
  margin-bottom: 16px;
}

.playlist-card {
  border-radius: 12px;
  overflow: hidden;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.08);
  transition: all 0.2s ease;
  cursor: pointer;
}

.playlist-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);
  border-color: rgba(255, 255, 255, 0.15);
}

.playlist-cover {
  position: relative;
  aspect-ratio: 16/9;
  overflow: hidden;
  background: rgba(0, 0, 0, 0.1);
}

.playlist-thumbnail {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  transition: transform 0.3s ease;
}

.playlist-card:hover .playlist-thumbnail {
  transform: scale(1.05);
}

.playlist-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.4);
  opacity: 0;
  transition: opacity 0.2s ease;
}

.playlist-card:hover .playlist-overlay {
  opacity: 1;
}

.play-icon {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 0, 0, 0.9);
  transition: all 0.2s ease;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.play-icon:hover {
  transform: scale(1.1);
  background: #ff0000;
}

.playlist-info {
  padding: 12px;
  background: rgba(0, 0, 0, 0.2);
}

.playlist-name {
  margin: 0;
  font-size: 0.9rem;
  font-weight: 500;
  color: var(--color-text-primary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.playlist-description {
  margin: 4px 0 0 0;
  font-size: 0.75rem;
  color: var(--color-text-secondary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* Styles pour les playlists Deezer */
.playlist-cover.deezer {
  background: linear-gradient(135deg, #ff6600, #ff8533);
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 120px;
}

.playlist-cover.deezer .playlist-image {
  text-align: center;
  padding: 20px;
}

.playlist-cover.deezer .playlist-image svg {
  width: 48px;
  height: 48px;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2));
}

/* Styles pour la section YouTube */
.youtube-section {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.input-group {
  display: flex;
  gap: 8px;
  margin-bottom: 12px;
}

.youtube-input {
  flex: 1;
  padding: 12px 16px;
  border-radius: 8px;
  border: 1px solid var(--color-border);
  background: rgba(255, 255, 255, 0.05);
  color: var(--color-text-primary);
  font-size: 14px;
  transition: all 0.2s ease;
}

.youtube-input:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 2px rgba(var(--color-primary-rgb), 0.2);
}

.youtube-input::placeholder {
  color: var(--color-text-muted);
}

.load-btn {
  padding: 0 20px;
  border-radius: 8px;
  background: var(--color-primary);
  color: white;
  border: none;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.load-btn:hover {
  background: var(--color-primary-dark);
  transform: translateY(-1px);
}

.load-btn:active {
  transform: translateY(0);
}

.youtube-player {
  position: relative;
  width: 100%;
  padding-bottom: 56.25%; /* 16:9 Aspect Ratio */
  border-radius: 12px;
  overflow: hidden;
  background: #000;
  margin-bottom: 20px;
}

.youtube-iframe {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border: none;
}

/* Styles pour les boutons de préréglages */
.presets-title {
  margin: 0 0 12px 0;
  font-size: 0.9rem;
  font-weight: 500;
  color: var(--color-text-secondary);
}

.preset-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 10px;
  margin-bottom: 16px;
}

.preset-btn {
  padding: 8px 12px;
  border-radius: 6px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid var(--color-border);
  color: var(--color-text-secondary);
  font-size: 0.8rem;
  text-align: center;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.preset-btn:hover {
  background: rgba(255, 255, 255, 0.1);
  color: var(--color-text-primary);
  border-color: var(--color-primary);
}

/* Styles pour la section de musique locale */
.local-music-section {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.file-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 14px 20px;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.05);
  border: 2px dashed var(--color-border);
  color: var(--color-text-secondary);
  font-size: 0.9rem;
  font-weight: 500;
  transition: all 0.2s ease;
  cursor: pointer;
}

.file-btn:hover {
  background: rgba(255, 255, 255, 0.1);
  border-color: var(--color-primary);
  color: var(--color-text-primary);
}

.file-btn svg {
  width: 18px;
  height: 18px;
}

.audio-player {
  width: 100%;
  height: 40px;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid var(--color-border);
}

/* Styles pour les paramètres */
.settings-group {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 8px 0;
}

.toggle-label {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  font-size: 0.9rem;
  color: var(--color-text-secondary);
  cursor: pointer;
  padding: 8px 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  transition: all 0.2s ease;
}

.toggle-label:last-child {
  border-bottom: none;
}

.toggle-label:hover {
  color: var(--color-text-primary);
}

.toggle-input {
  display: none;
}

.toggle-slider {
  position: relative;
  width: 44px;
  height: 24px;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid var(--color-border);
  transition: all 0.3s ease;
  cursor: pointer;
  flex-shrink: 0;
}

.toggle-slider::before {
  content: '';
  position: absolute;
  top: 2px;
  left: 2px;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: var(--color-text-secondary);
  transition: all 0.3s ease;
}

.toggle-input:checked + .toggle-slider {
  background: var(--color-primary);
  border-color: var(--color-primary);
}

.toggle-input:checked + .toggle-slider::before {
  transform: translateX(20px);
  background: white;
}

/* Styles responsifs */
@media (max-width: 768px) {
  .playlist-grid {
    grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  }
  
  .preset-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 480px) {
  .music-settings {
    padding: 1rem;
  }
  
  .section {
    padding: 1rem;
  }
  
  .playlist-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
  }
  
  .preset-grid {
    grid-template-columns: 1fr;
  }
  
  .input-group {
    flex-direction: column;
  }
  
  .load-btn {
    width: 100%;
    padding: 12px;
  }
}

/* Animation de chargement pour les miniatures */
@keyframes shimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}

.loading-thumbnail {
  background: linear-gradient(90deg, rgba(255,255,255,0.1) 25%, rgba(255,255,255,0.2) 50%, rgba(255,255,255,0.1) 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
  border-radius: 4px;
}

/* Amélioration de l'accessibilité */
button:focus-visible,
input:focus-visible,
.preset-btn:focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
}

/* Style pour les messages d'erreur */
.error-message {
  color: #ff6b6b;
  font-size: 0.85rem;
  margin-top: 8px;
  display: flex;
  align-items: center;
  gap: 6px;
}

.error-message svg {
  width: 16px;
  height: 16px;
  flex-shrink: 0;
}

.youtube-section {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.input-group {
  display: flex;
  gap: 8px;
}

.youtube-input {
  flex: 1;
  padding: 12px 16px;
  border-radius: var(--border-radius-sm);
  border: 1px solid var(--color-border);
  background: rgba(255, 255, 255, 0.05);
  color: var(--color-text-primary);
  font-size: 14px;
}

.youtube-input:focus {
  border-color: var(--color-primary);
  background: rgba(255, 255, 255, 0.1);
}

.youtube-input::placeholder {
  color: var(--color-text-muted);
}

.load-btn {
  padding: 12px 20px;
  border-radius: var(--border-radius-sm);
  background: var(--color-primary);
  color: var(--color-text-primary);
  font-size: 14px;
  font-weight: 500;
  transition: all var(--transition-fast);
}

.load-btn:hover {
  background: var(--color-primary-dark);
}

.youtube-player {
  width: 100%;
  aspect-ratio: 16/9;
  border-radius: var(--border-radius-md);
  overflow: hidden;
  background: rgba(255, 255, 255, 0.05);
}

.youtube-iframe {
  width: 100%;
  height: 100%;
}

.youtube-presets {
  margin-top: 8px;
}

.presets-title {
  margin: 0 0 12px 0;
  font-size: 14px;
  font-weight: 500;
  color: var(--color-text-secondary);
}

.preset-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: 8px;
}

.preset-btn {
  padding: 8px 12px;
  border-radius: var(--border-radius-sm);
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid var(--color-border);
  color: var(--color-text-secondary);
  font-size: 12px;
  transition: all var(--transition-fast);
}

.preset-btn:hover {
  background: rgba(255, 255, 255, 0.1);
  color: var(--color-text-primary);
}

.local-music-section {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.file-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 16px;
  border-radius: var(--border-radius-md);
  background: rgba(255, 255, 255, 0.05);
  border: 2px dashed var(--color-border);
  color: var(--color-text-secondary);
  font-size: 14px;
  font-weight: 500;
  transition: all var(--transition-fast);
  cursor: pointer;
}

.file-btn:hover {
  background: rgba(255, 255, 255, 0.1);
  border-color: var(--color-primary);
  color: var(--color-text-primary);
}

.audio-player {
  width: 100%;
  height: 40px;
  border-radius: var(--border-radius-sm);
}

.settings-group {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.toggle-label {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 14px;
  color: var(--color-text-secondary);
  cursor: pointer;
}

.toggle-input {
  display: none;
}

.toggle-slider {
  position: relative;
  width: 44px;
  height: 24px;
  border-radius: var(--border-radius-full);
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid var(--color-border);
  transition: all var(--transition-fast);
  cursor: pointer;
}

.toggle-slider::before {
  content: '';
  position: absolute;
  top: 2px;
  left: 2px;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: var(--color-text-secondary);
  transition: all var(--transition-fast);
}

.toggle-input:checked + .toggle-slider {
  background: var(--color-primary);
  border-color: var(--color-primary);
}

.toggle-input:checked + .toggle-slider::before {
  transform: translateX(20px);
  background: var(--color-text-primary);
}

/* Responsive */
@media (max-width: 480px) {
  .input-group {
    flex-direction: column;
  }
  
  .preset-grid {
    grid-template-columns: 1fr;
  }
  
  .toggle-label {
    font-size: 13px;
  }
}
</style>