/**
 * Device detection utilities for responsive preview system
 */

export function detectDevice() {
  if (typeof window === 'undefined') {
    return { type: 'desktop', mobile: false, tablet: false }
  }

  const userAgent = navigator.userAgent.toLowerCase()
  const isMobile = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent)
  const isTablet = /ipad|android(?!.*mobile)/i.test(userAgent)
  const touchScreen = 'ontouchstart' in window || navigator.maxTouchPoints > 0

  // Screen size detection
  const screenWidth = window.screen.width
  const screenHeight = window.screen.height
  const viewportWidth = window.innerWidth
  const viewportHeight = window.innerHeight

  // Common mobile screen sizes (6.1" iPhone 14, etc.)
  const isMobileSize = screenWidth <= 414 || viewportWidth <= 414

  // Common desktop sizes (15" laptop: 1366x768, 1536x864, 1920x1080)
  const isDesktopSize = screenWidth >= 1366 && screenHeight >= 768

  let deviceType = 'desktop'
  if (isMobile || (isMobileSize && touchScreen)) {
    deviceType = 'mobile'
  } else if (isTablet) {
    deviceType = 'tablet'
  }

  return {
    type: deviceType,
    mobile: deviceType === 'mobile',
    tablet: deviceType === 'tablet',
    desktop: deviceType === 'desktop',
    touchScreen,
    screenSize: { width: screenWidth, height: screenHeight },
    viewport: { width: viewportWidth, height: viewportHeight },
    orientation: viewportWidth > viewportHeight ? 'landscape' : 'portrait'
  }
}

export function getOptimalPreviewSize(deviceType = null) {
  const device = deviceType || detectDevice()
  
  if (device.mobile) {
    // iPhone 14 (6.1") dimensions
    if (device.orientation === 'portrait') {
      return { width: 390, height: 844, name: 'Mobile 6.1" Portrait' }
    } else {
      return { width: 844, height: 390, name: 'Mobile 6.1" Landscape' }
    }
  }
  
  // Default to 15" laptop sizes
  return { 
    width: 1366, 
    height: 768, 
    name: 'PC 15" Landscape'
  }
}

export function getAvailablePreviewSizes() {
  return [
    { 
      id: 'desktop-15-landscape', 
      width: 1366, 
      height: 768, 
      name: 'PC 15" Landscape',
      category: 'desktop'
    },
    { 
      id: 'desktop-15-hd', 
      width: 1536, 
      height: 864, 
      name: 'PC 15" HD',
      category: 'desktop'
    },
    { 
      id: 'mobile-6-portrait', 
      width: 390, 
      height: 844, 
      name: 'Mobile 6.1" Portrait',
      category: 'mobile'
    },
    { 
      id: 'mobile-6-landscape', 
      width: 844, 
      height: 390, 
      name: 'Mobile 6.1" Landscape',
      category: 'mobile'
    }
  ]
}

export function shouldShowDeviceChoice() {
  // Show device choice modal on first visit
  return !localStorage.getItem('device-choice-made')
}

export function saveDeviceChoice(choice) {
  localStorage.setItem('device-choice-made', 'true')
  localStorage.setItem('preferred-device-type', choice)
}

export function getPreferredDeviceType() {
  return localStorage.getItem('preferred-device-type') || detectDevice().type
}