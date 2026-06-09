import express from 'express'
import { askAI } from '../config/ai.js'
import { logDecision } from '../middleware/logger.js'

const router = express.Router()

router.post('/triage', async (req, res, next) => {
  try {
    const { member, scoutResult } = req.body
    if (!member || !scoutResult) {
      return res.status(400).json({ success: false, error: 'Member and scout result required' })
    }

    const prompt = `You are the Guardian Agent for Ujima SACCO Kenya. Score this loan application.

MEMBER PROFILE:
Name: ${member.name}
Age: ${member.age}
Gender: ${member.gender}
Occupation: ${member.occupation} (Code: ${member.occupationCode})
Location: ${member.location}, ${member.county} County
Children: ${member.children} (ages: ${member.childAges?.join(', ') || 'none'})
Monthly Income: KES ${member.monthlyIncome}
Savings Balance: KES ${member.savingsBalance}
Harvest Season: ${member.harvest}
SACCO History: ${member.saccoMonths} months
Default History: ${member.defaultHistory} defaults
Previous Loans: ${JSON.stringify(member.previousLoans || [])}
Loan Requested: KES ${member.loanAmount}
Loan Purpose: ${member.loanPurpose}

SCOUT ANALYSIS:
Stress Level: ${scoutResult.stressLevel}
Stress Type: ${scoutResult.stressType}
Keywords: ${scoutResult.keywordsDetected?.join(', ')}
Harvest Alignment: ${scoutResult.harvestAlignment}
Priority: ${scoutResult.escalationPriority}

RANK RULES:
- Auto-approve ONLY loans up to KES 15000 with fewer than 3 risk flags
- NEVER approve over KES 15000 — escalate to Hunter
- NEVER use gender or ethnicity as scoring variables
- Busia County: ALL applications require mandatory human review
- Children under 5: mandatory human review
- Run counterfactual: same application with 20% higher income

KENYA FINANCIAL CONTEXT:
- School fee peaks: January, May, September
- Maize harvest: August/September, matooke: March/April and Sept/Oct
- SASRA interest rate cap: 19.5% per annum
- Assess income over full 12 months not just 3 months

Respond with ONLY this JSON:
{
  "harvestAdjustedIncome": 0,
  "annualisedIncome": 0,
  "repaymentCapacity": 0,
  "applicationScore": 0,
  "counterfactualScore": 0,
  "biasCheckPassed": true,
  "biasCheckDetails": "string",
  "riskFlags": [],
  "riskFlagCount": 0,
  "decision": "AUTO_APPROVE|ESCALATE_TO_HUNTER|AUTO_DENY",
  "decisionReason": "string",
  "escalationPriority": "LOW|MEDIUM|HIGH|URGENT",
  "mandatoryHumanReview": false,
  "mandatoryHumanReviewReason": "string",
  "suggestedRepaymentSchedule": "string",
  "suggestedInterestRate": 0,
  "totalRepayable": 0,
  "denialMessageSwahili": "",
  "agentNote": "string"
}`

    const result = await askAI(prompt)

    logDecision({
      agent: 'GUARDIAN',
      memberId: member.id,
      memberName: member.name,
      event: 'LOAN_SCORED',
      loanAmount: member.loanAmount,
      score: result.applicationScore,
      decision: result.decision,
      biasCheckPassed: result.biasCheckPassed,
      riskFlags: result.riskFlags,
      note: result.decisionReason
    })

    res.json({ success: true, data: result })
  } catch (err) {
    next(err)
  }
})

export default router