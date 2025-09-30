import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { MapPin, Search, ArrowRight, ArrowLeft, Clock, Users, Route } from 'lucide-react'
import { Button, Input, Card, Modal } from '../ui'
import { useLanguage } from '../../contexts/LanguageContext'
import { fetchStops, searchRoutes } from '../../lib/supabase'
import GoogleMap from '../GoogleMap'

const HeroSection = () => {
  const [fromLocation, setFromLocation] = useState('')
  const [toLocation, setToLocation] = useState('')
  const [fromSuggestions, setFromSuggestions] = useState([])
  const [toSuggestions, setToSuggestions] = useState([])
  const [showFromSuggestions, setShowFromSuggestions] = useState(false)
  const [showToSuggestions, setShowToSuggestions] = useState(false)
  const [isSearching, setIsSearching] = useState(false)
  const [stops, setStops] = useState([])
  const [recentSearches, setRecentSearches] = useState([])
  const [searchResults, setSearchResults] = useState([])
  const [showResults, setShowResults] = useState(false)
  const [showMoreModal, setShowMoreModal] = useState(false)
  const [selectedRoute, setSelectedRoute] = useState(null)
  
  const { t } = useLanguage()

  useEffect(() => {
    const loadStops = async () => {
      const stopsData = await fetchStops()
      setStops(stopsData)
    }
    loadStops()

    // Load recent searches from localStorage
    const saved = localStorage.getItem('recentSearches')
    if (saved) {
      setRecentSearches(JSON.parse(saved))
    }
  }, [])

  const handleLocationChange = (value, type) => {
    if (type === 'from') {
      setFromLocation(value)
      if (value.length > 0) {
        const filtered = stops.filter(stop =>
          stop.name.toLowerCase().includes(value.toLowerCase()) ||
          stop.nearby_landmarks.some(landmark =>
            landmark.toLowerCase().includes(value.toLowerCase())
          )
        ).slice(0, 5)
        setFromSuggestions(filtered)
        setShowFromSuggestions(true)
      } else {
        setShowFromSuggestions(false)
      }
    } else {
      setToLocation(value)
      if (value.length > 0) {
        const filtered = stops.filter(stop =>
          stop.name.toLowerCase().includes(value.toLowerCase()) ||
          stop.nearby_landmarks.some(landmark =>
            landmark.toLowerCase().includes(value.toLowerCase())
          )
        ).slice(0, 5)
        setToSuggestions(filtered)
        setShowToSuggestions(true)
      } else {
        setShowToSuggestions(false)
      }
    }
  }

  const handleSuggestionClick = (stop, type) => {
    if (type === 'from') {
      setFromLocation(stop.name)
      setShowFromSuggestions(false)
    } else {
      setToLocation(stop.name)
      setShowToSuggestions(false)
    }
  }

  const handleSearch = async () => {
    if (!fromLocation || !toLocation) return

    setIsSearching(true)

    // Find stop IDs
    const fromStop = stops.find(stop => stop.name === fromLocation)
    const toStop = stops.find(stop => stop.name === toLocation)

    if (!fromStop || !toStop) {
      alert('Please select valid locations from the suggestions')
      setIsSearching(false)
      return
    }

    try {
      const results = await searchRoutes(fromStop.id, toStop.id)
      setSearchResults(results)
      setShowResults(true)
      
      // Save to recent searches
      const newSearch = {
        from: fromLocation,
        to: toLocation,
        fromStopId: fromStop.id,
        toStopId: toStop.id,
        timestamp: Date.now()
      }
      
      const updatedRecent = [newSearch, ...recentSearches.slice(0, 4)]
      setRecentSearches(updatedRecent)
      localStorage.setItem('recentSearches', JSON.stringify(updatedRecent))
    } catch (error) {
      console.error('Search error:', error)
    } finally {
      setIsSearching(false)
    }
  }

  const handleRecentSearch = (search) => {
    setFromLocation(search.from)
    setToLocation(search.to)
  }

  const swapLocations = () => {
    const temp = fromLocation
    setFromLocation(toLocation)
    setToLocation(temp)
  }

  const getStopName = (stopId) => {
    const stop = stops.find(s => s.id === stopId)
    return stop ? stop.name : 'Unknown Stop'
  }

  return (
    <div className="relative">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 dark:from-primary-800 dark:via-primary-900 dark:to-primary-950" />
        <div className="absolute inset-0 bg-black/20 dark:bg-black/30" />
        
        {/* Dhaka City Map Watermark */}
        <div className="absolute inset-0 opacity-5">
          <div className="w-full h-full bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgZmlsbD0iIzAwMCIvPgogIDxwYXRoIGQ9Ik0yMCAyMEw4MCAyMEw4MCA4MEwyMCA4MFoiIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzMzMyIgc3Ryb2tlLXdpZHRoPSIyIi8+CiAgPGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMyIgZmlsbD0iIzMzMyIvPgogIDxjaXJjbGUgY3g9IjcwIiBjeT0iNzAiIHI9IjMiIGZpbGw9IiMzMzMiLz4KICA8Y2lyY2xlIGN4PSI1MCIgY3k9IjUwIiByPSIyIiBmaWxsPSIjMzMzIi8+Cjwvc3ZnPg==')] bg-repeat bg-center"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center text-white mb-8"
          >
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-white">
              {t('hero_title_line1')}
              <br />
              <span className="text-primary-200">{t('hero_title_line2')}</span>
            </h1>
            <p className="text-lg md:text-xl text-primary-100 mb-6 max-w-2xl mx-auto">
              {t('hero_subtitle')}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            {/* Search Form */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative z-10"
            >
              <Card className="p-6 md:p-8 bg-white/95 dark:bg-white/95 backdrop-blur-sm relative z-10">
                <div className="space-y-4">
                  <div className="flex items-end justify-center gap-4">
                    {/* From Location */}
                    <div className="relative" style={{ width: '230px' }}>
                      <Input
                        label={t('from_label')}
                        placeholder={t('from_placeholder')}
                        value={fromLocation}
                        onChange={(e) => handleLocationChange(e.target.value, 'from')}
                        icon={<MapPin className="w-4 h-4 text-secondary-400" />}
                        onFocus={() => setShowFromSuggestions(true)}
                      />
                      {showFromSuggestions && fromSuggestions.length > 0 && (
                        <div className="absolute z-[99999] w-full mt-1 bg-white border border-secondary-200 rounded-md shadow-lg max-h-60 overflow-y-auto">
                          {fromSuggestions.map((stop) => (
                            <button
                              key={stop.id}
                              onClick={() => handleSuggestionClick(stop, 'from')}
                              className="w-full text-left px-4 py-3 hover:bg-secondary-50 border-b border-secondary-100 last:border-b-0"
                            >
                              <div className="font-medium text-secondary-900">{stop.name}</div>
                              <div className="text-sm text-secondary-500">
                                {stop.nearby_landmarks.join(', ')}
                              </div>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Swap Button */}
                    <div className="flex justify-center items-center">
                      <button
                        onClick={swapLocations}
                        className="p-2 rounded-full bg-secondary-100 hover:bg-secondary-200 transition-colors"
                        aria-label="Swap locations"
                      >
                        <div className="flex flex-col items-center leading-none">
                          <ArrowRight className="w-5 h-5 text-secondary-600" />
                          <ArrowLeft className="w-5 h-5 text-secondary-600 -mt-1" />
                        </div>
                      </button>
                    </div>

                    {/* To Location */}
                    <div className="relative" style={{ width: '230px' }}>
                      <Input
                        label={t('to_label')}
                        placeholder={t('to_placeholder')}
                        value={toLocation}
                        onChange={(e) => handleLocationChange(e.target.value, 'to')}
                        icon={<MapPin className="w-4 h-4 text-secondary-400" />}
                        onFocus={() => setShowToSuggestions(true)}
                      />
                      {showToSuggestions && toSuggestions.length > 0 && (
                        <div className="absolute z-[99999] w-full mt-1 bg-white border border-secondary-200 rounded-md shadow-lg max-h-60 overflow-y-auto">
                          {toSuggestions.map((stop) => (
                            <button
                              key={stop.id}
                              onClick={() => handleSuggestionClick(stop, 'to')}
                              className="w-full text-left px-4 py-3 hover:bg-secondary-50 border-b border-secondary-100 last:border-b-0"
                            >
                              <div className="font-medium text-secondary-900">{stop.name}</div>
                              <div className="text-sm text-secondary-500">
                                {stop.nearby_landmarks.join(', ')}
                              </div>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  <Button
                    onClick={handleSearch}
                    loading={isSearching}
                    disabled={!fromLocation || !toLocation}
                    size="lg"
                    className="w-full md:w-auto"
                  >
                    <Search className="w-5 h-5 mr-2" />
                    {t('find_routes')}
                  </Button>
                </div>
              </Card>

              {/* Search Results */}
              {showResults && searchResults.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-6 space-y-3 relative z-0"
                >
                  <h3 className="text-lg font-semibold text-white mb-4">Route Options</h3>
                  {searchResults.slice(0, 3).map((route, index) => (
                    <Card 
                      key={route.id} 
                      className={`p-4 bg-white/95 dark:bg-white/95 backdrop-blur-sm cursor-pointer transition-all duration-200 ${
                        selectedRoute?.id === route.id 
                          ? 'ring-2 ring-primary-500 shadow-lg' 
                          : 'hover:shadow-md'
                      }`}
                      onClick={() => setSelectedRoute(route)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h4 className="font-semibold text-secondary-900">
                            {route.routes.map(r => r.name).join(' → ')}
                          </h4>
                          <div className="flex items-center space-x-4 text-sm text-secondary-600 mt-1">
                            <span>{route.estimatedTime} min</span>
                            <span>{route.transfers} transfer{route.transfers !== 1 ? 's' : ''}</span>
                            <span>{route.stops.length} stops</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-xl font-bold text-primary-600">
                            ৳{route.totalFare}
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}

                  {searchResults.length > 3 && (
                    <div className="mt-2">
                      <Button onClick={() => setShowMoreModal(true)} className="bg-primary-600 hover:bg-primary-700 text-white">
                        View more bus routes
                      </Button>
                    </div>
                  )}
                </motion.div>
              )}

              {/* More Routes Modal */}
              <Modal
                isOpen={showMoreModal}
                onClose={() => setShowMoreModal(false)}
                title="More Route Options"
              >
                <div className="space-y-3 max-h-[70vh] overflow-y-auto pr-1">
                  {searchResults.slice(3).map((route) => (
                    <Card 
                      key={route.id} 
                      className={`p-4 cursor-pointer transition-all duration-200 ${
                        selectedRoute?.id === route.id 
                          ? 'ring-2 ring-primary-500 shadow-lg' 
                          : 'hover:shadow-md'
                      }`}
                      onClick={() => {
                        setSelectedRoute(route)
                        setShowMoreModal(false)
                      }}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-secondary-900 truncate">
                            {route.routes.map(r => r.name).join(' → ')}
                          </h4>
                          <div className="flex items-center space-x-4 text-sm text-secondary-600 mt-1">
                            <span>{route.estimatedTime} min</span>
                            <span>{route.transfers} transfer{route.transfers !== 1 ? 's' : ''}</span>
                            <span>{route.stops.length} stops</span>
                          </div>
                        </div>
                        <div className="text-right flex-shrink-0 ml-3">
                          <div className="text-lg font-bold text-primary-600">
                            ৳{route.totalFare}
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </Modal>

              {/* Recent Searches */}
              {recentSearches.length > 0 && !showResults && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-6 relative z-0"
                >
                  <h3 className="text-lg font-semibold text-white mb-4">Recent Searches</h3>
                  <div className="grid grid-cols-1 gap-3">
                    {recentSearches.slice(0, 2).map((search, index) => (
                      <Card
                        key={index}
                        className="p-4 bg-white/95 dark:bg-white/95 backdrop-blur-sm cursor-pointer hover:bg-white dark:hover:bg-white hover:shadow-lg transition-all duration-200 border border-white/20"
                        onClick={() => handleRecentSearch(search)}
                      >
                        <div className="flex items-center space-x-3">
                          <div className="w-3 h-3 bg-primary-600 rounded-full flex-shrink-0"></div>
                          <div className="flex-1 min-w-0">
                            <div className="font-medium text-secondary-900 truncate">
                              {search.from} → {search.to}
                            </div>
                            <div className="text-sm text-secondary-500">
                              {new Date(search.timestamp).toLocaleDateString()}
                            </div>
                          </div>
                          <Clock className="w-4 h-4 text-secondary-400 flex-shrink-0" />
                        </div>
                      </Card>
                    ))}
                  </div>
                </motion.div>
              )}
            </motion.div>

            {/* Google Map */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="h-96 lg:h-[500px] relative z-0"
            >
              <GoogleMap 
                stops={stops}
                searchResults={selectedRoute ? [selectedRoute] : searchResults}
                fromLocation={fromLocation}
                toLocation={toLocation}
                onlyEndpoints={true}
              />
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HeroSection
