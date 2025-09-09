/**
 * Audio notification system for Pomodoro timer
 * Generates various bell sounds using Web Audio API
 */

class AudioNotification {
  constructor() {
    this.audioContext = null
    this.volume = 0.7
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

  setVolume(volume) {
    this.volume = Math.max(0, Math.min(1, volume))
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

  // Play sound by name - for the sound library
  async playSoundByName(soundName) {
    await this.ensureAudioContext()
    if (!this.audioContext) return

    try {
      const soundConfig = this.getSoundConfig(soundName)
      if (soundConfig) {
        this.createAdvancedSound(soundConfig)
      }
    } catch (error) {
      console.warn(`Error playing sound ${soundName}:`, error)
    }
  }

  // Get sound configuration by name
  getSoundConfig(soundName) {
    const sounds = {
      'classic-bell': {
        type: 'bell',
        baseFreq: 800,
        harmonics: [1, 2, 3, 4],
        gains: [0.4, 0.2, 0.1, 0.05],
        duration: 1.5,
        decay: 'exponential'
      },
      'gentle-chime': {
        type: 'chime',
        baseFreq: 523.25, // C5
        harmonics: [1, 1.5, 2, 2.5],
        gains: [0.3, 0.25, 0.15, 0.1],
        duration: 2.5,
        decay: 'linear'
      },
      'temple-gong': {
        type: 'gong',
        baseFreq: 200,
        harmonics: [1, 1.618, 2, 2.618, 3],
        gains: [0.5, 0.3, 0.2, 0.15, 0.1],
        duration: 3,
        decay: 'exponential'
      },
      'crystal-ding': {
        type: 'crystal',
        baseFreq: 1047, // C6
        harmonics: [1, 2, 3, 5],
        gains: [0.4, 0.3, 0.2, 0.1],
        duration: 1,
        decay: 'sharp'
      },
      'soft-bells': {
        type: 'soft',
        baseFreq: 659.25, // E5
        harmonics: [1, 1.25, 1.5, 2],
        gains: [0.25, 0.2, 0.15, 0.1],
        duration: 2,
        decay: 'linear'
      },
      'meditation-bowl': {
        type: 'bowl',
        baseFreq: 256, // C4
        harmonics: [1, 1.414, 2, 2.828],
        gains: [0.4, 0.25, 0.15, 0.08],
        duration: 4,
        decay: 'slow'
      }
    }
    
    return sounds[soundName] || sounds['classic-bell']
  }

  createAdvancedSound(config) {
    const currentTime = this.audioContext.currentTime
    const masterGain = this.audioContext.createGain()
    masterGain.connect(this.audioContext.destination)
    masterGain.gain.setValueAtTime(this.volume, currentTime)
    
    config.harmonics.forEach((harmonic, index) => {
      const oscillator = this.audioContext.createOscillator()
      const gainNode = this.audioContext.createGain()
      
      // Set frequency and wave type
      const frequency = config.baseFreq * harmonic
      oscillator.type = config.type === 'gong' ? 'sawtooth' : 
                       config.type === 'crystal' ? 'triangle' : 'sine'
      oscillator.frequency.setValueAtTime(frequency, currentTime)
      
      // Set gain envelope based on decay type
      const gain = config.gains[index] || 0.05
      gainNode.gain.setValueAtTime(0, currentTime)
      
      if (config.decay === 'sharp') {
        gainNode.gain.linearRampToValueAtTime(gain, currentTime + 0.01)
        gainNode.gain.exponentialRampToValueAtTime(0.001, currentTime + config.duration * 0.3)
      } else if (config.decay === 'linear') {
        gainNode.gain.linearRampToValueAtTime(gain, currentTime + 0.05)
        gainNode.gain.linearRampToValueAtTime(0.001, currentTime + config.duration)
      } else if (config.decay === 'slow') {
        gainNode.gain.exponentialRampToValueAtTime(gain, currentTime + 0.1)
        gainNode.gain.exponentialRampToValueAtTime(0.001, currentTime + config.duration)
      } else { // exponential
        gainNode.gain.exponentialRampToValueAtTime(gain, currentTime + 0.01)
        gainNode.gain.exponentialRampToValueAtTime(0.001, currentTime + config.duration)
      }
      
      // Add some frequency modulation for more organic sound
      if (config.type === 'gong' || config.type === 'bowl') {
        const lfo = this.audioContext.createOscillator()
        const lfoGain = this.audioContext.createGain()
        lfo.frequency.setValueAtTime(0.5, currentTime)
        lfoGain.gain.setValueAtTime(frequency * 0.005, currentTime)
        lfo.connect(lfoGain)
        lfoGain.connect(oscillator.frequency)
        lfo.start(currentTime)
        lfo.stop(currentTime + config.duration)
      }
      
      // Connect and start
      oscillator.connect(gainNode)
      gainNode.connect(masterGain)
      
      oscillator.start(currentTime)
      oscillator.stop(currentTime + config.duration)
    })
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
      gainNode.gain.exponentialRampToValueAtTime(gains[index] * this.volume, currentTime + 0.01)
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
      gainNode.gain.setValueAtTime(0.1 * this.volume, this.audioContext.currentTime)
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

  // Get available sound names for UI
  getAvailableSounds() {
    return [
      { id: 'classic-bell', name: 'Classic Bell', description: 'Traditional bright bell sound' },
      { id: 'gentle-chime', name: 'Gentle Chime', description: 'Soft melodic chime' },
      { id: 'temple-gong', name: 'Temple Gong', description: 'Deep resonant gong' },
      { id: 'crystal-ding', name: 'Crystal Ding', description: 'High-pitched crystal sound' },
      { id: 'soft-bells', name: 'Soft Bells', description: 'Mellow bell harmony' },
      { id: 'meditation-bowl', name: 'Meditation Bowl', description: 'Long-lasting singing bowl' }
    ]
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