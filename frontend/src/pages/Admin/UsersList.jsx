import React, { useEffect, useState } from 'react';
import api from '../../config/axiosInstance';

const UsersList = () => {
    const [users, setUsers] = useState([]);

    const fetchUsers = async () => {
        try {
            const res = await api.get('/admin/getAllUsers');
            setUsers(res.data.data);
            console.log(res.data.data);
        } catch (err) {
            console.error("Fetch users error:", err);
        }
    };

    const toggleUser = async (id) => {
        try {
            await api.patch(`/admin/users/${id}/toggle`);
            fetchUsers();
        } catch (err) {
            console.error("Toggle user error:", err);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    return (
        <div className="p-8 text-white">
            <h1 className="text-2xl font-bold mb-6 text-center">Users</h1>
            <table className="w-full  border-collapse">
                <thead>
                    <tr className="bg-gray-800">
                        <th className="p-3">Name</th>
                        <th className="p-3">Email</th>
                        <th className="p-3">Status</th>
                        <th className="p-3">Action</th>
                    </tr>
                </thead>
                <tbody className='text-center'>
                    {users.map(user => (
                        <tr key={user._id} className="border-b border-white/20">
                            <td className="p-3">{user.name}</td>
                            <td className="p-3">{user.email}</td>
                            <td className="p-3 ">{user.active ? 'Active' : 'Frozen'}</td>
                            <td className="p-3">
                                <button
                                    onClick={() => toggleUser(user._id)}
                                    className={`px-3 py-1 cursor-pointer rounded ${user.active ? 'bg-red-500' : 'bg-green-500'} hover:opacity-80`}
                                >
                                    {user.active ? 'Freeze' : 'Activate'}
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default UsersList;