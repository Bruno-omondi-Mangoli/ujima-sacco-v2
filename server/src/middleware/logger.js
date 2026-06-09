import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { v4 as uuidv4 } from 'uuid'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const logPath = path.join(__dirname, '../data/audit_log.json')

export const logDecision = (entry) => {
  try {
    const raw = fs.readFileSync(logPath, 'utf8')
    const log = JSON.parse(raw || '[]')
    log.unshift({
      id: uuidv4(),
      timestamp: new Date().toISOString(),
      ...entry
    })
    // Keep last 500 entries
    const trimmed = log.slice(0, 500)
    fs.writeFileSync(logPath, JSON.stringify(trimmed, null, 2))
  } catch (err) {
    console.error('Audit log error:', err.message)
  }
}

export const requestLogger = (req, res, next) => {
  const start = Date.now()
  res.on('finish', () => {
    const duration = Date.now() - start
    const color = res.statusCode >= 400 ? '\x1b[31m' : '\x1b[32m'
    console.log(`${color}[${new Date().toISOString()}] ${req.method} ${req.path} ${res.statusCode} ${duration}ms\x1b[0m`)
  })
  next()
}