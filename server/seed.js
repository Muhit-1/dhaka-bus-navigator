// Builds the local MySQL database from the raw data files at the repo root
// (stops.txt, routes.txt) and geocodes each stop via OpenStreetMap Nominatim,
// caching results so re-running this doesn't re-hit the network.
//
// Usage: node --env-file=server/.env server/seed.js
import { readFile, writeFile, mkdir } from 'node:fs/promises'
import path from 'node:path'
import mysql from 'mysql2/promise'

const ROOT = path.resolve(import.meta.dirname, '..')
const CACHE_PATH = path.join(ROOT, 'data', 'geocoded-stops.json')
const BANGLA_PAREN = /\s*\([^)]*[ঀ-৿][^)]*\)\s*$/

function matchKey(name) {
  return name.replace(BANGLA_PAREN, '').trim().toLowerCase()
}

async function parseStops() {
  const text = await readFile(path.join(ROOT, 'stops.txt'), 'utf-8')
  const stops = []
  for (const line of text.split(/\r?\n/)) {
    const m = line.match(/^\((.*),(\d+)\)$/)
    if (!m) continue
    stops.push({ id: Number(m[2]), name: m[1].trim() })
  }
  return stops
}

async function parseRoutes() {
  const text = await readFile(path.join(ROOT, 'routes.txt'), 'utf-8')
  const lines = text.split(/\r?\n/).slice(1) // drop the header line
  const routes = []
  let pending = null

  for (const raw of lines) {
    const line = raw.trim()
    if (!line) continue

    if (line.startsWith('⇄')) {
      // stop sequence line: "⇄ Stop A ⇄ Stop B ⇄ ..."
      if (!pending) continue
      pending.stopNames = line
        .split('⇄')
        .map(s => s.trim())
        .filter(Boolean)
      continue
    }

    if (/Starting Time|Closing Time/i.test(line)) {
      if (pending) pending.timeWindow = line.replace(/^[^\w]*/, '').trim()
      continue
    }

    if (/Seating Service Type/i.test(line)) {
      continue // not modeled in the schema, safe to skip
    }

    // Anything else, when we don't already have a pending route with stops,
    // is a new route's name line.
    if (!pending || pending.stopNames) {
      if (pending) routes.push(pending)
      pending = { name: line.replace(/\t+$/, '').trim(), stopNames: null, timeWindow: null }
    }
  }
  if (pending && pending.stopNames) routes.push(pending)
  return routes
}

async function geocode(query, cache) {
  if (cache[query] !== undefined) return cache[query]
  const url = `https://nominatim.openstreetmap.org/search?format=json&limit=1&viewbox=90.10,24.10,90.60,23.55&q=${encodeURIComponent(query)}`
  try {
    const res = await fetch(url, {
      headers: { 'User-Agent': 'dhaka-bus-navigator-portfolio-project/1.0 (local dev seed script)' }
    })
    const results = await res.json()
    const hit = results[0]
    cache[query] = hit ? { lat: Number(hit.lat), lng: Number(hit.lon) } : null
  } catch (err) {
    console.warn(`  geocode failed for "${query}": ${err.message}`)
    cache[query] = null
  }
  return cache[query]
}

async function loadCache() {
  try {
    return JSON.parse(await readFile(CACHE_PATH, 'utf-8'))
  } catch {
    return {}
  }
}

async function saveCache(cache) {
  await mkdir(path.dirname(CACHE_PATH), { recursive: true })
  await writeFile(CACHE_PATH, JSON.stringify(cache, null, 2), 'utf-8')
}

async function main() {
  console.log('Parsing stops.txt and routes.txt...')
  const baseStops = await parseStops()
  const routesParsed = await parseRoutes()

  const byKey = new Map(baseStops.map(s => [matchKey(s.name), s]))
  let nextId = Math.max(...baseStops.map(s => s.id)) + 1

  const resolvedRoutes = routesParsed.map(route => {
    const stopIds = route.stopNames.map(rawName => {
      const key = matchKey(rawName)
      let stop = byKey.get(key)
      if (!stop) {
        stop = { id: nextId++, name: rawName }
        byKey.set(key, stop)
        baseStops.push(stop)
      }
      return stop.id
    })
    return { name: route.name, stops: stopIds, frequency: route.timeWindow }
  })

  console.log(`Parsed ${routesParsed.length} routes referencing ${baseStops.length} stops (including any not in stops.txt).`)

  console.log('Geocoding stops via OpenStreetMap Nominatim (rate-limited to 1 req/sec, cached)...')
  const cache = await loadCache()
  let geocoded = 0
  for (const stop of baseStops) {
    const query = `${matchKey(stop.name)}, Dhaka, Bangladesh`
    const wasCached = cache[query] !== undefined
    const result = await geocode(query, cache)
    stop.lat = result?.lat ?? null
    stop.lng = result?.lng ?? null
    if (!wasCached) {
      geocoded++
      await saveCache(cache)
      await new Promise(r => setTimeout(r, 1100))
    }
  }
  console.log(`Geocoded ${geocoded} new stop(s); ${baseStops.filter(s => s.lat == null).length} stop(s) have no coordinates.`)

  console.log('Applying schema...')
  const schemaConn = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT || 3306),
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    multipleStatements: true
  })
  const schemaSql = await readFile(path.join(ROOT, 'server', 'schema.sql'), 'utf-8')
  await schemaConn.query(schemaSql)
  await schemaConn.end()

  console.log('Inserting data...')
  const conn = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT || 3306),
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'dhaka_bus_navigator'
  })

  for (const stop of baseStops) {
    await conn.execute(
      'INSERT INTO stops (id, name, lat, lng, nearby_landmarks) VALUES (?, ?, ?, ?, ?)',
      [stop.id, stop.name, stop.lat, stop.lng, JSON.stringify([])]
    )
  }

  const palette = ['#2563eb', '#dc2626', '#16a34a', '#d97706', '#7c3aed', '#0891b2', '#db2777', '#65a30d']
  let colorIndex = 0
  for (const route of resolvedRoutes) {
    await conn.execute(
      'INSERT INTO routes (name, color, frequency, stops) VALUES (?, ?, ?, ?)',
      [route.name, palette[colorIndex++ % palette.length], route.frequency, JSON.stringify(route.stops)]
    )
  }

  await conn.end()
  console.log(`Done: ${baseStops.length} stops, ${resolvedRoutes.length} routes inserted into "dhaka_bus_navigator".`)
}

main().catch(err => {
  console.error(err)
  process.exit(1)
})
