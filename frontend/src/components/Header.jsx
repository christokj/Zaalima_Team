import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logoutUser } from '../redux/authSlice';
import api from '../config/axiosInstance';

function Header() {
    const user = useSelector((state) => state.auth.user?.username);
    const isLoggedIn = useSelector((state) => state.auth.isAuthenticated);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await api.post('/public/logout');
        dispatch(logoutUser());
        localStorage.removeItem('accessToken');
        navigate('/');
    };

    return (
        <header className="bg-blue-700 text-white shadow-md py-4 px-6 flex justify-between items-center">
            <div className="text-xl font-bold">
                Zaalima Web Development
            </div>
            {isLoggedIn && (
                <div className="flex items-center space-x-4">
                    <span className="font-medium">
                        Welcome, {user}
                    </span>
                    <button
                        onClick={handleLogout}
                        className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded transition"
                    >
                        Logout
                    </button>
                </div>
            )}
        </header>
    );
}

export default Header;
