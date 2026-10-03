import express from 'express'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import { authLimiter, userLimiter,limiter } from './utils/rateLimiter.js'
import helmet from 'helmet'
import config from './config/config.js'


// Route imports
import userRoutes from './routes/user.route.js'
import userManagementRoutes from './routes/userManagement.route.js'
import todoRoutes from './routes/todo.route.js'



const app = express()




app.get('/healthz', (req, res) => res.status(200).send('ok'))

app.use(cors({
  origin: config.corsOrigin,
  credentials: true
}));

app.use(helmet())



app.use(limiter)


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