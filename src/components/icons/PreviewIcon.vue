<template>
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <!-- Main screen/monitor -->
    <rect x="2" y="3" width="20" height="14" rx="2" stroke="currentColor" stroke-width="1.5"/>
    <!-- Stand -->
    <path d="M8 21h8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
    <path d="M12 17v4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
    
    <!-- Content preview lines (inside screen) -->
    <rect x="5" y="6" width="6" height="1.5" rx="0.75" fill="currentColor" opacity="0.6"/>
    <rect x="5" y="8.5" width="8" height="1" rx="0.5" fill="currentColor" opacity="0.4"/>
    <rect x="5" y="10.5" width="4" height="1" rx="0.5" fill="currentColor" opacity="0.4"/>
    
    <!-- Mobile icon overlay (small) -->
    <rect x="15" y="12" width="4" height="6" rx="1" stroke="currentColor" stroke-width="1" opacity="0.7"/>
    <circle cx="17" cy="16.5" r="0.3" fill="currentColor" opacity="0.7"/>
  </svg>
</template>

<script setup>
// Preview icon representing screen size optimization
</script>

<style scoped>
svg {
  color: inherit;
}
</style>