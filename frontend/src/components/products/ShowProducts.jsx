import React from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const SkeletonCard = () => (
    <div className="bg-white/10 border border-white/10 backdrop-blur-sm rounded-2xl overflow-hidden shadow-xl animate-pulse">
        <div className="w-full h-60 bg-gray-700" />
        <div className="p-5">
            <div className="h-4 bg-gray-600 rounded w-3/4 mb-3" />
            <div className="h-3 bg-gray-600 rounded w-full mb-2" />
            <div className="h-3 bg-gray-600 rounded w-5/6 mb-4" />
            <div className="h-8 bg-gray-600 rounded w-1/3" />
        </div>
    </div>
);

const ShowProducts = ({ products = [], loading = false }) => {
    const navigate = useNavigate();

    const { role } = useSelector((state) => state.auth);
    console.log(role)
    if (loading) {
        return (
            <div className="px-4 py-10 min-h-screen">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 max-w-7xl mx-auto">
                    {Array.from({ length: 20 }).map((_, index) => (
                        <SkeletonCard key={index} />
                    ))}
                </div>
            </div>
        );
    }

    if (!products.length) {
        return (
            <div className="min-h-[50vh] flex items-center justify-center text-gray-500 text-xl">
                No products available
            </div>
        );
    }

    return (
        <div className="px-4 py-10 min-h-screen">
            <h2 className="text-white text-3xl md:text-4xl font-bold text-center mb-10 animate-fade-in">
                {role !== "admin" ? 'Our Mesmerizing Products' : 'All Products'}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 max-w-7xl mx-auto">
                {products.map((product, index) => (
                    <div
                        key={product._id || index}
                        onClick={() =>
                            navigate(role !== "admin" ? `/product/${product._id}` : `/admin/addEditProduct/${product._id}`, { state: { product } })
                        }
                        className="bg-white/10 border border-white/10 backdrop-blur-sm rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
                    >
                        <img
                            src={product.photoUrl || "https://via.placeholder.com/400"}
                            alt={product.title}
                            loading="lazy"
                            className="w-full h-60 object-cover"
                        />
                        <div className="p-5 text-white">
                            <h3 className="text-lg font-semibold truncate">{product.title}</h3>
                            <p className="text-sm mt-2 text-gray-300 line-clamp-2">
                                {product.description}
                            </p>
                            <div className="mt-4 flex items-center justify-between">
                                <span className="text-xl font-bold text-green-400">₹{product.price}</span>
                                <button

                                    className="px-4 py-1 cursor-pointer rounded-full bg-blue-600 hover:bg-blue-700 text-white text-sm transition"
                                >
                                    View
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ShowProducts;
