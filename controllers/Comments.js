import CommentModel from "../models/Comments.js";
import BlogModel from "../models/Blog.js";

const createComment = async (req, res) => {
  try {
    const { post, postId, comment, user, userName } = req.body;
    const blogId = post || postId; // Accept both parameter names
    
    if (!blogId || !comment) {
      return res.status(400).json({ 
        success: false, 
        message: "Post ID and comment are required" 
      });
    }
    
    // Use provided user ID or authenticated user ID
    const userId = user || req.user?._id;
    
    const newComment = new CommentModel({
      post: blogId,
      user: userId || null,
      comment,
      userName: userName || req.user?.name || "Anonymous"
    });
    
    await newComment.save();
    
    // Populate the user data before sending response
    await newComment.populate('user', 'name profile');
    
    const existPost = await BlogModel.findById(blogId);
    if (!existPost) {
      return res.status(404).json({ success: false, message: "Post not found" });
    }
    existPost.comments.push(newComment._id);
    await existPost.save();
    
    res.status(200).json({ 
      success: true, 
      message: "Comment added successfully", 
      comment: newComment 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: "Internal Server Error",
      error: error.message 
    });
  }
};

const createCommentTest = async (req, res) => {
  try {
    const { post, user, comment } = req.body;
    
    if (!post || !user || !comment) {
      return res.status(400).json({ 
        success: false, 
        message: "Post ID, User ID, and comment are required" 
      });
    }
    
    const newComment = new CommentModel({
      post,
      user,
      comment
    });
    
    await newComment.save();
    
    const existPost = await BlogModel.findById(post);
    if (!existPost) {
      return res.status(404).json({ success: false, message: "Post not found" });
    }
    existPost.comments.push(newComment._id);
    await existPost.save();
    
    res.status(200).json({ 
      success: true, 
      message: "Comment added successfully", 
      comment: newComment 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: "Internal Server Error",
      error: error.message 
    });
  }
};

export { createComment, createCommentTest };