
import React from "react";
import { Link } from "react-router-dom";
import { CheckCircle } from "lucide-react";

const SuccessPage = () => {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-black to-gray-900 text-white px-4">
            <CheckCircle className="text-green-500 w-20 h-20 mb-6" />
            <h1 className="text-3xl font-bold mb-4">Payment Successful!</h1>
            <p className="text-gray-300 mb-6 text-center">
                Thank you for your purchase. Your order has been processed successfully.
            </p>
            <Link
                to="/products"
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-full text-white font-medium transition"
            >
                Continue Shopping
            </Link>
        </div>
    );
};

export default SuccessPage;
