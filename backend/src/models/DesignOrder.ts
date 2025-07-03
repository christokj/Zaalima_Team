import mongoose, { Schema, Document } from 'mongoose';

export interface IDesignOrder extends Document {
    userId: mongoose.Schema.Types.ObjectId;
    apparel: string;
    size: string;
    designImageUrl: string;
    position: {
        x: number;
        y: number;
    };
    scale: number;
}

const DesignOrderSchema: Schema = new Schema(
    {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        apparel: { type: String, required: true },
        size: { type: String, required: true },
        designImageUrl: { type: String, required: true },
        position: {
            x: { type: Number, required: true },
            y: { type: Number, required: true },
        },
        scale: { type: Number, required: true },
        status: {
            type: String,
            enum: ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'],
            default: 'Pending',
        },
    },
    { timestamps: true }
);

export default mongoose.model<IDesignOrder>('DesignOrder', DesignOrderSchema);
