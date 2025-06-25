import mongoose, { Schema, Document } from 'mongoose';

interface Review {
    user: string;
    comment: string;
}

export interface IProduct extends Document {
    title: string;
    description: string;
    price: number;
    oldPrice?: number;
    stock: number;
    brand: string;
    size: string;
    category: string;
    rating: number;
    reviews: Review[];
    photoUrl: string;
}

const ProductSchema: Schema = new Schema(
    {
        title: { type: String, required: true },
        description: { type: String, required: true },
        price: { type: Number, required: true },
        oldPrice: { type: Number },
        stock: { type: Number, required: true },
        brand: { type: String, required: true },
        size: { type: String, required: true },
        category: { type: String, required: true },
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
