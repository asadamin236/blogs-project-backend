import BlogModel from "../models/Blog.js";
import fs from "fs";
import path from "path";

const createBlog = async (req, res) => {
  try {
    const { title, description } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: "Image is required" });
    }

    // Convert buffer to base64 string for storage
    const base64Image = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;
    const imagePath = base64Image;
    
    const blog = new BlogModel({ title, description, image: imagePath });
    await blog.save();
    res.status(201).json({ message: "Blog created successfully", blog });
  } catch (error) {
    res.status(500).json({ message: error.message });
    console.log(error);
  }
};

const getAllBlogs = async (req, res) => {
  try {
    const blogs = await BlogModel.find();
    res.status(200).json({ blogs });
    console.log(blogs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getBlogById = async (req, res) => {
  try {
    const { id } = req.params;
    const blog = await BlogModel.findById(id);
    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }
    res.status(200).json({ blog });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateBlog = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description } = req.body;
    
    // Prepare update object
    const updateData = { title, description };
    
    // If a new image is uploaded, include it in the update
    if (req.file) {
      // Convert buffer to base64 string for storage
      const base64Image = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;
      updateData.image = base64Image;
    }
    
    const blog = await BlogModel.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    );
    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }
    res.status(200).json({ message: "Blog updated successfully", blog });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteBlog = async (req, res) => {
  try {
    const { id } = req.params;
    const blog = await BlogModel.findByIdAndDelete(id);
    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }
    res.status(200).json({ message: "Blog deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export { createBlog, getAllBlogs, getBlogById, updateBlog, deleteBlog };
