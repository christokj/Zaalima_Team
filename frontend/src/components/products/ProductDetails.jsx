import React from "react";
import { FaStar } from "react-icons/fa";
import { loadStripe } from "@stripe/stripe-js";
import axios from "axios";
import api from "../../config/axiosInstance";
import { toast } from "sonner";


const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_Publishable_key);

const ProductDetails = ({ product }) => {
    if (!product) {
        return <div className="text-center text-white mt-10">Product not found.</div>;
    }

    const handleAddToCart = async () => {
        try {
            const res = await api.post("/public/add-to-cart", {
                productId: product._id,
                quantity: 1,
            });

            if (res.data.success) {
                alert("Product added to cart!");
            } else {
                alert("Failed to add to cart.");
            }
        } catch (err) {
            toast.warning('Please login to add products to cart');
            console.error("Add to cart error:", err);
        }
    };

    const handleBuyNow = async () => {
        try {
            const stripe = await stripePromise;

            const res = await api.post("/public/create-checkout-session", {
                productId: product._id,
                quantity: 1,
            });

            const sessionId = res.data.sessionId;

            await stripe.redirectToCheckout({ sessionId });
        } catch (err) {
            toast.warning('Please login to buy products');
            console.error("Stripe checkout error:", err);
        }
    };

    return (
        <div className="min-h-screen px-4 py-10 text-white">
            <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-10">
                <img
                    src={product.photoUrl}
                    alt={product.title}
                    loading="lazy"
                    className="w-full h-auto object-cover rounded-2xl shadow-2xl border border-white/10"
                />
                <div className="space-y-6">
                    <h1 className="text-4xl font-bold">{product.title}</h1>
                    <div className="text-gray-300">{product.description}</div>
                    <div className="flex items-center space-x-4 text-xl">
                        <span className="text-green-400 font-bold">₹{product.price}</span>
                        {product.oldPrice && (
                            <span className="line-through text-gray-500">₹{product.oldPrice}</span>
                        )}
                    </div>
                    <div className="text-sm text-gray-400">
                        <p><strong>Brand:</strong> {product.brand}</p>
                        <p><strong>Category:</strong> {product.category}</p>
                        <p><strong>Size:</strong> {product.size}</p>
                        <p><strong>In Stock:</strong> {product.stock}</p>
                    </div>
                    <div className="flex items-center">
                        {[...Array(5)].map((_, index) => (
                            <FaStar
                                key={index}
                                className={`text-xl ${index < Math.round(product.rating || 0)
                                    ? "text-yellow-400"
                                    : "text-gray-600"
                                    }`}
                            />
                        ))}
                        <span className="ml-2 text-sm text-gray-400">
                            ({product.rating?.toFixed(1)} rating)
                        </span>
                    </div>
                    <div>
                        <button
                            onClick={handleBuyNow}
                            className="mt-4 mr-2 px-6 cursor-pointer py-2 bg-blue-600 hover:bg-blue-700 rounded-full text-white transition text-sm font-semibold"
                        >
                            Buy Now
                        </button>
                        <button
                            onClick={handleAddToCart}
                            className="mt-4 px-6 py-2 cursor-pointer bg-green-600 hover:bg-green-700 rounded-full text-white transition text-sm font-semibold"
                        >
                            Add to Cart
                        </button>
                    </div>
                </div>
            </div>

            {/* Reviews */}
            <div className="max-w-6xl mx-auto mt-14">
                <h2 className="text-2xl font-bold mb-4 border-b border-white/10 pb-2">Customer Reviews</h2>
                {product.reviews && product.reviews.length > 0 ? (
                    <div className="space-y-4">
                        {product.reviews.map((review, index) => (
                            <div key={index} className="bg-white/5 p-4 rounded-lg border border-white/10">
                                <p className="font-semibold text-white">{review.user}</p>
                                <p className="text-gray-300">{review.comment}</p>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-gray-400">No reviews yet.</p>
                )}
            </div>
        </div>
    );
};

export default ProductDetails;
