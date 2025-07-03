import { useSelector, useDispatch } from 'react-redux';
import { Navigate, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { toast } from 'sonner';
import { logoutUser } from '../../redux/authSlice';
import api from '../../config/axiosInstance';

const AdminProtectedRoute = ({ children }) => {
    const { isAuthenticated, role } = useSelector((state) => state.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        const handleLogout = async () => {
            try {
                await api.post("/public/logout", {}, { withCredentials: true });
                localStorage.removeItem("accessToken");
                dispatch(logoutUser());
                toast.success("Access denied. Logged out");
                navigate("/login-page");
            } catch (err) {
                toast.error("Logout failed");
            }
        };

        if (!isAuthenticated || role !== 'admin') {
            handleLogout();
        }
    }, [isAuthenticated, role, dispatch, navigate]);

    if (!isAuthenticated || role !== 'admin') {
        return <Navigate to="/login-page" replace />;
    } else if (role === 'consumer') {
        toast.error("Access denied. Admins only.");
        return <Navigate to="/login-page" replace />;
    }

    return children;
};

export default AdminProtectedRoute;
