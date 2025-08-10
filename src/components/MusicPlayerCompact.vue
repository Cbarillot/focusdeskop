<template>
  <div class="music-player-compact">
    <!-- Music Button -->
    <button 
      class="music-button"
      @click="togglePlayer"
      :class="{ expanded: isExpanded, playing: store.musicPlaying }"
      title="Musique"
    >
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/>
        <polygon v-if="!store.musicPlaying" points="10,8 16,12 10,16" fill="currentColor"/>
        <rect v-else x="9" y="8" width="2" height="8" fill="currentColor"/>
        <rect v-else x="13" y="8" width="2" height="8" fill="currentColor"/>
      </svg>
    </button>

    <!-- Compact Music Player -->
    <div 
      class="music-player-panel"
      :class="{ expanded: isExpanded }"
    >
      <div class="player-header">
        <h3>Player Musique</h3>
        <button class="close-btn" @click="togglePlayer">×</button>
      </div>
      
      <div class="player-content">
        <!-- Current Track -->
        <div v-if="store.currentTrack" class="current-track">
          <div class="track-name">{{ store.currentTrack }}</div>
          <div class="track-status">{{ store.musicPlaying ? 'En cours' : 'En pause' }}</div>
        </div>
        
        <div v-else class="no-track">
          Aucune musique sélectionnée
        </div>

        <!-- Controls -->
        <div class="music-controls">
          <button 
            @click="store.toggleMusicPlayback()"
            :disabled="!store.currentTrack"
            class="control-btn"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <polygon v-if="!store.musicPlaying" points="8,5 19,12 8,19" fill="currentColor"/>
              <rect v-else x="6" y="4" width="4" height="16" fill="currentColor"/>
              <rect v-else x="14" y="4" width="4" height="16" fill="currentColor"/>
            </svg>
          </button>
          
          <button 
            @click="store.stopMusic()"
            :disabled="!store.currentTrack"
            class="control-btn"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="6" y="6" width="12" height="12" fill="currentColor"/>
            </svg>
          </button>
          
          <button 
            @click="openMusicSettings"
            class="control-btn settings-btn"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 15a3 3 0 100-6 3 3 0 000 6z" fill="currentColor"/>
              <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z" stroke="currentColor" stroke-width="1.5"/>
            </svg>
          </button>
        </div>

        <!-- Quick Playlists -->
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
import { ref } from 'vue'
import { useAppStore } from '../stores/appStore'

const store = useAppStore()
const isExpanded = ref(false)

function togglePlayer() {
  isExpanded.value = !isExpanded.value
}

function openMusicSettings() {
  // Ouvre le panneau de paramètres musique
  store.setActiveTab('music')
  if (!store.sidebarOpen) {
    store.toggleSidebar()
  }
  // Ferme le player compact
  isExpanded.value = false
}
</script>

<style scoped>
.music-player-compact {
  position: fixed;
  bottom: 100px;
  left: 20px;
  z-index: 150;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0;
}

.music-button {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: rgba(0, 191, 165, 0.9);
  backdrop-filter: blur(10px);
  border: 2px solid rgba(0, 191, 165, 1);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  cursor: pointer;
  box-shadow: 0 4px 16px rgba(0, 191, 165, 0.3);
}

.music-button:hover {
  transform: scale(1.05);
  box-shadow: 0 6px 20px rgba(0, 191, 165, 0.4);
}

.music-button.playing {
  background: rgba(255, 165, 0, 0.9);
  border-color: rgba(255, 165, 0, 1);
  box-shadow: 0 4px 16px rgba(255, 165, 0, 0.3);
}

.music-button.expanded {
  border-radius: 12px 12px 0 0;
  background: rgba(0, 191, 165, 1);
}

.music-button.expanded.playing {
  background: rgba(255, 165, 0, 1);
  border-color: rgba(255, 165, 0, 1);
}

.music-player-panel {
  width: 280px;
  height: 0;
  background: rgba(0, 0, 0, 0.85);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-top: none;
  border-radius: 0 0 12px 12px;
  overflow: hidden;
  transition: all 0.3s ease;
  opacity: 0;
}

.music-player-panel.expanded {
  height: 220px;
  opacity: 1;
}

.player-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
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
  border-top: 1px solid rgba(255, 255, 255, 0.1);
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
