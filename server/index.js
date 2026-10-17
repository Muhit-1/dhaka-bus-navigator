import express from 'express'
import cors from 'cors'
import { pool } from './db.js'

const app = express()
app.use(cors())
app.use(express.json())

const asyncHandler = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)

// MariaDB stores JSON columns as LONGTEXT, so mysql2 returns them as strings
// (MySQL 8 returns parsed values). Normalize so the client always gets arrays.
const parseJsonArray = (value) => {
  if (Array.isArray(value)) return value
  if (typeof value === 'string') {
    try {
      const parsed = JSON.parse(value)
      return Array.isArray(parsed) ? parsed : []
    } catch {
      return []
    }
  }
  return []
}

app.get('/api/stops', asyncHandler(async (req, res) => {
  const [rows] = await pool.query('SELECT id, name, lat, lng, nearby_landmarks FROM stops')
  res.json(rows.map(row => ({ ...row, nearby_landmarks: parseJsonArray(row.nearby_landmarks) })))
}))

app.get('/api/routes', asyncHandler(async (req, res) => {
  const [rows] = await pool.query('SELECT id, name, color, frequency, stops FROM routes')
  res.json(rows.map(row => ({ ...row, stops: parseJsonArray(row.stops) })))
}))

app.get('/api/fares', asyncHandler(async (req, res) => {
  const [rows] = await pool.query('SELECT id, route_id, from_stop_id, to_stop_id, fare FROM fares')
  res.json(rows)
}))

app.post('/api/feedback', asyncHandler(async (req, res) => {
  const { feedback_type, stop_id, route_id, description, contact_email } = req.body || {}

  if (!description || !description.toString().trim()) {
    return res.status(400).json({ error: 'description is required' })
  }

  const sanitized = {
    feedback_type: feedback_type?.toString().slice(0, 50) || null,
    stop_id: stop_id?.toString().slice(0, 50) || null,
    route_id: route_id?.toString().slice(0, 50) || null,
    description: description.toString().slice(0, 1000),
    contact_email: contact_email?.toString().slice(0, 100) || null
  }

  const [result] = await pool.execute(
    `INSERT INTO user_feedback (feedback_type, stop_id, route_id, description, contact_email, status)
     VALUES (?, ?, ?, ?, ?, 'pending')`,
    [sanitized.feedback_type, sanitized.stop_id, sanitized.route_id, sanitized.description, sanitized.contact_email]
  )

  res.status(201).json({ id: result.insertId, ...sanitized, status: 'pending' })
}))

app.use((err, req, res, next) => {
  console.error(err)
  res.status(500).json({ error: 'Internal server error' })
})

const port = Number(process.env.PORT || 5000)
app.listen(port, () => {
  console.log(`API server listening on http://localhost:${port}`)
})
