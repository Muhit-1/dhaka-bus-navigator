import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  ArrowLeft, 
  MapPin, 
  Clock, 
  Bus, 
  Star,
  Navigation,
  RefreshCw,
  AlertCircle,
  Phone,
  Wifi,
  Coffee,
  ShoppingBag,
  Banknote
} from 'lucide-react'
import { Button, Card, Badge, LoadingSkeleton } from '../components/ui'
import Map from '../components/Map'
import { fetchStops, fetchRoutes } from '../lib/supabase'

const StopDetailPage = () => {
  const { stopId } = useParams()
  const navigate = useNavigate()
  
  const [stop, setStop] = useState(null)
  const [routes, setRoutes] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [nextBuses, setNextBuses] = useState([])

  useEffect(() => {
    const loadStopData = async () => {
      setIsLoading(true)
      try {
        const [stopsData, routesData] = await Promise.all([
          fetchStops(),
          fetchRoutes()
        ])
        
        const stopData = stopsData.find(s => s.id === stopId)
        if (!stopData) {
          navigate('/')
          return
        }
        
        setStop(stopData)
        
        // Find routes that pass through this stop
        const passingRoutes = routesData.filter(route => 
          route.stops.includes(stopId)
        )
        setRoutes(passingRoutes)
        
        // Generate next bus times (placeholder)
        const nextBusesData = passingRoutes.map(route => ({
          routeId: route.id,
          routeName: route.name,
          nextTime: `${Math.floor(Math.random() * 20) + 1} min`,
          frequency: route.frequency,
          color: route.color
        }))
        setNextBuses(nextBusesData)
        
      } catch (error) {
        console.error('Error loading stop data:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadStopData()
  }, [stopId, navigate])

  const getNearbyServices = () => {
    // Placeholder data for nearby services
    return [
      { type: 'food', name: 'Café Mocha', distance: '50m', icon: Coffee },
      { type: 'shopping', name: 'City Mall', distance: '200m', icon: ShoppingBag },
      { type: 'bank', name: 'Dutch Bangla Bank ATM', distance: '100m', icon: Banknote },
      { type: 'wifi', name: 'Free WiFi Zone', distance: '0m', icon: Wifi },
      { type: 'phone', name: 'Public Phone', distance: '30m', icon: Phone }
    ]
  }

  const getStopAlerts = () => {
    // Placeholder for real-time alerts
    const alerts = []
    
    if (Math.random() > 0.7) {
      alerts.push({
        type: 'warning',
        message: 'Route 15 delayed by 10 minutes due to traffic',
        route: 'Azimpur → Motijheel'
      })
    }
    
    if (Math.random() > 0.8) {
      alerts.push({
        type: 'info',
        message: 'New route 42 now available from this stop',
        route: 'Dhanmondi → Airport'
      })
    }
    
    return alerts
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
              {[1, 2, 3].map(i => (
                <LoadingSkeleton key={i} height="h-24" width="w-full" />
              ))}
            </div>
            <LoadingSkeleton height="h-96" width="w-full" />
          </div>
        </div>
      </div>
    )
  }

  if (!stop) {
    return (
      <div className="min-h-screen bg-secondary-50 flex items-center justify-center">
        <Card className="p-8 text-center">
          <AlertCircle className="w-12 h-12 text-secondary-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-secondary-900 mb-2">
            Stop not found
          </h3>
          <p className="text-secondary-600 mb-4">
            The requested bus stop could not be found.
          </p>
          <Button onClick={() => navigate('/')}>
            Go Home
          </Button>
        </Card>
      </div>
    )
  }

  const nearbyServices = getNearbyServices()
  const alerts = getStopAlerts()

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
              onClick={() => navigate(-1)}
              className="flex items-center space-x-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </Button>
            
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                className="flex items-center space-x-2"
              >
                <Star className="w-4 h-4" />
                <span>Save Stop</span>
              </Button>
              <Button
                variant="outline"
                className="flex items-center space-x-2"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Refresh</span>
              </Button>
            </div>
          </div>

          <div className="text-center">
            <h1 className="text-3xl font-bold text-secondary-900 mb-2">
              {stop.name}
            </h1>
            <p className="text-lg text-secondary-600 mb-4">
              {stop.nearby_landmarks.join(' • ')}
            </p>
            <div className="flex items-center justify-center space-x-6">
              <div className="flex items-center space-x-2">
                <MapPin className="w-4 h-4 text-secondary-500" />
                <span className="text-sm text-secondary-600">
                  {stop.coordinates.lat.toFixed(4)}, {stop.coordinates.lng.toFixed(4)}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <Bus className="w-4 h-4 text-secondary-500" />
                <span className="text-sm text-secondary-600">
                  {routes.length} route{routes.length !== 1 ? 's' : ''} serve this stop
                </span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Alerts */}
        {alerts.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-8 space-y-2"
          >
            {alerts.map((alert, index) => (
              <Card
                key={index}
                className={`p-4 ${
                  alert.type === 'warning' 
                    ? 'bg-yellow-50 border-yellow-200' 
                    : 'bg-blue-50 border-blue-200'
                }`}
              >
                <div className="flex items-start space-x-3">
                  <AlertCircle className={`w-5 h-5 mt-0.5 ${
                    alert.type === 'warning' ? 'text-yellow-600' : 'text-blue-600'
                  }`} />
                  <div>
                    <p className={`font-medium ${
                      alert.type === 'warning' ? 'text-yellow-800' : 'text-blue-800'
                    }`}>
                      {alert.message}
                    </p>
                    <p className={`text-sm ${
                      alert.type === 'warning' ? 'text-yellow-700' : 'text-blue-700'
                    }`}>
                      {alert.route}
                    </p>
                  </div>
                </div>
              </Card>
            ))}
          </motion.div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Main Content */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-6"
          >
            {/* Next Buses */}
            <Card>
              <Card.Header>
                <Card.Title>Next Buses</Card.Title>
                <Card.Description>
                  Real-time arrival information
                </Card.Description>
              </Card.Header>
              <Card.Content>
                <div className="space-y-3">
                  {nextBuses.map((bus, index) => (
                    <motion.div
                      key={bus.routeId}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center justify-between p-3 bg-secondary-50 rounded-lg"
                    >
                      <div className="flex items-center space-x-3">
                        <div 
                          className="w-4 h-4 rounded-full"
                          style={{ backgroundColor: bus.color }}
                        />
                        <div>
                          <h4 className="font-medium text-secondary-900">
                            {bus.routeName}
                          </h4>
                          <p className="text-sm text-secondary-600">
                            Every {bus.frequency}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-semibold text-primary-600">
                          {bus.nextTime}
                        </div>
                        <div className="text-xs text-secondary-500">
                          Next arrival
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </Card.Content>
            </Card>

            {/* Routes from this Stop */}
            <Card>
              <Card.Header>
                <Card.Title>Routes from this Stop</Card.Title>
                <Card.Description>
                  All bus routes that serve this stop
                </Card.Description>
              </Card.Header>
              <Card.Content>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {routes.map((route) => (
                    <Button
                      key={route.id}
                      variant="outline"
                      className="justify-start h-auto p-3"
                      onClick={() => navigate(`/route/${route.id}`)}
                    >
                      <div className="flex items-center space-x-3 w-full">
                        <div 
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: route.color }}
                        />
                        <div className="text-left flex-1">
                          <div className="font-medium">{route.name}</div>
                          <div className="text-xs text-secondary-500">
                            {route.frequency}
                          </div>
                        </div>
                      </div>
                    </Button>
                  ))}
                </div>
              </Card.Content>
            </Card>

            {/* Nearby Services */}
            <Card>
              <Card.Header>
                <Card.Title>Nearby Services</Card.Title>
                <Card.Description>
                  Amenities and services around this stop
                </Card.Description>
              </Card.Header>
              <Card.Content>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {nearbyServices.map((service, index) => {
                    const Icon = service.icon
                    return (
                      <div
                        key={index}
                        className="flex items-center space-x-3 p-3 bg-secondary-50 rounded-lg"
                      >
                        <Icon className="w-5 h-5 text-secondary-600" />
                        <div className="flex-1">
                          <div className="font-medium text-secondary-900">
                            {service.name}
                          </div>
                          <div className="text-sm text-secondary-600">
                            {service.distance}
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </Card.Content>
            </Card>
          </motion.div>

          {/* Map */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="sticky top-8">
              <h2 className="text-xl font-semibold text-secondary-900 mb-4">
                Stop Location
              </h2>
              <Map
                stops={[stop]}
                routes={routes}
                selectedStopId={stopId}
                height="500px"
              />
              
              {/* Quick Actions */}
              <div className="mt-4 space-y-2">
                <Button
                  size="lg"
                  className="w-full flex items-center justify-center space-x-2"
                >
                  <Navigation className="w-5 h-5" />
                  <span>Get Directions</span>
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full flex items-center justify-center space-x-2"
                >
                  <RefreshCw className="w-5 h-5" />
                  <span>Refresh Times</span>
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default StopDetailPage
