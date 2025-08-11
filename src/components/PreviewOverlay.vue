<template>
  <div class="preview-overlay" v-if="visible">
    <div class="controls" :class="{ collapsed }">
      <button class="toggle" @click="collapsed = !collapsed" :title="collapsed ? 'Ouvrir' : 'Réduire'">
        {{ collapsed ? '👁️' : 'Aperçu 15"' }}
      </button>
      <div v-if="!collapsed" class="panel">
        <label>
          Preset
          <select v-model="preset" @change="applyPreset">
            <option value="off">Off</option>
            <option value="1366x768">1366×768</option>
            <option value="1536x864">1536×864</option>
          </select>
        </label>
        <label class="chk">
          <input type="checkbox" v-model="shade" /> Assombrir hors cadre
        </label>
      </div>
    </div>

    <div v-if="preset !== 'off'" class="frame" :style="frameStyle">
      <div class="hint">{{ preset }} — Aperçu visuel</div>
    </div>

    <div v-if="shade && preset !== 'off'" class="backdrop" />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount, watch } from 'vue'

const visible = ref(true)
const collapsed = ref(false)
const preset = ref('1366x768')
const shade = ref(true)

const frameStyle = computed(() => {
  if (preset.value === '1366x768') return { width: '1366px', height: '768px' }
  if (preset.value === '1536x864') return { width: '1536px', height: '864px' }
  return { display: 'none' }
})

function applyPreset() {
  document.documentElement.classList.remove('preview-15inch')
  if (preset.value !== 'off') {
    document.documentElement.classList.add('preview-15inch')
  }
}

onMounted(() => {
  applyPreset()
})

onBeforeUnmount(() => {
  document.documentElement.classList.remove('preview-15inch')
})

watch(preset, applyPreset)
</script>

<style scoped>
.preview-overlay {
  position: fixed;
  inset: 0;
  pointer-events: none; /* overlay itself non-bloquant */
  z-index: 9999;
}

.controls {
  position: fixed;
  top: 10px;
  right: 10px;
  pointer-events: auto;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.controls .toggle {
  padding: 6px 10px;
  border-radius: 8px;
  border: 1px solid rgba(255,255,255,0.35);
  background: rgba(255,255,255,0.12);
  color: rgba(255,255,255,0.95);
  cursor: pointer;
}

.controls .panel {
  padding: 8px;
  border-radius: 10px;
  border: 1px solid rgba(255,255,255,0.35);
  background: rgba(0,0,0,0.45);
  backdrop-filter: blur(8px);
  color: #fff;
}

.controls select {
  margin-left: 8px;
}

.chk { display: flex; align-items: center; gap: 6px; margin-top: 6px; }

.frame {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  border: 2px dashed rgba(255,255,255,0.6);
  border-radius: 8px;
  pointer-events: none;
}

.hint {
  position: absolute;
  top: -28px;
  left: 0;
  font-size: 12px;
  color: rgba(255,255,255,0.85);
}

.backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.35);
  pointer-events: none;
}
</style>
