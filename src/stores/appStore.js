import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useAppStore = defineStore('app', () => {
  // Timer state
  const timerMode = ref('pomodoro') // pomodoro, shortBreak, longBreak
  const timeRemaining = ref(25 * 60) // in seconds
  const isRunning = ref(false)
  const cycle = ref(0)
  let timerInterval = null
  
  // Timer settings
  const pomodoroTime = ref(25 * 60)
  const shortBreakTime = ref(5 * 60)
  const longBreakTime = ref(15 * 60)
  
  // UI state
  const sidebarOpen = ref(false)
  const activeTab = ref('themes') // themes, clock, timer, stats, music, notepad, sounds, quotes, background, todo
  const isFullscreen = ref(false) // Fullscreen mode state
  const timerDisplayMode = ref('focus') // focus, ambiance, home

// Theme & styling
const currentTheme = ref('toto-forest') // home, ambiance, focus, toto-forest, etc.
const backgroundType = ref('canvas') // gradient, image, video, canvas, color, youtube, animated-gradient
const backgroundValue = ref('lava-lamp') // valeur par défaut selon le backgroundType
const overlayOpacity = ref(0.2) // compromis entre 0.1 et 0.3

// Custom gradient colors (utilisé pour les backgrounds personnalisés)
const customGradientColors = ref(['#DF437A', '#3d57d6', '#a117fd', '#ec634b'])

// Authentic Flocus themes with official assets + custom, canvas/animated themes, and color palettes
const themes = ref({
  // Gradients & Couleurs
  'aura-twilight': {
    name: 'Aura Twilight',
    type: 'image',
    value: 'https://app.flocus.com/resources/images/themes/fc5d2c05dba5c17ea3fa.jpg',
    preview: 'https://app.flocus.com/resources/images/themes/58caf7f5c0a933ebfcf7.jpg'
  },
  // ... (tous les autres thèmes de la version ai_main_f671d7f41848, à conserver)
  // Exemple avec les mondes ambiants, canvas, animated, custom, etc.
  'lava-lamp': {
    name: 'Lava Lamp',
    type: 'canvas',
    value: 'lava-lamp',
    colors: ['#DF437A', '#3d57d6', '#a117fd', '#ec634b'],
    preview: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjEyMCIgdmlld0JveD0iMCAwIDIwMCAxMjAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PGxpbmVhckdyYWRpZW50IGlkPSJncmFkIiB4MT0iMCUiIHkxPSIwJSIgeDI9IjEwMCUiIHkyPSIxMDAlIj48c3RvcCBvZmZzZXQ9IjAlIiBzdHlsZT0ic3RvcC1jb2xvcjojREY0MzdBIiAvPjxzdG9wIG9mZnNldD0iMzMlIiBzdHlsZT0ic3RvcC1jb2xvcjojM2Q1N2Q2IiAvPjxzdG9wIG9mZnNldD0iNjYlIiBzdHlsZT0ic3RvcC1jb2xvcjojYTExN2ZkIiAvPjxzdG9wIG9mZnNldD0iMTAwJSIgc3R5bGU9InN0b3AtY29sb3I6I2VjNjM0YiIgLz48L2xpbmVhckdyYWRpZW50PjwvZGVmcz48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjEyMCIgZmlsbD0idXJsKCNncmFkKSIgcng9IjgiLz48L3N2Zz4='
  },
  'custom-animated-gradient': {
    name: 'Custom Animated Gradient',
    type: 'animated-gradient',
    value: 'custom',
    colors: ['#DF437A', '#3d57d6', '#a117fd', '#ec634b'],
    preview: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjEyMCIgdmlld0JveD0iMCAwIDIwMCAxMjAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PGxpbmVhckdyYWRpZW50IGlkPSJhbmltYXRlZCIgeDI9IjEwMCUiIHkyPSIxMDAlIj48c3RvcCBvZmZzZXQ9IjAlIiBzdHlsZT0ic3RvcC1jb2xvcjojREY0MzdBIiAvPjxzdG9wIG9mZnNldD0iMzMlIiBzdHlsZT0ic3RvcC1jb2xvcjojM2Q1N2Q2IiAvPjxzdG9wIG9mZnNldD0iNjYlIiBzdHlsZT0ic3RvcC1jb2xvcjojYTExN2ZkIiAvPjxzdG9wIG9mZnNldD0iMTAwJSIgc3R5bGU9InN0b3AtY29sb3I6I2VjNjM0YiIgLz48L2xpbmVhckdyYWRpZW50PjwvZGVmcz48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjEyMCIgZmlsbD0idXJsKCNhbmltYXRlZCkiIHJ4PSI4Ii8+PGNpcmNsZSBjeD0iMTAwIiBjeT0iNjAiIHI9IjMiIGZpbGw9IndoaXRlIiBvcGFjaXR5PSIwLjgiPjxhbmltYXRlIGF0dHJpYnV0ZU5hbWU9Im9wYWNpdHkiIHZhbHVlcz0iMC44OzAuMzswLjgiIGR1cj0iMnMiIHJlcGVhdENvdW50PSJpbmRlZmluaXRlIi8+PC9jaXJjbGU+PC9zdmc+'
  },

  // === NEW THEMES FROM ASSETS ===
  
  // ===== IMAGE THEMES (NATURE/AMBIENT) =====
  '3d-cartoon-door': {
    name: '3D Cartoon Door',
    type: 'image',
    value: '/assets/themes/images/3d-rendering-cartoon-welcome-door.jpg',
    preview: '/assets/themes/images/3d-rendering-cartoon-welcome-door.jpg',
    category: 'images'
  },
  'digital-river-landscape': {
    name: 'Digital River Landscape',
    type: 'image', 
    value: '/assets/themes/images/digital-art-style-river-nature-landscape.jpg',
    preview: '/assets/themes/images/digital-art-style-river-nature-landscape.jpg',
    category: 'images'
  },
  'mysterious-forest-cat': {
    name: 'Mysterious Forest Cat',
    type: 'image',
    value: '/assets/themes/images/mysterious-cat-sunny-forest.jpg', 
    preview: '/assets/themes/images/mysterious-cat-sunny-forest.jpg',
    category: 'images'
  },
  'mononoke-forest': {
    name: 'Mononoke Forest',
    type: 'image',
    value: '/assets/themes/images/mononoké forest.jpg',
    preview: '/assets/themes/images/mononoké forest.jpg',
    category: 'images'
  },
  'kiki-flying': {
    name: 'Kiki Flying',
    type: 'image',
    value: '/assets/themes/images/kiki flying.jpg',
    preview: '/assets/themes/images/kiki flying.jpg',
    category: 'images'
  },
  'chihiro-flowers': {
    name: 'Chihiro\'s Flowers',
    type: 'image',
    value: '/assets/themes/images/chihiro\'s flowers.jpg',
    preview: '/assets/themes/images/chihiro\'s flowers.jpg',
    category: 'images'
  },
  'totoro-forest': {
    name: 'Totoro\'s Forest',
    type: 'image',
    value: '/assets/themes/images/totoro\'s forest.jpg',
    preview: '/assets/themes/images/totoro\'s forest.jpg',
    category: 'images'
  },
  'monet-painting': {
    name: 'Monet Landscape',
    type: 'image',
    value: '/assets/themes/images/793829-monet-desktop-wallpaper-1920x1080-free-download.jpg',
    preview: '/assets/themes/images/793829-monet-desktop-wallpaper-1920x1080-free-download.jpg',
    category: 'images'
  },
  'bay-of-naples': {
    name: 'Bay of Naples (Aivazovsky)',
    type: 'image',
    value: '/assets/themes/images/4-the-bay-of-naples-in-the-morning-1893-Romantic-Ivan-Aivazovsky-Russian.jpg',
    preview: '/assets/themes/images/4-the-bay-of-naples-in-the-morning-1893-Romantic-Ivan-Aivazovsky-Russian.jpg',
    category: 'images'
  },
  'kiki-workshop': {
    name: 'Kiki\'s Workshop',
    type: 'image',
    value: '/assets/themes/images/kiki\'s workshop.jpg',
    preview: '/assets/themes/images/kiki\'s workshop.jpg',
    category: 'images'
  },

  // ===== ANIMATED BACKGROUNDS (NATURE SUBCATEGORY) =====
  'spirited-away-island': {
    name: 'Island House (Spirited Away)',
    type: 'video',
    value: '/assets/themes/videos/island-house-spirited-away-moewalls-com.mp4',
    preview: '/assets/themes/videos/island-house-spirited-away-moewalls-com.mp4',
    category: 'nature'
  },
  'flowers-water-stream': {
    name: 'Flowers & Water Stream (Ghibli)',
    type: 'video',
    value: '/assets/themes/videos/flowers-water-stream-ghibli-moewalls-com.mp4',
    preview: '/assets/themes/videos/flowers-water-stream-ghibli-moewalls-com.mp4',
    category: 'nature'
  },
  'totoro-rain': {
    name: 'Totoro in the Rain',
    type: 'video',
    value: '/assets/themes/videos/totoro-in-the-rain-moewalls-com.mp4',
    preview: '/assets/themes/videos/totoro-in-the-rain-moewalls-com.mp4',
    category: 'nature'
  },
  'flower-field-howls': {
    name: 'Flower Field (Howl\'s Moving Castle)',
    type: 'video',
    value: '/assets/themes/videos/flower-field-howls-moving-castle-moewalls-com.mp4',
    preview: '/assets/themes/videos/flower-field-howls-moving-castle-moewalls-com.mp4',
    category: 'nature'
  },
  'small-forest-house': {
    name: 'Small House in Forest',
    type: 'video',
    value: '/assets/themes/videos/small-house-in-forest.3840x2160.mp4',
    preview: '/assets/themes/videos/small-house-in-forest.3840x2160.mp4',
    category: 'nature'
  },
  'arrietty-flower-field': {
    name: 'Arrietty Flower Field',
    type: 'video',
    value: '/assets/themes/videos/shou-relaxing-flower-field-the-secret-world-of-arrietty-moewalls-com.mp4',
    preview: '/assets/themes/videos/shou-relaxing-flower-field-the-secret-world-of-arrietty-moewalls-com.mp4',
    category: 'nature'
  },
  'howls-moving-castle': {
    name: 'Howl\'s Moving Castle',
    type: 'video',
    value: '/assets/themes/videos/howls-moving-castle-1-moewalls-com.mp4',
    preview: '/assets/themes/videos/howls-moving-castle-1-moewalls-com.mp4',
    category: 'nature'
  },
  'zelda-forest-temple': {
    name: 'Zelda Forest Temple',
    type: 'video',
    value: '/assets/themes/videos/zelda-forest-temple.3840x2160.mp4',
    preview: '/assets/themes/videos/zelda-forest-temple.3840x2160.mp4',
    category: 'nature'
  },
  'castle-beyond-clouds': {
    name: 'Castle Beyond Clouds',
    type: 'video',
    value: '/assets/themes/videos/castle-beyond-the-clouds.3840x2160.mp4',
    preview: '/assets/themes/videos/castle-beyond-the-clouds.3840x2160.mp4',
    category: 'nature'
  },

  // ===== ANIMATED BACKGROUNDS (LOFI SUBCATEGORY) =====
  'chihiro-spirited-away': {
    name: 'Chihiro (Spirited Away)',
    type: 'video',
    value: '/assets/themes/videos/chihiro-ogino-spirited-away.3840x2160.mp4',
    preview: '/assets/themes/videos/chihiro-ogino-spirited-away.3840x2160.mp4',
    category: 'lofi'
  },
  'evening-chill': {
    name: 'Evening Chill',
    type: 'video',
    value: '/assets/themes/videos/evening-chill.3840x2160.mp4',
    preview: '/assets/themes/videos/evening-chill.3840x2160.mp4',
    category: 'lofi'
  },
  'lofi-cozy-house-rain': {
    name: 'Lofi Cozy House (Rainy Day)',
    type: 'video',
    value: '/assets/themes/videos/lofi-cozy-house-rainy-day-moewalls-com.mp4',
    preview: '/assets/themes/videos/lofi-cozy-house-rainy-day-moewalls-com.mp4',
    category: 'lofi'
  },
  'lofi-house-cloudy': {
    name: 'Lofi House (Cloudy Day)',
    type: 'video',
    value: '/assets/themes/videos/lofi-house-cloudy-day-1-moewalls-com.mp4',
    preview: '/assets/themes/videos/lofi-house-cloudy-day-1-moewalls-com.mp4',
    category: 'lofi'
  },
  'lofi-girl-animated': {
    name: 'Lofi Girl Animated',
    type: 'video',
    value: '/assets/themes/videos/lofi-girl-animated.1920x1080.mp4',
    preview: '/assets/themes/videos/lofi-girl-animated.1920x1080.mp4',
    category: 'lofi'
  },

  // ===== ANIMATED BACKGROUNDS (CAFÉ SUBCATEGORY) =====
  'japanese-lofi-cafe': {
    name: 'Japanese Lofi Café',
    type: 'video',
    value: '/assets/themes/videos/japanese-lofi-cafe-moewalls-com.mp4',
    preview: '/assets/themes/videos/japanese-lofi-cafe-moewalls-com.mp4',
    category: 'cafe'
  },
  'morning-coffee': {
    name: 'Morning Coffee',
    type: 'video',
    value: '/assets/themes/videos/morning-coffee.3840x2160.mp4',
    preview: '/assets/themes/videos/morning-coffee.3840x2160.mp4',
    category: 'cafe'
  },
  'coffee-shop': {
    name: 'Coffee Shop',
    type: 'video',
    value: '/assets/themes/videos/coffee-shop.3840x2160.mp4',
    preview: '/assets/themes/videos/coffee-shop.3840x2160.mp4',
    category: 'cafe'
  },
  // === END NEW THEMES ===

  // Palette themes
  home: {
    name: 'Home',
    colors: {
      primary: '#8B5CF6',
      primaryDark: '#7C3AED',
      secondary: '#A78BFA',
      accent: '#EC4899',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    }
  },
  ambiance: {
    name: 'Ambiance',
    colors: {
      primary: '#10B981',
      primaryDark: '#059669',
      secondary: '#6EE7B7',
      accent: '#34D399',
      background: 'linear-gradient(135deg, #065f46 0%, #047857 100%)'
    }
  },
  focus: {
    name: 'Focus',
    colors: {
      primary: '#F59E0B',
      primaryDark: '#D97706',
      secondary: '#FCD34D',
      accent: '#FBBF24',
      background: 'linear-gradient(135deg, #92400e 0%, #b45309 100%)'
    }
  }
})
  
  // Music state - Universal music component with URL support
  const musicPlaying = ref(false)
  const currentTrack = ref(null)
  const volume = ref(0.7)
  const musicUrl = ref('') // Support for Spotify, Deezer, YouTube, SoundCloud URLs
  const musicPlatform = ref('') // spotify, deezer, youtube, soundcloud
  const musicError = ref('')
  const soundscapes = ref({
    rain: { enabled: false, volume: 0.5 },
    forest: { enabled: false, volume: 0.5 },
    cafe: { enabled: false, volume: 0.5 },
    ocean: { enabled: false, volume: 0.5 }
  })
  
  // Todo state
  const todos = ref([])
  const todoFilter = ref('all') // all, active, completed
  const todoSort = ref('created') // created, priority, due, alphabetical
  
  // Computed
  const displayTime = computed(() => {
    const minutes = Math.floor(timeRemaining.value / 60)
    const seconds = timeRemaining.value % 60
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
  })

  const currentModeTime = computed(() => {
    switch (timerMode.value) {
      case 'pomodoro': return pomodoroTime.value
      case 'shortBreak': return shortBreakTime.value
      case 'longBreak': return longBreakTime.value
      default: return pomodoroTime.value
    }
  })

  // Get current theme colors
  const currentThemeColors = computed(() => {
    return themes.value[currentTheme.value]?.colors || themes.value.home.colors
  })

  // Todo computed properties
  const incompleteTasks = computed(() => {
    return todos.value.filter(todo => !todo.completed)
  })

  const urgentImportantTasks = computed(() => {
    return todos.value.filter(todo => !todo.completed && todo.urgent && todo.important)
  })

  const importantNotUrgentTasks = computed(() => {
    return todos.value.filter(todo => !todo.completed && todo.important && !todo.urgent)
  })

  const urgentNotImportantTasks = computed(() => {
    return todos.value.filter(todo => !todo.completed && todo.urgent && !todo.important)
  })

  const neitherUrgentNorImportantTasks = computed(() => {
    return todos.value.filter(todo => !todo.completed && !todo.urgent && !todo.important)
  })
  
  // Timer functions
  function tick() {
    if (timeRemaining.value > 0) {
      timeRemaining.value--
    } else {
      // Timer finished
      isRunning.value = false
      if (timerInterval) {
        clearInterval(timerInterval)
        timerInterval = null
      }
      
      // Auto-switch to next mode (simplified logic)
      if (timerMode.value === 'pomodoro') {
        cycle.value++
        if (cycle.value % 4 === 0) {
          switchMode('longBreak')
        } else {
          switchMode('shortBreak')
        }
      } else {
        switchMode('pomodoro')
      }
    }
  }
  
  // Actions
  function toggleTimer() {
    isRunning.value = !isRunning.value
    
    if (isRunning.value) {
      timerInterval = setInterval(tick, 1000)
    } else {
      if (timerInterval) {
        clearInterval(timerInterval)
        timerInterval = null
      }
    }
  }
  
  function resetTimer() {
    isRunning.value = false
    if (timerInterval) {
      clearInterval(timerInterval)
      timerInterval = null
    }
    timeRemaining.value = currentModeTime.value
  }
  
  function switchMode(mode) {
    timerMode.value = mode
    isRunning.value = false
    if (timerInterval) {
      clearInterval(timerInterval)
      timerInterval = null
    }
    
    switch (mode) {
      case 'pomodoro':
        timeRemaining.value = pomodoroTime.value
        break
      case 'shortBreak':
        timeRemaining.value = shortBreakTime.value
        break
      case 'longBreak':
        timeRemaining.value = longBreakTime.value
        break
    }
  }
  
  function toggleSidebar() {
    sidebarOpen.value = !sidebarOpen.value
  }
  
  function setActiveTab(tab) {
    activeTab.value = tab
    if (!sidebarOpen.value) {
      sidebarOpen.value = true
    }
  }
  
  function setBackground(type, value) {
    backgroundType.value = type
    backgroundValue.value = value
  }

  function extractYouTubeId(url) {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/
    const match = url.match(regExp)
    return (match && match[2].length === 11) ? match[2] : null
  }

  function setTheme(themeKey) {
    const theme = themes.value[themeKey]
    if (theme) {
      currentTheme.value = themeKey
      backgroundType.value = theme.type
      backgroundValue.value = theme.value

      // Set CSS variables for canvas themes
      if (theme.colors) {
        theme.colors.forEach((color, index) => {
          document.documentElement.style.setProperty(`--gradient-color-${index + 1}`, color)
        })
      }
    }
  }

  function setYouTubeBackground(youtubeUrl) {
    const videoId = extractYouTubeId(youtubeUrl)
    if (videoId) {
      backgroundType.value = 'youtube'
      backgroundValue.value = videoId
      return true
    }
    return false
  }

  function setCustomGradientColors(colors) {
    customGradientColors.value = [...colors]
    // Update CSS variables for the animated gradient
    colors.forEach((color, index) => {
      document.documentElement.style.setProperty(`--custom-gradient-color-${index + 1}`, color)
    })
  }

  function setAnimatedGradientBackground() {
    backgroundType.value = 'animated-gradient'
    backgroundValue.value = 'custom'
    setCustomGradientColors(customGradientColors.value)
  }
  
  function addTodo(todo) {
    todos.value.push({
      id: Date.now(),
      text: todo.text || '',
      priority: todo.priority || 'low', // low, medium, high
      urgent: todo.urgent || false,
      important: todo.important || false,
      estimatedTime: todo.estimatedTime || 25, // minutes
      completed: false,
      created: new Date(),
      subtasks: []
    })
  }
  
  function toggleTodo(id) {
    const todo = todos.value.find(t => t.id === id)
    if (todo) {
      todo.completed = !todo.completed
    }
  }
  
  function deleteTodo(id) {
    const index = todos.value.findIndex(t => t.id === id)
    if (index > -1) {
      todos.value.splice(index, 1)
    }
  }

  // Theme management functions
  function switchTheme(themeName) {
    if (themes.value[themeName]) {
      currentTheme.value = themeName
      // Apply theme colors to CSS variables
      applyThemeColors()
      // Store theme preference (could be localStorage in future)
    }
  }

  function applyThemeColors() {
    const colors = currentThemeColors.value
    if (typeof document !== 'undefined') {
      const root = document.documentElement
      root.style.setProperty('--color-primary', colors.primary)
      root.style.setProperty('--color-primary-dark', colors.primaryDark)
      root.style.setProperty('--color-secondary', colors.secondary)
      root.style.setProperty('--color-accent', colors.accent)
      // Update background if it's a gradient theme
      if (colors.background) {
        backgroundValue.value = colors.background
      }
    }
  }

  // Music URL handling functions
  function setMusicUrl(url) {
    musicUrl.value = url
    musicError.value = ''
    musicPlatform.value = detectMusicPlatform(url)
  }

  function detectMusicPlatform(url) {
    if (url.includes('spotify.com')) return 'spotify'
    if (url.includes('deezer.com')) return 'deezer'
    if (url.includes('youtube.com') || url.includes('youtu.be')) return 'youtube'
    if (url.includes('soundcloud.com')) return 'soundcloud'
    return ''
  }

  // Predefined playlists - Both Deezer and YouTube options
  const deezerPlaylists = ref([
    {
      name: 'Warm Melancholia',
      url: 'https://link.deezer.com/s/30I4s94Syhp5iuS3T0NW9',
      id: 'warm-melancholia'
    },
    {
      name: 'Classical Music', 
      url: 'https://link.deezer.com/s/30I4sTHKDNbVCXriMGGJY',
      id: 'classical-music'
    },
    {
      name: 'Dance Music',
      url: 'https://link.deezer.com/s/30I4tfQt1D3eTJ7FZKjpn', 
      id: 'dance-music'
    },
    {
      name: 'Coup de Coeur',
      url: 'https://link.deezer.com/s/30HLLIhq7W7gERuNFubDG',
      id: 'coup-de-coeur'
    }
  ])

  const youtubePlaylists = ref([
    {
      id: 'lofi-study',
      name: 'Lo-Fi Study Music',
      shortName: 'Lo-Fi',
      videoId: 'jfKfPfyJRdk',
      url: 'https://www.youtube.com/watch?v=jfKfPfyJRdk'
    },
    {
      id: 'classical-focus', 
      name: 'Classical Focus',
      shortName: 'Classical',
      videoId: '6p0DAz_30qQ',
      url: 'https://www.youtube.com/watch?v=6p0DAz_30qQ'
    },
    {
      id: 'ambient-chill',
      name: 'Ambient Chill',
      shortName: 'Ambient',
      videoId: '5qap5aO4i9A',
      url: 'https://www.youtube.com/watch?v=5qap5aO4i9A'
    },
    {
      id: 'nature-sounds',
      name: 'Nature Sounds',
      shortName: 'Nature',
      videoId: 'eKFTSSKCzWA',
      url: 'https://www.youtube.com/watch?v=eKFTSSKCzWA'
    }
  ])

  function playDeezerPlaylist(playlistId) {
    const playlist = deezerPlaylists.value.find(p => p.id === playlistId)
    if (playlist) {
      setMusicUrl(playlist.url)
      currentTrack.value = playlist.name
      musicPlaying.value = true
      // Open the Deezer link in a new tab for background playback
      if (typeof window !== 'undefined') {
        window.open(playlist.url, '_blank')
      }
    }
  }

  function playYouTubePlaylist(playlistIdOrUrl, title) {
    // Check if it's a predefined playlist ID
    const playlist = youtubePlaylists.value.find(p => p.id === playlistIdOrUrl)
    if (playlist) {
      setMusicUrl(playlist.url)
      currentTrack.value = playlist.name
      musicPlaying.value = true
      return playlist
    } else {
      // Direct URL usage
      setMusicUrl(playlistIdOrUrl)
      currentTrack.value = title || 'YouTube Playlist'
      musicPlaying.value = true
      // Open YouTube in a new tab for background playback  
      if (typeof window !== 'undefined') {
        window.open(playlistIdOrUrl, '_blank')
      }
    }
  }

  function stopMusic() {
    musicPlaying.value = false
    currentTrack.value = null
  }

  function toggleMusicPlayback() {
    musicPlaying.value = !musicPlaying.value
  }

  // Fullscreen management
  function toggleFullscreen() {
    if (typeof document !== 'undefined') {
      if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().then(() => {
          isFullscreen.value = true
        }).catch(() => {
          console.warn('Fullscreen not supported or denied')
        })
      } else {
        document.exitFullscreen().then(() => {
          isFullscreen.value = false
        })
      }
    }
  }
  
  return {
    // State
    timerMode,
    timeRemaining,
    isRunning,
    cycle,
    pomodoroTime,
    shortBreakTime,
    longBreakTime,
    sidebarOpen,
    activeTab,
    isFullscreen,
    timerDisplayMode,
    currentTheme,
    themes,
    backgroundType,
    backgroundValue,
    overlayOpacity,
    themes,
    customGradientColors,
    musicPlaying,
    currentTrack,
    volume,
    musicUrl,
    musicPlatform,
    musicError,
    soundscapes,
    // Playlist data
    deezerPlaylists,
    youtubePlaylists,
    todos,
    todoFilter,
    todoSort,
    
    // Computed
    displayTime,
    currentModeTime,
    currentThemeColors,
    incompleteTasks,
    urgentImportantTasks,
    importantNotUrgentTasks,
    urgentNotImportantTasks,
    neitherUrgentNorImportantTasks,
    
    // Actions
    toggleTimer,
    resetTimer,
    switchMode,
    toggleSidebar,
    setActiveTab,
    setBackground,
    setTheme,
    setYouTubeBackground,
    extractYouTubeId,
    setCustomGradientColors,
    setAnimatedGradientBackground,
    addTodo,
    toggleTodo,
    deleteTodo,
    switchTheme,
    applyThemeColors,
    setMusicUrl,
    detectMusicPlatform,
    playDeezerPlaylist,
    playYouTubePlaylist,
    stopMusic,
    toggleMusicPlayback,
    toggleFullscreen,
    setTimerDisplayMode: (mode) => { timerDisplayMode.value = mode }
  }
})
