# Notes API - Scalable REST API with Authentication & Role-Based Access

A production-ready backend system built with Node.js and Express.js featuring JWT authentication, role-based authorization, and CRUD operations for a notes management system. This project demonstrates secure API design, scalable architecture, and clean code practices.

## 🚀 Features Implemented

### Core Backend Features
- ✅ **User Authentication System**
  - User registration with password hashing (bcrypt)
  - Secure login with JWT token generation
  - Token refresh mechanism
  - Logout functionality with token invalidation
  
- ✅ **Role-Based Access Control (RBAC)**
  - User role management (User/Admin)
  - Protected routes with middleware authentication
  - Admin-only operations for user management
  
- ✅ **Notes CRUD Operations**
  - Create, Read, Update, Delete notes
  - User-specific note ownership
  - Admin can manage all notes
  
- ✅ **API Versioning**
  - Version 1 API structure (/api/v1)
  - Scalable for future versions
  
- ✅ **Security Features**
  - Password hashing with bcrypt
  - JWT token authentication
  - HTTP-only cookies for token storage
  - CORS protection
  - Input validation and sanitization
  - Request size limits (16kb)
  
- ✅ **Error Handling**
  - Custom ApiError and ApiResponse classes
  - Async error handling wrapper
  - Consistent error response format

### Additional Features
- Health check endpoint
- Modular project structure
- Environment-based configuration
- RESTful API design principles

## 🛠️ Tech Stack

**Backend Framework:**
- Node.js
- Express.js

**Database:**
- MongoDB with Mongoose ODM

**Authentication:**
- JSON Web Tokens (JWT)
- bcrypt for password hashing

**Security:**
- cookie-parser
- cors

**Development Tools:**
- ES6 Modules
- dotenv for environment variables

## 📁 Project Structure
backend/
├── src/
│ ├── controllers/
│ │ ├── user.controller.js # User authentication & profile
│ │ ├── admin.controller.js # Admin operations
│ │ └── note.controller.js # Notes CRUD operations
│ ├── models/
│ │ ├── user.model.js # User schema with methods
│ │ └── note.model.js # Note schema
│ ├── routes/
│ │ ├── user.routes.js # User endpoints
│ │ ├── admin.routes.js # Admin endpoints
│ │ └── note.routes.js # Note endpoints
│ ├── middlewares/
│ │ ├── auth.middleware.js # JWT verification
│ │ ├── isAdmin.middleware.js # Admin role check
│ │ └── isNoteOwnerOrAdmin.js # Note ownership check
│ ├── utils/
│ │ ├── asyncHandler.js # Async error wrapper
│ │ ├── ApiError.js # Custom error class
│ │ └── ApiResponse.js # Standardized response
│ ├── db/
│ │ └── index.js # Database connection
│ ├── app.js # Express app configuration
│ └── index.js # Server entry point
├── .env # Environment variables
├── .env.example # Environment template
├── package.json
└── README.md


🔧 Installation & Setup
Prerequisites
Before you begin, ensure you have the following installed on your system:

Node.js (v18 or higher)

MongoDB Atlas Account (Free Tier M0 cluster is sufficient)

npm or yarn package manager

Step 1: Clone & Install
Clone the repository:

bash
git clone [YOUR_REPO_URL]
cd Backend
Install dependencies:

bash
npm install
Step 2: Environment Configuration
Create a .env file in the root directory with the following variables:

text
# Server Configuration
PORT=8000
FRONTEND_URL=http://localhost:3000

# Database
MONGODB_URI=mongodb+srv://username:password@cluster0.abcde.mongodb.net/notedb

# JWT Secrets (Generate using: node -e "console.log(require('crypto').randomBytes(64).toString('hex'))")
ACCESS_TOKEN_SECRET=your_access_token_secret_here
REFRESH_TOKEN_SECRET=your_refresh_token_secret_here

# Token Expiry
ACCESS_TOKEN_EXPIRY=1d
REFRESH_TOKEN_EXPIRY=10d
Environment Variables Reference
Variable	Description	Example
PORT	Server port number	8000
FRONTEND_URL	Frontend URL for CORS configuration	http://localhost:3000
MONGODB_URI	MongoDB Atlas connection string	mongodb+srv://user:pass@cluster.mongodb.net/notedb
ACCESS_TOKEN_SECRET	Secret key for signing access tokens	64-character random string
REFRESH_TOKEN_SECRET	Secret key for signing refresh tokens	64-character random string
ACCESS_TOKEN_EXPIRY	Access token validity period	1d (1 day)
REFRESH_TOKEN_EXPIRY	Refresh token validity period	10d (10 days)
🔐 Generate Secure Secrets:

bash
# Run this command to generate a secure random secret
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
Step 3: MongoDB Atlas Setup
Create a MongoDB Atlas account at https://www.mongodb.com/cloud/atlas

Create a new cluster (Free M0 tier is sufficient)

Create a database user with password

Whitelist your IP address (or use 0.0.0.0/0 for development)

Get your connection string and replace in .env:

text
mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/notedb?retryWrites=true&w=majority
Step 4: Run the Application
Development mode with auto-restart:

bash
npm run dev
Production mode:

bash
npm start
Expected output:

text
Server is running at port: 8000
✅ MongoDB connected! DB HOST: cluster0-shard-00-01.xxxxx.mongodb.net
The API will be accessible at http://localhost:8000

