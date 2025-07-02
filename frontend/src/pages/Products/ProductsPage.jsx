import React, { lazy, Suspense, useEffect, useRef, useState } from 'react';
import ShowProducts from '../../components/products/ShowProducts';
import api from '../../config/axiosInstance';
import CustomClothesDesigner from '../../components/products/CustomClothesDesigner';
const StarsCanvas = lazy(() => import("../../components/canvas/Stars"));

function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(0);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [showCustomClothes, setShowCustomClothes] = useState(false);
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
      <button
        onClick={() => setShowCustomClothes(true)}
        className="fixed right-4 top-32 px-6 py-3 cursor-pointer bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-all duration-200 z-20"
      >
        Custom Clothes Designer
      </button>
      <button
        onClick={() => setShowCustomClothes(false)}
        className={`fixed top-32 right-4 px-6 py-3 cursor-pointer bg-red-600 text-white rounded-full shadow-lg hover:bg-red-700 transition-all duration-200 z-20 ${showCustomClothes ? '' : 'hidden'}`}
      >
        Close Designer
      </button>
      {showCustomClothes ? (
        <div className="w-full h-full bg-transparent z-10 flex items-center justify-center">
          <CustomClothesDesigner />
        </div>
      ) : <ShowProducts products={products} loading={isLoading} />}

      {!showCustomClothes && !isLoading && products.length > 0 &&

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
      }

      <Suspense fallback={<h1>Loading...</h1>}>
        <StarsCanvas />
      </Suspense>
    </div>
  );
}

export default ProductsPage;
