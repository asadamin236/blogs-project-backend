import mongoose from "mongoose";

const CommentSchema = new mongoose.Schema({
    post: { type: mongoose.Schema.Types.ObjectId, ref: "Blog" },      
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: false },
    comment: { type: String, required: true },
    userName: { type: String, default: "Anonymous" }
}, { timestamps: true });

const CommentModel = mongoose.model("Comment", CommentSchema);

export default CommentModel;