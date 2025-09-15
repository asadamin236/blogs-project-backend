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
connectDB();

const port = process.env.PORT || 8000;
const app = express();

const corsOptions = {
    origin: true,
    credentials: true,
}
app.use(express.json());
app.use(cookieParser());
app.use(cors(corsOptions));
app.get("/", (req, res) => {
    res.send("Hello World!");
});

// Serve static files from public directory
app.use("/public", express.static("public"));

app.use("/api/auth", AuthRoutes);
app.use("/api/blog", BlogRoutes);
app.use("/dashboard", DashboardRoutes)
app.use("/api/comments", CommentsRoutes);
app.use("/api/public", PublicRoutes);


// For Vercel deployment, export the app instead of listening
if (process.env.NODE_ENV !== 'production') {
    app.listen(port, () => {
        console.log(`Server running on port ${port}`);
    });
}

// Export the Express app for Vercel
export default app;
