import jwt from "jsonwebtoken";
import UserModel from "../models/user.js";

const isAuthenticated = async (req, res, next) => {
    try {
        const token = req.cookies.token;
        if (!token) {
            return res.status(401).json({ message: "Unauthorized - Please login first" });
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await UserModel.findById(decoded.id);
        if (!user) {
            return res.status(401).json({ message: "Unauthorized - User not found" });
        }
        req.user = user;
        next();
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export default isAuthenticated;
