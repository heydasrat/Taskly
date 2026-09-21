import jwt from 'jsonwebtoken'
import User from '../models/user.model.js'
import ApiError from './ApiError.js'
import config from '../config/config.js'

const generatePasswordResetToken = (userId) => {
    return jwt.sign(
        {
            userId,
            purpose: "password-reset"
        },
        config.passwordResetToken,
        {
            expiresIn: config.passwordResetTokenExpiry
        }
    )
}

const generateAccessAndRefreshToken = async (userId) => {
    try {
        const user = await User.findById(userId)

        if (!user) {
            throw new ApiError(404, "User not found")
        }

        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()

        user.refreshToken = refreshToken

        await user.save({
            validateBeforeSave: false
        })

        return {
            accessToken,
            refreshToken
        }
    } catch (error) {
        if (error instanceof ApiError) {
            throw error
        }

        throw new ApiError(
            500,
            "Something went wrong while generating your tokens"
        )
    }
}

export {
    generatePasswordResetToken,
    generateAccessAndRefreshToken
}