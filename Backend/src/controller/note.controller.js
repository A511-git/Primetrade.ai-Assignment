import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Note } from "../models/note.model.js";
import mongoose,{isValidObjectId} from "mongoose";


const createNote = asyncHandler(async (req, res) => {
    try {
        let  { title, content } = req.body;
        title = title?.trim();
        content = content?.trim();
        if (!title || !content)
            throw new ApiError(400, "All fields are required");

        const userId = req.user._id; 
        
        const user = await User.findById(userId); 
        if (!user)
            throw new ApiError(404, "User not found");

        const note = await Note.create({
            owner: userId,
            title,
            content
        });

        if (!note)
            throw new ApiError(500, "Note creation failed"); 

        res.status(201).json(new ApiResponse(201, note, "Note created successfully"));
    } catch (error) {
        throw new ApiError(500, "Internal server error - createNote");
    }
});

const getNote = asyncHandler(async (req, res) => {
    try {
        const noteId = req.params.noteId;
        if (!isValidObjectId(noteId))
            throw new ApiError(400, "Invalid noteId");

        const note = await Note.findById(noteId);
        if (!note)
            throw new ApiError(404, "Note not found");

        res.status(200).json(new ApiResponse(200, note, "Note fetched successfully"));
    } catch (error) {
        throw error instanceof ApiError ? error :  new ApiError(500, "Internal server error - getNote");
    }
});

const getUserNotes = asyncHandler(async (req, res) => {
    try {
        const userId = req.params.userId;
        if (!isValidObjectId(userId))
            throw new ApiError(400, "Invalid userId")
        
        const notes = await Note.find({ owner: userId });

        res.status(200).json(new ApiResponse(200, notes, "Notes fetched successfully"));

    } catch (error) {
        throw error instanceof ApiError ? error :  new ApiError(500, "Internal server error - getAllNotes");
    }
});

const updateNote = asyncHandler(async (req, res) => {
    try {
        const noteId = req.params.noteId;
        const { title, content } = req.body;

        
        if(!title && !content)
            throw new ApiError(400, "At least one field is required");

        const updateFields = {};
        if (title) updateFields.title = title.trim();
        if (content) updateFields.content = content.trim();

        const note = await Note.findByIdAndUpdate(
            noteId,
            {
                $set: updateFields
            },
            { new: true }
        );

        if (!note)
            throw new ApiError(404, "Note not found");

        res.status(200).json(new ApiResponse(200, note, "Note updated successfully"));
    } catch (error) {
        throw error instanceof ApiError ? error :  new ApiError(500, "Internal server error - updateNote");
    }
});

const deleteNote = asyncHandler(async (req, res) => {
    try {
        const noteId = req.params.noteId;
        
        const note = await Note.findByIdAndDelete(noteId);

        if (!note)
            throw new ApiError(404, "Note not found");

        res.status(200).json(new ApiResponse(204, null, "Note deleted successfully"));
    } catch (error) {
        throw error instanceof ApiError ? error :  new ApiError(500, "Internal server error - deleteNote");
    }
});

const getAllAvailableNotes = asyncHandler(async (req, res) => {
    try {
        // Fetch all documents from the Note collection
        const notes = await Note.find(); 
        
        // Even if the array is empty, the fetch was successful (200 OK with empty array)
        res.status(200).json(new ApiResponse(200, notes, "All available notes fetched successfully"));

    } catch (error) {
        throw error instanceof ApiError ? error :  new ApiError(500, "Internal server error - getAllAvailableNotes");
    }
});


export {
    createNote,
    getNote,
    getUserNotes,
    updateNote,
    deleteNote,
    getAllAvailableNotes

}