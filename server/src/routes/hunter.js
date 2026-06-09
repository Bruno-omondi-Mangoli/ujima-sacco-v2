import express from 'express'
import { askAI } from '../config/ai.js'
import { logDecision } from '../middleware/logger.js'

const router = express.Router()

router.post('/brief', async (req, res, next) => {
  try {
    const { member, scoutResult, guardianResult } = req.body
    if (!member || !scoutResult || !guardianResult) {
      return res.status(400).json({ success: false, error: 'All three inputs required' })
    }

    const prompt = `You are the Hunter Agent for Ujima SACCO Kenya. Prepare an officer briefing packet.

RANK RULES:
- NEVER approve or deny — preparation only
- Match officer by crop specialty and county
- Alert within 15 minutes for URGENT cases
- Always include cross-sell opportunities

AVAILABLE OFFICERS:
1. Sarah Wanjiku — Maize/wheat farmers, Kakamega and Western Kenya
2. David Otieno — Fish traders, debt rescue cases, Kisumu and Nyanza
3. Amina Hassan — Shea butter and informal traders, Busia district
4. James Mwangi — Coffee and tea farmers, Central Kenya and Kericho
5. Grace Adhiambo — Mama mboga, market vendors, Nairobi informal
6. Robert Kiplagat — Boda boda operators, transport sector, all counties

MEMBER: ${member.name}, ${member.age}, ${member.gender}
OCCUPATION: ${member.occupation} (${member.occupationCode})
LOCATION: ${member.location}, ${member.county} County
CHILDREN: ${member.children} (ages: ${member.childAges?.join(', ') || 'none'})
LOAN: KES ${member.loanAmount} for ${member.loanPurpose}
HARVEST: ${member.harvest}
SAVINGS: KES ${member.savingsBalance}
SACCO: ${member.saccoMonths} months, ${member.defaultHistory} defaults
PREVIOUS LOANS: ${member.previousLoans?.length || 0} (all repaid: ${member.previousLoans?.every(l => l.status === 'repaid') ? 'YES' : 'NO'})

SCOUT:
Stress Level: ${scoutResult.stressLevel}
Type: ${scoutResult.stressType}
Financial Health Score: ${scoutResult.financialHealthScore}
Harvest Alignment: ${scoutResult.harvestAlignment}

GUARDIAN:
Application Score: ${guardianResult.applicationScore}%
Counterfactual Score: ${guardianResult.counterfactualScore}%
Repayment Capacity: KES ${guardianResult.repaymentCapacity}/month
Harvest Adjusted Income: KES ${guardianResult.harvestAdjustedIncome}
Risk Flags: ${guardianResult.riskFlags?.join(', ') || 'None'}
Bias Check: ${guardianResult.biasCheckPassed ? 'PASSED' : 'FAILED'}
Suggested Repayment: ${guardianResult.suggestedRepaymentSchedule}
Interest Rate: ${guardianResult.suggestedInterestRate}%
Total Repayable: KES ${guardianResult.totalRepayable}

Respond with ONLY this JSON:
{
  "assignedOfficer": "string",
  "officerSpecialty": "string",
  "escalationPriority": "LOW|MEDIUM|HIGH|URGENT",
  "slaMins": 0,
  "briefingSummary": "string — 2 sentences max",
  "top3Points": ["string", "string", "string"],
  "repaymentSchedule": [
    { "month": "string", "amount": 0, "note": "string", "isSchoolFeeMonth": false }
  ],
  "crossSellOpportunities": [
    { "product": "string", "reason": "string", "priority": "LOW|MEDIUM|HIGH" }
  ],
  "pridePausePoints": ["string"],
  "riskMitigation": ["string"],
  "approvalMessageSwahili": "string",
  "approvalMessageEnglish": "string",
  "denialMessageSwahili": "string",
  "denialMessageEnglish": "string",
  "agentNote": "string"
}`

    const result = await askAI(prompt, 2000)

    logDecision({
      agent: 'HUNTER',
      memberId: member.id,
      memberName: member.name,
      event: 'BRIEFING_PREPARED',
      assignedOfficer: result.assignedOfficer,
      priority: result.escalationPriority,
      slaMins: result.slaMins,
      note: result.briefingSummary
    })

    res.json({ success: true, data: result })
  } catch (err) {
    next(err)
  }
})

export default router