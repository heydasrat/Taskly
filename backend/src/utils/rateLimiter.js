import rateLimit from "express-rate-limit"

const rateLimitHandler = (req, res, next) => {
  next(
    new ApiError(
      429,
      "Too many requests. Please try again later."
    )
  )
}

// General limiter: applies to the entire API
export const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 300,
  standardHeaders: true,
  legacyHeaders: false,
  ipv6Subnet: 56,
  handler: rateLimitHandler
})

// Authentication limiter: login, registration, etc.
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  skipSuccessfulRequests: true,
  standardHeaders: true,
  legacyHeaders: false,
  ipv6Subnet: 56,
  handler: rateLimitHandler
})

// User-management limiter: profile, password, theme, avatar, etc.
export const userLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 60,
  standardHeaders: true,
  legacyHeaders: false,
  ipv6Subnet: 56,
  handler: rateLimitHandler
})