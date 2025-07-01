import React, { lazy, Suspense, useEffect, useRef, useState } from 'react';
import ShowProducts from '../../components/products/ShowProducts';
import api from '../../config/axiosInstance';
const StarsCanvas = lazy(() => import("../../components/canvas/Stars"));

function ProductsList() {
    const [products, setProducts] = useState([]);
    const [page, setPage] = useState(0);
    const [total, setTotal] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const limit = 20;

    const productCache = useRef({});

    const fetchProducts = async (pageNum = 0) => {
        try {
            setIsLoading(true);
            const skip = pageNum * limit;
            const response = await api.get(`/public/getProducts?skip=${skip}&limit=${limit}`);

            const data = response.data.data;
            const totalCount = response.data.total;

            // Save to cache
            productCache.current[pageNum] = data;

            setProducts(data);
            setTotal(totalCount);
            setIsLoading(false);
        } catch (error) {
            console.error("Error fetching products:", error);
        }
    };

    useEffect(() => {
        fetchProducts(page);
    }, [page]);

    const handleNext = () => {
        if ((page + 1) * limit < total) setPage(prev => prev + 1);
    };

    const handlePrev = () => {
        if (page > 0) setPage(prev => prev - 1);
    };

    return (
        <div className="relative min-h-screen overflow-hidden bg-transparent z-0">
            <ShowProducts products={products} loading={isLoading} />

            <div className="flex justify-center gap-4 py-10 bg-transparent backdrop-blur-xl">
                <button
                    onClick={handlePrev}
                    disabled={page === 0}
                    className="px-4 py-2 bg-gray-300 text-black rounded disabled:opacity-40 cursor-pointer"
                >
                    Previous
                </button>
                <button
                    onClick={handleNext}
                    disabled={(page + 1) * limit >= total}
                    className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-40 cursor-pointer hover:px-5  hover:bg-blue-700 transition-all duration-200"
                >
                    Next
                </button>
            </div>

        </div>
    );
}

export default ProductsList;
