import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import User from "../models/user.model.js";
import uploadOnCloudinary from "../utils/uploadOnCloudinary.js";
import { v2 as cloudinary } from "cloudinary";
import { sendResponse } from "../utils/response.utils.js";
import { publicUserObj } from "../utils/user.utils.js";

const options = {
    secure: true,
    httpOnly: true,
    sameSite: "strict",
};

const updateProfile = asyncHandler(async (req, res) => {
    const { username, fullName } = req.body;

    const user = await User.findById(req.user._id);

    if (!user) {
        throw new ApiError(404, "User not found");
    }

    if (username !== undefined) {
        const newUsername = username.trim().toLowerCase();

        if (!newUsername) {
            throw new ApiError(400, "Username cannot be empty");
        }

        if (newUsername !== user.username) {
            const existingUser = await User.findOne({
                username: newUsername,
                _id: { $ne: user._id },
            });

            if (existingUser) {
                throw new ApiError(409, "Username is already taken");
            }

            user.username = newUsername;
        }
    }

    if (fullName !== undefined) {
        const newFullName = fullName.trim();

        if (!newFullName) {
            throw new ApiError(400, "Full name cannot be empty");
        }

        user.fullName = newFullName;
    }

    const avatarLocalObject = req.files?.avatar?.[0];

    let oldAvatarPublicId = null;

    if (avatarLocalObject) {
        if (avatarLocalObject.mimetype !== "image/jpeg") {
            throw new ApiError(400, "Only JPEG images are allowed for avatar");
        }

        const avatar = await uploadOnCloudinary(avatarLocalObject.path);

        if (!avatar) {
            throw new ApiError(
                500,
                "Something went wrong while uploading your avatar"
            );
        }

        oldAvatarPublicId = user.avatar?.public_id;

        user.avatar = {
            url: avatar.secure_url,
            public_id: avatar.public_id,
        };
    }

    await user.save();

    if (oldAvatarPublicId) {
        await cloudinary.uploader.destroy(oldAvatarPublicId);
    }

    const safeUser = publicUserObj(user);

    return sendResponse(
        res,
        200,
        safeUser,
        "Profile updated successfully"
    );
});

const changePassword = asyncHandler(async (req, res) => {
    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || oldPassword.trim() === "") {
        throw new ApiError(400, "Invalid current password");
    }

    if (!newPassword || newPassword.trim() === "") {
        throw new ApiError(400, "Invalid new password");
    }

    const user = await User.findById(req.user._id);

    if (!user) {
        throw new ApiError(404, "User not found");
    }

    const isPasswordCorrect = await user.isPasswordCorrect(oldPassword);

    if (!isPasswordCorrect) {
        throw new ApiError(401, "Incorrect current password");
    }

    user.refreshToken = null;
    user.password = newPassword;

    await user.save();

    res.clearCookie("accessToken", options);
    res.clearCookie("refreshToken", options);

    return sendResponse(
        res,
        200,
        null,
        "User password changed successfully"
    );
});

const deleteAvatar = asyncHandler(async (req, res) => {
    const user = await User.findOne({
        _id: req.user._id,
        isVerified: true,
    });

    if (!user) {
        throw new ApiError(404, "User not found");
    }

    if (!user.avatar?.public_id) {
        throw new ApiError(404, "No avatar found");
    }

    await cloudinary.uploader.destroy(user.avatar.public_id);

    user.avatar.url = null;
    user.avatar.public_id = null;

    await user.save();

    return sendResponse(
        res,
        200,
        {},
        "Avatar removed successfully"
    );
});

const toggleTheme = asyncHandler(async (req, res) => {
    const { theme } = req.body;

    const allowedThemes = ["light", "dark", "system"];

    if (!theme || !allowedThemes.includes(theme)) {
        throw new ApiError(400, "Invalid theme");
    }

    const user = await User.findByIdAndUpdate(
        req.user._id,
        {
            $set: {
                "preferences.theme": theme,
            },
        },
        {
           returnDocument: "after",
        }
    );

    if (!user) {
        throw new ApiError(404, "User not found");
    }

    const safeUser = publicUserObj(user);

    return sendResponse(
        res,
        200,
        safeUser,
        "Theme changed successfully"
    );
});

export {
    changePassword,
    updateProfile,
    deleteAvatar,
    toggleTheme,
};