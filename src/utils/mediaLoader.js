/**
 * Media loader utility to automatically scan and load media assets
 * from the themes directories
 */

// Get all image files from assets/themes/images
async function loadImageAssets() {
  const images = {}
  
  // List of known image files from the directory
  const imageFiles = [
    '4-the-bay-of-naples-in-the-morning-1893-Romantic-Ivan-Aivazovsky-Russian.jpg',
    '793829-monet-desktop-wallpaper-1920x1080-free-download.jpg',
    'Princess_Mononoke_.jpg',
    'boy reading in the weeds.jpg',
    'chihiro\'s flowers 2.jpg',
    'chihiro\'s flowers.jpg',
    'digital-art-style-river-nature-landscape.jpg',
    'howl and sophie flying.png',
    'kiki flying.jpg',
    'kiki\'s workshop.jpg',
    'mononoké forest.jpg',
    'totoro\'s forest.jpg',
    'vague osaka 2.jpg',
    'van-gogh-wallpaper-2009121402599.jpg'
  ]

  imageFiles.forEach((filename) => {
    const name = formatMediaName(filename)
    const key = createMediaKey(filename)
    
    images[key] = {
      name,
      type: 'image',
      value: `/assets/themes/images/${filename}`,
      preview: `/assets/themes/images/${filename}`,
      category: categorizeImage(filename),
      source: 'assets'
    }
  })

  return images
}

// Get all video files from assets/themes/videos
async function loadVideoAssets() {
  const videos = {}
  
  // List of known video files from the directory
  const videoFiles = [
    'coffee-shop.3840x2160.mp4',
    'evening-chill.3840x2160.mp4',
    'flower-field-howls-moving-castle-moewalls-com.mp4',
    'howls-moving-castle-1-moewalls-com (1).mp4',
    'island-house-spirited-away-moewalls-com.mp4',
    'japanese-lofi-cafe-moewalls-com.mp4',
    'lofi-cozy-house-rainy-day-moewalls-com.mp4',
    'lofi-girl-animated.1920x1080.mp4',
    'lofi-house-cloudy-day-1-moewalls-com.mp4',
    'morning-coffee.3840x2160.mp4',
    'shou-relaxing-flower-field-the-secret-world-of-arrietty-moewalls-com.mp4',
    'small-house-in-forest.3840x2160.mp4',
    'totoro-in-the-rain-moewalls-com.mp4',
    'zelda-forest-temple.3840x2160.mp4'
  ]

  videoFiles.forEach((filename) => {
    const name = formatMediaName(filename)
    const key = createMediaKey(filename)
    
    videos[key] = {
      name,
      type: 'video',
      value: `/assets/themes/videos/${filename}`,
      preview: `/assets/themes/videos/${filename}`,
      category: categorizeVideo(filename),
      source: 'assets'
    }
  })

  return videos
}

// Format filename to readable name
function formatMediaName(filename) {
  // Remove file extension
  let name = filename.replace(/\.[^/.]+$/, "")
  
  // Handle special cases
  name = name
    .replace(/moewalls-com/g, '')
    .replace(/3840x2160/g, '')
    .replace(/1920x1080/g, '')
    .replace(/\s*\(\d+\)\s*/g, '') // Remove (1), (2) etc
    .replace(/[-_]+/g, ' ') // Replace dashes and underscores with spaces
    .replace(/\s+/g, ' ') // Remove multiple spaces
    .trim()

  // Capitalize first letter of each word
  return name.split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ')
}

// Create a unique key for the media item
function createMediaKey(filename) {
  return filename
    .replace(/\.[^/.]+$/, '') // Remove extension
    .replace(/[^a-zA-Z0-9]/g, '-') // Replace special chars with dashes
    .replace(/-+/g, '-') // Replace multiple dashes with single
    .replace(/^-|-$/g, '') // Remove leading/trailing dashes
    .toLowerCase()
}

// Categorize images based on filename and content
function categorizeImage(filename) {
  const name = filename.toLowerCase()
  
  // Studio Ghibli/Anime themes
  if (name.includes('ghibli') || name.includes('totoro') || name.includes('kiki') || 
      name.includes('chihiro') || name.includes('mononoke') || name.includes('howl')) {
    return 'ghibli'
  }
  
  // Classical art
  if (name.includes('monet') || name.includes('van-gogh') || name.includes('aivazovsky') || 
      name.includes('naples') || name.includes('painting')) {
    return 'classical-art'
  }
  
  // Nature/Landscape
  if (name.includes('nature') || name.includes('landscape') || name.includes('forest') || 
      name.includes('river') || name.includes('digital-art')) {
    return 'nature'
  }
  
  // Default to images category
  return 'images'
}

// Categorize videos based on filename and content  
function categorizeVideo(filename) {
  const name = filename.toLowerCase()
  
  // Lofi category
  if (name.includes('lofi') || name.includes('chill') || name.includes('evening')) {
    return 'lofi'
  }
  
  // Café category
  if (name.includes('coffee') || name.includes('cafe') || name.includes('morning-coffee')) {
    return 'cafe'
  }
  
  // Nature category (Studio Ghibli and nature scenes)
  if (name.includes('totoro') || name.includes('flower') || name.includes('forest') || 
      name.includes('island') || name.includes('spirited') || name.includes('howl') || 
      name.includes('arrietty') || name.includes('zelda')) {
    return 'nature'
  }
  
  // Default to animated category
  return 'animated'
}

// Load all media assets
export async function loadAllMediaAssets() {
  try {
    const [images, videos] = await Promise.all([
      loadImageAssets(),
      loadVideoAssets()
    ])
    
    return {
      ...images,
      ...videos
    }
  } catch (error) {
    console.error('Error loading media assets:', error)
    return {}
  }
}

// Get media assets by category
export function getMediaByCategory(mediaAssets, category) {
  return Object.keys(mediaAssets)
    .filter(key => mediaAssets[key].category === category)
    .reduce((obj, key) => {
      obj[key] = mediaAssets[key]
      return obj
    }, {})
}

export default {
  loadAllMediaAssets,
  getMediaByCategory,
  formatMediaName,
  createMediaKey,
  categorizeImage,
  categorizeVideo
}