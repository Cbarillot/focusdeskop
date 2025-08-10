<template>
  <div class="universal-music">
    <!-- Music URL Input -->
    <div class="music-input-section">
      <h3>Universal Music Player</h3>
      <p class="description">
        Coller un lien Spotify, Deezer, YouTube ou SoundCloud pour écouter de la musique
      </p>
      
      <div class="input-group">
        <input 
          v-model="musicUrl"
          type="url"
          placeholder="https://open.spotify.com/track/... ou https://youtube.com/watch?v=..."
          class="music-url-input"
          @input="onUrlChange"
          @paste="onUrlPaste"
        />
        <button 
          class="load-btn"
          @click="loadMusic"
          :disabled="!musicUrl || loading"
        >
          {{ loading ? 'Chargement...' : 'Charger' }}
        </button>
      </div>

      <!-- Platform Indicator -->
      <div v-if="store.musicPlatform" class="platform-indicator">
        <component :is="getPlatformIcon()" />
        <span>{{ getPlatformName() }}</span>
      </div>

      <!-- Error Display -->
      <div v-if="store.musicError" class="error-message">
        <AlertIcon />
        {{ store.musicError }}
      </div>
    </div>

    <!-- Music Player Area -->
    <div v-if="store.musicUrl" class="music-player-section">
      <!-- Direct Embed (when possible) -->
      <div v-if="canEmbed && embedUrl" class="music-embed">
        <iframe 
          :src="embedUrl"
          width="100%"
          height="152"
          frameborder="0"
          allowtransparency="true"
          allow="encrypted-media"
          loading="lazy"
        ></iframe>
      </div>

      <!-- Fallback: External Link -->
      <div v-else class="external-fallback">
        <div class="fallback-info">
          <component :is="getPlatformIcon()" />
          <div class="fallback-text">
            <h4>Lecture externe requise</h4>
            <p>Cliquez pour ouvrir dans {{ getPlatformName() }}</p>
          </div>
        </div>
        <button 
          class="external-btn"
          @click="openExternal"
        >
          <ExternalIcon />
          Ouvrir
        </button>
      </div>

      <!-- Player Controls -->
      <div class="player-controls">
        <button 
          class="control-btn"
          @click="togglePlay"
          :disabled="!canEmbed"
        >
          <component :is="store.musicPlaying ? 'PauseIcon' : 'PlayIcon'" />
        </button>
        
        <div class="volume-control">
          <VolumeIcon />
          <input 
            type="range"
            min="0"
            max="1"
            step="0.1"
            v-model="store.volume"
            class="volume-slider"
          />
        </div>
      </div>
    </div>

    <!-- URL Examples/Help -->
    <details class="help-section">
      <summary>Formats supportés</summary>
      <div class="help-content">
        <div class="platform-examples">
          <div class="platform-example">
            <SpotifyIcon />
            <div>
              <strong>Spotify</strong>
              <code>https://open.spotify.com/track/...</code>
            </div>
          </div>
          <div class="platform-example">
            <DeezerIcon />
            <div>
              <strong>Deezer</strong>
              <code>https://www.deezer.com/track/...</code>
            </div>
          </div>
          <div class="platform-example">
            <YouTubeIcon />
            <div>
              <strong>YouTube</strong>
              <code>https://youtube.com/watch?v=...</code>
            </div>
          </div>
          <div class="platform-example">
            <SoundCloudIcon />
            <div>
              <strong>SoundCloud</strong>
              <code>https://soundcloud.com/artist/track</code>
            </div>
          </div>
        </div>
      </div>
    </details>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useAppStore } from '../stores/appStore'

const store = useAppStore()

// Local reactive state
const musicUrl = ref(store.musicUrl)
const loading = ref(false)

// URL change handlers
const onUrlChange = () => {
  store.setMusicUrl(musicUrl.value)
}

const onUrlPaste = (event) => {
  // Handle paste event for better UX
  setTimeout(() => {
    store.setMusicUrl(musicUrl.value)
  }, 0)
}

// Computed properties
const canEmbed = computed(() => {
  // Spotify and some YouTube videos can be embedded
  return ['spotify', 'youtube'].includes(store.musicPlatform)
})

const embedUrl = computed(() => {
  if (!store.musicUrl) return ''
  
  try {
    const url = new URL(store.musicUrl)
    
    switch (store.musicPlatform) {
      case 'spotify':
        // Convert Spotify URL to embed format
        const spotifyMatch = store.musicUrl.match(/spotify\.com\/(track|album|playlist)\/([a-zA-Z0-9]+)/)
        if (spotifyMatch) {
          return `https://open.spotify.com/embed/${spotifyMatch[1]}/${spotifyMatch[2]}?utm_source=generator`
        }
        break
        
      case 'youtube':
        // Convert YouTube URL to embed format
        const videoId = extractYouTubeVideoId(store.musicUrl)
        if (videoId) {
          return `https://www.youtube.com/embed/${videoId}?rel=0&showinfo=0`
        }
        break
    }
  } catch (error) {
    console.warn('Error creating embed URL:', error)
  }
  
  return ''
})

// Helper functions
function extractYouTubeVideoId(url) {
  const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/
  const match = url.match(regExp)
  return (match && match[7].length === 11) ? match[7] : null
}

function getPlatformName() {
  switch (store.musicPlatform) {
    case 'spotify': return 'Spotify'
    case 'deezer': return 'Deezer'
    case 'youtube': return 'YouTube'
    case 'soundcloud': return 'SoundCloud'
    default: return 'Plateforme inconnue'
  }
}

function getPlatformIcon() {
  switch (store.musicPlatform) {
    case 'spotify': return 'SpotifyIcon'
    case 'deezer': return 'DeezerIcon'
    case 'youtube': return 'YouTubeIcon'
    case 'soundcloud': return 'SoundCloudIcon'
    default: return 'MusicIcon'
  }
}

// Actions
async function loadMusic() {
  if (!musicUrl.value) return
  
  loading.value = true
  store.musicError = ''
  
  try {
    // Validate URL
    const url = new URL(musicUrl.value)
    const platform = store.detectMusicPlatform(musicUrl.value)
    
    if (!platform) {
      throw new Error('Plateforme non supportée. Utilisez Spotify, Deezer, YouTube ou SoundCloud.')
    }
    
    store.setMusicUrl(musicUrl.value)
    
    // Additional validation per platform
    switch (platform) {
      case 'spotify':
        if (!musicUrl.value.includes('/track/') && !musicUrl.value.includes('/album/') && !musicUrl.value.includes('/playlist/')) {
          throw new Error('URL Spotify invalide. Utilisez un lien vers un titre, album ou playlist.')
        }
        break
        
      case 'youtube':
        if (!extractYouTubeVideoId(musicUrl.value)) {
          throw new Error('URL YouTube invalide. Vérifiez le format du lien.')
        }
        break
        
      case 'deezer':
        if (!musicUrl.value.includes('/track/') && !musicUrl.value.includes('/album/') && !musicUrl.value.includes('/playlist/')) {
          throw new Error('URL Deezer invalide. Utilisez un lien vers un titre, album ou playlist.')
        }
        break
        
      case 'soundcloud':
        // SoundCloud URLs are more variable, basic validation
        if (!url.hostname.includes('soundcloud.com')) {
          throw new Error('URL SoundCloud invalide.')
        }
        break
    }
    
    console.log(`Music loaded successfully from ${platform}`)
    
  } catch (error) {
    store.musicError = error.message
  } finally {
    loading.value = false
  }
}

function openExternal() {
  if (store.musicUrl) {
    window.open(store.musicUrl, '_blank', 'noopener,noreferrer')
  }
}

function togglePlay() {
  store.musicPlaying = !store.musicPlaying
  // In a real implementation, this would control the embedded player
  console.log(store.musicPlaying ? 'Playing music' : 'Pausing music')
}

// Watch for URL changes from store
watch(() => store.musicUrl, (newUrl) => {
  musicUrl.value = newUrl
})
</script>

<script>
// Platform and control icons
const SpotifyIcon = {
  template: `
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15.12 10.56 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.3c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.42 1.56-.299.421-1.02.599-1.559.3z"/>
    </svg>
  `
}

const DeezerIcon = {
  template: `
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.81 8.35v1.86h4.17V8.35h-4.17zm0 2.8v1.86h4.17V11.15h-4.17zm0 2.79v1.86h4.17v-1.86h-4.17zM14.24 8.35v1.86h3.49V8.35h-3.49zm0 2.8v1.86h3.49V11.15h-3.49zm0 2.79v1.86h3.49v-1.86h-3.49zm0 2.8v1.86h3.49v-1.86h-3.49zM9.67 8.35v1.86h3.49V8.35H9.67zm0 2.8v1.86h3.49V11.15H9.67zm0 2.79v1.86h3.49v-1.86H9.67zm0 2.8v1.86h3.49v-1.86H9.67zM5.1 11.15v1.86h3.49V11.15H5.1zm0 2.79v1.86h3.49v-1.86H5.1zm0 2.8v1.86h3.49v-1.86H5.1z"/>
    </svg>
  `
}

const YouTubeIcon = {
  template: `
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
    </svg>
  `
}

const SoundCloudIcon = {
  template: `
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M1.175 13.788c-.067 0-.114-.049-.114-.111V9.155c0-.062.047-.111.114-.111.068 0 .115.049.115.111v4.522c0 .062-.047.111-.115.111zm1.018 0c-.067 0-.115-.049-.115-.111V8.021c0-.062.048-.111.115-.111.068 0 .115.049.115.111v5.656c0 .062-.047.111-.115.111zm1.019 0c-.068 0-.115-.049-.115-.111V7.244c0-.062.047-.111.115-.111s.115.049.115.111v6.433c0 .062-.047.111-.115.111z"/>
    </svg>
  `
}

const MusicIcon = {
  template: `
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M9 18V5L21 3V16" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      <circle cx="6" cy="18" r="3" stroke="currentColor" stroke-width="2"/>
      <circle cx="18" cy="16" r="3" stroke="currentColor" stroke-width="2"/>
    </svg>
  `
}

const PlayIcon = {
  template: `
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <polygon points="5,3 19,12 5,21" fill="currentColor"/>
    </svg>
  `
}

const PauseIcon = {
  template: `
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="6" y="4" width="4" height="16" fill="currentColor"/>
      <rect x="14" y="4" width="4" height="16" fill="currentColor"/>
    </svg>
  `
}

const VolumeIcon = {
  template: `
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <polygon points="11,5 6,9 2,9 2,15 6,15 11,19" stroke="currentColor" stroke-width="2" fill="none" stroke-linejoin="round"/>
      <path d="M15.54 8.46a5 5 0 0 1 0 7.07" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
  `
}

const ExternalIcon = {
  template: `
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      <polyline points="15,3 21,3 21,9" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      <line x1="10" y1="14" x2="21" y2="3" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
  `
}

const AlertIcon = {
  template: `
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      <line x1="12" y1="9" x2="12" y2="13" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      <line x1="12" y1="17" x2="12.01" y2="17" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
  `
}

export default {
  components: {
    SpotifyIcon,
    DeezerIcon,
    YouTubeIcon,
    SoundCloudIcon,
    MusicIcon,
    PlayIcon,
    PauseIcon,
    VolumeIcon,
    ExternalIcon,
    AlertIcon
  }
}
</script>

<style scoped>
.universal-music {
  padding: 0;
}

/* Input Section */
.music-input-section {
  margin-bottom: 24px;
}

.music-input-section h3 {
  margin: 0 0 8px 0;
  font-size: 18px;
  font-weight: 600;
  color: var(--color-text-primary);
}

.description {
  margin: 0 0 16px 0;
  font-size: 14px;
  color: var(--color-text-secondary);
  line-height: 1.4;
}

.input-group {
  display: flex;
  gap: 8px;
  margin-bottom: 12px;
}

.music-url-input {
  flex: 1;
  padding: 12px 16px;
  border-radius: var(--border-radius-md);
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid var(--color-border);
  color: var(--color-text-primary);
  font-size: 14px;
  transition: all var(--transition-fast);
}

.music-url-input:focus {
  background: rgba(255, 255, 255, 0.15);
  border-color: var(--color-primary);
  outline: none;
}

.music-url-input::placeholder {
  color: var(--color-text-muted);
}

.load-btn {
  padding: 12px 20px;
  border-radius: var(--border-radius-md);
  background: var(--color-primary);
  color: var(--color-text-primary);
  font-size: 14px;
  font-weight: 500;
  transition: all var(--transition-fast);
}

.load-btn:hover:not(:disabled) {
  background: var(--color-primary-dark);
  transform: translateY(-1px);
}

.load-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Platform Indicator */
.platform-indicator {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: var(--border-radius-sm);
  font-size: 13px;
  color: var(--color-text-secondary);
  margin-bottom: 12px;
}

/* Error Message */
.error-message {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.3);
  border-radius: var(--border-radius-md);
  color: #f87171;
  font-size: 14px;
  margin-bottom: 16px;
}

/* Music Player Section */
.music-player-section {
  border-top: 1px solid var(--color-border);
  padding-top: 24px;
}

/* Music Embed */
.music-embed {
  margin-bottom: 16px;
  border-radius: var(--border-radius-md);
  overflow: hidden;
  background: rgba(255, 255, 255, 0.02);
}

.music-embed iframe {
  border-radius: var(--border-radius-md);
}

/* External Fallback */
.external-fallback {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: var(--border-radius-md);
  margin-bottom: 16px;
}

.fallback-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.fallback-text h4 {
  margin: 0 0 4px 0;
  font-size: 14px;
  font-weight: 500;
  color: var(--color-text-primary);
}

.fallback-text p {
  margin: 0;
  font-size: 12px;
  color: var(--color-text-secondary);
}

.external-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  border-radius: var(--border-radius-sm);
  background: var(--color-primary);
  color: var(--color-text-primary);
  font-size: 13px;
  font-weight: 500;
  transition: all var(--transition-fast);
}

.external-btn:hover {
  background: var(--color-primary-dark);
}

/* Player Controls */
.player-controls {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}

.control-btn {
  width: 44px;
  height: 44px;
  border-radius: var(--border-radius-full);
  background: var(--color-primary);
  color: var(--color-text-primary);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all var(--transition-fast);
}

.control-btn:hover:not(:disabled) {
  background: var(--color-primary-dark);
  transform: scale(1.05);
}

.control-btn:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

.volume-control {
  display: flex;
  align-items: center;
  gap: 8px;
  flex: 1;
  max-width: 200px;
}

.volume-slider {
  flex: 1;
  -webkit-appearance: none;
  height: 4px;
  border-radius: 2px;
  background: rgba(255, 255, 255, 0.2);
  outline: none;
}

.volume-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: var(--color-primary);
  cursor: pointer;
}

/* Help Section */
.help-section {
  margin-top: 24px;
  border-top: 1px solid var(--color-border);
  padding-top: 16px;
}

.help-section summary {
  font-size: 14px;
  font-weight: 500;
  color: var(--color-text-secondary);
  cursor: pointer;
  padding: 4px 0;
}

.help-section summary:hover {
  color: var(--color-text-primary);
}

.help-content {
  margin-top: 12px;
}

.platform-examples {
  display: grid;
  gap: 12px;
}

.platform-example {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: rgba(255, 255, 255, 0.03);
  border-radius: var(--border-radius-sm);
}

.platform-example strong {
  display: block;
  font-size: 13px;
  color: var(--color-text-primary);
  margin-bottom: 4px;
}

.platform-example code {
  font-size: 11px;
  color: var(--color-text-muted);
  font-family: 'Courier New', monospace;
  background: rgba(255, 255, 255, 0.05);
  padding: 2px 6px;
  border-radius: 4px;
}

/* Responsive */
@media (max-width: 768px) {
  .input-group {
    flex-direction: column;
  }
  
  .external-fallback {
    flex-direction: column;
    gap: 12px;
    text-align: center;
  }
  
  .player-controls {
    flex-direction: column;
    gap: 12px;
  }
  
  .volume-control {
    max-width: none;
    width: 100%;
  }
}
</style>