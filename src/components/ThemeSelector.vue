<template>
  <div class="theme-selector">
    <button 
      class="theme-button"
      @click="openThemePanel"
      :title="'Changer de thème'"
    >
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="12" cy="12" r="4" stroke="currentColor" stroke-width="2"/>
        <path d="M12 1V3M12 21V23M4.22 4.22L5.64 5.64M18.36 18.36L19.78 19.78M1 12H3M21 12H23M4.22 19.78L5.64 18.36M18.36 5.64L19.78 4.22" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
      </svg>
      <span>Thèmes</span>
    </button>
  </div>
</template>

<script setup>
import { useAppStore } from '../stores/appStore'

const store = useAppStore()

function openThemePanel() {
  store.setActiveTab('themes')
  if (!store.sidebarOpen) {
    store.toggleSidebar()
  }
}
</script>

<style scoped>
.theme-selector {
  position: fixed;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 90;
}

.theme-button {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  border-radius: var(--border-radius-full, 25px);
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  color: rgba(255, 255, 255, 0.9);
  font-size: 12px;
  font-weight: 500;
  transition: all 0.3s ease;
  cursor: pointer;
  white-space: nowrap;
}

.theme-button:hover {
  background: rgba(255, 255, 255, 0.25);
  color: rgba(255, 255, 255, 1);
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
}

/* Responsive */
@media (max-width: 768px) {
  .theme-selector {
    bottom: 15px;
  }
  
  .theme-button {
    padding: 6px 12px;
    font-size: 11px;
  }
}

@media (max-width: 480px) {
  .theme-selector {
    bottom: 12px;
  }
  
  .theme-button {
    padding: 5px 10px;
    font-size: 10px;
    gap: 4px;
  }
}
</style>