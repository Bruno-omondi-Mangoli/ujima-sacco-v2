import express from 'express'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const router = express.Router()
const __dirname = path.dirname(fileURLToPath(import.meta.url))
const membersPath = path.join(__dirname, '../data/members.json')

const getMembers = () => {
  const raw = fs.readFileSync(membersPath, 'utf8')
  return JSON.parse(raw)
}

// GET all members
router.get('/', (req, res) => {
  try {
    const members = getMembers()
    const { search, county, occupation, status } = req.query
    let filtered = members

    if (search) {
      const q = search.toLowerCase()
      filtered = filtered.filter(m =>
        m.name.toLowerCase().includes(q) ||
        m.occupation.toLowerCase().includes(q) ||
        m.location.toLowerCase().includes(q)
      )
    }
    if (county) filtered = filtered.filter(m => m.county === county)
    if (occupation) filtered = filtered.filter(m => m.occupationCode === occupation)
    if (status) filtered = filtered.filter(m => m.status === status)

    res.json({ success: true, data: filtered, total: filtered.length })
  } catch (err) {
    res.status(500).json({ success: false, error: err.message })
  }
})

// GET single member
router.get('/:id', (req, res) => {
  try {
    const members = getMembers()
    const member = members.find(m => m.id === req.params.id)
    if (!member) return res.status(404).json({ success: false, error: 'Member not found' })
    res.json({ success: true, data: member })
  } catch (err) {
    res.status(500).json({ success: false, error: err.message })
  }
})

export default router