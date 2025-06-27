import React, { useEffect, useMemo, useState } from "react";
import CartItem from "../../components/cart/CartItem";
import api from "../../config/axiosInstance";
import { Link } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";



const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_Publishable_key);

const CartPage = () => {
    const [cart, setCart] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchCart = async () => {
        try {
            const res = await api.get("/public/cart", {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                },
            });
            setCart(res.data.cart || []);
        } catch (err) {
            console.error("Error fetching cart", err);
        } finally {
            setLoading(false);
        }
    };

    const removeFromCart = async (itemId) => {
        try {
            await api.delete(`/cart/${itemId}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                },
            });
            setCart((prev) => prev.filter((item) => item._id !== itemId));
        } catch (err) {
            console.error("Failed to remove item", err);
        }
    };

    useEffect(() => {
        fetchCart();
    }, []);

    //Compute totalAmount when cart changes
    const totalAmount = useMemo(() => {
        return cart.reduce(
            (sum, item) =>
                sum + (item?.productId?.price || 0) * (item?.quantity || 1),
            0
        );
    }, [cart]);

    const handleBuyNow = async () => {
        try {
            const stripe = await stripePromise;

            const res = await api.post(
                "/public/create-checkout-session",
                {
                    cartItems: cart.map((item) => ({
                        productId: item.productId._id,
                        quantity: item.quantity,
                    })),
                },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                    },
                }
            );

            const sessionId = res.data.sessionId;

            await stripe.redirectToCheckout({ sessionId });
        } catch (err) {
            console.error("Stripe checkout error:", err);
        }
    };



    return (
        <div className="min-h-screen px-4 py-10 text-white bg-black">
            <div className="max-w-5xl mx-auto">
                <h1 className="text-3xl font-bold mb-8 text-center">Your Cart</h1>

                {loading ? (
                    <p className="text-center text-gray-400">Loading...</p>
                ) : cart.length === 0 ? (
                    <p className="text-center text-gray-400">Your cart is empty.</p>
                ) : (
                    <>
                        <div className="space-y-4 mb-8">
                            {cart.map((item) => (
                                <CartItem key={item._id} item={item} onRemove={removeFromCart} />
                            ))}
                        </div>

                        <div className="text-right">
                            <p className="text-lg font-semibold text-green-400">
                                Total: ₹{totalAmount.toFixed(2)}
                            </p>
                            <button
                                onClick={handleBuyNow}
                                className="inline-block mt-4 px-6 py-2 cursor-pointer bg-blue-600 hover:bg-blue-700 rounded-full text-white font-semibold transition"
                            >
                                Proceed to Checkout
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default CartPage;
