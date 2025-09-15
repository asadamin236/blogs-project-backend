import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import AuthRoutes from "./routes/Auth.js";
import cookieParser from "cookie-parser";
import BlogRoutes from "./routes/Blog.js";
import DashboardRoutes from "./routes/Dashboard.js";
import CommentsRoutes from "./routes/Comments.js";
import PublicRoutes from "./routes/Public.js";
import cors from "cors";

dotenv.config();

const app = express();

// MongoDB connection for serverless with proper configuration
const connectDB = async () => {
  if (mongoose.connections[0].readyState) {
    return mongoose.connections[0];
  }
  
  try {
    const connection = await mongoose.connect(process.env.MongoDB, {
      bufferCommands: false,
      maxPoolSize: 5,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      family: 4
    });
    console.log("MongoDB connected");
    return connection;
  } catch (error) {
    console.error("MongoDB connection error:", error);
    throw error;
  }
};

const corsOptions = {
    origin: true,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Cookie']
}

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors(corsOptions));
app.get("/", (req, res) => {
    res.json({ message: "Blog API is running!", status: "success" });
});

// Test endpoint without database
app.get("/test", (req, res) => {
    res.json({ message: "Test endpoint working", timestamp: new Date().toISOString() });
});

// Database connection test endpoint
app.get("/db-test", async (req, res) => {
  try {
    await connectDB();
    res.json({ message: "Database connection successful", status: "connected" });
  } catch (error) {
    console.error("Database connection test failed:", error);
    res.status(500).json({ message: "Database connection failed", error: error.message });
  }
});

// Database connection middleware for API routes only
const dbMiddleware = async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (error) {
    console.error("Database connection failed:", error);
    res.status(500).json({ message: "Database connection failed", error: error.message });
  }
};

app.use("/api/auth", dbMiddleware, AuthRoutes);
app.use("/api/blog", dbMiddleware, BlogRoutes);
app.use("/dashboard", dbMiddleware, DashboardRoutes);
app.use("/api/comments", dbMiddleware, CommentsRoutes);
app.use("/api/public", dbMiddleware, PublicRoutes);

// Basic error handling
app.use((error, req, res, next) => {
  console.error('Error:', error);
  res.status(500).json({ message: 'Internal server error' });
});

// Export the Express app for Vercel
export default app;
