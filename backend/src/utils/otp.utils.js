import { randomInt } from "node:crypto";
import OTP from '../models/otp.model.js'
import ApiError from './ApiError.js'
import { sendEmail } from '../service/email.service.js'

function OTPHTML(otp){
    return `
        <div style="font-family: Arial, sans-serif; text-align: center;">
            <h2 style="color: #333;">Your OTP Code</h2>
            <p style="font-size: 18px; color: #555;">Please use the following OTP to complete your action:</p>
            <div style="font-size: 24px; font-weight: bold; color: #007BFF; margin: 20px 0;">${otp}</div>
            <p style="font-size: 14px; color: #999;">This OTP will expire in 10 minutes.</p>
        </div>
    `;
}



const generateOTP = () => randomInt(100000, 1000000);


const OTP_EXPIRY_MS = 10 * 60 * 1000

const getOTPExpiry = () => {
    return new Date(Date.now() + OTP_EXPIRY_MS)
}

const createAndSendOTP = async (email, subject, text) => {
    await OTP.deleteMany({
        email
    })

    const otp = generateOTP()

    await OTP.create({
        email,
        otp: otp.toString(),
        expiresAt: getOTPExpiry()
    })

    const result = await sendEmail(
        email,
        subject,
        text(otp),
        OTPHTML(otp)
    )

    if (
        result.accepted.length === 0 ||
        result.rejected.length > 0
    ) {
        throw new ApiError(
            500,
            "Failed to send OTP email"
        )
    }
}

const verifyOTP = async (email, otp) => {
    const OTPDoc = await OTP.findOne({
        email
    })

    if (!OTPDoc) {
        throw new ApiError(400, "Invalid OTP")
    }

    if (OTPDoc.expiresAt < new Date()) {
        await OTP.deleteOne({
            _id: OTPDoc._id
        })

        throw new ApiError(400, "OTP has expired")
    }

    const isOTPValid = await OTPDoc.isOTPCorrect(otp)

    if (!isOTPValid) {
        throw new ApiError(400, "Invalid OTP")
    }

    return OTPDoc
}

export {
    generateOTP,
    OTPHTML,
    getOTPExpiry,
    createAndSendOTP,
    verifyOTP
}