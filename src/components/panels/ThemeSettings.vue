<template>
  <div class="panel-section">
    <h3>Themes</h3>
    <p class="section-description">Choose from beautiful backgrounds to enhance your focus experience.</p>
    
    <div class="theme-categories">
      <div class="category-section">
        <h4 class="category-title">🎨 Gradients & Colors</h4>
        <div class="themes-grid">
          <div
            v-for="(theme, key) in getThemesByCategory('gradients')"
            :key="key"
            class="theme-card"
            :class="{ active: store.currentTheme === key }"
            @click="selectTheme(key)"
          >
            <div class="theme-preview">
              <div
                v-if="theme.type === 'canvas'"
                class="canvas-preview"
                :style="{ background: getCanvasPreviewGradient(theme.colors) }"
              >
                <div class="canvas-indicator">✨</div>
              </div>
              <div
                v-else-if="theme.type === 'gradient'"
                class="gradient-preview"
                :style="{ background: theme.value }"
              ></div>
              <div
                v-else-if="theme.type === 'color'"
                class="color-preview"
                :style="{ backgroundColor: theme.value }"
              ></div>
              <img
                v-else
                :src="getPreviewImage(theme)"
                :alt="theme.name"
                class="theme-image"
                @error="handleImageError"
              />
              <div class="theme-type-badge" :class="theme.type">
                {{ getTypeBadge(theme.type) }}
              </div>
            </div>
            <div class="theme-info">
              <h4 class="theme-name">{{ theme.name }}</h4>
              <p class="theme-type">{{ getTypeLabel(theme.type) }}</p>
            </div>
          </div>
        </div>
      </div>

      <div class="category-section">
        <h4 class="category-title">🖼️ Images</h4>
        <div class="themes-grid">
          <div
            v-for="(theme, key) in getThemesByCategory('images')"
            :key="key"
            class="theme-card"
            :class="{ active: store.currentTheme === key }"
            @click="selectTheme(key)"
          >
            <div class="theme-preview">
              <img
                :src="getPreviewImage(theme)"
                :alt="theme.name"
                class="theme-image"
                @error="handleImageError"
              />
              <div class="theme-type-badge" :class="theme.type">
                🖼️
              </div>
            </div>
            <div class="theme-info">
              <h4 class="theme-name">{{ theme.name }}</h4>
              <p class="theme-type">Static Image</p>
            </div>
          </div>
        </div>
      </div>

      <div class="category-section">
        <h4 class="category-title">🎬 Animated Backgrounds</h4>
        
        <!-- Nature Subcategory -->
        <h5 class="subcategory-title">🌿 Nature</h5>
        <div class="themes-grid">
          <div
            v-for="(theme, key) in getThemesByCategory('nature')"
            :key="key"
            class="theme-card"
            :class="{ active: store.currentTheme === key }"
            @click="selectTheme(key)"
          >
            <div class="theme-preview" @mouseenter="playPreview" @mouseleave="pausePreview">
              <video
                :src="theme.value"
                muted
                loop
                class="theme-video"
                :data-theme-key="key"
                @error="handleImageError"
                preload="none"
              ></video>
              <div class="theme-type-badge video">
                🌿
              </div>
              <div class="video-play-indicator">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M8 5V19L19 12L8 5Z" fill="currentColor"/>
                </svg>
              </div>
            </div>
            <div class="theme-info">
              <h4 class="theme-name">{{ theme.name }}</h4>
              <p class="theme-type">Nature Animation</p>
            </div>
          </div>
        </div>

        <!-- Lofi Subcategory -->
        <h5 class="subcategory-title">🎵 Lofi</h5>
        <div class="themes-grid">
          <div
            v-for="(theme, key) in getThemesByCategory('lofi')"
            :key="key"
            class="theme-card"
            :class="{ active: store.currentTheme === key }"
            @click="selectTheme(key)"
          >
            <div class="theme-preview" @mouseenter="playPreview" @mouseleave="pausePreview">
              <video
                :src="theme.value"
                muted
                loop
                class="theme-video"
                :data-theme-key="key"
                @error="handleImageError"
                preload="none"
              ></video>
              <div class="theme-type-badge video">
                🎵
              </div>
              <div class="video-play-indicator">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M8 5V19L19 12L8 5Z" fill="currentColor"/>
                </svg>
              </div>
            </div>
            <div class="theme-info">
              <h4 class="theme-name">{{ theme.name }}</h4>
              <p class="theme-type">Lofi Animation</p>
            </div>
          </div>
        </div>

        <!-- Café Subcategory -->
        <h5 class="subcategory-title">☕ Café</h5>
        <div class="themes-grid">
          <div
            v-for="(theme, key) in getThemesByCategory('cafe')"
            :key="key"
            class="theme-card"
            :class="{ active: store.currentTheme === key }"
            @click="selectTheme(key)"
          >
            <div class="theme-preview" @mouseenter="playPreview" @mouseleave="pausePreview">
              <video
                :src="theme.value"
                muted
                loop
                class="theme-video"
                :data-theme-key="key"
                @error="handleImageError"
                preload="none"
              ></video>
              <div class="theme-type-badge video">
                ☕
              </div>
              <div class="video-play-indicator">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M8 5V19L19 12L8 5Z" fill="currentColor"/>
                </svg>
              </div>
            </div>
            <div class="theme-info">
              <h4 class="theme-name">{{ theme.name }}</h4>
              <p class="theme-type">Café Animation</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="setting-group">
      <h4>Custom YouTube Background</h4>
      <p class="setting-description">Add any YouTube video as your background. Perfect for lofi music, nature sounds, or ambient videos.</p>

      <div class="youtube-input-section">
        <div class="input-group">
          <input
            v-model="youtubeUrl"
            type="url"
            placeholder="Paste YouTube URL here (e.g., https://youtu.be/jfKfPfyJRdk)"
            class="youtube-input"
            @keyup.enter="addYouTubeBackground"
          />
          <button
            @click="addYouTubeBackground"
            class="add-youtube-btn"
            :disabled="!youtubeUrl.trim()"
          >
            Add Background
          </button>
        </div>

        <div v-if="youtubeError" class="error-message">
          {{ youtubeError }}
        </div>

        <div class="youtube-examples">
          <h5>Popular Ambient Videos:</h5>
          <div class="example-links">
            <button
              v-for="example in youtubeExamples"
              :key="example.id"
              @click="useExampleVideo(example.url)"
              class="example-btn"
            >
              {{ example.title }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <div class="setting-group">
      <h4>Custom Animated Gradient</h4>
      <p class="setting-description">Create your own animated gradient background with custom colors.</p>

      <div class="gradient-customizer">
        <div class="color-inputs">
          <div
            v-for="(color, index) in gradientColors"
            :key="index"
            class="color-input-group"
          >
            <label class="color-label">Color {{ index + 1 }}</label>
            <input
              type="color"
              :value="color"
              @input="updateGradientColor(index, $event.target.value)"
              class="color-picker"
            />
          </div>
        </div>

        <div class="gradient-preview">
          <div class="preview-container" :style="getGradientPreviewStyle()">
            <span class="preview-text">Preview</span>
          </div>
        </div>

        <div class="gradient-actions">
          <button @click="applyCustomGradient" class="apply-gradient-btn">
            Apply Gradient Background
          </button>
          <button @click="resetToDefaults" class="reset-btn">
            Reset to Default Colors
          </button>
        </div>

        <div class="preset-gradients">
          <h5>Quick Presets:</h5>
          <div class="preset-buttons">
            <button
              v-for="preset in gradientPresets"
              :key="preset.name"
              @click="applyPreset(preset.colors)"
              class="preset-btn"
              :style="{ background: `linear-gradient(45deg, ${preset.colors.join(', ')})` }"
            >
              {{ preset.name }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <div class="setting-group">
      <h4>Display Settings</h4>
      
      <div class="setting-item">
        <label class="setting-label">Overlay opacity</label>
        <div class="slider-container">
          <input 
            type="range" 
            min="0" 
            max="0.8" 
            step="0.1" 
            v-model="overlayOpacity" 
            @input="updateOverlay"
            class="slider"
          />
          <span class="slider-value">{{ Math.round(overlayOpacity * 100) }}%</span>
        </div>
      </div>
      
      <div class="setting-item">
        <label class="setting-label">Auto-change themes</label>
        <label class="toggle-switch">
          <input type="checkbox" v-model="autoChangeThemes" />
          <span class="toggle-slider"></span>
        </label>
      </div>
      
      <div class="setting-item" v-if="autoChangeThemes">
        <label class="setting-label">Change interval</label>
        <select v-model="changeInterval" class="select-input">
          <option value="hour">Every hour</option>
          <option value="session">Every session</option>
          <option value="day">Daily</option>
        </select>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useAppStore } from '../../stores/appStore'

const store = useAppStore()

const overlayOpacity = ref(store.overlayOpacity)
const autoChangeThemes = ref(false)
const changeInterval = ref('hour')
const youtubeUrl = ref('')
const youtubeError = ref('')

const youtubeExamples = [
  {
    id: 1,
    title: 'Lofi Hip Hop',
    url: 'https://www.youtube.com/watch?v=jfKfPfyJRdk'
  },
  {
    id: 2,
    title: 'Rain Sounds',
    url: 'https://www.youtube.com/watch?v=mPZkdNFkNps'
  },
  {
    id: 3,
    title: 'Forest Ambience',
    url: 'https://www.youtube.com/watch?v=xNN7iTA57jM'
  },
  {
    id: 4,
    title: 'Ocean Waves',
    url: 'https://www.youtube.com/watch?v=V1Pl8CzNzCw'
  }
]

const gradientColors = ref([...store.customGradientColors])

const gradientPresets = [
  {
    name: 'Lava Lamp',
    colors: ['#DF437A', '#3d57d6', '#a117fd', '#ec634b']
  },
  {
    name: 'Ocean Breeze',
    colors: ['#00c9ff', '#92fe9d', '#00d4ff', '#4facfe']
  },
  {
    name: 'Sunset',
    colors: ['#ff9a9e', '#fecfef', '#fad0c4', '#f093fb']
  },
  {
    name: 'Forest',
    colors: ['#134e5e', '#71b280', '#42a5f5', '#478ed1']
  },
  {
    name: 'Royal',
    colors: ['#667eea', '#764ba2', '#f093fb', '#f5576c']
  },
  {
    name: 'Fire',
    colors: ['#ff416c', '#ff4b2b', '#ff6b6b', '#ee5a24']
  }
]

function selectTheme(themeKey) {
  store.setTheme(themeKey)
}

function updateOverlay() {
  store.overlayOpacity = parseFloat(overlayOpacity.value)
}

function getPreviewImage(theme) {
  // Use authentic Flocus preview images
  return theme.preview || theme.value
}

function getCanvasPreviewGradient(colors) {
  if (!colors || colors.length < 2) return 'linear-gradient(45deg, #8B5CF6, #EC4899)'
  return `radial-gradient(circle at 30% 40%, ${colors[0]}40 0%, ${colors[1]}40 25%, ${colors[2]}40 50%, ${colors[3] || colors[0]}40 100%)`
}

function getTypeBadge(type) {
  const badges = {
    'canvas': '✨',
    'video': '🎬',
    'image': '🖼️',
    'gradient': '🌈',
    'color': '🎨'
  }
  return badges[type] || '🎨'
}

function getTypeLabel(type) {
  const labels = {
    'canvas': 'Animated',
    'video': 'Video',
    'image': 'Photo',
    'gradient': 'Gradient',
    'color': 'Solid Color'
  }
  return labels[type] || 'Custom'
}

function handleImageError(event) {
  // Fallback to a gradient if image fails to load
  const colors = ['#8B5CF6', '#EC4899', '#F59E0B']
  event.target.style.display = 'none'
  event.target.parentElement.style.background = `linear-gradient(45deg, ${colors.join(', ')})`
}

function addYouTubeBackground() {
  youtubeError.value = ''

  if (!youtubeUrl.value.trim()) {
    youtubeError.value = 'Please enter a YouTube URL'
    return
  }

  const success = store.setYouTubeBackground(youtubeUrl.value)

  if (success) {
    youtubeUrl.value = ''
    youtubeError.value = ''
    // Optionally close the sidebar
    // store.toggleSidebar()
  } else {
    youtubeError.value = 'Invalid YouTube URL. Please check the format and try again.'
  }
}

function useExampleVideo(url) {
  youtubeUrl.value = url
  addYouTubeBackground()
}

function updateGradientColor(index, color) {
  gradientColors.value[index] = color
}

function getGradientPreviewStyle() {
  return {
    background: `linear-gradient(45deg, ${gradientColors.value.join(', ')})`,
    backgroundSize: '200% 200%',
    animation: 'gradientAnimation 3s ease infinite'
  }
}

function applyCustomGradient() {
  store.setCustomGradientColors(gradientColors.value)
  store.setAnimatedGradientBackground()
}

function resetToDefaults() {
  gradientColors.value = ['#DF437A', '#3d57d6', '#a117fd', '#ec634b']
}

function applyPreset(colors) {
  gradientColors.value = [...colors]
  applyCustomGradient()
}

function getThemesByCategory(category) {
  const gradientThemes = [
    'aura-twilight', 'peach-aura-heart', 'light-pink-heart', 'flare',
    'minimalist-black', 'minimalist-white', 'heat-map', 'dark-purple-heart',
    'light-purple-heart', 'grainy-gradient', 'lava-lamp', 'aurora', 'custom-animated-gradient'
  ]

  const imageThemes = [
    'countryside-morning', 'toto-forest', 'lofi-clouds', 'dusk-peak',
    'tuscan-village', 'forest-retreat', 'cotton-candy-sky', 'countryside-night',
    'underwater-reef', 'enchanted-river', 'hobbit-home', 'golden-forest-cat',
    // New image themes from assets
    '3d-cartoon-door', 'digital-river-landscape', 'mysterious-forest-cat',
    'mononoke-forest', 'kiki-flying', 'chihiro-flowers', 'totoro-forest',
    'monet-painting', 'bay-of-naples', 'kiki-workshop'
  ]

  const natureThemes = [
    // Nature animated backgrounds
    'spirited-away-island', 'flowers-water-stream', 'totoro-rain', 
    'flower-field-howls', 'small-forest-house', 'arrietty-flower-field',
    'howls-moving-castle', 'zelda-forest-temple', 'castle-beyond-clouds'
  ]

  const lofiThemes = [
    // Lofi animated backgrounds  
    'chihiro-spirited-away', 'evening-chill', 'lofi-cozy-house-rain',
    'lofi-house-cloudy', 'lofi-girl-animated'
  ]

  const cafeThemes = [
    // Café animated backgrounds
    'japanese-lofi-cafe', 'morning-coffee', 'coffee-shop'
  ]

  const themes = {}

  if (category === 'gradients') {
    gradientThemes.forEach(key => {
      if (store.themes[key]) themes[key] = store.themes[key]
    })
  } else if (category === 'images') {
    imageThemes.forEach(key => {
      if (store.themes[key]) themes[key] = store.themes[key]
    })
  } else if (category === 'nature') {
    natureThemes.forEach(key => {
      if (store.themes[key]) themes[key] = store.themes[key]
    })
  } else if (category === 'lofi') {
    lofiThemes.forEach(key => {
      if (store.themes[key]) themes[key] = store.themes[key]
    })
  } else if (category === 'cafe') {
    cafeThemes.forEach(key => {
      if (store.themes[key]) themes[key] = store.themes[key]
    })
  }

  return themes
}

// Video preview optimization methods
function playPreview(event) {
  const videoElement = event.currentTarget.querySelector('.theme-video')
  if (videoElement) {
    videoElement.currentTime = 0
    videoElement.play().catch(() => {
      // Ignore play errors (common on mobile or when multiple videos play)
    })
  }
}

function pausePreview(event) {
  const videoElement = event.currentTarget.querySelector('.theme-video')
  if (videoElement) {
    videoElement.pause()
    videoElement.currentTime = 0
  }
}
</script>

<style scoped>
.theme-categories {
  margin-bottom: 32px;
}

.category-section {
  margin-bottom: 40px;
}

.category-title {
  margin: 0 0 20px 0;
  font-size: 18px;
  font-weight: 600;
  color: var(--color-text-primary);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  padding-bottom: 8px;
}

.subcategory-title {
  margin: 32px 0 16px 0;
  font-size: 16px;
  font-weight: 500;
  color: var(--color-text-secondary);
  padding-left: 16px;
  border-left: 3px solid var(--color-primary);
}

.themes-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  gap: 16px;
}

.theme-card {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: var(--border-radius-md);
  overflow: hidden;
  cursor: pointer;
  transition: all 0.2s ease;
}

.theme-card:hover {
  background: rgba(255, 255, 255, 0.1);
  border-color: rgba(255, 255, 255, 0.2);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.theme-card.active {
  background: rgba(139, 92, 246, 0.2);
  border-color: var(--color-primary);
  box-shadow: 0 4px 16px rgba(139, 92, 246, 0.3);
}

.theme-preview {
  position: relative;
  height: 80px;
  overflow: hidden;
}

.theme-image,
.theme-video,
.canvas-preview,
.gradient-preview,
.color-preview {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.2s ease;
}

.color-preview {
  border-radius: 4px;
}

.theme-card:hover .theme-image,
.theme-card:hover .theme-video,
.theme-card:hover .canvas-preview,
.theme-card:hover .color-preview {
  transform: scale(1.05);
}

.canvas-preview {
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.canvas-indicator {
  font-size: 20px;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  animation: sparkle 2s ease-in-out infinite;
}

@keyframes sparkle {
  0%, 100% { opacity: 0.7; transform: scale(1); }
  50% { opacity: 1; transform: scale(1.1); }
}

.theme-type-badge {
  position: absolute;
  top: 6px;
  right: 6px;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  padding: 2px 6px;
  font-size: 10px;
  line-height: 1;
}

.theme-type-badge.video {
  background: rgba(239, 68, 68, 0.8);
}

.theme-type-badge.canvas {
  background: rgba(139, 92, 246, 0.8);
}

.theme-type-badge.image {
  background: rgba(34, 197, 94, 0.8);
}

.theme-type-badge.gradient {
  background: rgba(249, 115, 22, 0.8);
}

.theme-type-badge.color {
  background: rgba(168, 85, 247, 0.8);
}

.video-play-indicator {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 36px;
  height: 36px;
  background: rgba(0, 0, 0, 0.7);
  border-radius: var(--border-radius-full);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  opacity: 1;
  transition: all 0.2s ease;
  pointer-events: none;
}

.theme-preview:hover .video-play-indicator {
  opacity: 0;
}

.theme-video:not([data-loaded]) + .video-play-indicator {
  opacity: 1;
}

.theme-info {
  padding: 12px;
}

.theme-name {
  margin: 0 0 4px 0;
  font-size: 13px;
  font-weight: 600;
  color: var(--color-text-primary);
}

.theme-type {
  margin: 0;
  font-size: 11px;
  color: var(--color-text-secondary);
}

.setting-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.slider-container {
  display: flex;
  align-items: center;
  gap: 12px;
}

.slider {
  width: 100px;
  height: 4px;
  border-radius: 2px;
  background: rgba(255, 255, 255, 0.2);
  outline: none;
  cursor: pointer;
}

.slider::-webkit-slider-thumb {
  appearance: none;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: var(--color-primary);
  cursor: pointer;
}

.slider::-moz-range-thumb {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: var(--color-primary);
  cursor: pointer;
  border: none;
}

.slider-value {
  font-size: 12px;
  color: var(--color-text-secondary);
  min-width: 32px;
  text-align: right;
}

.toggle-switch {
  position: relative;
  display: inline-block;
  width: 40px;
  height: 20px;
}

.toggle-switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.toggle-slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(255, 255, 255, 0.2);
  transition: 0.2s;
  border-radius: 20px;
}

.toggle-slider:before {
  position: absolute;
  content: "";
  height: 16px;
  width: 16px;
  left: 2px;
  bottom: 2px;
  background-color: white;
  transition: 0.2s;
  border-radius: 50%;
}

input:checked + .toggle-slider {
  background-color: var(--color-primary);
}

input:checked + .toggle-slider:before {
  transform: translateX(20px);
}

.select-input {
  padding: 6px 8px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: var(--border-radius-sm);
  color: var(--color-text-primary);
  font-size: 12px;
}

h4 {
  margin: 0 0 16px 0;
  font-size: 16px;
  font-weight: 600;
  color: var(--color-text-primary);
}

h5 {
  margin: 16px 0 12px 0;
  font-size: 14px;
  font-weight: 500;
  color: var(--color-text-primary);
}

.setting-description {
  font-size: 13px;
  color: var(--color-text-secondary);
  margin-bottom: 20px;
  line-height: 1.4;
}

.youtube-input-section {
  margin-bottom: 24px;
}

.input-group {
  display: flex;
  gap: 12px;
  margin-bottom: 16px;
}

.youtube-input {
  flex: 1;
  padding: 12px 16px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: var(--border-radius-md);
  color: var(--color-text-primary);
  font-size: 14px;
  transition: all 0.2s ease;
}

.youtube-input:focus {
  border-color: var(--color-primary);
  box-shadow: 0 0 0 2px rgba(139, 92, 246, 0.1);
  outline: none;
}

.youtube-input::placeholder {
  color: var(--color-text-secondary);
}

.add-youtube-btn {
  padding: 12px 20px;
  background: var(--color-primary);
  border: none;
  border-radius: var(--border-radius-md);
  color: white;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;
}

.add-youtube-btn:hover:not(:disabled) {
  background: var(--color-primary-dark);
  transform: translateY(-1px);
}

.add-youtube-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none;
}

.error-message {
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.3);
  border-radius: var(--border-radius-sm);
  padding: 8px 12px;
  color: #FCA5A5;
  font-size: 12px;
  margin-bottom: 16px;
}

.youtube-examples {
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  padding-top: 16px;
}

.example-links {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: 8px;
}

.example-btn {
  padding: 8px 12px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: var(--border-radius-sm);
  color: var(--color-text-secondary);
  font-size: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
  text-align: left;
}

.example-btn:hover {
  background: rgba(255, 255, 255, 0.1);
  color: var(--color-text-primary);
  border-color: var(--color-primary);
}

.gradient-customizer {
  margin-bottom: 24px;
}

.color-inputs {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
  gap: 16px;
  margin-bottom: 20px;
}

.color-input-group {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.color-label {
  font-size: 12px;
  color: var(--color-text-secondary);
  font-weight: 500;
}

.color-picker {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  border: 2px solid rgba(255, 255, 255, 0.2);
  background: transparent;
  cursor: pointer;
  transition: all 0.2s ease;
}

.color-picker:hover {
  border-color: var(--color-primary);
  transform: scale(1.05);
}

.gradient-preview {
  margin-bottom: 20px;
}

.preview-container {
  height: 80px;
  border-radius: var(--border-radius-md);
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid rgba(255, 255, 255, 0.1);
  position: relative;
  overflow: hidden;
}

.preview-text {
  color: white;
  font-weight: 600;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
  font-size: 14px;
}

.gradient-actions {
  display: flex;
  gap: 12px;
  margin-bottom: 20px;
}

.apply-gradient-btn {
  flex: 1;
  padding: 12px 20px;
  background: var(--color-primary);
  border: none;
  border-radius: var(--border-radius-md);
  color: white;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.apply-gradient-btn:hover {
  background: var(--color-primary-dark);
  transform: translateY(-1px);
}

.reset-btn {
  padding: 12px 16px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: var(--border-radius-md);
  color: var(--color-text-secondary);
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.reset-btn:hover {
  background: rgba(255, 255, 255, 0.1);
  color: var(--color-text-primary);
}

.preset-gradients {
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  padding-top: 20px;
}

.preset-buttons {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 12px;
}

.preset-btn {
  padding: 10px 12px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: var(--border-radius-md);
  color: white;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
  min-height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.preset-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  border-color: rgba(255, 255, 255, 0.4);
}

@keyframes gradientAnimation {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}

/* Responsive */
@media (max-width: 768px) {
  .themes-grid {
    grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
    gap: 12px;
  }
  
  .theme-preview {
    height: 70px;
  }
  
  .theme-info {
    padding: 10px;
  }
  
  .theme-name {
    font-size: 12px;
  }
  
  .theme-type {
    font-size: 10px;
  }
}

@media (max-width: 480px) {
  .themes-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 10px;
  }

  .theme-preview {
    height: 60px;
  }

  .setting-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }

  .slider-container {
    align-self: stretch;
    justify-content: space-between;
  }

  .slider {
    flex: 1;
    margin-right: 12px;
  }

  .input-group {
    flex-direction: column;
    gap: 8px;
  }

  .youtube-input {
    padding: 10px 12px;
  }

  .add-youtube-btn {
    padding: 10px 16px;
    align-self: stretch;
    text-align: center;
  }

  .example-links {
    grid-template-columns: 1fr;
  }

  .color-inputs {
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
  }

  .color-picker {
    width: 50px;
    height: 50px;
  }

  .gradient-actions {
    flex-direction: column;
    gap: 8px;
  }

  .preset-buttons {
    grid-template-columns: repeat(2, 1fr);
    gap: 8px;
  }

  .preset-btn {
    padding: 8px 10px;
    font-size: 11px;
    min-height: 35px;
  }
}
</style>
