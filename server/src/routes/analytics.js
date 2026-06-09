import express from 'express'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const router = express.Router()
const __dirname = path.dirname(fileURLToPath(import.meta.url))

router.get('/', (req, res) => {
  try {
    const members = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/members.json'), 'utf8'))
    const audit = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/audit_log.json'), 'utf8') || '[]')

    const guardianDecisions = audit.filter(e => e.agent === 'GUARDIAN')
    const humanDecisions = audit.filter(e => e.agent === 'HUMAN')

    const approvalsByOccupation = members.reduce((acc, m) => {
      acc[m.occupation] = (acc[m.occupation] || 0) + 1
      return acc
    }, {})

    const approvalsByCounty = members.reduce((acc, m) => {
      acc[m.county] = (acc[m.county] || 0) + 1
      return acc
    }, {})

    const totalCreditRequested = members.reduce((sum, m) => sum + m.loanAmount, 0)
    const avgLoanAmount = Math.round(totalCreditRequested / members.length)
    const totalSavings = members.reduce((sum, m) => sum + m.savingsBalance, 0)
    const femaleMembers = members.filter(m => m.gender === 'Female').length
    const informalTraders = members.filter(m => m.occupationCode.startsWith('INFORMAL')).length

    res.json({
      success: true,
      data: {
        overview: {
          totalMembers: members.length,
          totalCreditRequested,
          avgLoanAmount,
          totalSavings,
          femaleMembers,
          femalePct: Math.round((femaleMembers / members.length) * 100),
          informalTraders,
          informalPct: Math.round((informalTraders / members.length) * 100),
          agentDecisions: audit.length,
          humanDecisions: humanDecisions.length,
        },
        approvalsByOccupation: Object.entries(approvalsByOccupation).map(([name, count]) => ({ name, count })),
        approvalsByCounty: Object.entries(approvalsByCounty).map(([name, count]) => ({ name, count })),
        agentActivity: ['SCOUT', 'GUARDIAN', 'HUNTER', 'HUMAN'].map(agent => ({
          agent,
          count: audit.filter(e => e.agent === agent).length
        })),
        recentDecisions: audit.slice(0, 10)
      }
    })
  } catch (err) {
    res.status(500).json({ success: false, error: err.message })
  }
})

export default router