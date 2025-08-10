<template>
  <div id="bg-wrapper" class="dynamic-background">
    <!-- Background Layer for gradients and colors -->
    <div
      v-if="store.backgroundType === 'gradient' || store.backgroundType === 'color'"
      class="background-layer"
      :style="backgroundStyle"
    ></div>

    <!-- Image Background -->
    <img
      v-if="store.backgroundType === 'image' && store.backgroundValue"
      class="background-image"
      :src="store.backgroundValue"
      alt="Background"
      loading="lazy"
      @load="onImageLoad"
      @error="onImageError"
    />

    <!-- Video Background -->
    <video
      id="bg-video"
      v-if="store.backgroundType === 'video' && store.backgroundValue"
      class="background-video"
      :src="store.backgroundValue"
      loop
      muted
      playsinline
      preload="metadata"
      @loadeddata="onVideoLoad"
      @error="onVideoError"
    ></video>

    <!-- YouTube Video Background -->
    <iframe
      v-if="store.backgroundType === 'youtube' && store.backgroundValue"
      class="background-youtube"
      :src="getYouTubeEmbedUrl(store.backgroundValue)"
      frameborder="0"
      allow="autoplay; encrypted-media"
      allowfullscreen
    ></iframe>

    <!-- Canvas Background for animated effects -->
    <AnimatedCanvas
      v-if="store.backgroundType === 'canvas'"
      :animation-type="store.backgroundValue"
      :colors="getCurrentThemeColors()"
    />

    <!-- Animated Gradient Background -->
    <div
      v-if="store.backgroundType === 'animated-gradient'"
      class="animated-gradient"
      :style="getAnimatedGradientStyle()"
    ></div>

    <!-- Overlay Layer -->
    <div
      class="overlay-layer"
      :style="overlayStyle"
    ></div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useAppStore } from '../stores/appStore'
import AnimatedCanvas from './AnimatedCanvas.vue'

const store = useAppStore()

const backgroundStyle = computed(() => {
  switch (store.backgroundType) {
    case 'gradient':
      return {
        background: store.backgroundValue
      }
    case 'color':
      return {
        backgroundColor: store.backgroundValue,
        width: '100%',
        height: '100%'
      }
    default:
      return {
        background: 'transparent'
      }
  }
})

function getCurrentThemeColors() {
  const currentTheme = store.themes[store.currentTheme]
  return currentTheme?.colors || ['#8B5CF6', '#EC4899', '#F59E0B', '#10B981']
}

function getYouTubeEmbedUrl(videoId) {
  return `https://www.youtube.com/embed/${videoId}?autoplay=1&loop=1&mute=1&controls=0&showinfo=0&rel=0&modestbranding=1&iv_load_policy=3&playlist=${videoId}&vq=hd1080`
}

// Optimize background loading
function onImageLoad() {
  // Image loaded successfully - could add fade-in effect here
  console.log('Background image loaded')
}

function onImageError() {
  console.warn('Failed to load background image')
}

function onVideoLoad() {
  // Auto-play video once loaded
  const video = document.getElementById('bg-video')
  if (video) {
    video.play().catch(e => console.warn('Video autoplay failed:', e))
  }
}

function onVideoError() {
  console.warn('Failed to load background video')
}

function getAnimatedGradientStyle() {
  const colors = store.customGradientColors.length >= 4
    ? store.customGradientColors
    : ['#DF437A', '#3d57d6', '#a117fd', '#ec634b']

  return {
    background: `linear-gradient(45deg, ${colors.join(', ')})`,
    backgroundSize: '400% 400%'
  }
}

const overlayStyle = computed(() => ({
  backgroundColor: `rgba(0, 0, 0, ${store.overlayOpacity})`
}))
</script>

<style scoped>
.dynamic-background {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 0;
  overflow: hidden;
}

.background-layer {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  transition: all var(--transition-slow);
  animation: gradientShift 20s ease-in-out infinite;
}

.background-image,
.background-video,
.background-youtube {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
}

.background-youtube {
  width: 100vw;
  height: 56.25vw; /* 16:9 aspect ratio */
  min-height: 100vh;
  min-width: 177.78vh; /* 16:9 aspect ratio */
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  pointer-events: none;
}

.animated-gradient {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  animation: gradientAnimation 15s ease infinite;
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

.overlay-layer {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  transition: background-color var(--transition-normal);
  backdrop-filter: blur(1px);
}

@keyframes gradientShift {
  0%, 100% {
    filter: hue-rotate(0deg) brightness(1);
  }
  25% {
    filter: hue-rotate(30deg) brightness(1.1);
  }
  50% {
    filter: hue-rotate(60deg) brightness(1);
  }
  75% {
    filter: hue-rotate(30deg) brightness(0.9);
  }
}
</style>
