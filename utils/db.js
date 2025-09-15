import mongoose from "mongoose";  

const connectDB = async () => {
    try {
        // Check if already connected
        if (mongoose.connections[0].readyState) {
            console.log("MongoDB already connected");
            return;
        }
        
        await mongoose.connect(process.env.MongoDB, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            maxPoolSize: 10,
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000,
        });
        console.log("MongoDB connected");
    } catch (error) {
        console.error("MongoDB connection error:", error);
        throw error;
    }
}

export default connectDB;
