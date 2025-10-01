import { createClient } from '@supabase/supabase-js'

// Configure from Vite env
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database schema types
export const DB_TABLES = {
  ROUTES: 'routes',
  STOPS: 'stops',
  FARES: 'fares',
  USER_FEEDBACK: 'user_feedback',
  FAVORITES: 'favorites'
}

// No placeholder data; rely on real database contents

// API functions
export const fetchRoutes = async () => {
  try {
    const { data, error } = await supabase
      .from(DB_TABLES.ROUTES)
      .select('*')
    
    if (error) throw error
    return Array.isArray(data) ? data : []
  } catch (error) {
    console.error('Failed to fetch routes:', error)
    return []
  }
}

export const fetchStops = async () => {
  try {
    const { data, error } = await supabase
      .from(DB_TABLES.STOPS)
      .select('id, name, lat, lng, nearby_landmarks')
    
    if (error) throw error
    const rows = Array.isArray(data) ? data : []
    return rows
  } catch (error) {
    console.error('Failed to fetch stops:', error)
    return []
  }
}

export const fetchFares = async () => {
  try {
    const { data, error } = await supabase
      .from(DB_TABLES.FARES)
      .select('*')
    
    if (error) throw error
    return Array.isArray(data) ? data : []
  } catch (error) {
    console.error('Failed to fetch fares:', error)
    return []
  }
}

export const submitFeedback = async (feedbackData) => {
  try {
    // Input validation and sanitization
    const sanitizedData = {
      feedback_type: feedbackData.feedback_type?.toString().slice(0, 50) || null,
      stop_id: feedbackData.stop_id?.toString().slice(0, 50) || null,
      route_id: feedbackData.route_id?.toString().slice(0, 50) || null,
      description: feedbackData.description?.toString().slice(0, 1000) || '',
      contact_email: feedbackData.contact_email?.toString().slice(0, 100) || null,
      status: 'pending'
    }
    
    const { data, error } = await supabase
      .from(DB_TABLES.USER_FEEDBACK)
      .insert([sanitizedData])
      .select()
    
    if (error) throw error
    return data
  } catch (error) {
    console.error('Error submitting feedback:', error)
    throw error
  }
}

export const searchRoutes = async (fromStopId, toStopId) => {
  const routes = await fetchRoutes()
  const stops = await fetchStops()
  const fares = await fetchFares()
  const stopMap = new Map(stops.map(s => [String(s.id), s]))
  
  // Simple route finding algorithm
  const results = []
  
  for (const route of routes) {
    const stopIds = (route.stops || []).map(String)
    const fromIndex = stopIds.indexOf(String(fromStopId))
    const toIndex = stopIds.indexOf(String(toStopId))
    if (fromIndex === -1 || toIndex === -1 || fromIndex === toIndex) continue

    // Direct route in either direction
    const [start, end] = fromIndex < toIndex ? [fromIndex, toIndex] : [toIndex, fromIndex]
    let routeStops = stopIds.slice(start, end + 1)
    if (fromIndex > toIndex) {
      routeStops = routeStops.reverse()
    }

    const totalFare = calculateDistanceFare(routeStops, stopMap)
    results.push({
      id: `direct-${route.id}-${fromIndex < toIndex ? 'fw' : 'rev'}`,
      type: 'direct',
      routes: [route],
      stops: routeStops,
      totalFare,
      estimatedTime: calculateEstimatedTime(routeStops.length),
      transfers: 0
    })
  }
  
  // Find transfer routes (simplified)
  for (const route1 of routes) {
    const fromIndex1 = route1.stops.indexOf(fromStopId)
    if (fromIndex1 === -1) continue
    
    for (const route2 of routes) {
      if (route1.id === route2.id) continue
      
      const toIndex2 = route2.stops.indexOf(toStopId)
      if (toIndex2 === -1) continue
      
      // Check for common stops
      for (const stopId of route1.stops) {
        const stopIndex1 = route1.stops.indexOf(stopId)
        const stopIndex2 = route2.stops.indexOf(stopId)
        
        if (stopIndex1 !== -1 && stopIndex2 !== -1 && 
            stopIndex1 > fromIndex1 && stopIndex2 < toIndex2) {
          
          const route1Stops = route1.stops.slice(fromIndex1, stopIndex1 + 1)
          const route2Stops = route2.stops.slice(stopIndex2, toIndex2 + 1)
          
          const fare1 = calculateDistanceFare(route1Stops, stopMap)
          const fare2 = calculateDistanceFare(route2Stops, stopMap)
          
          results.push({
            id: `transfer-${route1.id}-${route2.id}`,
            type: 'transfer',
            routes: [route1, route2],
            stops: [...route1Stops, ...route2Stops.slice(1)],
            totalFare: fare1 + fare2,
            estimatedTime: calculateEstimatedTime(route1Stops.length + route2Stops.length - 1),
            transfers: 1,
            transferStop: stopId
          })
        }
      }
    }
  }
  
  return results.sort((a, b) => {
    // Sort by transfers first, then by fare
    if (a.transfers !== b.transfers) {
      return a.transfers - b.transfers
    }
    return a.totalFare - b.totalFare
  })
}

// Distance-based fare calculation for Dhaka:
// - 2.42 tk per km
// - Minimum fare 10 tk
// - Round to nearest multiple of 5 (21.22 -> 20, 23 -> 25)
// Robustness:
// - Ignore segments with invalid or extreme coordinates
// - Collapse consecutive duplicate stops
// - Drop outlier segments (likely bad data) using median-based gate
// - Fallback to endpoint straight-line distance if segment sum is zero
const calculateDistanceFare = (orderedStopIds, stopMap) => {
  const ratePerKm = 2.42
  const minFare = 10

  if (!Array.isArray(orderedStopIds) || orderedStopIds.length < 2) {
    return minFare
  }

  // Collapse consecutive duplicate IDs
  const dedupIds = []
  for (let i = 0; i < orderedStopIds.length; i++) {
    const id = String(orderedStopIds[i])
    if (i === 0 || id !== String(orderedStopIds[i - 1])) {
      dedupIds.push(id)
    }
  }

  // Build segment distances
  const segmentKms = []
  for (let i = 0; i < dedupIds.length - 1; i++) {
    const a = stopMap.get(dedupIds[i])
    const b = stopMap.get(dedupIds[i + 1])
    if (!isValidCoordStop(a) || !isValidCoordStop(b)) continue
    const km = haversineKm(a.lat, a.lng, b.lat, b.lng)
    // Absolute cap for a city segment (ignore clearly bad data)
    if (km > 15) continue
    segmentKms.push(km)
  }

  // Median-based outlier filtering (drop segments > 3x median)
  let filtered = segmentKms
  if (segmentKms.length >= 3) {
    const med = median(segmentKms)
    const gate = med * 3
    filtered = segmentKms.filter(km => km <= Math.max(gate, 1))
  }

  let totalKm = filtered.reduce((s, km) => s + km, 0)

  // Fallback: use endpoint straight-line distance if segments sum to 0
  if (totalKm === 0) {
    const first = stopMap.get(dedupIds[0])
    const last = stopMap.get(dedupIds[dedupIds.length - 1])
    if (isValidCoordStop(first) && isValidCoordStop(last)) {
      totalKm = haversineKm(first.lat, first.lng, last.lat, last.lng)
    }
  }

  let rawFare = totalKm * ratePerKm
  if (rawFare < minFare) rawFare = minFare
  const rounded = Math.round(rawFare / 5) * 5
  return rounded
}

function isValidCoordStop(s) {
  return s && typeof s.lat === 'number' && typeof s.lng === 'number' &&
    s.lat >= -90 && s.lat <= 90 && s.lng >= -180 && s.lng <= 180
}

function median(arr) {
  const a = [...arr].sort((x, y) => x - y)
  const mid = Math.floor(a.length / 2)
  return a.length % 2 ? a[mid] : (a[mid - 1] + a[mid]) / 2
}

function haversineKm(lat1, lon1, lat2, lon2) {
  const R = 6371 // km
  const toRad = (d) => d * Math.PI / 180
  const dLat = toRad(lat2 - lat1)
  const dLon = toRad(lon2 - lon1)
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

const calculateEstimatedTime = (stopCount) => {
  // Rough estimate: 3 minutes per stop + 5 minutes base
  return stopCount * 3 + 5
}
