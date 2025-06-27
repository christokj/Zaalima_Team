
import React from "react";
import { Trash2 } from "lucide-react";

const CartItem = ({ item, onRemove }) => {
    const product = item.productId;

    return (
        <div className="flex items-center gap-4 p-4 border-b border-white/10">
            <img
                src={product.photoUrl}
                alt={product.title}
                className="w-24 h-24 object-cover rounded-lg"
                loading="lazy"
            />
            <div className="flex-1 text-white">
                <h3 className="font-semibold text-lg">{product.title}</h3>
                <p className="text-sm text-gray-400">Price: ₹{product.price}</p>
                <p className="text-sm text-gray-400">Quantity: {item.quantity}</p>
                <p className="text-sm text-gray-400">
                    Total: ₹{product.price * item.quantity}
                </p>
            </div>
            <button
                onClick={() => onRemove(item._id)}
                className="text-red-500 hover:text-red-600"
            >
                <Trash2 />
            </button>
        </div>
    );
};

export default CartItem;


