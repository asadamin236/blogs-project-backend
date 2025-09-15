import UserModel from "../models/user.js";
import PostModel from "../models/Blog.js";
import CommentModel from "../models/Comments.js";
import fs from "fs";
import path from "path";

const getAllData = async (req, res) => {
  try {
    const Users = await UserModel.find();
    const Posts = await PostModel.find();
    const Comments = await CommentModel.find();

    if (!Users && !Posts) {
      return res.status(400).json({ success: false, message: "No Data Found" });
    }
    res
      .status(200)
      .json({ success: true, message: "Data Found", Users, Posts, Comments });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const Users = await UserModel.find();

    if (!Users) {
      return res.status(400).json({ success: false, message: "No Data Found" });
    }
    res.status(200).json({ success: true, message: "Data Found", Users });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

const deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const existUser = await UserModel.findById(userId);
    if (!existUser) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    if (existUser.role == "admin") {
      return res
        .status(403)
        .json({ success: false, message: "You can't delete admin" });
    }
    if (existUser.profile) {
      try {
        // existUser.profile already contains the full path like "public/images/filename.png"
        fs.unlinkSync(existUser.profile);
        console.log("Image Deleted Successfully");
      } catch (err) {
        console.log("Image Deletion Failed", err);
      }
    }
    const deletedUser = await UserModel.findByIdAndDelete(userId);
    res.status(200).json({
      success: true,
      message: "User deleted successfully",
      deletedUser,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export { getAllData, getAllUsers, deleteUser };
