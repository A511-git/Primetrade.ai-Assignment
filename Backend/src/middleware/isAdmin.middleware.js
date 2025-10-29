import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import mongoose from "mongoose";


export const isAdmin = asyncHandler(async (req, res, next) => {
    try {
        const user = req.user;
        if(!user)
            throw new ApiError(401, "Authentication required");

        if(user.role !== "ADMIN")
            throw new ApiError(403, "Access forbidden: Requires Admin privileges");

        next();        
    } catch (error) {
        throw error instanceof ApiError ? error :  new ApiError(500, "Internal server error - isAdmin");           
    }
});