import mongoose, { Document, Schema, Model } from 'mongoose';

// Define TypeScript interface for Public document
export interface IUser extends Document {
    email: string;
    name: string;
    age: number;
    mobile: string;
    address: string;
    password: string;
    active?: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}

// Define Mongoose schema for Public    
const userSchema: Schema<IUser> = new Schema(
    {
        email: { type: String, unique: true, required: true },
        name: { type: String, required: true },
        age: { type: Number, required: true },
        mobile: { type: String, required: true },
        address: { type: String, required: true },
        password: { type: String, required: true },
        active: { type: Boolean, default: true }
    },
    { timestamps: true }
);

// Export model
export const User: Model<IUser> = mongoose.model<IUser>('User', userSchema);
