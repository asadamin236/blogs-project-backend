import express from "express";
import { createComment, createCommentTest } from "../controllers/Comments.js";
import { isLogin } from "../middlewares/isAdmin.js";

const CommentRoutes = express.Router();

CommentRoutes.post("/addcomment", isLogin, createComment);
CommentRoutes.post("/create", isLogin, createComment);
// Test route without authentication
CommentRoutes.post("/test", createCommentTest);

export default CommentRoutes;