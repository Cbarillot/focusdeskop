/**
 * Audio notification system for Pomodoro timer
 * Generates bell sounds using Web Audio API
 */

class AudioNotification {
  constructor() {
    this.audioContext = null
    this.initAudioContext()
  }

  initAudioContext() {
    try {
      // Create audio context on user interaction
      if (typeof window !== 'undefined') {
        this.audioContext = new (window.AudioContext || window.webkitAudioContext)()
      }
    } catch (error) {
      console.warn('Web Audio API not supported:', error)
    }
  }

  async ensureAudioContext() {
    if (!this.audioContext) {
      this.initAudioContext()
    }
    
    // Resume audio context if suspended (required by browser policies)
    if (this.audioContext && this.audioContext.state === 'suspended') {
      try {
        await this.audioContext.resume()
      } catch (error) {
        console.warn('Could not resume audio context:', error)
      }
    }
  }

  // Generate a bell-like sound for work session end
  async playWorkEndBell() {
    await this.ensureAudioContext()
    if (!this.audioContext) return

    try {
      // Create a harmonious bell sound - bright and energetic
      const frequency = 800 // Higher pitch for work end
      const duration = 1.5
      
      this.createBellSound(frequency, duration, 'work')
    } catch (error) {
      console.warn('Error playing work end bell:', error)
    }
  }

  // Generate a bell-like sound for break end  
  async playBreakEndBell() {
    await this.ensureAudioContext()
    if (!this.audioContext) return

    try {
      // Create a softer bell sound - lower and more gentle
      const frequency = 600 // Lower pitch for break end
      const duration = 2
      
      this.createBellSound(frequency, duration, 'break')
    } catch (error) {
      console.warn('Error playing break end bell:', error)
    }
  }

  createBellSound(baseFrequency, duration, type) {
    const currentTime = this.audioContext.currentTime
    
    // Create multiple oscillators for harmonic richness
    const frequencies = [
      baseFrequency,
      baseFrequency * 2,    // Octave
      baseFrequency * 3,    // Fifth
      baseFrequency * 4     // Double octave
    ]
    
    const gains = type === 'work' ? [0.4, 0.2, 0.1, 0.05] : [0.3, 0.15, 0.08, 0.03]
    
    frequencies.forEach((freq, index) => {
      const oscillator = this.audioContext.createOscillator()
      const gainNode = this.audioContext.createGain()
      
      // Use sine wave for pure bell-like tone
      oscillator.type = 'sine'
      oscillator.frequency.setValueAtTime(freq, currentTime)
      
      // Create bell envelope - quick attack, long decay
      gainNode.gain.setValueAtTime(0, currentTime)
      gainNode.gain.exponentialRampToValueAtTime(gains[index], currentTime + 0.01)
      gainNode.gain.exponentialRampToValueAtTime(0.001, currentTime + duration)
      
      // Connect and start
      oscillator.connect(gainNode)
      gainNode.connect(this.audioContext.destination)
      
      oscillator.start(currentTime)
      oscillator.stop(currentTime + duration)
    })
  }

  // Test method to check if audio is working
  async testSound() {
    await this.ensureAudioContext()
    if (!this.audioContext) {
      console.warn('Audio context not available')
      return false
    }
    
    try {
      // Simple beep for testing
      const oscillator = this.audioContext.createOscillator()
      const gainNode = this.audioContext.createGain()
      
      oscillator.frequency.setValueAtTime(440, this.audioContext.currentTime)
      gainNode.gain.setValueAtTime(0.1, this.audioContext.currentTime)
      gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + 0.5)
      
      oscillator.connect(gainNode)
      gainNode.connect(this.audioContext.destination)
      
      oscillator.start()
      oscillator.stop(this.audioContext.currentTime + 0.5)
      
      return true
    } catch (error) {
      console.warn('Audio test failed:', error)
      return false
    }
  }
}

// Create global instance
let audioNotification = null

export function getAudioNotification() {
  if (!audioNotification) {
    audioNotification = new AudioNotification()
  }
  return audioNotification
}

export default getAudioNotification