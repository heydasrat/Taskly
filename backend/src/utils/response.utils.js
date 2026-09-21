import ApiResponse from "./ApiResponse.js"

export function sendResponse(res, statusCode, data, message) {
    return res.status(statusCode).json(
        new ApiResponse(
            statusCode,
            data,
            message
        )
    )
}