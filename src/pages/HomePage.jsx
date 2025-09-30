import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { MapPin, Search, ArrowRight, ArrowLeft, Clock, Users, Route } from 'lucide-react'
import { Button, Input, Card } from '../components/ui'
import { useLanguage } from '../contexts/LanguageContext'
import { fetchStops, searchRoutes } from '../lib/supabase'

const HomePage = () => {
  const [fromLocation, setFromLocation] = useState('')
  const [toLocation, setToLocation] = useState('')
  const [fromSuggestions, setFromSuggestions] = useState([])
  const [toSuggestions, setToSuggestions] = useState([])
  const [showFromSuggestions, setShowFromSuggestions] = useState(false)
  const [showToSuggestions, setShowToSuggestions] = useState(false)
  const [isSearching, setIsSearching] = useState(false)
  const [stops, setStops] = useState([])
  const [recentSearches, setRecentSearches] = useState([])
  
  const navigate = useNavigate()
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

    // Navigate to search results
    navigate('/search', { 
      state: { 
        fromStopId: fromStop.id, 
        toStopId: toStop.id,
        fromLocation,
        toLocation
      } 
    })
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

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800" />
        <div className="absolute inset-0 bg-black/20" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center text-white"
          >
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Navigate Dhaka
              <br />
              <span className="text-primary-200">with Confidence</span>
            </h1>
            <p className="text-xl md:text-2xl text-primary-100 mb-12 max-w-3xl mx-auto">
              Find the best bus routes, check fares, and plan your journey across Dhaka city
            </p>
          </motion.div>

          {/* Search Form */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="max-w-4xl mx-auto"
          >
            <Card className="p-6 md:p-8 bg-white/95 backdrop-blur-sm">
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                  {/* From Location */}
                  <div className="relative">
                    <Input
                      label={t('from_label')}
                      placeholder={t('from_placeholder')}
                      value={fromLocation}
                      onChange={(e) => handleLocationChange(e.target.value, 'from')}
                      icon={<MapPin className="w-4 h-4 text-secondary-400" />}
                      onFocus={() => setShowFromSuggestions(true)}
                    />
                    {showFromSuggestions && fromSuggestions.length > 0 && (
                      <div className="absolute z-10 w-full mt-1 bg-white border border-secondary-200 rounded-md shadow-lg max-h-60 overflow-y-auto">
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
                  <div className="flex justify-center">
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
                  <div className="relative">
                    <Input
                      label={t('to_label')}
                      placeholder={t('to_placeholder')}
                      value={toLocation}
                      onChange={(e) => handleLocationChange(e.target.value, 'to')}
                      icon={<MapPin className="w-4 h-4 text-secondary-400" />}
                      onFocus={() => setShowToSuggestions(true)}
                    />
                    {showToSuggestions && toSuggestions.length > 0 && (
                      <div className="absolute z-10 w-full mt-1 bg-white border border-secondary-200 rounded-md shadow-lg max-h-60 overflow-y-auto">
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
          </motion.div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-secondary-900 mb-4">
              Why Choose Dhaka Bus Navigator?
            </h2>
            <p className="text-lg text-secondary-600 max-w-2xl mx-auto">
              Your trusted companion for navigating Dhaka's public transportation system
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: <Route className="w-8 h-8 text-primary-600" />,
                title: "Smart Route Planning",
                description: "Find the best routes with minimal transfers and optimal timing"
              },
              {
                icon: <Clock className="w-8 h-8 text-primary-600" />,
                title: "Real-time Information",
                description: "Get accurate fare estimates and journey times"
              },
              {
                icon: <Users className="w-8 h-8 text-primary-600" />,
                title: "Community Driven",
                description: "Updated by locals, for locals - always current information"
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-secondary-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-secondary-600">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Searches */}
      {recentSearches.length > 0 && (
        <div className="py-16 bg-secondary-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h3 className="text-2xl font-bold text-secondary-900 mb-8">
                Recent Searches
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {recentSearches.slice(0, 2).map((search, index) => (
                  <Card
                    key={index}
                    hover
                    className="p-4 cursor-pointer"
                    onClick={() => handleRecentSearch(search)}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-primary-600 rounded-full"></div>
                      <div className="flex-1">
                        <div className="font-medium text-secondary-900">
                          {search.from} → {search.to}
                        </div>
                        <div className="text-sm text-secondary-500">
                          {new Date(search.timestamp).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </div>
  )
}

export default HomePage
