<template>
  <div v-if="show" class="device-choice-modal">
    <div class="modal-backdrop" @click="handleBackdropClick"></div>
    <div class="modal-content">
      <div class="modal-header">
        <h2>Choisissez votre environnement</h2>
        <p>Sélectionnez votre type d'appareil pour une expérience optimisée</p>
      </div>
      
      <div class="device-options">
        <button 
          class="device-option"
          :class="{ selected: selectedDevice === 'desktop' }"
          @click="selectDevice('desktop')"
        >
          <div class="device-icon">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="2" y="3" width="20" height="14" rx="2" stroke="currentColor" stroke-width="2"/>
              <path d="M8 21h8" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              <path d="M12 17v4" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>
          </div>
          <div class="device-info">
            <h3>Ordinateur</h3>
            <p>PC, Mac, écran 15" et plus</p>
          </div>
        </button>
        
        <button 
          class="device-option"
          :class="{ selected: selectedDevice === 'mobile' }"
          @click="selectDevice('mobile')"
        >
          <div class="device-icon">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="5" y="2" width="14" height="20" rx="2" stroke="currentColor" stroke-width="2"/>
              <path d="M12 18h.01" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>
          </div>
          <div class="device-info">
            <h3>Mobile</h3>
            <p>Smartphone, tablette</p>
          </div>
        </button>
        
        <button 
          class="device-option auto-detect"
          :class="{ selected: selectedDevice === 'auto' }"
          @click="selectDevice('auto')"
        >
          <div class="device-icon">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2v4" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              <path d="M12 18v4" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              <path d="M4.93 4.93l2.83 2.83" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              <path d="M16.24 16.24l2.83 2.83" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              <path d="M2 12h4" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              <path d="M18 12h4" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              <path d="M4.93 19.07l2.83-2.83" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              <path d="M16.24 7.76l2.83-2.83" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              <circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="2"/>
            </svg>
          </div>
          <div class="device-info">
            <h3>Détection automatique</h3>
            <p>Laissez l'app choisir pour vous</p>
          </div>
        </button>
      </div>
      
      <div class="modal-footer">
        <button class="confirm-btn" @click="confirmChoice" :disabled="!selectedDevice">
          Continuer
        </button>
        <button class="skip-btn" @click="skipChoice">
          Passer pour l'instant
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { detectDevice, shouldShowDeviceChoice, saveDeviceChoice } from '../utils/deviceDetection'

const emit = defineEmits(['device-selected', 'dismissed'])

const show = ref(false)
const selectedDevice = ref('')

function selectDevice(type) {
  selectedDevice.value = type
}

function confirmChoice() {
  if (!selectedDevice.value) return
  
  let finalChoice = selectedDevice.value
  if (selectedDevice.value === 'auto') {
    finalChoice = detectDevice().type
  }
  
  saveDeviceChoice(finalChoice)
  emit('device-selected', finalChoice)
  show.value = false
}

function skipChoice() {
  emit('dismissed')
  show.value = false
}

function handleBackdropClick() {
  // Optional: close on backdrop click
  // skipChoice()
}

onMounted(() => {
  if (shouldShowDeviceChoice()) {
    show.value = true
    // Pre-select based on auto-detection
    const detected = detectDevice()
    selectedDevice.value = detected.type
  }
})
</script>

<style scoped>
.device-choice-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-backdrop {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(8px);
}

.modal-content {
  position: relative;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 16px;
  padding: 32px;
  max-width: 500px;
  width: 90%;
  color: white;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
}

.modal-header {
  text-align: center;
  margin-bottom: 32px;
}

.modal-header h2 {
  margin: 0 0 8px 0;
  font-size: 24px;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.95);
}

.modal-header p {
  margin: 0;
  font-size: 14px;
  color: rgba(255, 255, 255, 0.7);
}

.device-options {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 32px;
}

.device-option {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px;
  background: rgba(255, 255, 255, 0.05);
  border: 2px solid rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  text-align: left;
  color: white;
}

.device-option:hover {
  background: rgba(255, 255, 255, 0.1);
  border-color: rgba(255, 255, 255, 0.4);
  transform: translateY(-2px);
}

.device-option.selected {
  background: rgba(0, 191, 165, 0.2);
  border-color: rgba(0, 191, 165, 0.6);
  transform: translateY(-2px);
}

.device-option.auto-detect {
  border-style: dashed;
}

.device-option.auto-detect.selected {
  background: rgba(255, 193, 7, 0.2);
  border-color: rgba(255, 193, 7, 0.6);
}

.device-icon {
  flex-shrink: 0;
  opacity: 0.8;
}

.device-option.selected .device-icon {
  opacity: 1;
  color: rgba(0, 191, 165, 1);
}

.device-option.auto-detect.selected .device-icon {
  color: rgba(255, 193, 7, 1);
}

.device-info {
  flex: 1;
}

.device-info h3 {
  margin: 0 0 4px 0;
  font-size: 16px;
  font-weight: 600;
}

.device-info p {
  margin: 0;
  font-size: 13px;
  color: rgba(255, 255, 255, 0.6);
}

.modal-footer {
  display: flex;
  gap: 12px;
  justify-content: center;
}

.confirm-btn, .skip-btn {
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.confirm-btn {
  background: rgba(0, 191, 165, 0.8);
  border: 1px solid rgba(0, 191, 165, 1);
  color: white;
}

.confirm-btn:hover:not(:disabled) {
  background: rgba(0, 191, 165, 1);
  transform: translateY(-1px);
}

.confirm-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.skip-btn {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.3);
  color: rgba(255, 255, 255, 0.8);
}

.skip-btn:hover {
  background: rgba(255, 255, 255, 0.2);
  color: white;
}

@media (max-width: 768px) {
  .modal-content {
    padding: 24px;
    width: 95%;
  }
  
  .device-option {
    padding: 12px;
  }
  
  .device-icon svg {
    width: 36px;
    height: 36px;
  }
}
</style>