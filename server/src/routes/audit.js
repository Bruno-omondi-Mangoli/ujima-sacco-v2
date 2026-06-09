import express from 'express'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const router = express.Router()
const __dirname = path.dirname(fileURLToPath(import.meta.url))
const logPath = path.join(__dirname, '../data/audit_log.json')

router.get('/', (req, res) => {
  try {
    const raw = fs.readFileSync(logPath, 'utf8')
    const log = JSON.parse(raw || '[]')
    const { agent, memberId, limit = 100 } = req.query
    let filtered = log
    if (agent) filtered = filtered.filter(e => e.agent === agent)
    if (memberId) filtered = filtered.filter(e => e.memberId === memberId)
    res.json({ success: true, data: filtered.slice(0, parseInt(limit)), total: filtered.length })
  } catch (err) {
    res.json({ success: true, data: [], total: 0 })
  }
})

router.delete('/', (req, res) => {
  try {
    fs.writeFileSync(logPath, '[]')
    res.json({ success: true, message: 'Audit log cleared' })
  } catch (err) {
    res.status(500).json({ success: false, error: err.message })
  }
})

export default router