import rateLimit from "express-rate-limit"
import ApiError from '../utils/ApiError.js'

const rateLimitHandler = (req, res, next) => {
  next(
    new ApiError(
      429,
      "Too many requests. Please try again later."
    )
  )
}

export const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 300,
  standardHeaders: true,
  legacyHeaders: false,
  ipv6Subnet: 56,
  handler: rateLimitHandler
})

export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  skipSuccessfulRequests: true,
  standardHeaders: true,
  legacyHeaders: false,
  ipv6Subnet: 56,
  handler: rateLimitHandler
})

export const userLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 60,
  standardHeaders: true,
  legacyHeaders: false,
  ipv6Subnet: 56,
  handler: rateLimitHandler
})