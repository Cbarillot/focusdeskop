<template>
  <div class="background-settings">
    <div class="section">
      <h3 class="section-title">Background Type</h3>
      
      <div class="type-tabs">
        <button 
          v-for="type in backgroundTypes"
          :key="type.key"
          class="type-tab"
          :class="{ active: store.backgroundType === type.key }"
          @click="setBackgroundType(type.key)"
        >
          <component :is="type.icon" />
          <span>{{ type.label }}</span>
        </button>
      </div>
    </div>
    
    <!-- Gradient Options -->
    <div v-if="store.backgroundType === 'gradient'" class="section">
      <h3 class="section-title">Gradient Presets</h3>
      
      <div class="gradient-grid">
        <button 
          v-for="gradient in gradientPresets"
          :key="gradient.name"
          class="gradient-btn"
          :style="{ background: gradient.value }"
          @click="setBackground('gradient', gradient.value)"
          :class="{ active: store.backgroundValue === gradient.value }"
        >
          <span class="gradient-name">{{ gradient.name }}</span>
        </button>
      </div>
    </div>
    
    <!-- Color Options -->
    <div v-if="store.backgroundType === 'color'" class="section">
      <h3 class="section-title">Solid Color</h3>
      
      <div class="color-section">
        <input 
          type="color"
          :value="colorValue"
          @input="setBackground('color', $event.target.value)"
          class="color-picker"
        />
        
        <div class="color-presets">
          <button 
            v-for="color in colorPresets"
            :key="color"
            class="color-preset"
            :style="{ backgroundColor: color }"
            @click="setBackground('color', color)"
            :class="{ active: store.backgroundValue === color }"
          ></button>
        </div>
      </div>
    </div>
    
    <!-- Image Options -->
    <div v-if="store.backgroundType === 'image'" class="section">
      <h3 class="section-title">Background Image</h3>
      
      <div class="image-section">
        <input 
          type="file"
          ref="imageInput"
          accept="image/*"
          @change="loadBackgroundImage"
          style="display: none"
        />
        
        <button @click="$refs.imageInput.click()" class="upload-btn">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2" stroke="currentColor" stroke-width="2"/>
            <circle cx="8.5" cy="8.5" r="1.5" stroke="currentColor" stroke-width="2"/>
            <path d="M21 15L16 10L5 21" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          Upload Image
        </button>
        
        <div class="image-presets">
          <h4 class="presets-title">Popular Backgrounds</h4>
          <div class="image-grid">
            <button 
              v-for="image in imagePresets"
              :key="image.name"
              class="image-btn"
              :style="{ backgroundImage: `url(${image.url})` }"
              @click="setBackground('image', image.url)"
            >
              <span class="image-name">{{ image.name }}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Video Options -->
    <div v-if="store.backgroundType === 'video'" class="section">
      <h3 class="section-title">Background Video</h3>
      
      <div class="video-section">
        <input 
          v-model="videoUrl"
          type="url"
          placeholder="Enter video URL"
          class="video-input"
          @input="setBackground('video', videoUrl)"
        />
        
        <div class="video-presets">
          <h4 class="presets-title">Ambient Videos</h4>
          <div class="video-grid">
            <button 
              v-for="video in videoPresets"
              :key="video.name"
              class="video-btn"
              @click="setBackground('video', video.url); videoUrl = video.url"
            >
              {{ video.name }}
            </button>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Overlay Settings -->
    <div class="section">
      <h3 class="section-title">Overlay</h3>
      
      <div class="overlay-section">
        <label class="slider-label">
          <span>Overlay Opacity</span>
          <div class="slider-container">
            <input 
              type="range"
              min="0"
              max="0.8"
              step="0.1"
              :value="store.overlayOpacity"
              @input="store.overlayOpacity = parseFloat($event.target.value)"
              class="opacity-slider"
            />
            <span class="slider-value">{{ Math.round(store.overlayOpacity * 100) }}%</span>
          </div>
        </label>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useAppStore } from '../../stores/appStore'

const store = useAppStore()

const videoUrl = ref('')

const backgroundTypes = [
  { key: 'gradient', label: 'Gradient', icon: 'GradientIcon' },
  { key: 'color', label: 'Color', icon: 'ColorIcon' },
  { key: 'image', label: 'Image', icon: 'ImageIcon' },
  { key: 'video', label: 'Video', icon: 'VideoIcon' }
]

const gradientPresets = [
  { name: 'Purple Dream', value: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' },
  { name: 'Ocean Breeze', value: 'linear-gradient(135deg, #2E3192 0%, #1BFFFF 100%)' },
  { name: 'Sunset Glow', value: 'linear-gradient(135deg, #FF6B6B 0%, #4ECDC4 100%)' },
  { name: 'Forest Mist', value: 'linear-gradient(135deg, #134E5E 0%, #71B280 100%)' },
  { name: 'Cherry Blossom', value: 'linear-gradient(135deg, #F093FB 0%, #F5576C 100%)' },
  { name: 'Midnight City', value: 'linear-gradient(135deg, #232526 0%, #414345 100%)' }
]

const colorPresets = [
  '#1a1a1a', '#2d3748', '#4a5568', '#667eea', '#764ba2', 
  '#f093fb', '#f5576c', '#4ecdc4', '#ff6b6b', '#71b280'
]

const imagePresets = [
  { name: 'Mountain Lake', url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&h=1080&fit=crop' },
  { name: 'Forest Path', url: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1920&h=1080&fit=crop' },
  { name: 'Ocean Waves', url: 'https://images.unsplash.com/photo-1439066615861-d1af74d74000?w=1920&h=1080&fit=crop' },
  { name: 'Desert Dunes', url: 'https://images.unsplash.com/photo-1509316785289-025f5b846b35?w=1920&h=1080&fit=crop' }
]

const videoPresets = [
  { name: 'Flowing Water', url: '/videos/water-flow.mp4' },
  { name: 'Fireplace', url: '/videos/fireplace.mp4' },
  { name: 'Rain Window', url: '/videos/rain-window.mp4' },
  { name: 'Space Journey', url: '/videos/space.mp4' }
]

const colorValue = computed(() => {
  return store.backgroundType === 'color' ? store.backgroundValue : '#667eea'
})

function setBackgroundType(type) {
  store.backgroundType = type
  
  // Set default value for each type
  switch (type) {
    case 'gradient':
      store.backgroundValue = gradientPresets[0].value
      break
    case 'color':
      store.backgroundValue = colorPresets[0]
      break
    case 'image':
      store.backgroundValue = imagePresets[0].url
      break
    case 'video':
      store.backgroundValue = ''
      break
  }
}

function setBackground(type, value) {
  store.setBackground(type, value)
}

function loadBackgroundImage(event) {
  const file = event.target.files[0]
  if (file) {
    const url = URL.createObjectURL(file)
    setBackground('image', url)
  }
}
</script>

<script>
// Icon components
const GradientIcon = {
  template: `
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="currentColor" stop-opacity="1"/>
          <stop offset="100%" stop-color="currentColor" stop-opacity="0.3"/>
        </linearGradient>
      </defs>
      <rect x="3" y="3" width="18" height="18" rx="2" stroke="url(#grad)" stroke-width="2" fill="url(#grad)"/>
    </svg>
  `
}

const ColorIcon = {
  template: `
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2L2 22H22L12 2Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="currentColor"/>
    </svg>
  `
}

const ImageIcon = {
  template: `
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="3" y="3" width="18" height="18" rx="2" ry="2" stroke="currentColor" stroke-width="2"/>
      <circle cx="8.5" cy="8.5" r="1.5" stroke="currentColor" stroke-width="2"/>
      <path d="M21 15L16 10L5 21" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
  `
}

const VideoIcon = {
  template: `
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <polygon points="23 7 16 12 23 17 23 7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      <rect x="1" y="5" width="15" height="14" rx="2" ry="2" stroke="currentColor" stroke-width="2"/>
    </svg>
  `
}

export default {
  components: {
    GradientIcon,
    ColorIcon, 
    ImageIcon,
    VideoIcon
  }
}
</script>

<style scoped>
.background-settings {
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

.type-tabs {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 8px;
}

.type-tab {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 16px;
  border-radius: var(--border-radius-md);
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid var(--color-border);
  color: var(--color-text-secondary);
  font-size: 12px;
  font-weight: 500;
  transition: all var(--transition-fast);
}

.type-tab:hover {
  background: rgba(255, 255, 255, 0.1);
  color: var(--color-text-primary);
}

.type-tab.active {
  background: var(--color-primary);
  border-color: var(--color-primary);
  color: var(--color-text-primary);
}

.gradient-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}

.gradient-btn {
  position: relative;
  height: 80px;
  border-radius: var(--border-radius-md);
  border: 2px solid transparent;
  overflow: hidden;
  transition: all var(--transition-fast);
}

.gradient-btn:hover,
.gradient-btn.active {
  border-color: var(--color-primary);
  transform: scale(1.02);
}

.gradient-name {
  position: absolute;
  bottom: 8px;
  left: 12px;
  right: 12px;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 11px;
  font-weight: 500;
  text-align: center;
}

.color-section {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.color-picker {
  width: 60px;
  height: 60px;
  border-radius: var(--border-radius-md);
  border: 1px solid var(--color-border);
  background: transparent;
  cursor: pointer;
}

.color-presets {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 8px;
}

.color-preset {
  width: 40px;
  height: 40px;
  border-radius: var(--border-radius-sm);
  border: 2px solid transparent;
  cursor: pointer;
  transition: all var(--transition-fast);
}

.color-preset:hover,
.color-preset.active {
  border-color: var(--color-primary);
  transform: scale(1.1);
}

.image-section {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.upload-btn {
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

.upload-btn:hover {
  background: rgba(255, 255, 255, 0.1);
  border-color: var(--color-primary);
  color: var(--color-text-primary);
}

.presets-title {
  margin: 0 0 12px 0;
  font-size: 14px;
  font-weight: 500;
  color: var(--color-text-secondary);
}

.image-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 8px;
}

.image-btn {
  position: relative;
  height: 60px;
  border-radius: var(--border-radius-md);
  border: 2px solid transparent;
  background-size: cover;
  background-position: center;
  overflow: hidden;
  transition: all var(--transition-fast);
}

.image-btn:hover {
  border-color: var(--color-primary);
  transform: scale(1.02);
}

.image-name {
  position: absolute;
  bottom: 4px;
  left: 4px;
  right: 4px;
  background: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 10px;
  font-weight: 500;
  text-align: center;
}

.video-section {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.video-input {
  padding: 12px 16px;
  border-radius: var(--border-radius-sm);
  border: 1px solid var(--color-border);
  background: rgba(255, 255, 255, 0.05);
  color: var(--color-text-primary);
  font-size: 14px;
}

.video-input:focus {
  border-color: var(--color-primary);
  background: rgba(255, 255, 255, 0.1);
}

.video-input::placeholder {
  color: var(--color-text-muted);
}

.video-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 8px;
}

.video-btn {
  padding: 12px;
  border-radius: var(--border-radius-sm);
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid var(--color-border);
  color: var(--color-text-secondary);
  font-size: 12px;
  font-weight: 500;
  transition: all var(--transition-fast);
}

.video-btn:hover {
  background: rgba(255, 255, 255, 0.1);
  color: var(--color-text-primary);
}

.overlay-section {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.slider-label {
  display: flex;
  flex-direction: column;
  gap: 8px;
  font-size: 14px;
  color: var(--color-text-secondary);
}

.slider-container {
  display: flex;
  align-items: center;
  gap: 12px;
}

.opacity-slider {
  flex: 1;
  height: 6px;
  border-radius: 3px;
  background: rgba(255, 255, 255, 0.1);
  outline: none;
  cursor: pointer;
}

.opacity-slider::-webkit-slider-thumb {
  appearance: none;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: var(--color-primary);
  cursor: pointer;
}

.opacity-slider::-moz-range-thumb {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: var(--color-primary);
  cursor: pointer;
  border: none;
}

.slider-value {
  font-size: 12px;
  font-weight: 500;
  color: var(--color-text-primary);
  min-width: 40px;
  text-align: right;
}

/* Responsive */
@media (max-width: 480px) {
  .type-tabs {
    grid-template-columns: 1fr;
    gap: 6px;
  }
  
  .type-tab {
    flex-direction: row;
    justify-content: center;
    padding: 12px;
  }
  
  .gradient-grid,
  .image-grid,
  .video-grid {
    grid-template-columns: 1fr;
  }
  
  .color-presets {
    grid-template-columns: repeat(4, 1fr);
  }
}
</style>