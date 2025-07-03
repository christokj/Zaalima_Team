import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../config/axiosInstance';
import DashboardCard from '../../components/admin/DashboardCard';

function AdminDashboard() {
    const [totalUsers, setTotalUsers] = useState(0);
    const [totalProducts, setTotalProducts] = useState(0);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await api.get('/admin/dashboard-stats');
                setTotalUsers(res.data.data.totalUsers);
                setTotalProducts(res.data.data.totalProducts);
            } catch (error) {
                console.error("Dashboard fetch error:", error);
            }
        };

        fetchStats();
    }, []);

    return (
        <div className="p-20 text-white">
            <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
            <div className="grid grid-cols-2 gap-6 mb-10">
                <DashboardCard title="Total Products" count={totalProducts} color="bg-blue-600" />
                <DashboardCard title="Total Users" count={totalUsers} color="bg-green-600" />
            </div>
            <div className="flex gap-4">
                <button
                    onClick={() => navigate('/admin/products')}
                    className="px-6 py-2 bg-blue-500 rounded cursor-pointer hover:bg-blue-700"
                >
                    Manage Products
                </button>
                <button
                    onClick={() => navigate('/admin/custom-clothes')}
                    className="px-6 py-2 bg-blue-500 rounded cursor-pointer hover:bg-blue-700"
                >
                    Manage Custom Clothes Orders
                </button>
                <button
                    onClick={() => navigate('/admin/users')}
                    className="px-6 py-2 bg-green-500 rounded cursor-pointer hover:bg-green-700"
                >
                    Manage Users
                </button>
            </div>
        </div>
    );
}

export default AdminDashboard;