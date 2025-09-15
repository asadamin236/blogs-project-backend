import express from "express";
import { createComment, createCommentTest } from "../controllers/Comments.js";

const CommentRoutes = express.Router();

CommentRoutes.post("/addcomment", createComment);
CommentRoutes.post("/create", createComment);
// Test route without authentication
CommentRoutes.post("/test", createCommentTest);

export default CommentRoutes;