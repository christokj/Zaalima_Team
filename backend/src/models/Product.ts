import mongoose, { Schema, Document } from 'mongoose';

interface Review {
    user: string;
    comment: string;
}

export interface IProduct extends Document {
    title: string;
    description: string;
    price: number;
    category: string;
    rating: number;
    reviews: Review[];
    photoUrl: string;
}

const ProductSchema: Schema = new Schema(
    {
        title: { type: String, required: true },
        description: { type: String },
        price: { type: Number, required: true },
        category: { type: String },
        rating: { type: Number, default: 0 },
        reviews: [
            {
                user: { type: String },
                comment: { type: String }
            }
        ],
        photoUrl: { type: String, required: true },
    },
    { timestamps: true }
);

export default mongoose.model<IProduct>('Product', ProductSchema);
