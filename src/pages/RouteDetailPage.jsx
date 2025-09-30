import React, { useState, useEffect } from 'react'
import { useParams, useLocation, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  ArrowLeft, 
  Clock, 
  MapPin, 
  Bus, 
  ArrowRight, 
  Star,
  Share2,
  Download,
  AlertCircle,
  Navigation,
  RefreshCw
} from 'lucide-react'
import { Button, Card, Badge, LoadingSkeleton } from '../components/ui'
import Map from '../components/Map'
import { fetchStops } from '../lib/supabase'

const RouteDetailPage = () => {
  const { routeId } = useParams()
  const location = useLocation()
  const navigate = useNavigate()
  const { route, fromLocation, toLocation, fromStopId, toStopId } = location.state || {}
  
  const [stops, setStops] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedStopId, setSelectedStopId] = useState(null)
  const [showMap, setShowMap] = useState(true)

  useEffect(() => {
    if (!route) {
      navigate('/')
      return
    }

    const loadStops = async () => {
      setIsLoading(true)
      try {
        const stopsData = await fetchStops()
        setStops(stopsData)
      } catch (error) {
        console.error('Error loading stops:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadStops()
  }, [route, navigate])

  const getStopDetails = (stopId) => {
    return stops.find(s => s.id === stopId)
  }

  const getStopName = (stopId) => {
    const stop = getStopDetails(stopId)
    return stop ? stop.name : 'Unknown Stop'
  }

  const handleStopClick = (stopId) => {
    setSelectedStopId(stopId)
    navigate(`/stop/${stopId}`)
  }

  const calculateSegmentFare = (startStopId, endStopId, routeId) => {
    // This would normally fetch from the fares table
    // For now, return a placeholder calculation
    const startIndex = route.stops.indexOf(startStopId)
    const endIndex = route.stops.indexOf(endStopId)
    const stopCount = Math.abs(endIndex - startIndex)
    return stopCount * 5 // 5 BDT per stop as placeholder
  }

  const getNextBusTime = () => {
    // Placeholder for real-time data
    const times = ['5 min', '12 min', '18 min', '25 min']
    return times[Math.floor(Math.random() * times.length)]
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-secondary-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <LoadingSkeleton height="h-8" width="w-64" className="mb-4" />
            <LoadingSkeleton height="h-4" width="w-96" />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map(i => (
                <LoadingSkeleton key={i} height="h-16" width="w-full" />
              ))}
            </div>
            <LoadingSkeleton height="h-96" width="w-full" />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-secondary-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-6">
            <Button
              variant="ghost"
              onClick={() => navigate('/search')}
              className="flex items-center space-x-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Results</span>
            </Button>
            
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                onClick={() => setShowMap(!showMap)}
                className="flex items-center space-x-2"
              >
                <MapPin className="w-4 h-4" />
                <span>{showMap ? 'Hide' : 'Show'} Map</span>
              </Button>
              <Button
                variant="outline"
                className="flex items-center space-x-2"
              >
                <Share2 className="w-4 h-4" />
                <span>Share</span>
              </Button>
            </div>
          </div>

          <div className="text-center">
            <h1 className="text-3xl font-bold text-secondary-900 mb-2">
              {route.routes.map(r => r.name).join(' → ')}
            </h1>
            <p className="text-lg text-secondary-600">
              {fromLocation} → {toLocation}
            </p>
            <div className="flex items-center justify-center space-x-6 mt-4">
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4 text-secondary-500" />
                <span className="text-sm text-secondary-600">
                  {route.estimatedTime} minutes
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="w-4 h-4 text-secondary-500" />
                <span className="text-sm text-secondary-600">
                  {route.stops.length} stops
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <Bus className="w-4 h-4 text-secondary-500" />
                <span className="text-sm text-secondary-600">
                  ৳{route.totalFare} total fare
                </span>
              </div>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Stops List */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="space-y-4"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-secondary-900">
                Route Stops
              </h2>
              <Badge variant="primary">
                {route.transfers === 0 ? 'Direct Route' : `${route.transfers} Transfer${route.transfers > 1 ? 's' : ''}`}
              </Badge>
            </div>

            <div className="space-y-2">
              {route.stops.map((stopId, index) => {
                const stop = getStopDetails(stopId)
                const isStart = index === 0
                const isEnd = index === route.stops.length - 1
                const isTransfer = route.transferStop === stopId && route.transfers > 0
                
                return (
                  <motion.div
                    key={stopId}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card
                      hover
                      className={`p-4 cursor-pointer transition-all ${
                        selectedStopId === stopId ? 'ring-2 ring-primary-500' : ''
                      }`}
                      onClick={() => handleStopClick(stopId)}
                    >
                      <div className="flex items-start space-x-4">
                        {/* Stop Indicator */}
                        <div className="flex flex-col items-center">
                          <div className={`w-4 h-4 rounded-full border-2 ${
                            isStart || isEnd 
                              ? 'bg-primary-600 border-primary-600' 
                              : isTransfer
                              ? 'bg-yellow-500 border-yellow-500'
                              : 'bg-secondary-300 border-secondary-300'
                          }`} />
                          {index < route.stops.length - 1 && (
                            <div className="w-0.5 h-8 bg-secondary-200 mt-1" />
                          )}
                        </div>

                        {/* Stop Details */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <h3 className="font-semibold text-secondary-900 truncate">
                              {stop ? stop.name : 'Unknown Stop'}
                            </h3>
                            <div className="flex items-center space-x-2">
                              {isStart && <Badge variant="success">Start</Badge>}
                              {isEnd && <Badge variant="danger">End</Badge>}
                              {isTransfer && <Badge variant="warning">Transfer</Badge>}
                            </div>
                          </div>
                          
                          {stop && (
                            <p className="text-sm text-secondary-600 mb-2">
                              {stop.nearby_landmarks.join(', ')}
                            </p>
                          )}

                          <div className="flex items-center justify-between text-sm">
                            <div className="flex items-center space-x-4">
                              <div className="flex items-center space-x-1">
                                <Clock className="w-3 h-3 text-secondary-500" />
                                <span className="text-secondary-600">
                                  Next: {getNextBusTime()}
                                </span>
                              </div>
                              {index < route.stops.length - 1 && (
                                <div className="flex items-center space-x-1">
                                  <Bus className="w-3 h-3 text-secondary-500" />
                                  <span className="text-secondary-600">
                                    ৳{calculateSegmentFare(stopId, route.stops[index + 1], route.routes[0].id)}
                                  </span>
                                </div>
                              )}
                            </div>
                            
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-primary-600 hover:text-primary-700"
                            >
                              <Star className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                )
              })}
            </div>

            {/* Route Summary */}
            <Card className="p-4 bg-primary-50 border-primary-200">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-primary-900">Route Summary</h3>
                  <p className="text-sm text-primary-700">
                    {route.routes.length} bus{route.routes.length > 1 ? 'es' : ''} • {route.transfers} transfer{route.transfers !== 1 ? 's' : ''}
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-primary-900">
                    ৳{route.totalFare}
                  </div>
                  <div className="text-sm text-primary-700">
                    Total fare
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Map */}
          {showMap && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="sticky top-8">
                <h2 className="text-xl font-semibold text-secondary-900 mb-4">
                  Route Map
                </h2>
                <Map
                  stops={route.stops.map(stopId => getStopDetails(stopId)).filter(Boolean)}
                  routes={route.routes}
                  selectedStopId={selectedStopId}
                  onStopClick={handleStopClick}
                  height="500px"
                />
              </div>
            </motion.div>
          )}
        </div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-8 flex flex-wrap items-center justify-center gap-4"
        >
          <Button
            size="lg"
            className="flex items-center space-x-2"
          >
            <Navigation className="w-5 h-5" />
            <span>Start Navigation</span>
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="flex items-center space-x-2"
          >
            <RefreshCw className="w-5 h-5" />
            <span>Refresh Times</span>
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="flex items-center space-x-2"
          >
            <Download className="w-5 h-5" />
            <span>Download Route</span>
          </Button>
        </motion.div>
      </div>
    </div>
  )
}

export default RouteDetailPage
