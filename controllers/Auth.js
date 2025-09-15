import UserModel from "../models/user.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const Register = async (req, res) => {
  try {
    const { name, email, password, adminSecretKey } = req.body;
    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }
    
    // Determine user role based on admin secret key
    let userRole = "user"; // Default role
    if (adminSecretKey && adminSecretKey === process.env.ADMIN_SECRET_KEY) {
      userRole = "admin";
    }
    
    const profilePath = req.file ? req.file.path : null;
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new UserModel({ 
      name, 
      email, 
      profile: profilePath, 
      password: hashedPassword,
      role: userRole 
    });
    console.log(newUser);
    await newUser.save();
    
    const message = userRole === "admin" 
      ? "Admin registered successfully" 
      : "User registered successfully";
    
    res.status(201).json({ 
      message,
      user: {
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        profile: newUser.profile,
        role: newUser.role
      },
      isAdmin: userRole === "admin"
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const Login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid password" });
    }
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "24h" });
    res.cookie("token", token, { 
      httpOnly: true, 
      secure: process.env.NODE_ENV === 'production', 
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      maxAge: 3 * 24 * 60 * 60 * 1000 
    });
    
    // Don't send password in response
    const userResponse = {
      _id: user._id,
      name: user.name,
      email: user.email,
      profile: user.profile,
      role: user.role
    };
    
    res.status(200).json({ 
      message: "User logged in successfully", 
      token, 
      user: userResponse,
      isAdmin: user.role === "admin"
    });
    
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const Logout = async (req, res) => {
  try {
    res.clearCookie("token");
    res.status(200).json({ message: "User logged out successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getProfile = async (req, res) => {
  try {
    const userResponse = {
      _id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      profile: req.user.profile,
      role: req.user.role
    };
    res.status(200).json({ 
      user: userResponse,
      isAdmin: req.user.role === "admin"
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateProfile = async (req, res) => {
  try {
    const { name, oldPassword, newPassword } = req.body;
    const userId = req.user._id;
    
    console.log("Update profile request body:", req.body);
    console.log("Update profile file:", req.file);
    
    const user = await UserModel.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update name if provided
    if (name) {
      user.name = name;
    }

    // Update profile image if provided
    if (req.file) {
      console.log("Updating profile image to:", req.file.path);
      user.profile = req.file.path;
    } else {
      console.log("No file received in request");
    }

    // Update password if both old and new passwords are provided
    if (oldPassword && newPassword) {
      const isOldPasswordValid = await bcrypt.compare(oldPassword, user.password);
      if (!isOldPasswordValid) {
        return res.status(400).json({ message: "Old password is incorrect" });
      }
      user.password = await bcrypt.hash(newPassword, 10);
    }

    await user.save();

    const userResponse = {
      _id: user._id,
      name: user.name,
      email: user.email,
      profile: user.profile,
      role: user.role
    };

    res.status(200).json({ 
      message: "Profile updated successfully",
      user: userResponse
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Admin function to update any user
const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, role, password } = req.body;
    
    // Check if user exists
    const user = await UserModel.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if email is being changed and if it already exists
    if (email && email !== user.email) {
      const existingUser = await UserModel.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: "Email already exists" });
      }
    }

    // Update user fields
    const updateData = {};
    if (name) updateData.name = name;
    if (email) updateData.email = email;
    if (role) updateData.role = role;
    
    // Update password if provided
    if (password && password.trim() !== "") {
      updateData.password = await bcrypt.hash(password, 10);
    }

    const updatedUser = await UserModel.findByIdAndUpdate(
      id,
      updateData,
      { new: true, select: '-password' }
    );

    res.status(200).json({ 
      message: "User updated successfully",
      user: updatedUser
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Admin function to delete any user
const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Check if user exists
    const user = await UserModel.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Prevent admin from deleting themselves
    if (req.user._id.toString() === id) {
      return res.status(400).json({ message: "You cannot delete your own account" });
    }

    await UserModel.findByIdAndDelete(id);
    
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all users (admin only)
const getAllUsers = async (req, res) => {
  try {
    const users = await UserModel.find({}, '-password');
    res.status(200).json({ 
      message: "Users fetched successfully",
      users 
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export { Register, Login, Logout, getProfile, updateProfile, updateUser, deleteUser, getAllUsers };
