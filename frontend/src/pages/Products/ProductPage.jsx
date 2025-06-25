import React, { useEffect, useState } from 'react';
// import toast from 'react-hot-toast';
import { useLocation, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import api from '../../config/axiosInstance';
// import Card from '../../components/Product/Card';

function ProductPage() {
    const [product, setProduct] = useState([]);

    const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

    const navigate = useNavigate();

    const location = useLocation();

    const handleClick = async (id) => {
        if (isAuthenticated) {
            try {
                const response = await api({
                    url: '/user/add-cart',
                    method: "POST",
                    data: { productId: id, quantity: 1 },
                    withCredentials: true
                });
                toast.success("Product added to cart");
                navigate('/user/cart', { replace: true });
            } catch (error) {
                toast.error("Product not added");
            }
        } else {
            navigate("/login");
            toast.error("Please login to add product to cart");
        }
    };
    useEffect(() => {
        if (location.state && location.state.product) {
            setProduct(location.state.product);
        }
    }, [location.state]);


    return (
        <div className="max-w-5xl mx-auto p-4">
            {/* <Card
                id={product._id}
                image={product.image}
                title={product.title}
                description={product.description}
                price={product.price}
                reviews={product.reviews}
                onButtonClick={() => handleClick(product._id)}
            /> */}
        </div>
    );
}

export default ProductPage;
