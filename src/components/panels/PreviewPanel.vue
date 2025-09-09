<template>
  <div class="preview-settings">
    <div class="settings-section">
      <h3>Aperçu d'écran</h3>
      <p class="section-description">
        Prévisualisez votre interface sur différents formats d'écran
      </p>
      
      <div class="setting-group">
        <label class="setting-label">
          <span>Aperçu actif</span>
          <div class="toggle-switch">
            <input 
              type="checkbox" 
              :checked="store.previewOverlayVisible" 
              @change="togglePreview"
            />
            <span class="toggle-slider"></span>
          </div>
        </label>
      </div>

      <div v-if="store.previewOverlayVisible" class="setting-group">
        <label class="setting-label">Format d'écran</label>
        <div class="preset-grid">
          <button
            v-for="preset in availablePresets"
            :key="preset.id"
            class="preset-button"
            :class="{ 
              active: store.previewPreset === preset.id,
              mobile: preset.category === 'mobile',
              desktop: preset.category === 'desktop'
            }"
            @click="selectPreset(preset.id)"
          >
            <div class="preset-icon">
              <div v-if="preset.category === 'mobile'" class="mobile-icon">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="5" y="2" width="14" height="20" rx="2" stroke="currentColor" stroke-width="2"/>
                  <path d="M12 18h.01" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                </svg>
              </div>
              <div v-else class="desktop-icon">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="2" y="3" width="20" height="14" rx="2" stroke="currentColor" stroke-width="2"/>
                  <path d="M8 21h8" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                  <path d="M12 17v4" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                </svg>
              </div>
            </div>
            <div class="preset-info">
              <div class="preset-name">{{ preset.name }}</div>
              <div class="preset-size">{{ preset.width }}×{{ preset.height }}</div>
            </div>
          </button>
          
          <!-- Off option -->
          <button
            class="preset-button off-button"
            :class="{ active: store.previewPreset === 'off' }"
            @click="selectPreset('off')"
          >
            <div class="preset-icon">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              </svg>
            </div>
            <div class="preset-info">
              <div class="preset-name">Désactivé</div>
              <div class="preset-size">Aucun aperçu</div>
            </div>
          </button>
        </div>
      </div>

      <div v-if="store.previewOverlayVisible && store.previewPreset !== 'off'" class="setting-group">
        <label class="setting-label">
          <span>Assombrir l'arrière-plan</span>
          <div class="toggle-switch">
            <input 
              type="checkbox" 
              :checked="store.previewShade" 
              @change="toggleShade"
            />
            <span class="toggle-slider"></span>
          </div>
        </label>
      </div>
    </div>
    
    <div class="settings-section">
      <h3>Optimisation mobile</h3>
      <p class="section-description">
        Configuration spécifique pour les appareils mobiles
      </p>
      
      <div class="setting-group">
        <label class="setting-label">Type d'appareil détecté</label>
        <div class="detected-device">
          <div class="device-info">
            <span class="device-type">{{ detectedDevice.type }}</span>
            <span class="device-details">
              {{ detectedDevice.viewport.width }}×{{ detectedDevice.viewport.height }}
              ({{ detectedDevice.orientation }})
            </span>
          </div>
          <button class="change-device-btn" @click="showDeviceChoice">
            Changer
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useAppStore } from '../stores/appStore'
import { getAvailablePreviewSizes, detectDevice } from '../utils/deviceDetection'

const store = useAppStore()

const availablePresets = getAvailablePreviewSizes()
const detectedDevice = ref(detectDevice())

function togglePreview() {
  store.togglePreviewOverlay()
}

function selectPreset(presetId) {
  store.setPreviewPreset(presetId)
}

function toggleShade() {
  store.togglePreviewShade()
}

function showDeviceChoice() {
  // Emit event to show device choice modal
  // This will be handled by the parent component
  window.dispatchEvent(new CustomEvent('show-device-choice'))
}

onMounted(() => {
  // Update detected device info
  detectedDevice.value = detectDevice()
})
</script>

<style scoped>
.preview-settings {
  color: rgba(255, 255, 255, 0.9);
}

.settings-section {
  margin-bottom: 32px;
  padding-bottom: 24px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.settings-section:last-child {
  border-bottom: none;
  margin-bottom: 0;
}

.settings-section h3 {
  margin: 0 0 8px 0;
  font-size: 16px;
  font-weight: 600;
  color: rgba(0, 191, 165, 1);
}

.section-description {
  margin: 0 0 20px 0;
  font-size: 13px;
  color: rgba(255, 255, 255, 0.6);
  line-height: 1.4;
}

.setting-group {
  margin-bottom: 20px;
}

.setting-label {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 14px;
  color: rgba(255, 255, 255, 0.8);
  margin-bottom: 12px;
}

.toggle-switch {
  position: relative;
  width: 44px;
  height: 24px;
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
  background: rgba(255, 255, 255, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.3);
  transition: 0.3s;
  border-radius: 24px;
}

.toggle-slider:before {
  position: absolute;
  content: "";
  height: 18px;
  width: 18px;
  left: 2px;
  bottom: 2px;
  background: white;
  transition: 0.3s;
  border-radius: 50%;
}

input:checked + .toggle-slider {
  background: rgba(0, 191, 165, 0.8);
  border-color: rgba(0, 191, 165, 1);
}

input:checked + .toggle-slider:before {
  transform: translateX(20px);
}

.preset-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 8px;
}

.preset-button {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  color: rgba(255, 255, 255, 0.8);
  text-align: left;
}

.preset-button:hover {
  background: rgba(255, 255, 255, 0.1);
  border-color: rgba(255, 255, 255, 0.4);
}

.preset-button.active {
  background: rgba(0, 191, 165, 0.2);
  border-color: rgba(0, 191, 165, 0.6);
  color: white;
}

.preset-button.mobile.active {
  background: rgba(0, 191, 165, 0.2);
  border-color: rgba(0, 191, 165, 0.6);
}

.preset-button.desktop.active {
  background: rgba(255, 255, 255, 0.15);
  border-color: rgba(255, 255, 255, 0.5);
}

.preset-button.off-button.active {
  background: rgba(255, 107, 107, 0.2);
  border-color: rgba(255, 107, 107, 0.6);
}

.preset-icon {
  flex-shrink: 0;
  opacity: 0.7;
}

.preset-button.active .preset-icon {
  opacity: 1;
}

.preset-info {
  flex: 1;
}

.preset-name {
  font-size: 13px;
  font-weight: 500;
  margin-bottom: 2px;
}

.preset-size {
  font-size: 11px;
  color: rgba(255, 255, 255, 0.6);
}

.preset-button.active .preset-size {
  color: rgba(255, 255, 255, 0.8);
}

.detected-device {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  padding: 12px;
}

.device-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.device-type {
  font-size: 13px;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.9);
  text-transform: capitalize;
}

.device-details {
  font-size: 11px;
  color: rgba(255, 255, 255, 0.6);
}

.change-device-btn {
  padding: 6px 12px;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 4px;
  color: rgba(255, 255, 255, 0.8);
  font-size: 11px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.change-device-btn:hover {
  background: rgba(255, 255, 255, 0.2);
  color: white;
}

@media (max-width: 768px) {
  .preset-grid {
    grid-template-columns: 1fr;
  }
  
  .preset-button {
    padding: 10px;
  }
  
  .detected-device {
    flex-direction: column;
    align-items: stretch;
    gap: 8px;
  }
  
  .change-device-btn {
    align-self: flex-end;
  }
}
</style>