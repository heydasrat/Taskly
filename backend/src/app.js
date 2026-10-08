import express from "express"
import cookieParser from "cookie-parser"
import cors from "cors"
import { authLimiter, userLimiter, limiter } from "./utils/rateLimiter.js"
import helmet from "helmet"
import config from "./config/config.js"
import passport from "passport"
import { Strategy as GoogleStrategy } from "passport-google-oauth20"

// Route imports
import userRoutes from "./routes/user.route.js"
import userManagementRoutes from "./routes/userManagement.route.js"
import todoRoutes from "./routes/todo.route.js"

// Model imports
import User from "./models/user.model.js"

const app = express()

app.get("/healthz", (req, res) => res.status(200).send("ok"))

app.use(
    cors({
        origin: config.corsOrigin,
        credentials: true,
    })
)

app.use(helmet())

app.use(limiter)

app.use("/v1/api/auth", authLimiter)

app.use("/v1/api/user", userLimiter)

app.use(express.json({ limit: "1mb" }))

app.use(
    express.urlencoded({
        extended: true,
        limit: "1mb",
    })
)

app.use(express.static("./public"))

app.use(cookieParser())

app.use(passport.initialize())

passport.use(
    new GoogleStrategy(
        {
            clientID: config.googleAuthClientId,
            clientSecret: config.googleAuthClientSecret,
            callbackURL:
                "http://localhost:8000/v1/api/auth/google/callback",
        },
        async (accessToken, refreshToken, profile, done) => {
            try {
                const googleId = profile.id
                const email = profile.emails?.[0]?.value
                const emailVerified =
                    profile.emails?.[0]?.verified === true

                if (!email) {
                    return done(
                        new Error("Google account did not provide an email"),
                        null
                    )
                }

                let user = await User.findOne({ googleId })

                if (user) {
                    user.isVerified = emailVerified

                    if (!user.avatar?.url && profile.photos?.[0]?.value) {
                        user.avatar = {
                            url: profile.photos[0].value,
                            public_id: "",
                        }
                    }

                    await user.save({
                        validateBeforeSave: false,
                    })

                    return done(null, user)
                }

                user = await User.findOne({ email })

                if (user) {
                    user.googleId = googleId
                    user.isVerified = emailVerified

                    if (!user.avatar?.url && profile.photos?.[0]?.value) {
                        user.avatar = {
                            url: profile.photos[0].value,
                            public_id: "",
                        }
                    }

                    await user.save({
                        validateBeforeSave: false,
                    })

                    return done(null, user)
                }

                const baseUsername =
                    profile.displayName
                        ?.toLowerCase()
                        .replace(/[^a-z0-9]/g, "")
                        .slice(0, 15) || "googleuser"

                let username = baseUsername
                let usernameExists = await User.findOne({ username })

                let counter = 1

                while (usernameExists) {
                    username = `${baseUsername}${counter}`
                    usernameExists = await User.findOne({ username })
                    counter++
                }

                user = await User.create({
                    googleId,
                    email,
                    username,
                    fullName: profile.displayName || "Google User",
                    password: undefined,
                    avatar: {
                        url: profile.photos?.[0]?.value || "",
                        public_id: "",
                    },
                    isVerified: emailVerified,
                })

                return done(null, user)
            } catch (error) {
                return done(error, null)
            }
        }
    )
)

app.get(
    "/v1/api/auth/google",
    passport.authenticate("google", {
        scope: ["profile", "email"],
    })
)

app.get(
    "/v1/api/auth/google/callback",
    passport.authenticate("google", {
        session: false,
    }),
    async (req, res) => {
        try {
            const user = req.user

            const accessToken = user.generateAccessToken()
            const refreshToken = user.generateRefreshToken()

            user.refreshToken = refreshToken

            await user.save({
                validateBeforeSave: false,
            })

            res
                .cookie("accessToken", accessToken, {
                    httpOnly: true,
                    secure: config.nodeEnv === "production",
                    sameSite: "lax",
                })
                .cookie("refreshToken", refreshToken, {
                    httpOnly: true,
                    secure: config.nodeEnv === "production",
                    sameSite: "lax",
                })
                .redirect(config.frontendURL)
        } catch (error) {
            res.status(500).json({
                success: false,
                message: "Authentication failed",
            })
        }
    }
)

app.use("/v1/api/auth", userRoutes)

app.use("/v1/api/user", userManagementRoutes)

app.use("/v1/api/todo", todoRoutes)

app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: "Route not found",
    })
})

app.use((err, req, res, next) => {
    res.status(err.statusCode || 500).json({
        success: err.success || false,
        message: err.message || "Something went wrong",
        errors: err.errors || [],
    })
})

export default app