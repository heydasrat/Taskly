import express from 'express'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import { rateLimit } from 'express-rate-limit'
import helmet from 'helmet'
import config from './config/config.js'

// Route imports
import userRoutes from './routes/user.route.js'
import userManagementRoutes from './routes/userManagement.route.js'
import todoRoutes from './routes/todo.route.js'

// Utils
import asyncHandler from './utils/asyncHandler.js'
import ApiError from './utils/ApiError.js'

const app = express()




app.get('/healthz', (req, res) => res.status(200).send('ok'))

app.use(cors({
  origin: config.corsOrigin,
  credentials: true
}));

app.use(helmet())


const rateLimitHandler = (req, res, next) => {
  next(
    new ApiError(
      429,
      "Too many requests. Please try again later."
    )
  )
}

// General limiter: applies to the entire API
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 300,
  standardHeaders: true,
  legacyHeaders: false,
  ipv6Subnet: 56,
  handler: rateLimitHandler
})

// Authentication limiter: login, registration, etc.
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  skipSuccessfulRequests: true,
  standardHeaders: true,
  legacyHeaders: false,
  ipv6Subnet: 56,
  handler: rateLimitHandler
})

// User-management limiter: profile, password, theme, avatar, etc.
const userLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 60,
  standardHeaders: true,
  legacyHeaders: false,
  ipv6Subnet: 56,
  handler: rateLimitHandler
})

// Apply the general limiter first
app.use(limiter)

// Apply stricter limits to specific route groups
app.use("/v1/api/auth", authLimiter)
app.use("/v1/api/user", userLimiter)


app.use(express.json({ limit: '1mb' }))

app.use(express.urlencoded({
  extended: true,
  limit: '1mb'
}))

app.use(express.static('./public'))

app.use(cookieParser())


app.use('/v1/api/auth', userRoutes)
app.use('/v1/api/user', userManagementRoutes)
app.use('/v1/api/todo', todoRoutes)


app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  })
})


app.use((err, req, res, next) => {
  res.status(err.statusCode || 500).json({
    success: err.success || false,
    message: err.message || 'Something went wrong',
    errors: err.errors || []
  })
})

export default app