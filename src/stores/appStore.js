import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { loadAllMediaAssets } from '../utils/mediaLoader.js'

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
  
  // Auto-start settings
  const autoStartBreaks = ref(false)
  const autoStartPomodoros = ref(false)
  const longBreakInterval = ref(4) // After every 4 pomodoros
  
  // Timer display settings
  const timerDisplayMode = ref('focus') // focus, ambiance, home
  
  // UI state
  const sidebarOpen = ref(false)
  const activeTab = ref('themes') // themes, clock, timer, stats, music, notepad, sounds, quotes, background, todo
  const isFullscreen = ref(false) // Fullscreen mode state
  const mood = ref('focus') // home, ambience, focus - controls layout mode

// Theme & styling
const currentTheme = ref('toto-forest') // home, ambiance, focus, toto-forest, etc.
const backgroundType = ref('canvas') // gradient, image, video, canvas, color, youtube, animated-gradient
const backgroundValue = ref('lava-lamp') // valeur par défaut selon le backgroundType
const overlayOpacity = ref(0.2) // compromis entre 0.1 et 0.3

// Sample themes for testing
const sampleThemes = {
  'gradient-sunset': {
    name: 'Sunset Gradient',
    type: 'gradient',
    value: 'linear-gradient(45deg, #ff9a9e, #fad0c4)',
    category: 'gradients'
  },
  'gradient-ocean': {
    name: 'Ocean Breeze',
    type: 'gradient',
    value: 'linear-gradient(45deg, #4facfe, #00f2fe)',
    category: 'gradients'
  },
  // Thème Misty Forest supprimé car les fichiers associés sont manquants
  'animated-lava': {
    name: 'Lava Lamp',
    type: 'canvas',
    value: 'lava-lamp',
    colors: ['#DF437A', '#3d57d6', '#a117fd', '#ec634b'],
    category: 'animated'
  }
}

// Custom gradient colors (utilisé pour les backgrounds personnalisés)
const customGradientColors = ref(['#DF437A', '#3d57d6', '#a117fd', '#ec634b'])

// Authentic Flocus themes with official assets + custom, canvas/animated themes, and color palettes
// This will be enhanced with automatically loaded media assets
const themes = ref({
  // Sample themes for testing
  ...sampleThemes,
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

  // Existing manually defined themes will be preserved...
  // These will be merged with automatically loaded media assets

  // Palette themes - Les thèmes 'home', 'ambiance' et 'focus' ont été supprimés pour éviter la confusion avec les moods
})
  
  // Music state - Universal music component with URL support
  const musicPlaying = ref(false)
  const currentTrack = ref(null)
  const volume = ref(0.7)
  const musicUrl = ref('') // Support for Spotify, Deezer, YouTube, SoundCloud URLs
  const musicPlatform = ref('') // spotify, deezer, youtube, soundcloud
  const musicError = ref('')
  
  // New state for the refactored music player workflow
  const musicSelected = ref(false) // Track if user has selected and clicked play on music
  const selectedMusicSource = ref(null) // Store the selected music source details
  const localAudioFile = ref(null) // Store local audio file details
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
  
  // Load media assets from the file system
  async function loadMediaAssets() {
    try {
      const mediaAssets = await loadAllMediaAssets()
      
      // Merge the loaded media assets with existing themes
      Object.assign(themes.value, mediaAssets)
      
      console.log(`Loaded ${Object.keys(mediaAssets).length} media assets from themes directories`)
      return mediaAssets
    } catch (error) {
      console.error('Failed to load media assets:', error)
      return {}
    }
  }

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
        const nextMode = (cycle.value % longBreakInterval.value === 0) ? 'longBreak' : 'shortBreak'
        
        if (autoStartBreaks.value) {
          switchMode(nextMode)
          // Auto start the break timer
          setTimeout(() => {
            if (!isRunning.value) {
              toggleTimer()
            }
          }, 100)
        } else {
          switchMode(nextMode)
        }
      } else {
        // Break is over, switch to pomodoro
        if (autoStartPomodoros.value) {
          switchMode('pomodoro')
          // Auto start the pomodoro timer
          setTimeout(() => {
            if (!isRunning.value) {
              toggleTimer()
            }
          }, 100)
        } else {
          switchMode('pomodoro')
        }
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
    
    // Auto-convert Deezer URLs to widget format
    if (musicPlatform.value === 'deezer') {
      const widgetUrl = convertDeezerToWidget(url);
      if (widgetUrl !== url) {
        console.log('Auto-converted Deezer URL to widget format');
      }
    }
  }

  function detectMusicPlatform(url) {
    if (url.includes('spotify.com')) return 'spotify'
    if (url.includes('deezer.com')) return 'deezer'
    if (url.includes('youtube.com') || url.includes('youtu.be')) return 'youtube'
    if (url.includes('soundcloud.com')) return 'soundcloud'
    return ''
  }

  // Enhanced Deezer URL conversion function
  function convertDeezerToWidget(url) {
    try {
      // Handle various Deezer URL formats and convert to widget URLs
      if (url.includes('deezer.com')) {
        // Extract playlist/album/track ID from various formats
        let playlistMatch = url.match(/playlist\/(\d+)/);
        let albumMatch = url.match(/album\/(\d+)/);
        let trackMatch = url.match(/track\/(\d+)/);
        
        if (playlistMatch) {
          return `https://widget.deezer.com/widget/light/playlist/${playlistMatch[1]}?tracklist=false`;
        } else if (albumMatch) {
          return `https://widget.deezer.com/widget/light/album/${albumMatch[1]}?tracklist=false`;
        } else if (trackMatch) {
          return `https://widget.deezer.com/widget/light/track/${trackMatch[1]}?tracklist=false`;
        }
        
        // Handle share links (link.deezer.com)
        if (url.includes('link.deezer.com')) {
          console.warn('Deezer share links need manual conversion. Please provide the direct Deezer URL.');
          return url; // Return original URL, let user handle manually
        }
      }
      return url;
    } catch (error) {
      console.warn('Error converting Deezer URL:', error);
      return url;
    }
  }

  // Predefined playlists - Both Deezer and YouTube options
  const deezerPlaylists = ref([
    {
      name: 'Warm Melancholia',
      url: 'https://link.deezer.com/s/30I4s94Syhp5iuS3T0NW9',
      widgetUrl: 'https://widget.deezer.com/widget/light/playlist/11649050864?tracklist=false',
      id: 'warm-melancholia'
    },
    {
      name: 'Classical Music', 
      url: 'https://link.deezer.com/s/30I4sTHKDNbVCXriMGGJY',
      widgetUrl: 'https://widget.deezer.com/widget/light/playlist/8940192602?tracklist=false',
      id: 'classical-music'
    },
    {
      name: 'Dance, bitch',
      url: 'https://link.deezer.com/s/30I4tfQt1D3eTJ7FZKjpn', 
      widgetUrl: 'https://widget.deezer.com/widget/light/playlist/13367781383?tracklist=false',
      id: 'dance-music'
    },
    {
      name: 'Favorites',
      url: 'https://link.deezer.com/s/30HLLIhq7W7gERuNFubDG',
      widgetUrl: 'https://widget.deezer.com/widget/light/playlist/1087888711?tracklist=false',
      id: 'favorites'
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

  // New functions for the refactored music player workflow
  function playSelectedMusic(source) {
    // Set the selected music source and mark as selected
    selectedMusicSource.value = source
    musicSelected.value = true
    musicPlaying.value = true
    
    // Set appropriate URL and platform based on source type
    if (source.type === 'youtube') {
      setMusicUrl(source.url)
      currentTrack.value = source.title || source.name
    } else if (source.type === 'spotify') {
      setMusicUrl(source.url) 
      currentTrack.value = source.title || source.name
    } else if (source.type === 'deezer') {
      // Auto-convert Deezer URLs to widget format if needed
      let urlToUse = source.widgetUrl || source.url
      if (!source.widgetUrl && source.url) {
        urlToUse = convertDeezerToWidget(source.url)
        source.widgetUrl = urlToUse // Store the converted widget URL
      }
      
      setMusicUrl(urlToUse)
      currentTrack.value = source.title || source.name
      // Store both URLs for different use cases
      selectedMusicSource.value.widgetUrl = urlToUse
      selectedMusicSource.value.url = source.url
    } else if (source.type === 'local') {
      localAudioFile.value = source
      currentTrack.value = source.name
      musicUrl.value = source.url // for local files, this will be a blob URL
      musicPlatform.value = 'local'
    }
  }

  function resetMusicSelection() {
    // Reset all music selection state
    musicSelected.value = false
    selectedMusicSource.value = null
    localAudioFile.value = null
    musicPlaying.value = false
    currentTrack.value = null
    musicUrl.value = ''
    musicPlatform.value = ''
    musicError.value = ''
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
  
  // Timer settings functions
  function updatePomodoroTime(minutes) {
    const newTime = parseInt(minutes) * 60
    if (newTime > 0 && newTime <= 3600) { // Max 60 minutes
      pomodoroTime.value = newTime
      if (timerMode.value === 'pomodoro') {
        timeRemaining.value = newTime
      }
    }
  }
  
  function updateShortBreakTime(minutes) {
    const newTime = parseInt(minutes) * 60
    if (newTime > 0 && newTime <= 1800) { // Max 30 minutes
      shortBreakTime.value = newTime
      if (timerMode.value === 'shortBreak') {
        timeRemaining.value = newTime
      }
    }
  }
  
  function updateLongBreakTime(minutes) {
    const newTime = parseInt(minutes) * 60
    if (newTime > 0 && newTime <= 3600) { // Max 60 minutes
      longBreakTime.value = newTime
      if (timerMode.value === 'longBreak') {
        timeRemaining.value = newTime
      }
    }
  }
  
  function setTimerDisplayMode(mode) {
    if (['focus', 'ambiance', 'home'].includes(mode)) {
      timerDisplayMode.value = mode
      // Also update the mood to match the display mode
      mood.value = mode
    }
  }
  
  function toggleAutoStartBreaks() {
    autoStartBreaks.value = !autoStartBreaks.value
  }
  
  function toggleAutoStartPomodoros() {
    autoStartPomodoros.value = !autoStartPomodoros.value
  }
  
  function setLongBreakInterval(interval) {
    const newInterval = parseInt(interval)
    if (newInterval >= 2 && newInterval <= 10) {
      longBreakInterval.value = newInterval
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
    autoStartBreaks,
    autoStartPomodoros,
    longBreakInterval,
    timerDisplayMode,
    sidebarOpen,
    activeTab,
    isFullscreen,
    mood,
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
    musicSelected,
    selectedMusicSource,
    localAudioFile,
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
    convertDeezerToWidget,
    playDeezerPlaylist,
    playYouTubePlaylist,
    stopMusic,
    toggleMusicPlayback,
    playSelectedMusic,
    resetMusicSelection,
    toggleFullscreen,
    updatePomodoroTime,
    updateShortBreakTime,
    updateLongBreakTime,
    setTimerDisplayMode,
    toggleAutoStartBreaks,
    toggleAutoStartPomodoros,
    setLongBreakInterval,
    setMood: (newMood) => { mood.value = newMood },
    loadMediaAssets
  }
})
