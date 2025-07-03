import React, { useEffect, useState } from 'react';
import api from '../config/axiosInstance';
import { toast } from 'sonner';

function UserOrders() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchMyOrders = async () => {
        try {
            const res = await api.get('/public/my-design-orders');
            console.log('My Orders:', res.data.data);
            setOrders(res.data.data);
        } catch (err) {
            console.error('Error loading orders', err);
            toast.error('Could not load your orders');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMyOrders();
    }, []);
    if (!orders) {
        return <p className="text-white">No orders found.</p>;
    } else {

        return (
            <div>
                <h2 className="text-xl font-semibold mb-4">My Design Orders</h2>
                {loading ? (
                    <p>Loading orders...</p>
                ) : orders?.length === 0 ? (
                    <p>You have not placed any custom design orders yet.</p>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {orders.map(order => (
                            <div key={order._id} className="bg-white/10 p-4 rounded shadow">
                                <p><strong>Apparel:</strong> {order.apparel}</p>
                                <p><strong>Size:</strong> {order.size}</p>
                                <p><strong>Status:</strong> <span className="text-yellow-400">{order.status || 'Pending'}</span></p>
                                <img
                                    src={order.designImageUrl}
                                    alt="Design"
                                    className="w-full h-40 object-contain border border-white my-2"
                                />
                                <p><strong>Price:</strong> ₹{(order.price / 100 || 799).toFixed(2)}</p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        );
    }
}

export default UserOrders;
