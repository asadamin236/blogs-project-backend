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

// Simple MongoDB connection for serverless
const connectDB = async () => {
  if (mongoose.connections[0].readyState) {
    return;
  }
  
  try {
    await mongoose.connect(process.env.MongoDB);
    console.log("MongoDB connected");
  } catch (error) {
    console.error("MongoDB connection error:", error);
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

// Initialize DB connection with error handling
try {
    connectDB();
} catch (error) {
    console.error("Failed to connect to database:", error);
}

app.use("/api/auth", AuthRoutes);
app.use("/api/blog", BlogRoutes);
app.use("/dashboard", DashboardRoutes);
app.use("/api/comments", CommentsRoutes);
app.use("/api/public", PublicRoutes);

// Basic error handling
app.use((error, req, res, next) => {
  console.error('Error:', error);
  res.status(500).json({ message: 'Internal server error' });
});

// Export the Express app for Vercel
export default app;
