import React, { useEffect, useState } from 'react';
import api from '../../config/axiosInstance';
import { toast } from 'sonner';
import UserOrders from '../../components/UserOrders.jsx';

function ProfilePage() {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('profile');

  const fetchUserDetails = async () => {
    try {
      const res = await api.get('/public/profile');
      setUser(res.data.data);
    } catch (err) {
      console.error('Error fetching user profile:', err);
      toast.error('Failed to load user profile');
    }
  };

  useEffect(() => {
    fetchUserDetails();
  }, []);

  return (
    <div className="min-h-screen text-white p-10">
      <h1 className="text-3xl font-bold mb-6">My Profile</h1>

      <div className="flex gap-4 mb-6">
        <button
          onClick={() => setActiveTab('profile')}
          className={`px-4 py-2 cursor-pointer rounded ${activeTab === 'profile' ? 'bg-blue-600' : 'bg-gray-700'}`}
        >
          My Details
        </button>
        <button
          onClick={() => setActiveTab('orders')}
          className={`px-4 py-2 cursor-pointer rounded ${activeTab === 'orders' ? 'bg-blue-600' : 'bg-gray-700'}`}
        >
          My Orders
        </button>
      </div>

      {activeTab === 'profile' && user && (
        <div className="bg-white/10 p-6 rounded shadow-lg max-w-md space-y-3">
          <p><strong>Name:</strong> {user.name}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Mobile:</strong> {user.mobile}</p>
          <p><strong>Age:</strong> {user.age}</p>
          <p><strong>Address:</strong> {user.address}</p>
        </div>
      )}

      {activeTab === 'orders' && <UserOrders />}
    </div>
  );
}

export default ProfilePage;
