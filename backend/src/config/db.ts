import mongoose from 'mongoose';
import { MONGO_URI } from './env';

const connectDB = async (): Promise<void> => {
    try {
        await mongoose.connect(MONGO_URI);
        console.log("Connected to MongoDB");
    } catch (err) {
        console.error("Database connection failed:", err);
    }
};

export default connectDB;
