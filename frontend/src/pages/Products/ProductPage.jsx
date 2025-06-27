import React, { lazy, Suspense } from "react";
import { useLocation, useParams } from "react-router-dom";
import ProductDetails from "../../components/products/ProductDetails";

const StarsCanvas = lazy(() => import("../../components/canvas/Stars"));

const ProductPage = () => {
    const { state } = useLocation();
    const { id } = useParams();

    const product = state?.product;

    return (
        <div className="min-h-screen relative bg-transparent z-0">
            {product ? (
                <ProductDetails product={product} />
            ) : (
                <div className="text-white text-center py-20 text-xl">
                    Product not found or page refreshed without data.
                </div>
            )}
            <Suspense fallback={<h1>Loading...</h1>}>
                <StarsCanvas />
            </Suspense>
        </div>
    );
};

export default ProductPage;
