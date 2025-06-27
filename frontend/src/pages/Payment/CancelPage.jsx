
import React from "react";
import { Link } from "react-router-dom";
import { XCircle } from "lucide-react";

const CancelPage = () => {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-black to-gray-900 text-white px-4">
            <XCircle className="text-red-500 w-20 h-20 mb-6" />
            <h1 className="text-3xl font-bold mb-4">Payment Cancelled</h1>
            <p className="text-gray-300 mb-6 text-center">
                Your payment was not completed. You can try again or return to the store.
            </p>
            <Link
                to="/products"
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-full text-white font-medium transition"
            >
                Back to Products
            </Link>
        </div>
    );
};

export default CancelPage;
