import mongoose from "mongoose";

const BlogSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }],
}, { timestamps: true });

const BlogModel = mongoose.model("Blog", BlogSchema);

export default BlogModel;
