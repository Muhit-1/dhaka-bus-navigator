import React, { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { MapPin, Navigation, ZoomIn, ZoomOut } from 'lucide-react'
import { Button } from './ui'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

const GoogleMap = ({ 
  stops = [], 
  searchResults = [],
  fromLocation = '',
  toLocation = '',
  className = '',
  height = '400px',
  onlyEndpoints = false
}) => {
  const mapRef = useRef(null)
  const [isMapLoaded, setIsMapLoaded] = useState(false)
  const [mapError, setMapError] = useState('')
  const [userLocation, setUserLocation] = useState(null)
  const mapInstanceRef = useRef(null)
  const markersRef = useRef([])
  const polylinesRef = useRef([])

  useEffect(() => {
    let isCancelled = false

    async function init() {
      if (!mapRef.current || mapInstanceRef.current) return

      try {
        const map = L.map(mapRef.current, {
          center: [23.8103, 90.4125],
          zoom: 12,
          zoomControl: false,
          attributionControl: true
        })

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          maxZoom: 19,
          attribution: '&copy; OpenStreetMap contributors'
        }).addTo(map)

        if (isCancelled) return
        mapInstanceRef.current = map
        setIsMapLoaded(true)
        setMapError('')

        renderMarkers(map)
        fitMapToData(map)
      } catch (e) {
        console.error('Leaflet map failed to initialize:', e)
        setMapError('Map failed to load. Please check network connectivity and try again.')
      }
    }

    init()

    return () => {
      isCancelled = true
      markersRef.current.forEach(m => m.remove && m.remove())
      markersRef.current = []
      polylinesRef.current.forEach(p => p.remove && p.remove())
      polylinesRef.current = []
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove()
        mapInstanceRef.current = null
      }
    }
  }, [])

  useEffect(() => {
    if (!mapInstanceRef.current) return
    renderMarkers(mapInstanceRef.current)
    fitMapToData(mapInstanceRef.current)
    renderPolylines(mapInstanceRef.current)
  }, [stops, searchResults, fromLocation, toLocation])

  function renderMarkers(map) {
    try {
      markersRef.current.forEach(m => m.remove && m.remove())
      markersRef.current = []

      // Show markers based on fromLocation and toLocation
      if (fromLocation && toLocation) {
        // Find the stops by name
        const fromStop = stops.find(s => s.name === fromLocation)
        const toStop = stops.find(s => s.name === toLocation)
        
        // Render start marker (green)
        if (fromStop && typeof fromStop.lat === 'number' && typeof fromStop.lng === 'number') {
          const startMarker = L.circleMarker([fromStop.lat, fromStop.lng], {
            radius: 8,
            color: '#16a34a',
            weight: 3,
            fillColor: '#86efac',
            fillOpacity: 0.9,
            title: fromStop.name
          }).addTo(map)
          
          startMarker.bindPopup(`<div class="text-center"><strong>${fromStop.name}</strong><br/>Start Location</div>`)
          markersRef.current.push(startMarker)
        }
        
        // Render end marker (red)
        if (toStop && typeof toStop.lat === 'number' && typeof toStop.lng === 'number') {
          const endMarker = L.circleMarker([toStop.lat, toStop.lng], {
            radius: 8,
            color: '#dc2626',
            weight: 3,
            fillColor: '#fca5a5',
            fillOpacity: 0.9,
            title: toStop.name
          }).addTo(map)
          
          endMarker.bindPopup(`<div class="text-center"><strong>${toStop.name}</strong><br/>Destination</div>`)
          markersRef.current.push(endMarker)
        }
        
        // Render transfer markers (blue) if we have a selected route with transfers
        if (searchResults.length > 0) {
          const selectedRoute = searchResults[0]
          if (selectedRoute.transfers > 0 && selectedRoute.transferStop) {
            const transferStop = stops.find(s => s.id === selectedRoute.transferStop)
            if (transferStop && typeof transferStop.lat === 'number' && typeof transferStop.lng === 'number') {
              const transferMarker = L.circleMarker([transferStop.lat, transferStop.lng], {
                radius: 8,
                color: '#2563eb',
                weight: 3,
                fillColor: '#93c5fd',
                fillOpacity: 0.9,
                title: transferStop.name
              }).addTo(map)
              
              transferMarker.bindPopup(`<div class="text-center"><strong>${transferStop.name}</strong><br/>Transfer Point</div>`)
              markersRef.current.push(transferMarker)
            }
          }
        }
      }
    } catch (e) {
      console.error('Error rendering markers:', e)
      setMapError('Failed to render map markers.')
    }
  }

  function fitMapToData(map) {
    try {
      const latLngs = []
      
      // Fit to fromLocation and toLocation markers
      if (fromLocation && toLocation) {
        const fromStop = stops.find(s => s.name === fromLocation)
        const toStop = stops.find(s => s.name === toLocation)
        
        if (fromStop && typeof fromStop.lat === 'number' && typeof fromStop.lng === 'number') {
          latLngs.push([fromStop.lat, fromStop.lng])
        }
        if (toStop && typeof toStop.lat === 'number' && typeof toStop.lng === 'number') {
          latLngs.push([toStop.lat, toStop.lng])
        }
      }

      if (latLngs.length > 0) {
        const bounds = L.latLngBounds(latLngs)
        map.fitBounds(bounds, { padding: [20, 20] })
      }
    } catch (e) {
      console.error('Error fitting map to data:', e)
    }
  }

  function extractRouteSegments() {
    const segments = []
    const srList = Array.isArray(searchResults) ? searchResults : []
    
    for (const r of srList) {
      if (!r) continue
      
      // Try to get coordinates from different possible sources
      let coords = []
      
      if (Array.isArray(r.path) && r.path.every(p => typeof p?.lat === 'number' && typeof p?.lng === 'number')) {
        coords = r.path.map(p => [p.lat, p.lng])
      } else if (Array.isArray(r.coordinates) && r.coordinates.every(p => Array.isArray(p) && p.length === 2)) {
        coords = r.coordinates
      } else if (Array.isArray(r.stops)) {
        // Convert stop IDs to coordinates
        const stopCoords = r.stops.map(stopId => {
          const stop = stops.find(s => s.id === stopId)
          return stop && typeof stop.lat === 'number' && typeof stop.lng === 'number' 
            ? [stop.lat, stop.lng] 
            : null
        }).filter(Boolean)
        
        if (stopCoords.length > 0) {
          coords = stopCoords
        }
      }
      
      if (coords.length > 0) {
        segments.push(coords)
      }
    }
    
    return segments
  }

  function renderPolylines(map) {
    // Don't render any polylines - only show markers
    polylinesRef.current.forEach(p => p.remove && p.remove())
    polylinesRef.current = []
  }

  const centerOnUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const coords = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          }
          setUserLocation(coords)
          if (mapInstanceRef.current) {
            mapInstanceRef.current.setView([coords.lat, coords.lng], 14)
            L.circleMarker([coords.lat, coords.lng], {
              radius: 7,
              color: '#16a34a',
              weight: 2,
              fillColor: '#86efac',
              fillOpacity: 0.95,
              title: 'You are here'
            }).addTo(mapInstanceRef.current)
          }
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
        ref={mapRef}
        className="w-full rounded-lg border border-secondary-200 overflow-hidden relative z-0"
        style={{ height }}
      />
      
      {/* Map Controls */}
      <div className="absolute top-4 right-4 flex flex-col space-y-2 z-10">
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
          onClick={() => mapInstanceRef.current && mapInstanceRef.current.zoomIn()}
          className="w-10 h-10 p-0"
          title="Zoom in"
        >
          <ZoomIn className="w-4 h-4" />
        </Button>
        <Button
          variant="secondary"
          size="sm"
          onClick={() => mapInstanceRef.current && mapInstanceRef.current.zoomOut()}
          className="w-10 h-10 p-0"
          title="Zoom out"
        >
          <ZoomOut className="w-4 h-4" />
        </Button>
      </div>

      {/* Map Legend */}
      <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-lg z-10">
        <div className="text-xs text-secondary-600 space-y-1">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span>Start</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <span>Destination</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            <span>Transfer</span>
          </div>
        </div>
      </div>

      {/* Loading / Empty State */}
      {!isMapLoaded && (
        <div className="absolute inset-0 bg-secondary-100 rounded-lg flex items-center justify-center z-20">
          <div className="text-center">
            {!mapError ? (
              <>
            <div className="animate-spin w-8 h-8 border-2 border-primary-600 border-t-transparent rounded-full mx-auto mb-2"></div>
            <p className="text-sm text-secondary-600">Loading map...</p>
              </>
            ) : (
              <>
                <p className="text-sm text-red-600 max-w-xs">{mapError}</p>
              </>
            )}
          </div>
        </div>
      )}

      {isMapLoaded && (!Array.isArray(stops) || stops.filter(s => typeof s?.lat === 'number' && typeof s?.lng === 'number').length === 0) && !import.meta.env.DEV && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur-sm border border-secondary-200 rounded px-3 py-2 shadow z-10">
          <p className="text-xs text-secondary-700">No coordinates available to display markers.</p>
        </div>
      )}
    </div>
  )
}

export default GoogleMap
