import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
    const { isAuthenticated, role } = useSelector((state) => state.auth);
    if (!isAuthenticated && role === 'consumer') {
        return <Navigate to="login-page" replace />;
    }

    return children;
};

export default ProtectedRoute;
