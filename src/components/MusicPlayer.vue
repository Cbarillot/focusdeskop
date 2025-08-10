<template>
  <div class="music-player">
    <audio ref="audio" :src="src" controls style="width: 100%"></audio>
    <input type="file" @change="onFileChange" accept="audio/*" />
  </div>
</template>

<script setup>
import { ref } from 'vue'
const src = ref('')

function onFileChange(event) {
  const file = event.target.files[0]
  if (file) {
    src.value = URL.createObjectURL(file)
  }
}
</script>

<style scoped>
.music-player { margin: 2em 0; text-align: center; }
</style>