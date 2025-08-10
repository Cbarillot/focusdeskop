<template>
  <div class="home-layout">
    <div class="digital-clock">
      <div class="time-display">
        {{ currentTime }}
      </div>
      <div class="date-display">
        {{ currentDate }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const currentTime = ref('')
const currentDate = ref('')
let timeInterval = null

function updateTime() {
  const now = new Date()
  
  // Format time as HH:MM
  currentTime.value = now.toLocaleTimeString('fr-FR', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  })
  
  // Format date
  currentDate.value = now.toLocaleDateString('fr-FR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

onMounted(() => {
  updateTime()
  timeInterval = setInterval(updateTime, 1000)
})

onUnmounted(() => {
  if (timeInterval) {
    clearInterval(timeInterval)
  }
})
</script>

<style scoped>
.home-layout {
  display: flex;
  align-items: flex-start;
  justify-content: center;
  height: 100vh;
  text-align: center;
  padding-top: 120px;
}

.digital-clock {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
}

.time-display {
  font-family: 'Be Vietnam Pro', 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  font-size: clamp(6rem, 20vw, 180px);
  font-weight: 900;
  line-height: 0.8;
  letter-spacing: -0.04em;
  color: #fff;
  text-shadow: 0 4px 12px rgba(0, 0, 0, 0.5), 0 2px 4px rgba(0, 0, 0, 0.3);
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.date-display {
  font-family: 'Be Vietnam Pro', 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  font-size: clamp(1.2rem, 4vw, 2rem);
  font-weight: 300;
  color: rgba(255, 255, 255, 0.8);
  text-transform: capitalize;
  letter-spacing: 0.02em;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .digital-clock {
    gap: 15px;
  }
}

@media (max-width: 480px) {
  .digital-clock {
    gap: 10px;
  }
}
</style>
