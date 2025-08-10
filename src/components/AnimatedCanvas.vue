<template>
  <canvas 
    ref="canvasRef" 
    id="bg-canvas"
    :width="canvasWidth"
    :height="canvasHeight"
    class="animated-canvas"
  ></canvas>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue'

const props = defineProps({
  animationType: {
    type: String,
    default: 'lava-lamp'
  },
  colors: {
    type: Array,
    default: () => ['#DF437A', '#3d57d6', '#a117fd', '#ec634b']
  }
})

const canvasRef = ref(null)
const canvasWidth = ref(window.innerWidth)
const canvasHeight = ref(window.innerHeight)

let animationId = null
let startTime = Date.now()

// Resize handler
function handleResize() {
  canvasWidth.value = window.innerWidth
  canvasHeight.value = window.innerHeight
}

// Lava Lamp animation with gradient effect
function animateLavaLamp() {
  const canvas = canvasRef.value
  if (!canvas) return
  
  const ctx = canvas.getContext('2d')
  const time = (Date.now() - startTime) * 0.001
  
  // Clear canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  
  // Create multiple gradient circles
  const numCircles = 4
  const circles = []
  
  for (let i = 0; i < numCircles; i++) {
    const angle = (time * 0.5 + i * Math.PI * 0.5) % (Math.PI * 2)
    const radius = Math.min(canvas.width, canvas.height) * 0.4
    const centerX = canvas.width * 0.5 + Math.cos(angle + i) * radius * 0.3
    const centerY = canvas.height * 0.5 + Math.sin(angle * 0.7 + i) * radius * 0.3
    const circleRadius = radius * (0.6 + Math.sin(time * 0.3 + i) * 0.3)
    
    circles.push({
      x: centerX,
      y: centerY,
      radius: circleRadius,
      color: props.colors[i % props.colors.length]
    })
  }
  
  // Create complex gradient
  const gradient = ctx.createRadialGradient(
    canvas.width * 0.5, canvas.height * 0.5, 0,
    canvas.width * 0.5, canvas.height * 0.5, Math.max(canvas.width, canvas.height) * 0.7
  )
  
  // Add animated color stops
  const colorStops = [
    { stop: 0, color: props.colors[0] },
    { stop: 0.3 + Math.sin(time * 0.5) * 0.1, color: props.colors[1] },
    { stop: 0.6 + Math.cos(time * 0.3) * 0.1, color: props.colors[2] },
    { stop: 1, color: props.colors[3] }
  ]
  
  colorStops.forEach(({ stop, color }) => {
    gradient.addColorStop(Math.max(0, Math.min(1, stop)), color)
  })
  
  // Apply gradient
  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, canvas.width, canvas.height)
  
  // Add moving orbs for extra effect
  circles.forEach((circle, index) => {
    const orbGradient = ctx.createRadialGradient(
      circle.x, circle.y, 0,
      circle.x, circle.y, circle.radius
    )
    
    const alpha = 0.3 + Math.sin(time + index) * 0.2
    orbGradient.addColorStop(0, `${circle.color}${Math.floor(alpha * 255).toString(16).padStart(2, '0')}`)
    orbGradient.addColorStop(1, `${circle.color}00`)
    
    ctx.fillStyle = orbGradient
    ctx.beginPath()
    ctx.arc(circle.x, circle.y, circle.radius, 0, Math.PI * 2)
    ctx.fill()
  })
  
  animationId = requestAnimationFrame(animateLavaLamp)
}

// Aurora animation
function animateAurora() {
  const canvas = canvasRef.value
  if (!canvas) return
  
  const ctx = canvas.getContext('2d')
  const time = (Date.now() - startTime) * 0.001
  
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  
  // Create aurora waves
  const numWaves = 3
  for (let i = 0; i < numWaves; i++) {
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height)
    const color = props.colors[i % props.colors.length]
    
    gradient.addColorStop(0, `${color}00`)
    gradient.addColorStop(0.5 + Math.sin(time + i) * 0.2, `${color}80`)
    gradient.addColorStop(1, `${color}00`)
    
    ctx.fillStyle = gradient
    ctx.beginPath()
    
    const waveHeight = canvas.height * 0.6
    const waveOffset = time * (50 + i * 20)
    
    ctx.moveTo(0, canvas.height)
    for (let x = 0; x <= canvas.width; x += 10) {
      const y = canvas.height - waveHeight * 0.5 - 
                Math.sin((x + waveOffset) * 0.01 + i) * waveHeight * 0.3 -
                Math.cos((x + waveOffset) * 0.005 + i * 2) * waveHeight * 0.2
      ctx.lineTo(x, y)
    }
    ctx.lineTo(canvas.width, canvas.height)
    ctx.closePath()
    ctx.fill()
  }
  
  animationId = requestAnimationFrame(animateAurora)
}

function startAnimation() {
  if (animationId) {
    cancelAnimationFrame(animationId)
  }
  
  startTime = Date.now()
  
  if (props.animationType === 'lava-lamp') {
    animateLavaLamp()
  } else if (props.animationType === 'aurora') {
    animateAurora()
  }
}

onMounted(() => {
  window.addEventListener('resize', handleResize)
  handleResize()
  startAnimation()
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
  if (animationId) {
    cancelAnimationFrame(animationId)
  }
})

watch([() => props.animationType, () => props.colors], () => {
  startAnimation()
}, { deep: true })
</script>

<style scoped>
.animated-canvas {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
}
</style>
