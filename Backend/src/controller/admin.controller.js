import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";
import { Note } from "../models/note.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import mongoose, { isValidObjectId } from "mongoose";

const updateRole = asyncHandler(async (req, res) => {
    try {
        const userId = req.params.userId;
        let { role } = req.body;
        role = role?.trim().toUpperCase();
        const VALID_ROLES = ['USER', 'ADMIN'];



        if (!role)
            throw new ApiError(400, "Role is required");

        if (!isValidObjectId(userId))
            throw new ApiError(400, "Invalid userId");

        if (!VALID_ROLES.includes(role))
            throw new ApiError(400, `Invalid role value. Must be one of: ${VALID_ROLES.join(', ')}`);

        if (req.user._id.toString() === userId.toString()) {
            throw new ApiError(403, "Admins cannot change their own role via this route.");
        }

        const user = await User.findByIdAndUpdate(
            userId,
            {
                $set: { role }
            },
            { new: true }
        )
        .select("-password -refreshToken");
        if (!user)
            throw new ApiError(404, "User not found");

        res.status(200).json(new ApiResponse(200, user, "User role updated successfully"));
    } catch (error) {
        throw error instanceof ApiError ? error : new ApiError(500, "Internal server error - updateRole");
    }

});

const deleteAccount = asyncHandler(async (req, res) => {
    try {
        const userId = req.params.userId;

        if (!isValidObjectId(userId))
            throw new ApiError(400, "Invalid userId");

        if (req.user._id.toString() === userId.toString())
            throw new ApiError(400, "Cannot delete yourself");

        const notes = await Note.deleteMany({ owner: userId });

        const user = await User.findByIdAndDelete(userId);
        if (!user)
            throw new ApiError(404, "User not found");        

        res.status(200).json(new ApiResponse(204, null, `User and ${notes.deletedCount} associated notes deleted successfully`));
    } catch (error) {
        throw error instanceof ApiError ? error : new ApiError(500, "Internal server error - deleteAccount");
    }
});

const deleteAllNotes = asyncHandler(async (req, res) => {
    try {
        const notes = await Note.deleteMany();
        if (!notes || notes.acknowledged === false)
            throw new ApiError(404, "Failed to delete all notes");

        res.status(204).json(new ApiResponse(204, null, `All ${notes.deletedCount} notes deleted successfully`));
    } catch (error) {
        throw error instanceof ApiError ? error : new ApiError(500, "Internal server error - deleteAllNotes");
    }
});

export {
    updateRole,
    deleteAccount,
    deleteAllNotes
};

