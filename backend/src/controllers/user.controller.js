import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import User from "../models/user.model.js";
import {
    createAndSendOTP,
    verifyOTP,
} from "../utils/otp.utils.js";
import OTP from "../models/otp.model.js";
import jwt from "jsonwebtoken";
import config from "../config/config.js";
import { publicUserObj } from "../utils/user.utils.js";
import {
    generatePasswordResetToken,
    generateAccessAndRefreshToken,
} from "../utils/token.utils.js";
import { sendResponse } from "../utils/response.utils.js";

const options = {
    secure: true,
    httpOnly: true,
    sameSite: "strict",
};

const register = asyncHandler(async (req, res) => {
    const {
        fullName,
        email,
        password,
        username,
    } = req.body;

    if (
        [fullName, email, password, username]
            .some((field) => !field || field.trim() === "")
    ) {
        throw new ApiError(400, "All fields are required");
    }

    const normalizedEmail = email.toLowerCase().trim();

    const existedUserByEmailOrUsername = await User.findOne({
        $or: [
            {
                email: normalizedEmail,
            },
            {
                username,
            },
        ],
    });

    if (existedUserByEmailOrUsername) {
        if (existedUserByEmailOrUsername.email === normalizedEmail) {
            throw new ApiError(
                409,
                "User already exists with this email"
            );
        }

        if (existedUserByEmailOrUsername.username === username) {
            throw new ApiError(
                409,
                "Username is already taken"
            );
        }
    }

    const user = await User.create({
        username,
        fullName,
        email: normalizedEmail,
        password,
    });

    await createAndSendOTP(
        normalizedEmail,
        "Verify Your Email — Taskly",
        (otp) =>
            `Your Taskly verification code is ${otp}. This code will expire in 10 minutes.`
    );

    const safeUser = publicUserObj(user);

    return sendResponse(
        res,
        201,
        safeUser,
        "User registered successfully. Please verify your email address."
    );
});

const verifyEmail = asyncHandler(async (req, res) => {
    const {
        email,
        otp,
    } = req.body;

    if (!email || email.trim() === "") {
        throw new ApiError(400, "Email is missing");
    }

    if (!otp || otp.trim() === "") {
        throw new ApiError(400, "OTP is missing");
    }

    const normalizedEmail = email.toLowerCase().trim();

    const OTPDoc = await verifyOTP(
        normalizedEmail,
        otp
    );

    const user = await User.findOneAndUpdate(
        {
            email: normalizedEmail,
        },
        {
            $set: {
                isVerified: true,
            },
        },
        {
            new: true,
        }
    );

    if (!user) {
        throw new ApiError(404, "User not found");
    }

    await OTP.deleteOne({
        _id: OTPDoc._id,
    });

    const safeUser = publicUserObj(user);

    return sendResponse(
        res,
        200,
        safeUser,
        "Email verified successfully"
    );
});

const login = asyncHandler(async (req, res) => {
    const {
        identifier,
        password,
    } = req.body;

    if (!identifier || identifier.trim() === "") {
        throw new ApiError(
            400,
            "Username or email is required"
        );
    }

    if (!password || password.trim() === "") {
        throw new ApiError(
            400,
            "Password is required"
        );
    }

    const normalizedIdentifier = identifier.trim().toLowerCase();

    const user = await User.findOne({
        $or: [
            {
                email: normalizedIdentifier,
            },
            {
                username: identifier.trim(),
            },
        ],
    });

    if (!user) {
        throw new ApiError(
            404,
            "User not found!"
        );
    }

    if (!user.isVerified) {
        res.clearCookie("accessToken", options);
        res.clearCookie("refreshToken", options);

        return sendResponse(
            res,
            403,
            {},
            "Please verify your email before logging in."
        );
    }

    const isPasswordValid = await user.isPasswordCorrect(
        password
    );

    if (!isPasswordValid) {
        throw new ApiError(
            400,
            "Invalid credentials"
        );
    }

    const {
        accessToken,
        refreshToken,
    } = await generateAccessAndRefreshToken(
        user._id
    );

    const safeUser = publicUserObj(user);

    res.cookie(
        "accessToken",
        accessToken,
        options
    );

    res.cookie(
        "refreshToken",
        refreshToken,
        options
    );

    return sendResponse(
        res,
        200,
        safeUser,
        "User logged in successfully"
    );
});

const logout = asyncHandler(async (req, res) => {
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $set: {
                refreshToken: null,
            },
        },
        {
            new: true,
        }
    );

    res.clearCookie("accessToken", options);
    res.clearCookie("refreshToken", options);

    return sendResponse(
        res,
        200,
        {},
        "User logged out successfully"
    );
});

const getCurrentUser = asyncHandler(async (req, res) => {
    const user = await User.findById(
        req.user._id
    );

    if (!user) {
        throw new ApiError(
            404,
            "User not found"
        );
    }

    const safeUser = publicUserObj(user);

    return sendResponse(
        res,
        200,
        safeUser,
        "Current user fetched successfully"
    );
});

const requestPasswordReset = asyncHandler(async (req, res) => {
    const {
        email,
    } = req.body;

    if (!email || email.trim() === "") {
        throw new ApiError(
            400,
            "Invalid email address"
        );
    }

    const normalizedEmail = email.toLowerCase().trim();

    const user = await User.findOne({
        email: normalizedEmail,
        isVerified: true,
    });

    if (!user) {
        throw new ApiError(
            404,
            "User not found!"
        );
    }

    await createAndSendOTP(
        normalizedEmail,
        "Password Reset Code — Taskly",
        (otp) =>
            `We received a request to reset your Taskly password. Your verification code is ${otp}. This code will expire in 10 minutes. If you did not request this, you can safely ignore this email.`
    );

    return sendResponse(
        res,
        200,
        {},
        "Password reset OTP sent successfully"
    );
});

const verifyPasswordResetOtp = asyncHandler(async (req, res) => {
    const {
        otp,
        email,
    } = req.body;

    if (
        [otp, email]
            .some(
                (field) =>
                    !field ||
                    field.trim() === ""
            )
    ) {
        throw new ApiError(
            400,
            "All fields are required"
        );
    }

    const normalizedEmail = email.toLowerCase().trim();

    const user = await User.findOne({
        email: normalizedEmail,
        isVerified: true,
    });

    if (!user) {
        throw new ApiError(
            404,
            "User not found"
        );
    }

    const OTPDoc = await verifyOTP(
        normalizedEmail,
        otp
    );

    const resetToken = generatePasswordResetToken(
        user._id
    );

    await OTP.deleteOne({
        _id: OTPDoc._id,
    });

    return sendResponse(
        res,
        200,
        resetToken,
        "OTP verified successfully"
    );
});

const resetPassword = asyncHandler(async (req, res) => {
    const {
        resetToken,
        newPassword,
        confirmPassword,
    } = req.body;

    if (
        [resetToken, newPassword, confirmPassword]
            .some(
                (field) =>
                    !field ||
                    field.trim() === ""
            )
    ) {
        throw new ApiError(
            400,
            "All fields are required"
        );
    }

    if (newPassword !== confirmPassword) {
        throw new ApiError(
            400,
            "New password and confirm password do not match"
        );
    }

    let decoded;

    try {
        decoded = jwt.verify(
            resetToken,
            config.passwordResetToken
        );
    } catch (error) {
        if (error.name === "TokenExpiredError") {
            throw new ApiError(
                401,
                "Password reset token has expired"
            );
        }

        throw new ApiError(
            401,
            "Invalid password reset token"
        );
    }

    if (decoded.purpose !== "password-reset") {
        throw new ApiError(
            401,
            "Invalid password reset token"
        );
    }

    const user = await User.findById(
        decoded.userId
    );

    if (!user) {
        throw new ApiError(
            404,
            "User not found"
        );
    }

    user.password = newPassword;
    user.refreshToken = null;

    await user.save();

    return sendResponse(
        res,
        200,
        {},
        "Password changed successfully"
    );
});

const resendOTP = asyncHandler(async (req, res) => {
    const {
        email,
    } = req.body;

    if (!email || email.trim() === "") {
        throw new ApiError(
            400,
            "Invalid Email"
        );
    }

    const normalizedEmail = email.toLowerCase().trim();

    const user = await User.findOne({
        email: normalizedEmail,
        isVerified: false,
    });

    if (!user) {
        throw new ApiError(
            404,
            "User not found"
        );
    }

    await createAndSendOTP(
        normalizedEmail,
        "Verify Your Email — Taskly",
        (otp) =>
            `Your Taskly verification code is ${otp}. This code will expire in 10 minutes.`
    );

    return sendResponse(
        res,
        200,
        {},
        "OTP sent successfully"
    );
});

const refreshAccessToken = asyncHandler(async (req, res) => {
    const token =
        req.cookies?.refreshToken ||
        req.header("Authorization")?.replace(
            "Bearer ",
            ""
        );

    if (!token) {
        throw new ApiError(
            401,
            "Unauthorized request"
        );
    }

    try {
        const decodedToken = jwt.verify(
            token,
            config.refreshTokenSecret
        );

        const user = await User.findById(
            decodedToken?._id
        );

        if (!user) {
            throw new ApiError(
                401,
                "Invalid refresh token"
            );
        }

        if (token !== user.refreshToken) {
            throw new ApiError(
                403,
                "Invalid refresh token"
            );
        }

        const {
            accessToken,
            refreshToken,
        } = await generateAccessAndRefreshToken(
            user._id
        );

        res.cookie(
            "accessToken",
            accessToken,
            options
        );

        res.cookie(
            "refreshToken",
            refreshToken,
            options
        );

        return sendResponse(
            res,
            200,
            {},
            "Access and refresh token refreshed successfully!"
        );
    } catch (error) {
        if (error instanceof ApiError) {
            throw error;
        }

        throw new ApiError(
            401,
            error?.message ||
                "Invalid refresh token"
        );
    }
});

export {
    register,
    verifyEmail,
    login,
    logout,
    getCurrentUser,
    requestPasswordReset,
    verifyPasswordResetOtp,
    resetPassword,
    resendOTP,
    refreshAccessToken,
};