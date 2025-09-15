import express from "express";
import dotenv from "dotenv";
import connectDB from "./utils/db.js";
import AuthRoutes from "./routes/Auth.js";
import cookieParser from "cookie-parser";
import BlogRoutes from "./routes/Blog.js";
import DashboardRoutes from "./routes/Dashboard.js";
import CommentsRoutes from "./routes/Comments.js";
import PublicRoutes from "./routes/Public.js";
import cors from "cors";

dotenv.config();

const port = process.env.PORT || 8000;
const app = express();

// Initialize database connection for serverless
let isConnected = false;
const initDB = async () => {
  if (!isConnected) {
    try {
      await connectDB();
      isConnected = true;
    } catch (error) {
      console.error('Database connection failed:', error);
    }
  }
};

const corsOptions = {
    origin: process.env.NODE_ENV === 'production' 
      ? ['https://your-frontend-domain.vercel.app', 'https://your-custom-domain.com']
      : true,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Cookie']
}

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());
app.use(cors(corsOptions));
app.get("/", (req, res) => {
    res.send("Hello World!");
});

// Serve static files from public directory
app.use("/public", express.static("public"));

// Middleware to initialize DB connection for each request
app.use(async (req, res, next) => {
  await initDB();
  next();
});

app.use("/api/auth", AuthRoutes);
app.use("/api/blog", BlogRoutes);
app.use("/dashboard", DashboardRoutes);
app.use("/api/comments", CommentsRoutes);
app.use("/api/public", PublicRoutes);

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('Error:', error);
  res.status(500).json({ 
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// For Vercel deployment, export the app instead of listening
if (process.env.NODE_ENV !== 'production') {
    app.listen(port, () => {
        console.log(`Server running on port ${port}`);
    });
}

// Export the Express app for Vercel
export default app;
