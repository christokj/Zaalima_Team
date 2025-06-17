import mongoose, { Document, Schema, Model } from 'mongoose';

// Define TypeScript interface for User document
export interface IUser extends Document {
    username: string;
    name: string;
    age: number;
    mobile: string;
    password: string;
    createdAt?: Date;
    updatedAt?: Date;
}

// Define Mongoose schema
const userSchema: Schema<IUser> = new Schema(
    {
        username: { type: String, unique: true, required: true },
        name: { type: String, required: true },
        age: { type: Number, required: true },
        mobile: { type: String, required: true },
        password: { type: String, required: true },
    },
    { timestamps: true }
);

// Export model
export const User: Model<IUser> = mongoose.model<IUser>('User', userSchema);
