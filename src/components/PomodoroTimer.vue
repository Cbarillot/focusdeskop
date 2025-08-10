<template>
  <div class="pomodoro">
    <div class="timer">
      {{ minutes }}:{{ seconds.toString().padStart(2, '0') }}
    </div>
    <div class="controls">
      <button @click="toggle">
        {{ running ? 'Pause' : 'Start' }}
      </button>
      <button @click="reset">Reset</button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onUnmounted } from 'vue'

const initial = 25 * 60
const time = ref(initial)
const running = ref(false)
let interval

const minutes = computed(() => Math.floor(time.value / 60))
const seconds = computed(() => time.value % 60)

function tick() {
  if (time.value > 0) time.value--
  else running.value = false
}

function toggle() {
  running.value = !running.value
  if (running.value) {
    interval = setInterval(tick, 1000)
  } else {
    clearInterval(interval)
  }
}

function reset() {
  clearInterval(interval)
  time.value = initial
  running.value = false
}

onUnmounted(() => clearInterval(interval))
</script>

<style scoped>
.pomodoro { text-align: center; margin: 2em 0; }
.timer { font-size: 2.5em; margin-bottom: 1em; }
.controls button { margin: 0 0.5em; font-size: 1em; }
</style>