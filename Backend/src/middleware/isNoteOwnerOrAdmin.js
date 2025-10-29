import { Note } from "../models/note.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import mongoose, { isValidObjectId }from "mongoose";

export const isNoteOwnerOrAdmin = asyncHandler(async (req, res, next) => {
        const user = req.user;
        if (!user)
            throw new ApiError(401, "Authentication required");

        const noteId = req.params.noteId;
        if (!noteId || !isValidObjectId(noteId))
        throw new ApiError(400, "Invalid or missing noteId in URL path");

        const note = await Note.findById(noteId);
        if (!note)
            throw new ApiError(404, "Note not found");


        const isOwner = note.owner.toString() === req.user._id.toString();
        const isAdminUser = req.user.role === 'ADMIN';

        if (isAdminUser)
            next();
        else if (isOwner)
            next();
        else
            throw error instanceof ApiError ? error :  new ApiError(403, "Access forbidden: You are not the owner of this note");
});