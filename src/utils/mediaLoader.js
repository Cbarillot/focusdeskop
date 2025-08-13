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

// Categorize images - put ALL images from assets/themes/images into "images" category
function categorizeImage(filename) {
  // All images from assets/themes/images go to the "images" category
  return 'images'
}

// Categorize videos - put ALL videos from assets/themes/videos into "animated" category
function categorizeVideo(filename) {
  // All videos from assets/themes/videos go to the "animated" category
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