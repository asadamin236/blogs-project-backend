import jwt from "jsonwebtoken";
import UserModel from "../models/user.js";

const isAdmin = async (req, res, next) => {
  try {
    // Try to get token from cookies first, then from Authorization header
    let token = req.cookies.token;
    
    if (!token) {
      const authHeader = req.headers.authorization;
      if (authHeader && authHeader.startsWith('Bearer ')) {
        token = authHeader.substring(7);
      }
    }
    
    if (!token) {
      return res
        .status(401)
        .json({ message: "Unauthorized - No token provided" });
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const FindUser = await UserModel.findById(decoded.id);
    if (!FindUser) {
      return res.status(401).json({ message: "Unauthorized - User not found" });
    }
    if (FindUser.role !== "admin") {
      return res
        .status(403)
        .json({ message: "Forbidden - Admin access required" });
    }
    req.user = FindUser;
    next();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const isLogin = async (req, res, next) => {
  try {
    // Try to get token from cookies first, then from Authorization header
    let token = req.cookies.token;
    
    if (!token) {
      const authHeader = req.headers.authorization;
      if (authHeader && authHeader.startsWith('Bearer ')) {
        token = authHeader.substring(7);
      }
    }
    
    if (!token) {
      return res
        .status(401)
        .json({ message: "Unauthorized - No token provided" });
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const FindUser = await UserModel.findById(decoded.id);
    if (!FindUser) {
      return res.status(401).json({ message: "Unauthorized - User not found" });
    }
    // For isLogin, we only check if user is authenticated (any role is allowed)
    req.user = FindUser;
    next();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export default isAdmin;
export { isLogin };
