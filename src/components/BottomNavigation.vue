<template>
  <nav class="bottom-navigation" role="navigation">
    <div class="nav-container">
      <!-- Home Button - Circular independent button -->
      <button 
        class="nav-button"
        :class="{ active: currentActiveButton === 'home' }"
        @click="switchToHome"
        aria-label="Mode Home"
      >
        <HomeIcon />
      </button>

      <!-- Ambiance Button - Circular independent button -->
      <button 
        class="nav-button"
        :class="{ active: currentActiveButton === 'ambiance' }"
        @click="switchToAmbiance"
        aria-label="Mode Ambiance"
      >
        <AmbianceIcon />
      </button>

      <!-- Focus Button - Circular independent button -->
      <button 
        class="nav-button"
        :class="{ active: currentActiveButton === 'focus' }"
        @click="switchToFocus"
        aria-label="Mode Focus"
      >
        <FocusIcon />
      </button>

      <!-- Music Button - Circular independent button -->
      <button 
        class="nav-button"
        :class="{ active: currentActiveButton === 'musique' }"
        @click="openMusic"
        aria-label="Musique"
      >
        <MusicIcon />
      </button>

      <!-- Todo Button - Circular independent button -->
      <button 
        class="nav-button"
        :class="{ active: currentActiveButton === 'to-do' }"
        @click="openTodo"
        aria-label="To-do"
      >
        <TodoIcon />
      </button>

      <!-- Settings Button - Circular independent button -->
      <button 
        class="nav-button"
        :class="{ active: currentActiveButton === 'reglages' }"
        @click="openSettings"
        aria-label="Réglages"
      >
        <SettingsIcon />
      </button>

      <!-- Fullscreen Button - Circular independent button -->
      <button 
        class="nav-button"
        :class="{ active: currentActiveButton === 'plein-ecran' }"
        @click="toggleFullscreen"
        aria-label="Plein écran"
      >
        <FullscreenIcon />
      </button>
    </div>
  </nav>
</template>

<script setup>
import { useAppStore } from '../stores/appStore'
import { computed } from 'vue'

const store = useAppStore()

/**
 * Props for activeButton state management
 * Controls which button should be displayed as active
 */
const props = defineProps({
  activeButton: {
    type: String,
    default: '',
    validator: (value) => {
      const validButtons = ['home', 'ambiance', 'focus', 'musique', 'to-do', 'reglages', 'plein-ecran']
      return validButtons.includes(value) || value === ''
    }
  }
})

/**
 * Computed property to determine active button based on store state
 * Falls back to prop if no explicit state match
 */
const currentActiveButton = computed(() => {
  // Check current theme state for theme buttons
  if (store.currentTheme === 'home') return 'home'
  if (store.currentTheme === 'ambiance') return 'ambiance'  
  if (store.currentTheme === 'focus') return 'focus'
  
  // Check sidebar state for panel buttons
  if (store.sidebarOpen && store.activeTab === 'music') return 'musique'
  if (store.sidebarOpen && store.activeTab === 'todo') return 'to-do'
  if (store.sidebarOpen && ['timer', 'themes', 'background'].includes(store.activeTab)) return 'reglages'
  
  // Check fullscreen state
  if (store.isFullscreen) return 'plein-ecran'
  
  // Fallback to prop
  return props.activeButton
})

// Action handlers with user logic slots for customization
function switchToHome() {
  store.switchTheme('home')
  // Slot for user-defined logic - can be extended by parent components
  console.log('Switched to Home theme')
}

function switchToAmbiance() {
  store.switchTheme('ambiance')
  // Slot for user-defined logic - can be extended by parent components
  console.log('Switched to Ambiance theme')
}

function switchToFocus() {
  store.switchTheme('focus')
  // Slot for user-defined logic - can be extended by parent components
  console.log('Switched to Focus theme')
}

function openMusic() {
  store.setActiveTab('music')
  // Slot for user-defined logic - can be extended by parent components
  console.log('Opened Music panel')
}

function openTodo() {
  store.setActiveTab('todo')
  // Slot for user-defined logic - can be extended by parent components
  console.log('Opened Todo panel')
}

function openSettings() {
  store.setActiveTab('timer')
  // Slot for user-defined logic - can be extended by parent components
  console.log('Opened Settings panel')
}

function toggleFullscreen() {
  store.toggleFullscreen()
  // Slot for user-defined logic - can be extended by parent components
  console.log('Toggled fullscreen mode')
}
</script>

<script>
/**
 * Dynamic SVG icons for navigation buttons
 * These adapt to theme colors and states
 */
const HomeIcon = {
  template: `
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M3 9L12 2L21 9V20C21 20.5304 20.7893 21.0391 20.4142 21.4142C20.0391 21.7893 19.5304 22 19 22H5C4.46957 22 3.96086 21.7893 3.58579 21.4142C3.21071 21.0391 3 20.5304 3 20V9Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M9 22V12H15V22" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
  `
}

const AmbianceIcon = {
  template: `
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
  `
}

const FocusIcon = {
  template: `
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="2"/>
      <path d="M12 1V3M12 21V23M4.22 4.22L5.64 5.64M18.36 18.36L19.78 19.78M1 12H3M21 12H23M4.22 19.78L5.64 18.36M18.36 5.64L19.78 4.22" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
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

const TodoIcon = {
  template: `
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M9 11L12 14L22 4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M21 12V19C21 19.5304 20.7893 21.0391 20.4142 21.4142C20.0391 21.7893 19.5304 22 19 22H5C4.46957 22 3.96086 21.7893 3.58579 21.4142C3.21071 21.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H16" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
  `
}

const SettingsIcon = {
  template: `
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="2"/>
      <path d="M19.4 15C19.2669 15.3016 19.2272 15.6362 19.286 15.9606C19.3448 16.285 19.4995 16.5843 19.73 16.82L19.79 16.88C19.976 17.0657 20.1235 17.2863 20.2241 17.5291C20.3248 17.7719 20.3766 18.0322 20.3766 18.295C20.3766 18.5578 20.3248 18.8181 20.2241 19.0609C20.1235 19.3037 19.976 19.5243 19.79 19.71C19.6043 19.896 19.3837 20.0435 19.1409 20.1441C18.8981 20.2448 18.6378 20.2966 18.375 20.2966C18.1122 20.2966 17.8519 20.2448 17.6091 20.1441C17.3663 20.0435 17.1457 19.896 16.96 19.71L16.9 19.65C16.6643 19.4195 16.365 19.2648 16.0406 19.206C15.7162 19.1472 15.3816 19.1869 15.08 19.32C14.7842 19.4468 14.532 19.6572 14.3543 19.9255C14.1766 20.1938 14.0813 20.5082 14.08 20.83V21C14.08 21.5304 13.8693 22.0391 13.4942 22.4142C13.1191 22.7893 12.6104 23 12.08 23C11.5496 23 11.0409 22.7893 10.6658 22.4142C10.2907 22.0391 10.08 21.5304 10.08 21V20.91C10.0723 20.579 9.96512 20.2573 9.77251 19.9887C9.5799 19.7201 9.31074 19.5176 9 19.41C8.69838 19.2769 8.36381 19.2372 8.03941 19.296C7.71502 19.3548 7.41568 19.5095 7.18 19.74L7.12 19.8C6.93425 19.986 6.71368 20.1335 6.47088 20.2341C6.22808 20.3348 5.96783 20.3866 5.705 20.3866C5.44217 20.3866 5.18192 20.3348 4.93912 20.2341C4.69632 20.1335 4.47575 19.986 4.29 19.8C4.10405 19.6143 3.95653 19.3937 3.85588 19.1509C3.75523 18.9081 3.70343 18.6478 3.70343 18.385C3.70343 18.1222 3.75523 17.8619 3.85588 17.6191C3.95653 17.3763 4.10405 17.1557 4.29 16.97L4.35 16.91C4.58054 16.6743 4.73519 16.375 4.794 16.0506C4.85282 15.7262 4.81312 15.3916 4.68 15.09C4.55324 14.7942 4.34276 14.542 4.07447 14.3543C3.80618 14.1766 3.49179 14.0813 3.17 14.08H3C2.46957 14.08 1.96086 13.8693 1.58579 13.4942C1.21071 13.1191 1 12.6104 1 12.08C1 11.5496 1.21071 11.0409 1.58579 10.6658C1.96086 10.2907 2.46957 10.08 3 10.08H3.09C3.42099 10.0723 3.74269 9.96512 4.01133 9.77251C4.27998 9.5799 4.48249 9.31074 4.59 9C4.72312 8.69838 4.76282 8.36381 4.704 8.03941C4.64519 7.71502 4.49054 7.41568 4.26 7.18L4.2 7.12C4.01405 6.93425 3.86653 6.71368 3.76588 6.47088C3.66523 6.22808 3.61343 5.96783 3.61343 5.705C3.61343 5.44217 3.66523 5.18192 3.76588 4.93912C3.86653 4.69632 4.01405 4.47575 4.2 4.29C4.38575 4.10405 4.60632 3.95653 4.84912 3.85588C5.09192 3.75523 5.35217 3.70343 5.615 3.70343C5.87783 3.70343 6.13808 3.75523 6.38088 3.85588C6.62368 3.95653 6.84425 4.10405 7.03 4.29L7.09 4.35C7.32568 4.58054 7.62502 4.73519 7.94941 4.794C8.27381 4.85282 8.60838 4.81312 8.91 4.68H9C9.29577 4.55324 9.54802 4.34276 9.73563 4.07447C9.92325 3.80618 10.0187 3.49179 10.02 3.17V3C10.02 2.46957 10.2307 1.96086 10.6058 1.58579C10.9809 1.21071 11.4896 1 12.02 1C12.5504 1 13.0591 1.21071 13.4342 1.58579C13.8093 1.96086 14.02 2.46957 14.02 3V3.09C14.0213 3.41179 14.1168 3.72618 14.3044 3.99447C14.492 4.26276 14.7443 4.47324 15.04 4.6C15.3416 4.73312 15.6762 4.77282 16.0006 4.714C16.325 4.65519 16.6243 4.50054 16.86 4.27L16.92 4.21C17.1057 4.02405 17.3263 3.87653 17.5691 3.77588C17.8119 3.67523 18.0722 3.62343 18.335 3.62343C18.5978 3.62343 18.8581 3.67523 19.1009 3.77588C19.3437 3.87653 19.5643 4.02405 19.75 4.21C19.936 4.39575 20.0835 4.61632 20.1841 4.85912C20.2848 5.10192 20.3366 5.36217 20.3366 5.625C20.3366 5.88783 20.2848 6.14808 20.1841 6.39088C20.0835 6.63368 19.936 6.85425 19.75 7.04L19.69 7.1C19.4595 7.33568 19.3048 7.63502 19.246 7.95941C19.1872 8.28381 19.2269 8.61838 19.36 8.92V9C19.4868 9.29577 19.6972 9.54802 19.9655 9.73563C20.2338 9.92325 20.5482 10.0187 20.87 10.02H21C21.5304 10.02 22.0391 10.2307 22.4142 10.6058C22.7893 10.9809 23 11.4896 23 12.02C23 12.5504 22.7893 13.0591 22.4142 13.4342C22.0391 13.8093 21.5304 14.02 21 14.02H20.91C20.5882 14.0213 20.2738 14.1168 20.0055 14.3044C19.7372 14.492 19.5268 14.7443 19.4 15.04V15Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
  `
}

const FullscreenIcon = {
  template: `
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M8 3H5C4.46957 3 3.96086 3.21071 3.58579 3.58579C3.21071 3.96086 3 4.46957 3 5V8M21 8V5C21 4.46957 20.7893 3.96086 20.4142 3.58579C20.0391 3.21071 19.5304 3 19 3H16M16 21H19C19.5304 21 20.0391 20.7893 20.4142 20.4142C20.7893 20.0391 21 19.5304 21 19V16M3 16V19C3 19.5304 3.21071 20.0391 3.58579 20.4142C3.96086 20.7893 4.46957 21 5 21H8" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
  `
}

export default {
  components: {
    HomeIcon,
    AmbianceIcon, 
    FocusIcon,
    MusicIcon,
    TodoIcon,
    SettingsIcon,
    FullscreenIcon
  }
}
</script>

<style scoped>
/**
 * Bottom Navigation - Circular buttons with blur effects
 * Based on Builder.io design requirements
 */
.bottom-navigation {
  position: fixed;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 100;
  pointer-events: none;
}

/**
 * Container with blur effect and translucent background
 */
.nav-container {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 12px 16px;
  
  /* Blur effect and translucent background as per Builder.io requirements */
  background: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  
  /* Clear border as specified */
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: var(--border-radius-full);
  
  /* Enhanced shadow for depth */
  box-shadow: 
    0 8px 32px rgba(0, 0, 0, 0.3),
    0 2px 8px rgba(0, 0, 0, 0.2),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
  
  pointer-events: auto;
  
  /* Smooth transitions */
  transition: all var(--transition-normal);
}

/**
 * Individual circular navigation buttons
 * Independent design without text labels, only SVG icons
 */
.nav-button {
  /* Circular button design */
  width: 48px;
  height: 48px;
  border-radius: var(--border-radius-full);
  
  /* Reset default button styles */
  border: none;
  background: transparent;
  padding: 0;
  
  /* Flexbox for centering icon */
  display: flex;
  align-items: center;
  justify-content: center;
  
  /* Icon and interaction styling */
  color: var(--color-text-secondary);
  cursor: pointer;
  
  /* Smooth transitions for all interactions */
  transition: all var(--transition-fast);
  
  /* Subtle border for definition */
  border: 1px solid rgba(255, 255, 255, 0.1);
}

/**
 * Hover state with subtle background and scale effect
 */
.nav-button:hover {
  background: rgba(255, 255, 255, 0.12);
  color: var(--color-text-primary);
  transform: scale(1.05);
  border-color: rgba(255, 255, 255, 0.2);
}

/**
 * Active state - enhanced background, shadow, and accent color
 * Uses theme color palette for dynamic styling
 */
.nav-button.active {
  /* Enhanced background with theme primary color */
  background: var(--color-primary);
  color: var(--color-text-primary);
  
  /* Enhanced shadow for active state */
  box-shadow: 
    0 4px 16px rgba(0, 0, 0, 0.4),
    0 2px 8px rgba(0, 0, 0, 0.2),
    0 0 0 1px var(--color-primary),
    inset 0 1px 0 rgba(255, 255, 255, 0.2);
  
  /* Slightly elevated */
  transform: scale(1.08) translateY(-1px);
  
  /* Accent border */
  border-color: rgba(255, 255, 255, 0.4);
}

/**
 * Focus state for accessibility
 */
.nav-button:focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
}

/**
 * SVG icon styling
 */
.nav-button svg {
  width: 20px;
  height: 20px;
  stroke-width: 1.5;
  transition: all var(--transition-fast);
}

/**
 * Active button icon styling
 */
.nav-button.active svg {
  stroke-width: 2;
  filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.3));
}

/**
 * Responsive design for mobile devices
 */
@media (max-width: 768px) {
  .bottom-navigation {
    bottom: 16px;
    left: 16px;
    right: 16px;
    transform: none;
  }
  
  .nav-container {
    justify-content: space-between;
    padding: 10px 12px;
    gap: 8px;
  }
  
  .nav-button {
    width: 44px;
    height: 44px;
  }
  
  .nav-button svg {
    width: 18px;
    height: 18px;
  }
}

/**
 * Compact mobile layout for smaller screens
 */
@media (max-width: 480px) {
  .bottom-navigation {
    bottom: 12px;
    left: 12px;
    right: 12px;
  }
  
  .nav-container {
    padding: 8px 10px;
    gap: 6px;
  }
  
  .nav-button {
    width: 40px;
    height: 40px;
  }
  
  .nav-button svg {
    width: 16px;
    height: 16px;
  }
}

/**
 * Theme-specific active button styling
 * Uses CSS custom properties for dynamic theme colors
 */
.nav-button.active[aria-label*="Home"] {
  background: var(--color-primary, #8B5CF6);
  box-shadow: 
    0 4px 16px rgba(139, 92, 246, 0.4),
    0 2px 8px rgba(139, 92, 246, 0.2),
    0 0 0 1px var(--color-primary, #8B5CF6);
}

.nav-button.active[aria-label*="Ambiance"] {
  background: var(--color-primary, #10B981);
  box-shadow: 
    0 4px 16px rgba(16, 185, 129, 0.4),
    0 2px 8px rgba(16, 185, 129, 0.2),
    0 0 0 1px var(--color-primary, #10B981);
}

.nav-button.active[aria-label*="Focus"] {
  background: var(--color-primary, #F59E0B);
  box-shadow: 
    0 4px 16px rgba(245, 158, 11, 0.4),
    0 2px 8px rgba(245, 158, 11, 0.2),
    0 0 0 1px var(--color-primary, #F59E0B);
}

/**
 * Container hover effect for enhanced interactivity
 */
.nav-container:hover {
  background: rgba(255, 255, 255, 0.12);
  border-color: rgba(255, 255, 255, 0.25);
}

/**
 * Accessibility enhancements
 */
@media (prefers-reduced-motion: reduce) {
  .nav-button,
  .nav-container {
    transition: none;
  }
  
  .nav-button:hover,
  .nav-button.active {
    transform: none;
  }
}

/**
 * High contrast mode support
 */
@media (prefers-contrast: high) {
  .nav-container {
    border: 2px solid rgba(255, 255, 255, 0.4);
    background: rgba(0, 0, 0, 0.8);
  }
  
  .nav-button {
    border: 1px solid rgba(255, 255, 255, 0.3);
  }
  
  .nav-button.active {
    border: 2px solid var(--color-primary);
  }
}
</style>