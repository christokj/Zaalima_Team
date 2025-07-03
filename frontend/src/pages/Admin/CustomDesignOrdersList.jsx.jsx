import React, { useEffect, useRef, useState } from 'react';
import api from '../../config/axiosInstance';
import { toast } from 'sonner';

function CustomDesignOrdersList() {
    const [orders, setOrders] = useState([]);
    const [page, setPage] = useState(0);
    const [total, setTotal] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const limit = 20;

    const ordersCache = useRef({});

    const fetchOrders = async (pageNum = 0) => {
        try {
            setIsLoading(true);
            const skip = pageNum * limit;

            const response = await api.get(`/admin/design-orders?skip=${skip}&limit=${limit}`);
            const data = response.data.data;
            const totalCount = response.data.total;

            ordersCache.current[pageNum] = data;

            setOrders(data);
            setTotal(totalCount);
            setIsLoading(false);
        } catch (error) {
            console.error("Error fetching custom orders:", error);
        }
    };

    useEffect(() => {
        fetchOrders(page);
    }, [page]);

    const handleNext = () => {
        if ((page + 1) * limit < total) setPage(prev => prev + 1);
    };

    const handlePrev = () => {
        if (page > 0) setPage(prev => prev - 1);
    };

    const updateOrderStatus = async (orderId, newStatus) => {
        try {
            await api.put(`/admin/design-orders/${orderId}/status`, { status: newStatus });

            toast.success('Order status updated');
            // Optional: update local state directly
            setOrders(prev =>
                prev.map(order =>
                    order._id === orderId ? { ...order, status: newStatus } : order
                )
            );
        } catch (err) {
            console.error('Update failed', err);
            toast.error('Failed to update order status');
        }
    };

    const statusOptions = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];

    return (
        <div className="min-h-screen bg-transparent text-white p-6">
            <h2 className="text-2xl font-bold mb-6">Custom Design Orders</h2>

            {isLoading ? (
                <p>Loading...</p>
            ) : orders.length === 0 ? (
                <p>No custom design orders found.</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {orders.map(order => (
                        <div key={order._id} className="bg-white/10 p-4 rounded shadow-lg">
                            <h3 className="text-xl font-semibold">{order.customerName}</h3>
                            <p className="text-sm text-gray-300 mb-2">
                                Apparel: {order.apparel} | Size: {order.size}
                            </p>
                            <img
                                src={order.designImageUrl}
                                alt="Design"
                                className="w-full h-48 object-contain border border-white mb-2"
                            />

                            {order.userId && (
                                <div className="text-sm text-gray-200 mb-2 space-y-1">
                                    <p><strong>Name:</strong> {order.userId.name}</p>
                                    <p><strong>Email:</strong> {order.userId.email}</p>
                                    <p><strong>Mobile:</strong> {order.userId.mobile}</p>
                                    <p><strong>Address:</strong> {order.userId.address}</p>
                                </div>
                            )}

                            <p>Position: X {order.position?.x}, Y {order.position?.y}</p>
                            <p>Scale: {order.scale}</p>
                            <p className="text-green-400 font-bold mt-2">₹{(order.price / 100 || 799).toFixed(2)}</p>

                            {/* Status Dropdown */}
                            <div className="mt-4">
                                <label className="text-sm font-medium">Order Status:</label>
                                <select
                                    className="w-full mt-1 p-2 rounded bg-gray-800 text-white"
                                    value={order.status}
                                    onChange={(e) => updateOrderStatus(order._id, e.target.value)}
                                >
                                    {statusOptions.map(status => (
                                        <option key={status} value={status}>
                                            {status}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <div className="flex justify-center gap-4 py-10">
                <button
                    onClick={handlePrev}
                    disabled={page === 0}
                    className="px-4 py-2 bg-gray-300 text-black rounded disabled:opacity-40"
                >
                    Previous
                </button>
                <button
                    onClick={handleNext}
                    disabled={(page + 1) * limit >= total}
                    className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-40 hover:bg-blue-700"
                >
                    Next
                </button>
            </div>
        </div>
    );
}

export default CustomDesignOrdersList;
