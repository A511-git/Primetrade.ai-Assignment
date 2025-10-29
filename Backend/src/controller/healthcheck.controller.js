import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"


export const healthcheck = asyncHandler(async (req, res) => {
    try {
        res.status(200).json({ status: 'OK' });
    } catch (error) {
        throw error instanceof ApiError ? error :  new ApiError(500, "Healthcheck failed");
    }
})

