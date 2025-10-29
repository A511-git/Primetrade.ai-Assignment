import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

const generateAccessAndRefreshToken = async (userId) => {
    const user = await User.findById(userId);
    if (!user) throw new ApiError(404, "User not found");
    
    try {
        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();
        
        if (!accessToken || !refreshToken)
            throw new ApiError(500, "Access & Refresh token generation failed"); // Changed 400 to 500

        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false });
        
        return {
            accessToken,
            refreshToken,
        };
    } catch (error) {
        throw error instanceof ApiError ? error : new ApiError(500, "Access & Refresh token generation failed");
    }
};

const registerUser = asyncHandler(async (req, res) => {
    try {
        const { username, email, fullName, password } = req.body;
    
        if (
            [username, email, fullName, password].some((field) => field?.trim() === "")
        ) {
            throw new ApiError(400, "All fields are required");
        }
    
        const [existedUserByUserName, existedUserByEmail] = await Promise.all([
            User.findOne({ username: username.trim().toLowerCase() }), 
            User.findOne({ email: email.trim().toLowerCase() }),
        ]);
        
        if (existedUserByUserName) throw new ApiError(409, "Username already exists");
        if (existedUserByEmail) throw new ApiError(409, "Email already exists");
    
        
        const createdUser = await User.create({
            fullName,
            email: email.trim().toLowerCase(),
            password,
            username: username.trim().toLowerCase(),
        });
    
        const user = await User.findById(createdUser._id).select("-password -refreshToken");
    
        if (!user) throw new ApiError(500, "User registration in DB failed"); // Changed 400 to 500
    
        res.status(201).json(new ApiResponse(201, user, "User created successfully"));
    } catch (error) {
        throw error instanceof ApiError ? error : new ApiError(500, "Internal server error - registerUser");
    }
});

const loginUser = asyncHandler(async (req, res) => {
    try {
        const { email, password } = req.body;
        if ([email, password].some((field) => field.trim() === ""))
            throw new ApiError(400, "All fields are required");
    
        const user = await User.findOne({ email: email.trim().toLowerCase() }); 
        if (!user) throw new ApiError(404, "User not found");
    
        const isPasswordCorrect = await user.isPasswordCorrect(password);
    
        if (!isPasswordCorrect) throw new ApiError(401, "Invalid credentials");
    
        const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
            user._id
        );
    
        const loggedInUser = await User.findById(user._id).select(
            "-password -refreshToken"
        );
    
        const cookieOptions = {
            httpOnly: true,
            secure: true,
        };
    
        return res
            .status(200)
            .cookie("accessToken", accessToken, cookieOptions)
            .cookie("refreshToken", refreshToken, cookieOptions)
            .json(
                new ApiResponse(
                    200,
                    { accessToken, refreshToken, loggedInUser },
                    "Login successful"
                )
            );
    } catch (error) {
        throw error instanceof ApiError ? error : new ApiError(500, "Internal server error - loginUser");
    }
});

const logoutUser = asyncHandler(async (req, res) => {
    try {
        await User.findByIdAndUpdate(
            req.user._id,
            {
                $unset: {
                    refreshToken: 1,
                },
            },
            { new: true }
        );
    
        const cookieOptions = {
            httpOnly: true,
            secure: true,
        };
    
        return res
            .status(200)
            .clearCookie("accessToken", cookieOptions)
            .clearCookie("refreshToken", cookieOptions)
            .json(new ApiResponse(200, null, "Logout successful"));
    } catch (error) {
        throw error instanceof ApiError ? error : new ApiError(500, "Internal server error - logoutUser");
    }
});

const refreshAccessToken = asyncHandler(async (req, res) => {
    try {
        const incomingRefreshToken =
            req.cookies.refreshToken || req.body.refreshToken;
        if (!incomingRefreshToken)
            throw new ApiError(400, "Refresh token is required");

        const decodedIncomingRefreshToken = jwt.verify(
            incomingRefreshToken,
            process.env.REFRESH_TOKEN_SECRET
        );

        let user = await User.findById(decodedIncomingRefreshToken._id);

        if (!user) throw new ApiError(404, "User not found");

        if (user.refreshToken !== incomingRefreshToken)
            throw new ApiError(401, "Expired or Used refresh token");

        const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
            user._id
        );

        const cookieOptions = {
            httpOnly: true,
            secure: true,
        };

        return res
            .status(200)
            .cookie("accessToken", accessToken, cookieOptions)
            .cookie("refreshToken", refreshToken, cookieOptions)
            .json(
                new ApiResponse(
                    200,
                    { accessToken, refreshToken },
                    "Access token refreshed successfully"
                )
            );
    } catch (error) {
        throw error instanceof ApiError ? error : new ApiError(500, "Internal server error - refreshAccessToken");
    }
});

const changePassword = asyncHandler(async (req, res) => {

    try {
        const { oldPassword, newPassword } = req.body;

        if ([oldPassword, newPassword].some((field) => field.trim() === ""))
            throw new ApiError(400, "All fields are required");

        const user = await User.findById(req.user._id);
        if (!user) throw new ApiError(404, "User not found");

        if (newPassword.trim() === oldPassword.trim()) 
             throw new ApiError(400, "New password cannot be same as old password");

        const isPasswordCorrect = await user.isPasswordCorrect(oldPassword)

        if (!isPasswordCorrect)
            throw new ApiError(401, "Invalid credentials");

        user.password = newPassword;
        const savedUser = await user.save({ validateBeforeSave: true }); 

        if (!savedUser) throw new ApiError(500, "Password change failed"); // Changed 400 to 500

        return res
            .status(200)
            .json(new ApiResponse(200, null, "Password changed successfully"));
    } catch (error) {
        throw error instanceof ApiError ? error : new ApiError(500, "Internal server error - changePassword");
    }
});

const getUser = asyncHandler(async (req, res) => {

    try {
        const user = await User.findById(req.user._id).select("-password -refreshToken");
        if (!user) throw new ApiError(404, "User not found");
        
        return res.status(200).json(new ApiResponse(200, user, "User fetched successfully"));
    }
    catch (error) {
        throw error instanceof ApiError ? error : new ApiError(500, "Internal server error - getUser");
    }
});

const updateAccountDetails = asyncHandler(async (req, res) => {

    try {
        let { username, email, fullName } = req.body;
        username = username?.trim().toLowerCase();
        email = email?.trim().toLowerCase();
        fullName = fullName?.trim();

        if (!username && !email && !fullName) {
             throw new ApiError(400, "At least one field (username, email, or fullName) is required for update");
        }

        const fetchedUser = await User.findById(req.user._id);
        if (!fetchedUser)
            throw new ApiError(404, "User not found");


        if (username && username !== fetchedUser.username) {
            const existedUserByUserName = await User
                .findOne({
                    username,
                    _id: { $ne: fetchedUser._id }
                });
            if (existedUserByUserName)
                throw new ApiError(409, "Username already exists");
            fetchedUser.username = username;
        }

        if (email && email !== fetchedUser.email) {
            const existedUserByEmail = await User
                .findOne({
                    email,
                    _id: { $ne: fetchedUser._id }
                });
            if (existedUserByEmail)
                throw new ApiError(409, "Email already exists");
            fetchedUser.email = email;
        }

        if (fullName)
            fetchedUser.fullName = fullName;

        // FIX: Set validateBeforeSave to TRUE to run Mongoose unique validators
        const isUpdated = await fetchedUser.save({ validateBeforeSave: true }); 

        if (!isUpdated)
            throw new ApiError(500, "User update failed"); // Changed 400 to 500

        // FIX: The select method is correctly used on the Mongoose document here, but 
        // calling .select on the document and then using await is unusual. 
        // We'll use .toObject() and delete properties for the response.
        const updatedUser = isUpdated.toObject();
        delete updatedUser.password;
        delete updatedUser.refreshToken;


        res.status(200).json(new ApiResponse(200, updatedUser, "User updated successfully"));
    }
    catch (error) {
        throw error instanceof ApiError ? error : new ApiError(500, "Internal server error - updateAccountDetails");
    }
});

export {
    registerUser,
    loginUser,
    logoutUser,
    refreshAccessToken,
    changePassword,
    getUser,
    updateAccountDetails
};