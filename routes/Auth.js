import express from "express";
import { Register, Login, Logout, getProfile, updateProfile, updateUser, deleteUser, getAllUsers } from "../controllers/Auth.js";
import upload from "../middlewares/Multer.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import isAdmin from "../middlewares/isAdmin.js";

const AuthRoutes = express.Router();

AuthRoutes.post("/register", upload.single("profile"), Register);
AuthRoutes.post("/login", Login);
AuthRoutes.post("/logout", Logout);
AuthRoutes.get("/profile", isAuthenticated, getProfile);
AuthRoutes.patch("/profile", isAuthenticated, upload.single("image"), updateProfile);

// Admin-only user management routes
AuthRoutes.get("/users", isAdmin, getAllUsers);
AuthRoutes.put("/users/:id", isAdmin, updateUser);
AuthRoutes.delete("/users/:id", isAdmin, deleteUser);

export default AuthRoutes;
