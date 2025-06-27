import mongoose, { Schema, Document } from "mongoose";

export interface ICart extends Document {
    userId: string;
    productId: mongoose.Types.ObjectId;
    quantity: number;
    addedAt: Date;
}

const CartSchema: Schema = new Schema(
    {
        userId: { type: String, required: true },
        productId: { type: Schema.Types.ObjectId, ref: "Product", required: true },
        quantity: { type: Number, default: 1 },
        addedAt: { type: Date, default: Date.now },
    },
    { timestamps: true }
);

export default mongoose.model<ICart>("Cart", CartSchema);
