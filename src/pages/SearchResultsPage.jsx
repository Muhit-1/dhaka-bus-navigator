import React, { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  ArrowLeft, 
  Clock, 
  MapPin, 
  Bus, 
  ArrowRight, 
  RefreshCw,
  Filter,
  SortAsc,
  Star,
  AlertCircle
} from 'lucide-react'
import { Button, Card, Badge, LoadingSkeleton } from '../components/ui'
import { searchRoutes, fetchStops } from '../lib/supabase'

const SearchResultsPage = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const { fromStopId, toStopId, fromLocation, toLocation } = location.state || {}
  
  const [routes, setRoutes] = useState([])
  const [stops, setStops] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [sortBy, setSortBy] = useState('fastest') // fastest, cheapest, transfers
  const [filterTransfers, setFilterTransfers] = useState('all') // all, direct, transfer

  useEffect(() => {
    if (!fromStopId || !toStopId) {
      navigate('/')
      return
    }

    const loadResults = async () => {
      setIsLoading(true)
      try {
        const [routesData, stopsData] = await Promise.all([
          searchRoutes(fromStopId, toStopId),
          fetchStops()
        ])
        setRoutes(routesData)
        setStops(stopsData)
      } catch (error) {
        console.error('Error loading search results:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadResults()
  }, [fromStopId, toStopId, navigate])

  const getStopName = (stopId) => {
    const stop = stops.find(s => s.id === stopId)
    return stop ? stop.name : 'Unknown Stop'
  }

  const getStopDetails = (stopId) => {
    return stops.find(s => s.id === stopId)
  }

  const sortedRoutes = routes
    .filter(route => {
      if (filterTransfers === 'direct') return route.transfers === 0
      if (filterTransfers === 'transfer') return route.transfers > 0
      return true
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'fastest':
          return a.estimatedTime - b.estimatedTime
        case 'cheapest':
          return a.totalFare - b.totalFare
        case 'transfers':
          return a.transfers - b.transfers
        default:
          return 0
      }
    })

  const handleRouteSelect = (route) => {
    navigate(`/route/${route.id}`, { 
      state: { 
        route, 
        fromLocation, 
        toLocation,
        fromStopId,
        toStopId
      } 
    })
  }

  const handleRefresh = () => {
    window.location.reload()
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-secondary-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <LoadingSkeleton height="h-8" width="w-64" className="mb-4" />
            <LoadingSkeleton height="h-4" width="w-96" />
          </div>
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <RouteCardSkeleton key={i} />
            ))}
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
              onClick={() => navigate('/')}
              className="flex items-center space-x-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Search</span>
            </Button>
            
            <Button
              variant="outline"
              onClick={handleRefresh}
              className="flex items-center space-x-2"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Refresh</span>
            </Button>
          </div>

          <div className="text-center">
            <h1 className="text-3xl font-bold text-secondary-900 mb-2">
              Route Options
            </h1>
            <p className="text-lg text-secondary-600">
              {fromLocation} → {toLocation}
            </p>
            <p className="text-sm text-secondary-500 mt-1">
              {routes.length} route{routes.length !== 1 ? 's' : ''} found
            </p>
          </div>
        </motion.div>

        {/* Filters and Sorting */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <Card className="p-4">
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center space-x-2">
                <Filter className="w-4 h-4 text-secondary-500" />
                <span className="text-sm font-medium text-secondary-700">Filter:</span>
                <select
                  value={filterTransfers}
                  onChange={(e) => setFilterTransfers(e.target.value)}
                  className="px-3 py-1 border border-secondary-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="all">All Routes</option>
                  <option value="direct">Direct Only</option>
                  <option value="transfer">With Transfers</option>
                </select>
              </div>

              <div className="flex items-center space-x-2">
                <SortAsc className="w-4 h-4 text-secondary-500" />
                <span className="text-sm font-medium text-secondary-700">Sort by:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-3 py-1 border border-secondary-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="fastest">Fastest</option>
                  <option value="cheapest">Cheapest</option>
                  <option value="transfers">Fewest Transfers</option>
                </select>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Results */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-4"
        >
          {sortedRoutes.length === 0 ? (
            <Card className="p-8 text-center">
              <AlertCircle className="w-12 h-12 text-secondary-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-secondary-900 mb-2">
                No routes found
              </h3>
              <p className="text-secondary-600 mb-4">
                We couldn't find any routes between these locations. Try different starting or ending points.
              </p>
              <Button onClick={() => navigate('/')}>
                Search Again
              </Button>
            </Card>
          ) : (
            sortedRoutes.map((route, index) => (
              <motion.div
                key={route.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card
                  hover
                  className="p-6 cursor-pointer"
                  onClick={() => handleRouteSelect(route)}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-semibold text-secondary-900">
                          {route.routes.map(r => r.name).join(' → ')}
                        </h3>
                        {route.transfers === 0 && (
                          <Badge variant="success">Direct</Badge>
                        )}
                        {route.transfers > 0 && (
                          <Badge variant="warning">
                            {route.transfers} Transfer{route.transfers > 1 ? 's' : ''}
                          </Badge>
                        )}
                      </div>
                      
                      <div className="flex items-center space-x-4 text-sm text-secondary-600 mb-3">
                        <div className="flex items-center space-x-1">
                          <Clock className="w-4 h-4" />
                          <span>{route.estimatedTime} min</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <MapPin className="w-4 h-4" />
                          <span>{route.stops.length} stops</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Bus className="w-4 h-4" />
                          <span>{route.routes.length} bus{route.routes.length > 1 ? 'es' : ''}</span>
                        </div>
                      </div>

                      {/* Route Preview */}
                      <div className="flex items-center space-x-2 text-sm">
                        <span className="font-medium text-secondary-900">
                          {getStopName(route.stops[0])}
                        </span>
                        <ArrowRight className="w-4 h-4 text-secondary-400" />
                        {route.transfers > 0 && (
                          <>
                            <span className="text-secondary-500">
                              {getStopName(route.transferStop)}
                            </span>
                            <ArrowRight className="w-4 h-4 text-secondary-400" />
                          </>
                        )}
                        <span className="font-medium text-secondary-900">
                          {getStopName(route.stops[route.stops.length - 1])}
                        </span>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-2xl font-bold text-primary-600">
                        ৳{route.totalFare}
                      </div>
                      <div className="text-sm text-secondary-500">
                        Total fare
                      </div>
                    </div>
                  </div>

                  {/* Route Details */}
                  <div className="border-t border-secondary-200 pt-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        {route.routes.map((r, routeIndex) => (
                          <div key={routeIndex} className="flex items-center space-x-2">
                            <div 
                              className="w-4 h-4 rounded-full"
                              style={{ backgroundColor: r.color }}
                            />
                            <span className="text-sm font-medium text-secondary-700">
                              {r.name}
                            </span>
                            {routeIndex < route.routes.length - 1 && (
                              <ArrowRight className="w-3 h-3 text-secondary-400" />
                            )}
                          </div>
                        ))}
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-primary-600 hover:text-primary-700"
                        >
                          <Star className="w-4 h-4 mr-1" />
                          Save
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                        >
                          View Details
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))
          )}
        </motion.div>
      </div>
    </div>
  )
}

export default SearchResultsPage
