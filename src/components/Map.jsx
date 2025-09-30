import React, { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { MapPin, Navigation, ZoomIn, ZoomOut } from 'lucide-react'
import { Button } from './ui'

const Map = ({ 
  stops = [], 
  routes = [], 
  selectedStopId = null,
  onStopClick = () => {},
  className = '',
  height = '400px'
}) => {
  const mapContainer = useRef(null)
  const map = useRef(null)
  const [isMapLoaded, setIsMapLoaded] = useState(false)
  const [userLocation, setUserLocation] = useState(null)

  useEffect(() => {
    // Initialize map with placeholder (since we don't have Mapbox token)
    if (mapContainer.current && !map.current) {
      // Create a placeholder map visualization
      mapContainer.current.innerHTML = `
        <div class="w-full h-full bg-gradient-to-br from-blue-100 to-green-100 rounded-lg flex items-center justify-center relative overflow-hidden">
          <div class="absolute inset-0 bg-white/20"></div>
          <div class="text-center z-10">
            <div class="w-16 h-16 bg-primary-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg class="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
              </svg>
            </div>
            <h3 class="text-lg font-semibold text-secondary-900 mb-2">Interactive Map</h3>
            <p class="text-secondary-600 text-sm">Map visualization would appear here</p>
            <p class="text-secondary-500 text-xs mt-2">Configure Mapbox token to enable</p>
          </div>
          
          <!-- Route visualization -->
          <div class="absolute inset-0 pointer-events-none">
            ${stops.map((stop, index) => {
              const x = 20 + (index * 60) + Math.random() * 20
              const y = 30 + Math.random() * 40
              return `
                <div 
                  class="absolute w-4 h-4 bg-primary-600 rounded-full border-2 border-white shadow-lg cursor-pointer hover:scale-110 transition-transform"
                  style="left: ${x}%; top: ${y}%;"
                  data-stop-id="${stop.id}"
                  title="${stop.name}"
                >
                </div>
                ${index < stops.length - 1 ? `
                  <div 
                    class="absolute h-0.5 bg-primary-400"
                    style="left: ${x + 2}%; top: ${y + 2}%; width: ${60}%; transform: rotate(${Math.random() * 30 - 15}deg);"
                  ></div>
                ` : ''}
              `
            }).join('')}
          </div>
        </div>
      `
      
      // Add click handlers to stops
      const stopElements = mapContainer.current.querySelectorAll('[data-stop-id]')
      stopElements.forEach(element => {
        element.addEventListener('click', (e) => {
          const stopId = e.target.getAttribute('data-stop-id')
          onStopClick(stopId)
        })
      })
      
      setIsMapLoaded(true)
    }
  }, [stops, onStopClick])

  const centerOnUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          })
        },
        (error) => {
          console.error('Error getting location:', error)
        }
      )
    }
  }

  return (
    <div className={`relative ${className}`}>
      <div 
        ref={mapContainer}
        className="w-full rounded-lg border border-secondary-200 overflow-hidden"
        style={{ height }}
      />
      
      {/* Map Controls */}
      <div className="absolute top-4 right-4 flex flex-col space-y-2">
        <Button
          variant="secondary"
          size="sm"
          onClick={centerOnUserLocation}
          className="w-10 h-10 p-0"
          title="Center on my location"
        >
          <Navigation className="w-4 h-4" />
        </Button>
        <Button
          variant="secondary"
          size="sm"
          className="w-10 h-10 p-0"
          title="Zoom in"
        >
          <ZoomIn className="w-4 h-4" />
        </Button>
        <Button
          variant="secondary"
          size="sm"
          className="w-10 h-10 p-0"
          title="Zoom out"
        >
          <ZoomOut className="w-4 h-4" />
        </Button>
      </div>

      {/* Map Legend */}
      <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-lg">
        <div className="text-xs text-secondary-600 space-y-1">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-primary-600 rounded-full"></div>
            <span>Bus Stops</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-0.5 bg-primary-400"></div>
            <span>Route</span>
          </div>
        </div>
      </div>

      {/* Loading State */}
      {!isMapLoaded && (
        <div className="absolute inset-0 bg-secondary-100 rounded-lg flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin w-8 h-8 border-2 border-primary-600 border-t-transparent rounded-full mx-auto mb-2"></div>
            <p className="text-sm text-secondary-600">Loading map...</p>
          </div>
        </div>
      )}
    </div>
  )
}

export default Map
