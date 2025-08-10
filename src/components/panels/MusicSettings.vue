<template>
  <div class="music-settings">
    <!-- Deezer Playlists -->
    <div class="section">
      <h3 class="section-title">Deezer Playlists</h3>
      <p class="section-description">Access curated playlists directly on Deezer.</p>
      
      <div class="deezer-section">
        <div class="playlist-grid">
          <div 
            v-for="playlist in deezerPlaylists"
            :key="playlist.id"
            class="playlist-card"
            @click="openDeezerPlaylist(playlist.url)"
          >
            <div class="playlist-cover">
              <div class="playlist-image">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" fill="#FF6600"/>
                  <path d="M8 5V19L19 12L8 5Z" fill="white"/>
                </svg>
              </div>
              <div class="play-overlay">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M8 5V19L19 12L8 5Z" fill="currentColor"/>
                </svg>
              </div>
            </div>
            <div class="playlist-info">
              <h5 class="playlist-name">{{ playlist.title }}</h5>
              <p class="playlist-description">{{ playlist.description }}</p>
            </div>
          </div>
        </div>
        
        <div class="deezer-note">
          <p>🎵 Click any playlist to open it directly in Deezer</p>
        </div>
      </div>
    </div>
    
    <!-- Universal Music Component -->
    <div class="section">
      <UniversalMusic />
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
import { ref } from 'vue'
import { useAppStore } from '../../stores/appStore'
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

const youtubePresets = [
  { id: 'zhDwjnYZiCo', title: 'Lofi Study', url: 'https://www.youtube.com/live/zhDwjnYZiCo?si=ZuFZCpaBymXSSoQG' },
  { id: 'Rik8YhvH09M', title: 'Home Cosy Ambiance', url: 'https://youtu.be/Rik8YhvH09M?si=1ZLAf8IbMfZ4Zlh3' },
  { id: 'kfZyQ4K2vcw', title: 'Forest Witch Ambiance', url: 'https://youtu.be/kfZyQ4K2vcw?si=_8pTMJePBKbLMmkU' },
  { id: '0L38Z9hIi5s', title: 'Coffee Piano Ambiance', url: 'https://youtu.be/0L38Z9hIi5s?si=l48HxC1vUNXa4rFG' },
  { id: 'PMMGwSJsHfU', title: 'Medieval Village', url: 'https://youtu.be/PMMGwSJsHfU?si=egnG7zejirdD1Zk8' },
  { id: 'XFGgeltLaks', title: 'Hogwarts Music', url: 'https://youtu.be/XFGgeltLaks?si=QvQEv9OV1owmTpnt' }
]

function loadYouTube() {
  if (youtubeUrl.value) {
    // Extract video ID from YouTube URL or use as search term
    const videoId = extractYouTubeId(youtubeUrl.value)
    if (videoId) {
      currentVideoId.value = videoId
      store.currentTrack = youtubeUrl.value
      store.musicPlaying = true
    } else {
      // For simplicity, use the first preset if not a valid URL
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
  currentVideoId.value = videoId
  youtubeUrl.value = `https://www.youtube.com/watch?v=${videoId}`
  store.currentTrack = youtubeUrl.value
  store.musicPlaying = true
}

function loadLocalMusic(event) {
  const file = event.target.files[0]
  if (file) {
    localAudioSrc.value = URL.createObjectURL(file)
    store.currentTrack = file.name
    store.musicPlaying = true
  }
}

// Deezer functions
function openDeezerPlaylist(url) {
  // Open the Deezer playlist in a new tab
  window.open(url, '_blank', 'noopener,noreferrer')
}
</script>

<style scoped>
.music-settings {
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

/* Deezer Playlists Styles */
.deezer-section {
  border-radius: var(--border-radius-md);
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid var(--color-border);
  overflow: hidden;
  padding: 20px;
}

.playlist-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
  gap: 16px;
  margin-bottom: 16px;
}

.playlist-card {
  cursor: pointer;
  border-radius: var(--border-radius-md);
  overflow: hidden;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid var(--color-border);
  transition: all 0.2s ease;
}

.playlist-card:hover {
  background: rgba(255, 255, 255, 0.1);
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

.playlist-cover {
  position: relative;
  aspect-ratio: 1;
  overflow: hidden;
  background: linear-gradient(135deg, #FF6600, #FF8533);
  display: flex;
  align-items: center;
  justify-content: center;
}

.playlist-image {
  display: flex;
  align-items: center;
  justify-content: center;
}

.play-overlay {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 40px;
  height: 40px;
  background: rgba(0, 0, 0, 0.7);
  border-radius: var(--border-radius-full);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.2s ease;
  color: white;
}

.playlist-card:hover .play-overlay {
  opacity: 1;
}

.playlist-info {
  padding: 12px;
}

.playlist-name {
  margin: 0 0 4px 0;
  font-size: 14px;
  font-weight: 600;
  color: var(--color-text-primary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.playlist-description {
  margin: 0;
  font-size: 12px;
  color: var(--color-text-secondary);
  line-height: 1.4;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.deezer-note {
  text-align: center;
  padding: 12px;
  background: rgba(255, 102, 0, 0.1);
  border-radius: var(--border-radius-sm);
  border: 1px solid rgba(255, 102, 0, 0.3);
}

.deezer-note p {
  margin: 0;
  font-size: 14px;
  color: var(--color-text-secondary);
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