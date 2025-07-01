import React from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logoutUser } from "../../redux/authSlice";

const AdminHeader = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleLogout = () => {
        dispatch(logoutUser());
        localStorage.removeItem("accessToken");
        navigate("/login"); // or wherever your login page is
    };

    return (
        <header className="w-full bg-black/30 backdrop-blur-md text-white p-4 flex items-center justify-between shadow-md z-50">
            <h1
                onClick={() => navigate("/admin")}
                className="text-2xl font-bold cursor-pointer"
            >
                Admin Panel
            </h1>

            <nav className="flex items-center gap-4">
                <button
                    onClick={() => navigate("/admin")}
                    className="px-4 py-2 rounded bg-blue-600 hover:bg-blue-700 transition"
                >
                    Home
                </button>

                <button
                    onClick={handleLogout}
                    className="px-4 py-2 rounded bg-red-600 hover:bg-red-700 transition"
                >
                    Logout
                </button>
            </nav>
        </header>
    );
};

export default AdminHeader;
