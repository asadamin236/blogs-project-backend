import express from "express";
import { createBlog, deleteBlog, getAllBlogs, getBlogById, updateBlog } from "../controllers/Blog.js";
import isAdmin from "../middlewares/isAdmin.js";
import upload from "../middlewares/Multer.js";
import multerErrorHandler from "../middlewares/multerErrorHandler.js";

const BlogRoutes = express.Router();

// Admin-only routes (protected)
BlogRoutes.post("/create", isAdmin, upload.single("image"), multerErrorHandler, createBlog);
BlogRoutes.put("/:id", isAdmin, upload.single("image"), multerErrorHandler, updateBlog);
BlogRoutes.delete("/:id", isAdmin, deleteBlog);

// Public routes (users can view)
BlogRoutes.get("/all", getAllBlogs);
BlogRoutes.get("/:id", getBlogById);

export default BlogRoutes;
