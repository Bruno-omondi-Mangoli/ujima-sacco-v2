import express from 'express'
import { askAI } from '../config/ai.js'
import { logDecision } from '../middleware/logger.js'

const router = express.Router()

router.post('/analyse', async (req, res, next) => {
  try {
    const { member } = req.body
    if (!member) return res.status(400).json({ success: false, error: 'Member data required' })

    const prompt = `You are the Scout Agent for Ujima SACCO Kenya. Analyse this member SMS.

MEMBER:
Name: ${member.name}
Age: ${member.age}
Occupation: ${member.occupation}
Location: ${member.location}
Children: ${member.children} (ages: ${member.childAges?.join(', ') || 'none'})
Monthly Income: KES ${member.monthlyIncome}
Savings: KES ${member.savingsBalance}
Harvest Season: ${member.harvest}
SACCO History: ${member.saccoMonths} months, ${member.defaultHistory} defaults
Previous Loans: ${member.previousLoans?.length || 0}

SMS: "${member.sms}"

RANK RULES:
- Max 3 SMS per day
- Never recommend specific loans unprompted
- Escalate to Guardian if: school fees stress, shylock/loan shark mention, medical emergency
- Kill switch: *#700# stops all messages

Respond with ONLY this JSON:
{
  "stressLevel": "LOW|MEDIUM|HIGH|CRITICAL",
  "stressType": "school_fees|predatory_lender|medical|business|general",
  "keywordsDetected": [],
  "harvestAlignment": "string describing harvest timing relevance",
  "financialHealthScore": 0,
  "escalateToGuardian": true,
  "escalationReason": "string",
  "escalationPriority": "LOW|MEDIUM|HIGH|URGENT",
  "contextPacket": {
    "childAges": [],
    "nextHarvestDate": "string",
    "currentSavings": 0,
    "monthlyIncome": 0,
    "saccoHistory": "string"
  },
  "memberResponseSwahili": "string",
  "memberResponseEnglish": "string",
  "agentNote": "string",
  "rankConstraintsApplied": []
}`

    const result = await askAI(prompt)

    logDecision({
      agent: 'SCOUT',
      memberId: member.id,
      memberName: member.name,
      event: 'SMS_ANALYSED',
      stressLevel: result.stressLevel,
      escalated: result.escalateToGuardian,
      priority: result.escalationPriority,
      note: result.escalationReason
    })

    res.json({ success: true, data: result })
  } catch (err) {
    next(err)
  }
})

export default router