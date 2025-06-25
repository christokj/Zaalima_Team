import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { StarsCanvas } from '../../components';
import ShowProducts from '../../components/products/ShowProducts';
import api from '../../config/axiosInstance';
// import ShowProducts from '../../components/Product/ShowProducts';

function ProductsPage() {

  const [products, setProducts] = useState([]);
  const navigate = useNavigate();
  const fetchProducts = async () => {
    try {
      const response = await api.get('/public/getProducts');
      setProducts(response.data.data);
      console.log(response.data.data); // Log the entire data object to see its structure
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };
  useEffect(() => {
    fetchProducts();
  }, []);



  return (
    <div >
      <ShowProducts products={products} />
      <StarsCanvas />


    </div>
  );
}

export default ProductsPage;