import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import dotenv from 'dotenv'
import rateLimit from 'express-rate-limit'
import { corsOptions } from './config/cors.js'
import { requestLogger } from './middleware/logger.js'
import { errorHandler, notFound } from './middleware/errorHandler.js'
import membersRouter from './routes/members.js'
import scoutRouter from './routes/scout.js'
import guardianRouter from './routes/guardian.js'
import hunterRouter from './routes/hunter.js'
import auditRouter from './routes/audit.js'
import analyticsRouter from './routes/analytics.js'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3001

// Security
app.use(helmet())
app.use(cors(corsOptions))

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { success: false, error: 'Too many requests' }
})
const aiLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 20,
  message: { success: false, error: 'AI rate limit — wait 1 minute' }
})

app.use(limiter)
app.use(express.json({ limit: '10mb' }))
app.use(requestLogger)

// Routes
app.use('/api/members', membersRouter)
app.use('/api/scout', aiLimiter, scoutRouter)
app.use('/api/guardian', aiLimiter, guardianRouter)
app.use('/api/hunter', aiLimiter, hunterRouter)
app.use('/api/audit', auditRouter)
app.use('/api/analytics', analyticsRouter)

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    status: 'running',
    version: '2.0.0',
    environment: process.env.NODE_ENV,
    timestamp: new Date().toISOString(),
    agents: ['Scout', 'Guardian', 'Hunter'],
    aiProvider: 'Groq (llama3-8b-8192)'
  })
})

// Error handling
app.use(notFound)
app.use(errorHandler)

app.listen(PORT, () => {
  console.log(`
\x1b[36m╔════════════════════════════════════════╗
║     UJIMA SACCO v2.0 — Server Ready    ║
╠════════════════════════════════════════╣
║  Port:    ${PORT}                          ║
║  Env:     ${process.env.NODE_ENV}               ║
║  AI:      Groq llama3-8b-8192          ║
║  Health:  /api/health                  ║
╚════════════════════════════════════════╝\x1b[0m
  `)
})