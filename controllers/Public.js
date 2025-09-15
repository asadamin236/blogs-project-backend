import BlogModel from "../models/Blog.js";

const GetSinglePost = async (req, res) => {
    try {
        const post_id = req.params.id;
        const post = await BlogModel.findById(post_id).populate({
            path: "comments", 
            populate: { path: "user" }
        });
        
        if (!post) {
            return res.status(404).json({ 
                success: false, 
                message: "Post not found" 
            });
        }
        
        res.status(200).json({ 
            success: true, 
            post 
        });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: "Internal Server Error",
            error: error.message 
        });
    }
};

export { GetSinglePost };