// File: src/utils/asyncHandler.js

const asyncHandler = (fn) => async (req, res, next) => {
  try {
    await fn(req, res, next);
  } catch (err) {
    // FIX: Explicitly check for MongoDB duplicate key error (code 11000)
    const statusCode =
      err.code === 11000
        ? 409 // Map 11000 (Duplicate Key) to 409 Conflict
        : err.code || 500; // Use the provided code or default to 500

    res.status(statusCode).json({
      success: false,
      message: err.message || "Internal Server Error",
    });
  }
};

export { asyncHandler };
