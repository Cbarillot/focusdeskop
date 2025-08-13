<template>
  <div class="panel-section">
    <!-- Section de couleur du thème -->
    <div class="theme-color-section">
      <h3 class="section-title accent-title">Couleur d'accentuation</h3>
      
      <div class="color-picker-container">
        <div class="custom-color-picker">
          <h4 class="color-picker-label">Couleur personnalisée</h4>
          <div class="color-input-wrapper">
            <input 
              type="color" 
              v-model="customColor" 
              @change="updateThemeColor"
              class="color-input"
            >
            <span class="color-value">{{ customColor.toUpperCase() }}</span>
          </div>
        </div>
        
        <div class="preset-colors">
          <h4 class="preset-colors-label">Palettes prédéfinies</h4>
          <div class="color-presets-grid">
            <button 
              v-for="color in colorPresets" 
              :key="color"
              :style="{ 
                backgroundColor: color,
                border: customColor === color ? `2px solid ${getContrastColor(color)}` : '2px solid transparent'
              }"
              class="color-preset"
              @click="setThemeColor(color)"
              :title="getColorName(color)"
            >
              <span v-if="customColor === color" class="check-icon">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M20 6L9 17L4 12" :stroke="getContrastColor(color)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Filter Toolbar -->
    <div class="filters-section">
      <h3 class="section-title">Filtres de thèmes</h3>
      <div class="row g-3">
        <div class="col-6 col-md-3">
          <select v-model="filters.type" class="form-select">
            <option value="Tous">Type: Tous</option>
            <option value="canvas">Canvas</option>
            <option value="gradient">Gradient</option>
            <option value="color">Color</option>
            <option value="image">Image</option>
            <option value="video">Video</option>
            <option value="youtube">YouTube</option>
            <option value="animated">Animated</option>
            <option value="animated-gradient">Animated Gradient</option>
          </select>
        </div>
        <div class="col-6 col-md-3">
          <select v-model="filters.environment" class="form-select">
            <option value="Tous">Environnement: Tous</option>
            <option value="nature">Nature</option>
            <option value="cafe">Café</option>
            <option value="lofi">Lofi</option>
            <option value="urbain">Urbain</option>
          </select>
        </div>
        <div class="col-6 col-md-3">
          <select v-model="filters.brightness" class="form-select">
            <option value="Tous">Luminosité: Tous</option>
            <option value="clair">Clair</option>
            <option value="sombre">Sombre</option>
          </select>
        </div>
        <div class="col-6 col-md-3">
          <select v-model="filters.color" class="form-select">
            <option value="Tous">Couleur: Tous</option>
            <option value="violet">Violet</option>
            <option value="bleu">Bleu</option>
            <option value="vert">Vert</option>
            <option value="orange">Orange</option>
            <option value="rouge">Rouge</option>
            <option value="gris">Gris</option>
          </select>
        </div>
      </div>
    </div>

    <!-- All Themes Grid -->
    <div class="all-themes-section">
      <h3 class="section-title">Tous les thèmes</h3>
      <div class="row g-3">
        <div 
          v-for="(theme, key) in filteredThemes" 
          :key="key" 
          class="col-6 col-sm-4 col-md-3 col-lg-3 col-xl-2"
        >
          <div 
            class="theme-card-new"
            :class="{ active: store.currentTheme === key }"
            @click="selectTheme(key)"
            @mouseenter="handleVideoHover(key, $event, true)"
            @mouseleave="handleVideoHover(key, $event, false)"
          >
            <div class="theme-preview-new">
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
              <video
                v-else-if="theme.type === 'video' || theme.type === 'animated'"
                :src="theme.value"
                :poster="getVideoThumbnail(theme)"
                muted
                loop
                class="theme-video"
                :data-theme-key="key"
                @error="handleVideoError"
                @loadeddata="handleVideoLoaded"
                preload="none"
              ></video>
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
            <div class="theme-info-new">
              <h4 class="theme-name">{{ theme.name }}</h4>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <div class="theme-categories">
      <!-- Gradients & Colors Section -->
      <div class="category-section">
        <div 
          class="category-toggle" 
          role="button" 
          tabindex="0"
          @click="toggleSection('gradients')" 
          @keydown.enter="toggleSection('gradients')" 
          @keydown.space.prevent="toggleSection('gradients')"
        >
          <h4 class="category-title">🎨 Dégradés & Couleurs</h4>
          <span class="chevron" :class="{ open: sectionOpen.gradients }">▾</span>
        </div>
        
        <div class="themes-grid" v-show="sectionOpen.gradients">
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

      <!-- Images Section -->
      <div class="category-section">
        <div 
          class="category-toggle" 
          role="button" 
          tabindex="0"
          @click="toggleSection('images')" 
          @keydown.enter="toggleSection('images')" 
          @keydown.space.prevent="toggleSection('images')"
        >
          <h4 class="category-title">🖼️ Images</h4>
          <span class="chevron" :class="{ open: sectionOpen.images }">▾</span>
        </div>
        
        <div class="themes-grid" v-show="sectionOpen.images">
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
                loading="lazy"
              />
              <div class="theme-type-badge image">
                🖼️
              </div>
            </div>
            <div class="theme-info">
              <h4 class="theme-name">{{ theme.name }}</h4>
              <p class="theme-type">Image</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Animated Backgrounds Section -->
      <div class="category-section">
        <div 
          class="category-toggle" 
          role="button" 
          tabindex="0"
          @click="toggleSection('animated')" 
          @keydown.enter="toggleSection('animated')" 
          @keydown.space.prevent="toggleSection('animated')"
        >
          <h4 class="category-title">🎬 Animated</h4>
          <span class="chevron" :class="{ open: sectionOpen.animated }">▾</span>
        </div>
        
        <div class="themes-grid" v-show="sectionOpen.animated">
          <div
            v-for="(theme, key) in getThemesByCategory('animated')"
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
                @error="handleVideoError"
                @loadeddata="handleVideoLoaded"
                preload="metadata"
              ></video>
              <div class="theme-type-badge video">
                🎬
              </div>
              <div class="video-play-indicator">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M8 5V19L19 12L8 5Z" fill="currentColor"/>
                </svg>
              </div>
            </div>
            <div class="theme-info">
              <h4 class="theme-name">{{ theme.name }}</h4>
              <p class="theme-type">Animation</p>
            </div>
          </div>
        </div>
      </div>



      <!-- YouTube Background Section -->
      <div class="category-section">
        <div 
          class="category-toggle" 
          role="button" 
          tabindex="0"
          @click="toggleSection('youtube')" 
          @keydown.enter="toggleSection('youtube')" 
          @keydown.space.prevent="toggleSection('youtube')"
        >
          <h4 class="category-title">▶️ YouTube</h4>
          <span class="chevron" :class="{ open: sectionOpen.youtube }">▾</span>
        </div>
        
        <div class="youtube-section" v-show="sectionOpen.youtube">
          <div class="youtube-input-container">
            <input
              type="text"
              v-model="youtubeUrl"
              placeholder="Coller l'URL YouTube ici"
              class="youtube-input"
              @keydown.enter="setYoutubeBackground"
            />
            <button 
              class="youtube-button"
              @click="setYoutubeBackground"
              :disabled="!youtubeUrl"
            >
              Appliquer
            </button>
          </div>
          <p class="youtube-hint">Collez l'URL d'une vidéo YouTube pour l'utiliser comme fond d'écran</p>
        </div>
      </div>

      <!-- Custom Gradient Section -->
      <div class="category-section">
        <div 
          class="category-toggle" 
          role="button" 
          tabindex="0"
          @click="toggleSection('customGradient')" 
          @keydown.enter="toggleSection('customGradient')" 
          @keydown.space.prevent="toggleSection('customGradient')"
        >
          <h4 class="category-title">🌈 Dégradé personnalisé</h4>
          <span class="chevron" :class="{ open: sectionOpen.customGradient }">▾</span>
        </div>
        
        <div class="custom-gradient-section" v-show="sectionOpen.customGradient">
          <div class="gradient-controls">
            <div 
              v-for="(color, index) in customGradientColors" 
              :key="index"
              class="color-picker-container"
            >
              <input 
                type="color" 
                v-model="customGradientColors[index]"
                @input="updateCustomGradient"
                class="color-picker"
              >
              <button 
                v-if="index > 1"
                @click="removeColor(index)"
                class="remove-color"
                title="Supprimer cette couleur"
              >
                ×
              </button>
            </div>
            <button 
              v-if="customGradientColors.length < 5"
              @click="addColor"
              class="add-color"
              title="Ajouter une couleur"
            >
              +
            </button>
          </div>
          <div 
            class="gradient-preview"
            :style="{ background: customGradientPreview }"
          ></div>
          <button 
            @click="applyCustomGradient"
            class="apply-gradient"
          >
            Appliquer le dégradé
          </button>
        </div>
      </div>
    </div>

    <!-- YouTube Background Section -->
    <div class="setting-group">
      <div 
        class="category-toggle" 
        role="button" 
        tabindex="0"
        @click="toggleSection('youtube')" 
        @keydown.enter="toggleSection('youtube')" 
        @keydown.space.prevent="toggleSection('youtube')"
      >
        <h4 class="category-title">📺 YouTube Background</h4>
        <span class="chevron" :class="{ open: sectionOpen.youtube }">▾</span>
      </div>
      
      <div v-show="sectionOpen.youtube" class="youtube-section">
        <p class="setting-description">Ajoutez n'importe quelle vidéo YouTube comme arrière-plan. Parfait pour la musique lofi, les sons de la nature ou les vidéos d'ambiance.</p>
        
        <div class="youtube-input-section">
          <input
            v-model="youtubeUrl"
            type="text"
            placeholder="https://www.youtube.com/watch?v=..."
            class="youtube-input"
            @keyup.enter="addYouTubeBackground"
          />
          <button class="youtube-button" @click="addYouTubeBackground">
            Ajouter
          </button>
        </div>
        
        <p v-if="youtubeError" class="youtube-error">{{ youtubeError }}</p>
        
        <div class="youtube-examples">
          <p class="youtube-hint">Exemples rapides :</p>
          <div class="youtube-examples-grid">
            <button
              v-for="example in youtubeExamples"
              :key="example.id"
              class="youtube-example"
              @click="useExampleVideo(example.url)"
            >
              {{ example.title }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, nextTick } from 'vue'
import { useAppStore } from '../../stores/appStore'

// Couleurs prédéfinies pour le thème
const colorPresets = [
  '#7C3AED', // Violet actuel
  '#3B82F6', // Bleu
  '#10B981', // Vert
  '#F59E0B', // Orange
  '#EF4444', // Rouge
  '#8B5CF6', // Violet clair
  '#EC4899'  // Rose
]

const customColor = ref('#7C3AED')

// Mettre à jour la couleur du thème
function setThemeColor(color) {
  customColor.value = color
  updateThemeColor()
}

// Mettre à jour la couleur CSS personnalisée
function updateThemeColor() {
  document.documentElement.style.setProperty('--accent-color', customColor.value)
  // Sauvegarder la couleur dans le localStorage
  localStorage.setItem('themeColor', customColor.value)
}

// Récupérer le nom de la couleur pour le tooltip
function getColorName(color) {
  const colors = {
    '#7C3AED': 'Violet',
    '#3B82F6': 'Bleu',
    '#10B981': 'Vert',
    '#F59E0B': 'Orange',
    '#EF4444': 'Rouge',
    '#8B5CF6': 'Violet clair',
    '#EC4899': 'Rose',
    '#000000': 'Noir',
    '#FFFFFF': 'Blanc'
  }
  return colors[color] || 'Personnalisé'
}

// Obtenir une couleur de contraste (noir ou blanc) selon la luminosité
const getContrastColor = (hexColor) => {
  // Convertir la couleur hex en RVB
  const r = parseInt(hexColor.slice(1, 3), 16) / 255;
  const g = parseInt(hexColor.slice(3, 5), 16) / 255;
  const b = parseInt(hexColor.slice(5, 7), 16) / 255;
  
  // Calculer la luminosité perçue (formule d'accessibilité WCAG)
  const luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b;
  
  // Retourner noir pour les couleurs claires, blanc pour les couleurs foncées
  return luminance > 0.5 ? '#000000' : '#FFFFFF';
};

// Charger la couleur sauvegardée au montage
onMounted(async () => {
  const savedColor = localStorage.getItem('themeColor')
  if (savedColor) {
    customColor.value = savedColor
    updateThemeColor()
  }
  
  // Load all media assets from the themes directories
  await store.loadMediaAssets()
})

const store = useAppStore()
const youtubeUrl = ref('')
const youtubeError = ref('')
const customGradientColors = ref(['#4F46E5', '#7C3AED', '#EC4899', '#F59E0B'])

// Filter state
const filters = ref({
  type: 'Tous',
  environment: 'Tous',
  brightness: 'Tous',
  color: 'Tous'
})

// Exemples de vidéos YouTube
const youtubeExamples = [
  {
    id: 1,
    title: 'Lofi Hip Hop',
    url: 'https://www.youtube.com/watch?v=jfKfPfyJRdk'
  },
  {
    id: 2,
    title: 'Medieval Village',
    url: 'https://youtu.be/OxMQjlBq6zQ?list=PLnmUBkCASRfgk0jCglV0qQ_VhwiDHsVcY'
  },
  {
    id: 3,
    title: 'Witchcore Ambience',
    url: 'https://youtu.be/kfZyQ4K2vcw?list=PLnmUBkCASRfgk0jCglV0qQ_VhwiDHsVcY'
  },
  {
    id: 4,
    title: 'Cosy fantasy village',
    url: 'https://youtu.be/ywH2C6KVFno?list=PLnmUBkCASRfgk0jCglV0qQ_VhwiDHsVcY'
  },
  {
    id: 5,
    title: 'Peaceful Day at Hogwarts',
    url: 'https://youtu.be/pQdTu0IeVho?list=PLnmUBkCASRfgk0jCglV0qQ_VhwiDHsVcY'
  },
  {
    id: 6,
    title: 'Cozy Magical Library',
    url: 'https://youtu.be/Z1oUGthAzeo?list=RDZ1oUGthAzeo'
  }
]

// Compute the gradient preview
const customGradientPreview = computed(() => {
  return `linear-gradient(45deg, ${customGradientColors.value.join(', ')})`
})

// Compute filtered themes
const filteredThemes = computed(() => {
  const allThemes = store.themes
  let filtered = {}

  Object.entries(allThemes).forEach(([key, theme]) => {
    let includeTheme = true

    // Type filter - defensive approach
    if (filters.value.type !== 'Tous') {
      if (theme.type && theme.type !== filters.value.type) {
        includeTheme = false
      } else if (!theme.type && filters.value.type !== 'Tous') {
        // If theme has no type but filter is set, exclude only if we're looking for a specific type
        includeTheme = false
      }
    }

    // Environment filter - defensive approach (only filter if theme has environmentTag)
    if (includeTheme && filters.value.environment !== 'Tous') {
      if (theme.environmentTag && theme.environmentTag !== filters.value.environment) {
        includeTheme = false
      }
      // If theme doesn't have environmentTag, don't exclude it
    }

    // Brightness filter - defensive approach (only filter if theme has brightnessTag)
    if (includeTheme && filters.value.brightness !== 'Tous') {
      if (theme.brightnessTag && theme.brightnessTag !== filters.value.brightness) {
        includeTheme = false
      }
      // If theme doesn't have brightnessTag, don't exclude it
    }

    // Color filter - defensive approach (only filter if theme has colorTag)
    if (includeTheme && filters.value.color !== 'Tous') {
      if (theme.colorTag && theme.colorTag !== filters.value.color) {
        includeTheme = false
      }
      // If theme doesn't have colorTag, don't exclude it
    }

    if (includeTheme) {
      filtered[key] = theme
    }
  })

  return filtered
})

// Collapsible sections state
const sectionOpen = ref({
  gradients: true,
  images: true,
  animated: true,
  youtube: false,
  customGradient: false,
  gradientPresets: true,
})

function toggleSection(key) {
  sectionOpen.value[key] = !sectionOpen.value[key]
}

function selectTheme(themeKey) {
  store.setTheme(themeKey)
}

function getPreviewImage(theme) {
  if (theme.preview) return theme.preview
  if (theme.type === 'color' || theme.type === 'gradient') return ''
  return theme.value
}

function getVideoThumbnail(theme) {
  // Check if theme has a custom thumbnail
  if (theme.thumbnail) return theme.thumbnail
  
  // For YouTube videos, use YouTube thumbnail API
  if (theme.type === 'youtube' && theme.value) {
    const videoId = extractYoutubeId(theme.value)
    if (videoId) {
      return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`
    }
  }
  
  // For other video types, check if there's a preview image
  if (theme.preview) return theme.preview
  
  // Fallback: try to use a screenshot or poster frame if available
  if (theme.poster) return theme.poster
  
  // Ultimate fallback: return empty string to show a placeholder
  return ''
}

function getCanvasPreviewGradient(colors) {
  if (!colors || !colors.length) return 'linear-gradient(45deg, #ff9a9e, #fad0c4)'
  return `linear-gradient(45deg, ${colors.join(', ')})`
}

function getTypeBadge(type) {
  const badges = {
    canvas: '🖌️',
    gradient: '🌈',
    color: '🎨',
    image: '🖼️',
    video: '🎥',
    youtube: '▶️',
    animated: '🎬'
  }
  return badges[type] || '✨'
}

function getTypeLabel(type) {
  const labels = {
    canvas: 'Canvas',
    gradient: 'Gradient',
    color: 'Color',
    image: 'Image',
    video: 'Video',
    youtube: 'YouTube',
    animated: 'Animated'
  }
  return labels[type] || 'Theme'
}

function getThemesByCategory(category) {
  const themes = {}
  
  // Get built-in themes and loaded media assets
  Object.entries(store.themes).forEach(([key, theme]) => {
    if (theme.category === category) {
      themes[key] = theme
    }
  })
  
  return themes
}

// Gestion des erreurs d'image
function handleImageError(event) {
  const img = event.target
  img.style.display = 'none'
  
  // Create a more descriptive fallback for videos
  const fallback = document.createElement('div')
  fallback.className = 'fallback-preview'
  
  if (img.tagName.toLowerCase() === 'video') {
    fallback.innerHTML = `
      <div class="fallback-content">
        <div class="fallback-icon">🎬</div>
        <div class="fallback-text">Video Preview</div>
      </div>
    `
  } else {
    fallback.innerHTML = `
      <div class="fallback-content">
        <div class="fallback-icon">🌌</div>
        <div class="fallback-text">Image Preview</div>
      </div>
    `
  }
  
  img.parentNode.insertBefore(fallback, img.nextSibling)
}

// Gestion des dégradés personnalisés
function updateCustomGradient() {
  // Mise à jour du prévisualisation via la computed property
}

function addColor() {
  if (customGradientColors.value.length < 5) {
    customGradientColors.value.push('#000000')
  }
}

function removeColor(index) {
  if (customGradientColors.value.length > 2) {
    customGradientColors.value.splice(index, 1)
  }
}

function applyCustomGradient() {
  const gradientValue = customGradientPreview.value
  store.setBackground('gradient', gradientValue)
  
  // Créer un thème personnalisé
  const themeId = `custom-gradient-${Date.now()}`
  const newTheme = {
    name: 'Dégradé personnalisé',
    type: 'gradient',
    value: gradientValue,
    category: 'gradients',
    custom: true
  }
  
  // Ajouter le thème à la liste
  store.themes[themeId] = newTheme
  
  // Sélectionner le nouveau thème
  store.setTheme(themeId)
}

// Gestion des vidéos YouTube
function setYoutubeBackground() {
  if (!youtubeUrl.value) return
  
  // Extraire l'ID de la vidéo YouTube
  const videoId = extractYoutubeId(youtubeUrl.value)
  if (!videoId) {
    alert("L'URL YouTube n'est pas valide")
    return
  }
  
  store.setYouTubeBackground(youtubeUrl.value)
  
  // Créer un thème personnalisé pour YouTube
  const themeId = `youtube-${videoId}`
  const newTheme = {
    name: 'YouTube Video',
    type: 'youtube',
    value: youtubeUrl.value,
    category: 'youtube',
    preview: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
    custom: true
  }
  
  // Ajouter le thème à la liste
  store.themes[themeId] = newTheme
  
  // Sélectionner le nouveau thème
  store.setTheme(themeId)
  
  // Réinitialiser l'URL
  youtubeUrl.value = ''
}

// Fonction utilitaire pour extraire l'ID d'une vidéo YouTube
function extractYoutubeId(url) {
  const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/
  const match = url.match(regExp)
  return (match && match[7].length === 11) ? match[7] : null
}

function useExampleVideo(url) {
  youtubeUrl.value = url
  youtubeError.value = ''
  // Défilement vers le champ d'entrée
  nextTick(() => {
    const input = document.querySelector('.youtube-input')
    if (input) input.focus()
  })
}

function addYouTubeBackground() {
  if (!youtubeUrl.value.trim()) {
    youtubeError.value = 'Veuillez entrer une URL YouTube valide'
    return
  }

  const videoId = extractYoutubeId(youtubeUrl.value)
  if (!videoId) {
    youtubeError.value = 'URL YouTube non valide. Format attendu : https://www.youtube.com/watch?v=...'
    return
  }

  // Appeler la fonction du store pour définir l'arrière-plan YouTube
  store.setYouTubeBackground(youtubeUrl.value)
  
  // Réinitialiser le champ
  youtubeUrl.value = ''
  youtubeError.value = ''
  
  // Afficher un message de succès
  // Vous pouvez ajouter une notification ici si nécessaire
}

// Video preview optimization methods - improved for better preview loading
function playPreview(event) {
  const video = event.currentTarget.querySelector('video')
  if (video) {
    // Load the video metadata first if not already loaded
    if (video.readyState < 1) {
      video.preload = 'metadata'
      video.load()
    }
    
    // Only play if video has loaded enough data
    const playPromise = video.play()
    if (playPromise !== undefined) {
      playPromise.catch(e => {
        console.warn('Error playing video preview:', e)
        // Video failed to play, keep showing poster/fallback
      })
    }
  }
}

function pausePreview(event) {
  const video = event.currentTarget.querySelector('video')
  if (video) {
    video.pause()
    video.currentTime = 0
  }
}

// Enhanced video hover handling for the all-themes grid
function handleVideoHover(themeKey, event, isEntering) {
  const video = event.currentTarget.querySelector('video')
  if (!video) return
  
  const theme = store.themes[themeKey]
  if (!theme || (theme.type !== 'video' && theme.type !== 'animated')) return
  
  if (isEntering) {
    // Load video on hover for better performance
    if (video.readyState < 1) {
      video.preload = 'metadata'
      video.load()
    }
    
    const playPromise = video.play()
    if (playPromise !== undefined) {
      playPromise.catch(e => {
        console.warn('Error playing video preview:', e)
      })
    }
  } else {
    video.pause()
    video.currentTime = 0
    // Reset preload to save bandwidth
    video.preload = 'none'
  }
}

// Handle video loading states
function handleVideoError(event) {
  const video = event.target
  const themeKey = video.getAttribute('data-theme-key')
  
  if (themeKey && store.themes[themeKey]) {
    store.themes[themeKey].videoError = true
  }
  
  // Call original error handler for fallback
  handleImageError(event)
}

function handleVideoLoaded(event) {
  const video = event.target
  const themeKey = video.getAttribute('data-theme-key')
  
  if (themeKey && store.themes[themeKey]) {
    store.themes[themeKey].videoLoaded = true
  }
}
</script>

<style scoped>
.panel-section {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
  color: var(--color-text-primary);
}

/* Styles pour les cartes de thèmes */
.themes-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
  gap: 16px;
  margin: 0;
  padding: 4px 0;
}

.theme-card {
  background: transparent;
  border-radius: 12px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.2s ease;
  border: 2px solid transparent;
  position: relative;
  aspect-ratio: 4/3;
  height: auto;
}

.theme-card:hover {
  transform: translateY(-2px) scale(1.02);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15);
}

.theme-card.active {
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px rgba(var(--color-primary-rgb), 0.3);
}

.theme-preview {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.theme-image, .theme-video {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.theme-video {
  background-color: #1a1a1a;
  position: relative;
}

.theme-video[poster] {
  object-fit: cover;
}

.theme-card:hover .theme-image,
.theme-card:hover .theme-video {
  transform: scale(1.05);
}

.theme-video {
  position: absolute;
  top: 0;
  left: 0;
  opacity: 0.9;
  transition: opacity 0.3s ease;
}

.theme-card:hover .theme-video {
  opacity: 1;
}

.video-play-indicator {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 48px;
  height: 48px;
  background: rgba(0, 0, 0, 0.6);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.2s ease;
  pointer-events: none;
}

.theme-card:hover .video-play-indicator {
  opacity: 1;
}

.theme-card .video-play-indicator svg {
  width: 24px;
  height: 24px;
  color: white;
  margin-left: 3px;
}

.video-loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
}

.loading-spinner {
  width: 32px;
  height: 32px;
  border: 3px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top: 3px solid white;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.fallback-preview {
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  text-align: center;
}

.fallback-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.fallback-icon {
  font-size: 32px;
  opacity: 0.8;
}

.fallback-text {
  font-size: 12px;
  opacity: 0.7;
  font-weight: 500;
}

.theme-type-badge.video {
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(4px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  font-size: 14px;
  padding: 4px 8px;
  border-radius: 12px;
}

.gradient-preview,
.canvas-preview,
.animated-gradient-preview {
  width: 100%;
  height: 100%;
  position: relative;
  background-size: cover;
  background-position: center;
}

.canvas-indicator,
.animated-indicator {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 28px;
  opacity: 0.9;
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
}

.theme-type-badge {
  position: absolute;
  top: 8px;
  right: 8px;
  background: rgba(0, 0, 0, 0.6);
  color: white;
  border-radius: 20px;
  padding: 4px 10px;
  font-size: 11px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 4px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  backdrop-filter: blur(4px);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.theme-info {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 12px;
  background: linear-gradient(transparent, rgba(0, 0, 0, 0.7));
  color: white;
  opacity: 0;
  transform: translateY(10px);
  transition: all 0.2s ease;
  pointer-events: none;
}

.theme-card:hover .theme-info {
  opacity: 1;
  transform: translateY(0);
}

.theme-name {
  margin: 0 0 2px 0;
  font-size: 13px;
  font-weight: 600;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
}

.theme-type {
  margin: 0;
  font-size: 11px;
  color: rgba(255, 255, 255, 0.8);
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
  font-weight: 500;
}

/* Styles pour la section YouTube */
.setting-group {
  margin-top: 24px;
  background: var(--color-bg-secondary);
  border-radius: 12px;
  padding: 16px;
}

.youtube-section {
  margin-top: 16px;
  padding-top: 12px;
  border-top: 1px solid var(--color-border);
}

.setting-description {
  color: var(--color-text-secondary);
  font-size: 0.9rem;
  margin-bottom: 16px;
  line-height: 1.5;
}

.youtube-input-section {
  display: flex;
  gap: 8px;
  margin-bottom: 12px;
}

.youtube-input {
  flex: 1;
  padding: 10px 14px;
  border-radius: 8px;
  border: 1px solid var(--color-border);
  background: var(--color-bg-primary);
  color: var(--color-text-primary);
  font-size: 0.95rem;
  transition: all 0.2s ease;
}

.youtube-input:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 2px rgba(var(--color-primary-rgb), 0.2);
}

.youtube-button {
  padding: 0 20px;
  background: var(--color-primary);
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s ease;
}

.youtube-button:hover {
  opacity: 0.9;
  transform: translateY(-1px);
}

.youtube-button:active {
  transform: translateY(0);
}

.youtube-error {
  color: #ff6b6b;
  font-size: 0.85rem;
  margin: 8px 0 16px;
}

.youtube-examples {
  margin-top: 20px;
  padding-top: 16px;
  border-top: 1px solid var(--color-border);
}

.youtube-hint {
  font-size: 0.85rem;
  color: var(--color-text-secondary);
  margin: 0 0 12px 0;
}

.youtube-examples-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
  gap: 10px;
}

.youtube-example {
  background: var(--color-bg-primary);
  border: 1px solid var(--color-border);
  border-radius: 6px;
  padding: 8px 12px;
  font-size: 0.85rem;
  text-align: left;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.youtube-example:hover {
  background: var(--color-bg-hover);
  border-color: var(--color-primary);
  color: var(--color-primary);
}

/* Styles pour la section de dégradé personnalisé */
.custom-gradient-section {
  margin-top: 16px;
}

.gradient-controls {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 12px;
}

.color-picker-container {
  position: relative;
  display: flex;
  align-items: center;
  gap: 4px;
}

.color-picker {
  width: 40px;
  height: 40px;
  padding: 0;
  border: 1px solid var(--color-border);
  border-radius: 4px;
  cursor: pointer;
  background: transparent;
}

.remove-color {
  position: absolute;
  top: -8px;
  right: -8px;
  width: 20px;
  height: 20px;
  background: #ef4444;
  color: white;
  border: none;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  line-height: 1;
  cursor: pointer;
  padding: 0;
}

.add-color {
  width: 40px;
  height: 40px;
  border: 2px dashed var(--color-border);
  background: transparent;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  color: var(--color-text-secondary);
  cursor: pointer;
  transition: all 0.2s;
}

.add-color:hover {
  border-color: var(--color-primary);
  color: var(--color-primary);
}

.gradient-preview {
  width: 100%;
  height: 80px;
  border-radius: 4px;
  margin-bottom: 12px;
  border: 1px solid var(--color-border);
}

.apply-gradient {
  width: 100%;
  padding: 10px;
  background: var(--color-primary);
  color: white;
  border: none;
  border-radius: 4px;
  font-weight: 500;
  cursor: pointer;
  transition: opacity 0.2s;
}

.apply-gradient:hover {
  opacity: 0.9;
}

/* Styles pour les sections réductibles */
.category-section {
  margin-bottom: 24px;
  background: var(--color-bg-secondary);
  border-radius: 12px;
  padding: 16px;
  transition: all 0.2s ease;
}

.category-section:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}


.category-toggle {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 0;
  padding: 10px 0;
  cursor: pointer;
  user-select: none;
  transition: all 0.2s ease;
  border-radius: 4px;
  margin: -10px -10px 10px -10px;
  padding: 10px;
}

.category-toggle:hover {
  background: rgba(255, 255, 255, 0.05);
}

.category-title {
  margin: 0;
  font-size: 1rem;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 8px;
}

.chevron {
  transition: transform 0.2s ease;
}

.chevron.open {
  transform: rotate(180deg);
}

/* Styles pour les écrans plus petits */
@media (max-width: 768px) {
  .themes-grid {
    grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  }
  
  .theme-preview {
    height: 80px;
  }
}

@media (max-width: 480px) {
  .themes-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

h3 {
  margin: 0 0 10px 0;
  color: var(--color-text-primary);
  font-size: 1.5rem;
}

.section-description {
  margin: 0 0 20px 0;
  color: var(--color-text-secondary);
  font-size: 0.9rem;
}

.theme-categories {
  margin-bottom: 32px;
}

.category-section {
  margin-bottom: 24px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  padding: 16px;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

/* Section de couleur du thème */
.theme-color-section {
  background: rgba(0, 0, 0, 0.1);
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 30px;
  border: 1px solid rgba(255, 255, 255, 0.05);
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  user-select: none;
  transition: all 0.2s ease;
}

.accent-title {
  text-align: center;
  font-weight: 600;
  margin-bottom: 20px;
  color: var(--color-text);
  font-size: 1.2rem;
}

.color-picker-container {
  display: flex;
  flex-direction: row;
  gap: 30px;
  align-items: flex-start;
}

@media (max-width: 768px) {
  .color-picker-container {
    flex-direction: column;
    gap: 20px;
  }
}

.custom-color-picker,
.preset-colors {
  background: rgba(0, 0, 0, 0.1);
  border-radius: 10px;
  padding: 16px;
  border: 1px solid rgba(255, 255, 255, 0.05);
  flex: 1;
  min-width: 0;
}

.color-picker-label,
.preset-colors-label {
  display: block;
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--color-text);
  margin: 0 0 15px 0;
  text-align: center;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  padding-bottom: 8px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.color-input-wrapper {
  display: flex;
  align-items: center;
  gap: 12px;
}

.color-input {
  width: 50px;
  height: 50px;
  border: 2px solid rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  cursor: pointer;
  background: transparent;
  padding: 0;
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  margin: 0;
  background: transparent;
}

.color-input::-webkit-color-swatch {
  border: 2px solid white;
  border-radius: 6px;
  padding: 0;
  margin: 0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}

.color-input::-webkit-color-swatch-wrapper {
  padding: 0;
  margin: 0;
  border: none;
}

.color-value {
  font-family: 'Fira Code', monospace;
  font-size: 0.85rem;
  color: white;
  background: rgba(255, 255, 255, 0.15);
  padding: 8px 12px;
  border-radius: 6px;
  min-width: 80px;
  text-align: center;
  margin-left: 10px;
  font-weight: 500;
  letter-spacing: 0.5px;
}

.color-presets-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(40px, 1fr));
  gap: 12px;
  margin-top: 10px;
}

.color-preset {
  width: 36px;
  height: 36px;
  border-radius: 8px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  margin: 0;
  overflow: hidden;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
}

.color-preset:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.check-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  backdrop-filter: blur(5px);
  padding: 2px;
}

/* Styles pour les titres de section */
.section-title {
  margin: 0 0 4px 0;
  font-size: 1.1rem;
  font-weight: 500;
  color: var(--color-text);
}

.section-description {
  margin: 0;
  font-size: 0.85rem;
  color: var(--color-text-secondary);
  opacity: 0.8;
}

.category-toggle:hover {
  background: rgba(255, 255, 255, 0.05);
}

.category-toggle h4 {
  margin: 0;
  font-size: 1.1rem;
  font-weight: 500;
  color: var(--color-text-primary);
  display: flex;
  align-items: center;
  gap: 8px;
}

.chevron.open {
  transform: rotate(180deg);
}

.themes-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 16px;
  margin-top: 12px;
}

.theme-card {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.2s ease;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.theme-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.3);
  border-color: var(--color-primary, #3B82F6);
  background: rgba(255, 255, 255, 0.15);
}

.theme-card.active {
  border: 2px solid var(--color-primary);
  box-shadow: 0 0 0 2px var(--color-primary-30);
}

.theme-preview {
  position: relative;
  height: 100px;
  background: var(--color-bg-secondary);
  overflow: hidden;
}

.theme-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.canvas-preview,
.gradient-preview,
.color-preview {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
}

.theme-type-badge {
  position: absolute;
  top: 8px;
  right: 8px;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  border-radius: 4px;
  padding: 2px 6px;
  font-size: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 24px;
  min-height: 24px;
}

.theme-info {
  padding: 12px;
  background: rgba(255, 255, 255, 0.03);
}

.theme-name {
  margin: 0 0 4px 0;
  font-size: 0.9rem;
  font-weight: 500;
  color: var(--color-text-primary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.theme-type {
  margin: 0;
  font-size: 0.75rem;
  color: var(--color-text-secondary);
  opacity: 0.8;
}

/* Filters Section */
.filters-section {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 30px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.filters-section .section-title {
  margin-bottom: 16px;
  color: var(--color-text-primary);
  font-size: 1.1rem;
  font-weight: 600;
}

.form-select {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  color: var(--color-text-primary);
  padding: 8px 12px;
  font-size: 0.9rem;
  transition: all 0.2s ease;
}

.form-select:focus {
  background: rgba(255, 255, 255, 0.15);
  border-color: var(--color-primary);
  box-shadow: 0 0 0 2px rgba(var(--color-primary-rgb, 139, 92, 246), 0.3);
  outline: none;
  color: var(--color-text-primary);
}

.form-select option {
  background: #2d3748;
  color: #ffffff;
  padding: 8px 12px;
}

.form-select option:hover {
  background: #4a5568;
  color: #ffffff;
}

.form-select option:checked {
  background: var(--color-primary, #7C3AED);
  color: #ffffff;
}

/* All Themes Section */
.all-themes-section {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 30px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.all-themes-section .section-title {
  margin-bottom: 20px;
  color: var(--color-text-primary);
  font-size: 1.2rem;
  font-weight: 600;
  text-align: center;
}

/* New Theme Cards for All Themes Grid */
.theme-card-new {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.2s ease;
  border: 3px solid transparent;
  position: relative;
  aspect-ratio: 4/3;
  height: auto;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.theme-card-new:hover {
  transform: translateY(-2px) scale(1.02);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
  background: rgba(255, 255, 255, 0.08);
}

.theme-card-new.active {
  border-color: white;
  box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.5), 0 8px 16px rgba(0, 0, 0, 0.2);
}

.theme-preview-new {
  position: relative;
  width: 100%;
  height: calc(100% - 40px);
  overflow: hidden;
  border-radius: 8px 8px 0 0;
}

.theme-info-new {
  padding: 8px 12px;
  background: rgba(0, 0, 0, 0.3);
  text-align: center;
}

.theme-info-new .theme-name {
  margin: 0;
  font-size: 0.85rem;
  font-weight: 500;
  color: var(--color-text-primary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* Responsive adjustments for Bootstrap grid */
@media (max-width: 768px) {
  .all-themes-section .row {
    margin-left: -8px;
    margin-right: -8px;
  }
  
  .all-themes-section .row > * {
    padding-left: 8px;
    padding-right: 8px;
  }
  
  .theme-card-new {
    aspect-ratio: 4/3;
    min-height: 120px;
  }
}

@media (min-width: 576px) {
  .col-sm-4 {
    flex: 0 0 auto;
    width: 33.33333%;
  }
}

@media (min-width: 768px) {
  .col-md-3 {
    flex: 0 0 auto;
    width: 25%;
  }
}

@media (min-width: 992px) {
  .col-lg-3 {
    flex: 0 0 auto;
    width: 25%;
  }
}

@media (min-width: 1200px) {
  .col-xl-2 {
    flex: 0 0 auto;
    width: 16.66666%;
  }
  
  .theme-card-new {
    aspect-ratio: 1;
    min-height: 140px;
  }
}

/* Compact grid spacing */
.all-themes-section .row {
  row-gap: 1rem;
  column-gap: 0.75rem;
}
</style>
